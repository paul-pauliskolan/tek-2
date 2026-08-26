#!/usr/bin/env python3
"""Split the 13 course chapters and presentations into 26 traceable parts."""

from __future__ import annotations

import json
import re
from copy import deepcopy
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]

# The split is the first h2 that belongs to the second new chapter.
PLAN = {
    1: ("Teknikutveckling från problem till prototyp", "Testning, iteration och tekniska lösningars livscykel", "6. Testning", "Steg 6"),
    2: ("Entreprenörskap, uppfinningar och innovation", "Entreprenörskapets villkor och möjligheter", "Villkor för entreprenörskap", "Villkor"),
    3: ("Tekniska problem och orsaksanalys", "Lösningar, implementering och systematisk testning", "3. Föreslå lösningar", "Steg 3"),
    4: ("Projektplanering, roller och samarbete", "Arbetsmetoder och agila projekt", "Arbetsmetoder i projekt", "Arbetsmetoder"),
    5: ("Programmeringsprocessen från problem till test", "Programförbättring, automatisering och kvalitet", "5. Förbättring", "Steg 5"),
    6: ("Kvalitetssäkring och riskanalys", "Riskhantering, miljösäkring och arbetsmiljö", "Hur kan risker minskas?", "Riskhantering"),
    7: ("Begrepp, teorier, modeller och systemkonstruktion", "Dimensionering, beräkningar och rimlighetsbedömning", "Dimensionering", "Dimensionering"),
    8: ("Modellering och simulering i digitala system", "Simulering i spel och andra teknikområden", "Exempel: modellering och simulering i spelutveckling", "Spelutveckling"),
    9: ("Tekniska framsteg, framtidsteknik och hållbarhet", "Affärsmodeller, samhällspåverkan och tekniskt ansvar", "Nya affärsmodeller", "Nya affärsmodeller"),
    10: ("Funktion, säkerhet, etik och integritet", "Hållbar värdering av tekniska lösningar", "Teknik och hållbar utveckling", "Hållbar utveckling"),
    11: ("Digitalisering i produktion, kommunikation och vardag", "Smarta system, digital kompetens och livsmiljö", "Smarta system", "Smarta system"),
    12: ("Kommunikation och dokumentation i teknikprojekt", "Versionshantering och presentation av tekniska lösningar", "Versionshantering", "Versionshantering"),
    13: ("Tekniska ritningar och modeller för digitala system", "2D- och 3D-modeller: tolkning och framställning", "2D- och 3D-modeller", "2D-modeller"),
}


def plain(value: str) -> str:
    return re.sub(r"<[^>]+>", "", value).strip()


def h2_parts(html: str) -> list[str]:
    return [part for part in re.split(r"(?=<h2(?:\s[^>]*)?>)", html) if part]


def headings(html: str) -> list[str]:
    return [plain(x) for x in re.findall(r"<h[23][^>]*>(.*?)</h[23]>", html, re.S)]


def split_chapters() -> None:
    path = ROOT / "data/chapters.json"
    source = json.loads(path.read_text(encoding="utf-8"))
    originals = source["chapters"]
    if len(originals) == 26:
        manifest_path = ROOT / "data/chapter-split-manifest.json"
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        for row in manifest:
            row["presentationSplitMarker"] = PLAN[row["sourceChapter"]][3]
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        return
    assert len(originals) == 13
    result = []
    manifest = []

    for old in originals:
        old_no = old["number"]
        title_a, title_b, split_heading, _ = PLAN[old_no]
        parts = h2_parts(old["contentHtml"])
        split_at = next(i for i, part in enumerate(parts) if re.search(r"<h2[^>]*>" + re.escape(split_heading) + r"</h2>", part))
        html_a = "".join(parts[:split_at])
        html_b = "".join(parts[split_at:])
        new_numbers = (old_no * 2 - 1, old_no * 2)

        for part_no, (new_no, title, html) in enumerate(zip(new_numbers, (title_a, title_b), (html_a, html_b)), 1):
            item = deepcopy(old)
            item["id"] = new_no
            item["number"] = new_no
            item["title"] = title
            item["contentHtml"] = html
            item["sections"] = [h for h in headings(html) if h not in {"Mål", "Centrala begrepp", "Frågor att arbeta med"}]
            # Keep metadata traceable while giving each half the relevant topic slice.
            topics = old.get("keyTopics", [])
            topic_cut = (len(topics) + 1) // 2
            item["keyTopics"] = topics[:topic_cut] if part_no == 1 else topics[topic_cut:]
            item["sourceChapter"] = old_no
            item["sourcePart"] = part_no
            result.append(item)

        before = len(re.findall(r"\w+", plain(old["contentHtml"])))
        counts = [len(re.findall(r"\w+", plain(x))) for x in (html_a, html_b)]
        assert sum(counts) == before
        manifest.append({
            "sourceChapter": old_no,
            "sourceTitle": old["title"],
            "splitBefore": split_heading,
            "presentationSplitMarker": PLAN[old_no][3],
            "newChapters": [new_numbers[0], new_numbers[1]],
            "newTitles": [title_a, title_b],
            "wordCounts": counts,
        })

    source["chapters"] = result
    path.write_text(json.dumps(source, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (ROOT / "data/chapter-split-manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def presentation_sections(html: str) -> tuple[str, list[str], str]:
    matches = list(re.finditer(r'<section class="slide(?: [^"]*)?">.*?</section>', html, re.S))
    assert matches, "No presentation slides found"
    return html[:matches[0].start()], [m.group(0) for m in matches], html[matches[-1].end():]


def split_presentations() -> None:
    if (ROOT / "presentations/kap-26.html").exists():
        return
    sources = {n: (ROOT / f"presentations/kap-{n}.html").read_text(encoding="utf-8") for n in range(1, 14)}
    for old_no, html in sources.items():
        title_a, title_b, _, marker = PLAN[old_no]
        prefix, slides, suffix = presentation_sections(html)
        # The first section is the original title slide; find the first topical slide of part two.
        candidates = [
            i for i, slide in enumerate(slides[2:], 2)
            if marker.lower() in plain(slide).lower()
        ]
        assert candidates, f"No slide marker {marker!r} in presentation {old_no}"
        split_at = min(candidates, key=lambda i: abs(i - len(slides) / 2))
        assert 2 <= split_at < len(slides)
        groups = (slides[:split_at], slides[split_at:])
        for part_no, (new_no, title, group) in enumerate(zip((old_no * 2 - 1, old_no * 2), (title_a, title_b), groups), 1):
            if part_no == 2:
                title_slide = slides[0]
                title_slide = re.sub(r"<h1>.*?</h1>", f"<h1>{title}</h1>", title_slide, count=1, flags=re.S)
                group = [title_slide] + group
            out = prefix + "\n".join(group) + suffix
            out = re.sub(r"<title>.*?</title>", f"<title>Kapitel {new_no} – {title}</title>", out, count=1, flags=re.S)
            out = re.sub(r"(slide-kicker\">[^<]*Kapitel\s+)\d+", rf"\g<1>{new_no}", out, count=1)
            (ROOT / f"presentations/kap-{new_no}.html").write_text(out, encoding="utf-8")


def extract_array_after(source: str, marker: str) -> str:
    start = source.index(marker) + len(marker)
    start = source.index("[", start)
    depth = 0
    quote = None
    escaped = False
    for i in range(start, len(source)):
        char = source[i]
        if quote:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
        elif char in "'\"`":
            quote = char
        elif char == "[":
            depth += 1
        elif char == "]":
            depth -= 1
            if depth == 0:
                return source[start:i + 1]
    raise ValueError(f"Unclosed array after {marker}")


def migrate_embedded_quizzes() -> None:
    """Move the bespoke chapter 1–2 quizzes into the shared quiz data once."""
    js_path = ROOT / "js/main.js"
    js = js_path.read_text(encoding="utf-8")
    if "// Migrated quizzes from original chapters 1 and 2" in js:
        return
    blocks = []
    for old_no in (1, 2):
        page = (ROOT / f"chapters/chapter-{old_no}.html").read_text(encoding="utf-8")
        questions = extract_array_after(page, "const questions =")
        blocks.append(f"  {old_no}: {questions},")
    insertion = "// Migrated quizzes from original chapters 1 and 2\n" + "\n".join(blocks) + "\n"
    js = js.replace("const chapterQuizData = {\n", "const chapterQuizData = {\n" + insertion, 1)
    js_path.write_text(js, encoding="utf-8")


def create_chapter_pages() -> None:
    template = (ROOT / "chapters/chapter-template.html").read_text(encoding="utf-8")
    for number in range(1, 27):
        (ROOT / f"chapters/chapter-{number}.html").write_text(template, encoding="utf-8")


def update_indexes() -> None:
    chapters = json.loads((ROOT / "data/chapters.json").read_text(encoding="utf-8"))["chapters"]
    cards = "\n".join(
        f'''          <div class="prompt-card presentation-index-card">
            <h2>Kapitel {c["number"]}</h2>
            <p><a href="kap-{c["number"]}.html">{c["title"]}</a></p>
          </div>'''
        for c in chapters
    )
    index_path = ROOT / "presentations/index.html"
    index = index_path.read_text(encoding="utf-8")
    index = re.sub(
        r'(<div class="presentation-index-grid">).*?(\s*</div>\s*</div>\s*</section>)',
        rf"\1\n{cards}\2",
        index,
        count=1,
        flags=re.S,
    )
    index = index.replace("Teknik 1", "Teknik 2")
    index_path.write_text(index, encoding="utf-8")

    for relative in ("index.html", "ovningsfragor.html"):
        path = ROOT / relative
        text = path.read_text(encoding="utf-8")
        text = text.replace("för kapitel 1-13", "för kursens 26 kapitel")
        path.write_text(text, encoding="utf-8")

    planning = ROOT / "planering-infor-gyarb.html"
    text = planning.read_text(encoding="utf-8")
    text = text.replace('chapters/chapter-13.html', 'chapters/chapter-26.html').replace('Kapitel 13', 'Kapitel 26')
    planning.write_text(text, encoding="utf-8")

    sitemap = ROOT / "sitemap.xml"
    text = sitemap.read_text(encoding="utf-8")
    last_url = max(re.finditer(r"\s*<url>\s*<loc>[^<]*/chapters/chapter-\d+\.html</loc>.*?</url>", text, re.S), key=lambda m: m.end())
    chapter_urls = "".join(
        f"\n  <url>\n    <loc>https://paul-pauliskolan.github.io/tek-2/chapters/chapter-{n}.html</loc>\n  </url>"
        for n in range(1, 27)
    )
    first = min(re.finditer(r"\s*<url>\s*<loc>[^<]*/chapters/chapter-\d+\.html</loc>.*?</url>", text, re.S), key=lambda m: m.start())
    text = text[:first.start()] + chapter_urls + text[last_url.end():]
    sitemap.write_text(text, encoding="utf-8")


def apply_content_refinements() -> None:
    path = ROOT / "data/chapters.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    chapter = data["chapters"][20]
    old = "Det syftar på den fjärde industriella revolutionen. För att förstå vad det innebär behöver man känna till de tidigare stegen i industrins utveckling."
    new = "Det heter Industri 4.0 eftersom det beskriver den fjärde industriella revolutionen. Siffran 4.0 markerar alltså det fjärde stora utvecklingssteget inom industrin."
    if old in chapter["contentHtml"]:
        chapter["contentHtml"] = chapter["contentHtml"].replace(old, new, 1)
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    split_chapters()
    split_presentations()
    migrate_embedded_quizzes()
    create_chapter_pages()
    update_indexes()
    apply_content_refinements()
