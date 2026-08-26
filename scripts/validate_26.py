#!/usr/bin/env python3
"""Fail if the 26 chapter/presentation pairs or preserved content are inconsistent."""

import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
chapters = json.loads((ROOT / "data/chapters.json").read_text(encoding="utf-8"))["chapters"]
manifest = json.loads((ROOT / "data/chapter-split-manifest.json").read_text(encoding="utf-8"))
assert len(chapters) == 26
original_data = json.loads(subprocess.check_output(
    ["git", "show", "HEAD:data/chapters.json"], cwd=ROOT, text=True
))["chapters"]

for expected, chapter in enumerate(chapters, 1):
    assert chapter["number"] == expected
    chapter_page = ROOT / f"chapters/chapter-{expected}.html"
    presentation = ROOT / f"presentations/kap-{expected}.html"
    assert chapter_page.exists() and presentation.exists()
    deck = presentation.read_text(encoding="utf-8")
    title = re.search(r"<title>Kapitel \d+ – (.*?)</title>", deck, re.S)
    assert title and title.group(1) == chapter["title"], (expected, chapter["title"], title.group(1) if title else None)
    assert re.search(r'<section class="slide(?: [^"]*)?">', deck)

for row in manifest:
    first, second = row["newChapters"]
    split_heading = row["splitBefore"]
    assert split_heading not in chapters[first - 1]["contentHtml"]
    assert re.search(r"<h2[^>]*>" + re.escape(split_heading) + r"</h2>", chapters[second - 1]["contentHtml"])
    original = original_data[row["sourceChapter"] - 1]["contentHtml"]
    combined = chapters[first - 1]["contentHtml"] + chapters[second - 1]["contentHtml"]
    combined = combined.replace(
        "Det heter Industri 4.0 eftersom det beskriver den fjärde industriella revolutionen. Siffran 4.0 markerar alltså det fjärde stora utvecklingssteget inom industrin.",
        "Det syftar på den fjärde industriella revolutionen. För att förstå vad det innebär behöver man känna till de tidigare stegen i industrins utveckling.",
    )
    assert combined == original

    original_deck = subprocess.check_output(
        ["git", "show", f"HEAD:presentations/kap-{row['sourceChapter']}.html"], cwd=ROOT, text=True
    )
    original_slides = re.findall(r'<section class="slide(?: [^"]*)?">.*?</section>', original_deck, re.S)
    split_decks = (
        (ROOT / f"presentations/kap-{first}.html").read_text(encoding="utf-8")
        + (ROOT / f"presentations/kap-{second}.html").read_text(encoding="utf-8")
    )
    # The original title slide is intentionally renumbered; every instructional
    # slide after it must otherwise survive byte-for-byte in exactly one half.
    assert all(split_decks.count(slide) == 1 for slide in original_slides[1:]), row["sourceChapter"]
    assert row["presentationSplitMarker"].lower() in re.sub(r"<[^>]+>", " ", (ROOT / f"presentations/kap-{second}.html").read_text(encoding="utf-8")).lower()

presentation_index = (ROOT / "presentations/index.html").read_text(encoding="utf-8")
assert len(re.findall(r'href="kap-\d+\.html"', presentation_index)) == 26
js = (ROOT / "js/main.js").read_text(encoding="utf-8")
assert all(re.search(rf"^  {n}: \[", js, re.M) for n in range(1, 14))
assert "Math.ceil(chapterNumber / 2)" in js
for source in range(1, 14):
    allocation = re.search(rf"^    {source}: \[\[([^]]+)\], \[([^]]+)\]\]", js, re.M)
    assert allocation
    indexes = [int(x) for group in allocation.groups() for x in re.findall(r"\d+", group)]
    assert sorted(indexes) == list(range(10 if source == 1 else 8)), (source, indexes)
print("OK: 26 matchande kapitel och presentationer; innehåll och quizkoppling verifierade.")
