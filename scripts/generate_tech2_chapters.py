from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "book-files" / "Teknik 2 bok IN version 2.md"
TARGET = ROOT / "data" / "chapters.json"

CHAPTER_RE = re.compile(r"^# \*\*Kapitel\s+(\d+)\s+–\s+(.+?)\*\*")
SPECIAL_CHAPTER_RE = re.compile(r"^#\s+Kap\s+(\d+):\s+(.+?)\.?$")
HEADING_RE = re.compile(r"^(#{2,3}) \*\*(.+?)\*\*(?: \{#.*\})?$")

META_HEADINGS = {"Mål", "Centrala begrepp", "Sammanfattning", "Frågor att arbeta med"}
IMAGE_DEF_RE = re.compile(r"^\[([^\]]+)\]:\s*<?([^>\s]+)>?\s*$")


def extract_image_definitions(lines: list[str]) -> dict[str, str]:
    definitions: dict[str, str] = {}
    for line in lines:
        match = IMAGE_DEF_RE.match(line.strip())
        if not match:
            continue
        definitions[match.group(1).strip().lower()] = match.group(2).strip()
    return definitions


def resolve_image_source(raw_source: str) -> str:
    source = raw_source.strip()
    return source


def resolve_local_image_fallback(ref_key: str) -> str:
    candidates = [
        ROOT / "assets" / "images" / f"{ref_key}.png",
        ROOT / "assets" / "images" / "ch1" / f"{ref_key}.png",
    ]

    if ref_key == "image1":
        candidates.insert(0, ROOT / "assets" / "images" / "xkcd-1.png")

    for candidate in candidates:
        if candidate.exists():
            relative = candidate.relative_to(ROOT).as_posix()
            return f"../{relative}"

    return ""


def image_tag(src: str, alt: str = "Illustration") -> str:
    safe_src = html.escape(src, quote=True)
    safe_alt = html.escape(alt, quote=True)
    return f'<img src="{safe_src}" alt="{safe_alt}" loading="lazy">'


def clean_heading(text: str) -> str:
    text = re.sub(r"\\([.#*\-])", r"\1", text)
    text = re.sub(r"\s+\{#.*\}$", "", text).strip()
    return text


def chapter_blocks(lines: list[str]) -> list[tuple[int, int, str, list[str]]]:
    starts: list[tuple[int, int, str]] = []
    for index, line in enumerate(lines):
        match = CHAPTER_RE.match(line) or SPECIAL_CHAPTER_RE.match(line)
        if match:
            starts.append((index, int(match.group(1)), match.group(2)))

    blocks: list[tuple[int, int, str, list[str]]] = []
    for position, (start_index, source_number, title) in enumerate(starts):
        end_index = starts[position + 1][0] if position + 1 < len(starts) else len(lines)
        blocks.append((source_number, start_index, title, lines[start_index:end_index]))
    return blocks


def first_description(block: list[str]) -> str:
    paragraphs: list[str] = []
    current: list[str] = []

    for line in block[1:]:
        if CHAPTER_RE.match(line) or line.startswith("## "):
            if current:
                paragraphs.append(" ".join(current).strip())
            break
        stripped = line.strip()
        if not stripped:
            if current:
                paragraphs.append(" ".join(current).strip())
                current = []
                if paragraphs:
                    break
            continue
        if stripped.startswith("![]"):
            continue
        if stripped.startswith("*") or stripped.startswith("-"):
            continue
        current.append(stripped)

    if current and not paragraphs:
        paragraphs.append(" ".join(current).strip())

    return paragraphs[0] if paragraphs else ""


def section_text(block: list[str], heading: str) -> list[str]:
    target_index = None
    target_level = None

    for index, line in enumerate(block):
        match = HEADING_RE.match(line)
        if match and clean_heading(match.group(2)) == heading:
            target_index = index
            target_level = len(match.group(1))
            break

    if target_index is None or target_level is None:
        return []

    collected: list[str] = []
    for line in block[target_index + 1 :]:
        match = HEADING_RE.match(line)
        if match and len(match.group(1)) <= target_level:
            break
        collected.append(line)
    return collected


def extract_sections(block: list[str]) -> list[str]:
    sections: list[str] = []
    for line in block[1:]:
        match = HEADING_RE.match(line)
        if not match:
            continue
        if len(match.group(1)) != 2:
            continue
        heading = clean_heading(match.group(2))
        if heading in META_HEADINGS:
            continue
        if heading.startswith("Kapitel "):
            continue
        sections.append(heading)
    return sections


def extract_key_topics(block: list[str]) -> list[str]:
    lines = section_text(block, "Centrala begrepp")
    topics: list[str] = []
    for line in lines:
        stripped = line.strip()
        if not stripped.startswith("*"):
            continue
        item = stripped.lstrip("* ").strip()
        if not item:
            continue
        item = re.sub(r"\*+", "", item).strip()
        item = re.split(r"\s*[–:-]\s*", item, maxsplit=1)[0].strip()
        item = item.rstrip(".,")
        if item and item not in topics:
            topics.append(item)
    return topics


def extract_summary(block: list[str]) -> str:
    lines = section_text(block, "Sammanfattning")
    paragraphs: list[str] = []
    current: list[str] = []

    for line in lines:
        stripped = line.strip()
        if not stripped:
            if current:
                paragraphs.append(" ".join(current).strip())
                current = []
            continue
        if stripped.startswith("## ") or stripped.startswith("### "):
            break
        if stripped.startswith("*"):
            if current:
                paragraphs.append(" ".join(current).strip())
                current = []
            continue
        if stripped.startswith("![]"):
            continue
        current.append(stripped)

    if current:
        paragraphs.append(" ".join(current).strip())

    return " ".join(paragraphs).strip()


def inline_markdown_to_html(text: str) -> str:
    text = text.replace("\\.", ".")
    text = re.sub(r"\s+\{#.*\}$", "", text).strip()
    text = html.escape(text, quote=False)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)

    def replace_link(match: re.Match[str]) -> str:
        label = match.group(1)
        url = html.escape(match.group(2), quote=True)
        return f'<a href="{url}" target="_blank">{label}</a>'

    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", replace_link, text)
    return text


def extract_content_html(block: list[str], image_defs: dict[str, str]) -> str:
    parts: list[str] = []
    paragraph_lines: list[str] = []
    list_type: str | None = None

    def flush_paragraph() -> None:
        nonlocal paragraph_lines
        if paragraph_lines:
            parts.append(f"<p>{' '.join(paragraph_lines).strip()}</p>")
            paragraph_lines = []

    def close_list() -> None:
        nonlocal list_type
        if list_type == "ul":
            parts.append("</ul>")
        elif list_type == "ol":
            parts.append("</ol>")
        list_type = None

    for raw_line in block[1:]:
        stripped = raw_line.strip()

        if not stripped:
            flush_paragraph()
            close_list()
            continue

        if stripped.startswith("!"):
            # Reference-style image: ![][image1]
            ref_image = re.match(r"^!\[(.*?)\]\[([^\]]+)\]\s*$", stripped)
            if ref_image:
                flush_paragraph()
                close_list()
                alt_text = ref_image.group(1).strip() or "Illustration"
                ref_key = ref_image.group(2).strip().lower()
                source = image_defs.get(ref_key, "")
                resolved = resolve_image_source(source)
                if not resolved or resolved.startswith("data:image"):
                    resolved = resolve_local_image_fallback(ref_key)
                if resolved:
                    parts.append(image_tag(resolved, alt_text))
                continue

            # Inline image: ![alt](url)
            inline_image = re.match(r"^!\[(.*?)\]\(([^)]+)\)\s*$", stripped)
            if inline_image:
                flush_paragraph()
                close_list()
                alt_text = inline_image.group(1).strip() or "Illustration"
                source = inline_image.group(2).strip()
                resolved = resolve_image_source(source)
                if resolved:
                    parts.append(image_tag(resolved, alt_text))
                continue

            continue

        if IMAGE_DEF_RE.match(stripped):
            # Image definition metadata should not be rendered as chapter content.
            continue

        heading_match = HEADING_RE.match(stripped)
        if heading_match:
            flush_paragraph()
            close_list()
            level = len(heading_match.group(1))
            tag = "h2" if level == 2 else "h3"
            heading = clean_heading(heading_match.group(2))
            parts.append(f"<{tag}>{inline_markdown_to_html(heading)}</{tag}>")
            continue

        bullet_match = re.match(r"^\*\s+(.*)$", stripped)
        if bullet_match:
            flush_paragraph()
            if list_type != "ul":
                close_list()
                parts.append("<ul>")
                list_type = "ul"
            parts.append(f"<li>{inline_markdown_to_html(bullet_match.group(1))}</li>")
            continue

        ordered_match = re.match(r"^\d+\.\s+(.*)$", stripped)
        if ordered_match:
            flush_paragraph()
            if list_type != "ol":
                close_list()
                parts.append("<ol>")
                list_type = "ol"
            parts.append(f"<li>{inline_markdown_to_html(ordered_match.group(1))}</li>")
            continue

        close_list()
        paragraph_lines.append(inline_markdown_to_html(stripped))

    flush_paragraph()
    close_list()
    return "\n".join(parts)


def main() -> None:
    lines = SOURCE.read_text(encoding="utf-8").splitlines()
    image_defs = extract_image_definitions(lines)
    chapters = []

    for index, (_source_number, _start_index, title, block) in enumerate(chapter_blocks(lines), start=1):
        chapters.append(
            {
                "id": index,
                "number": index,
                "title": title,
                "description": first_description(block),
                "sections": extract_sections(block),
                "contentHtml": extract_content_html(block, image_defs),
                "summary": extract_summary(block),
                "keyTopics": extract_key_topics(block),
                "videoSuggestions": [],
                "resources": [],
            }
        )

    TARGET.write_text(
        json.dumps({"chapters": chapters}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"Wrote {len(chapters)} chapters to {TARGET}")
    for chapter in chapters:
        print(f"{chapter['number']:02d}: {chapter['title']} ({len(chapter['sections'])} sections)")


if __name__ == "__main__":
    main()
