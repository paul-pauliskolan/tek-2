(function () {
  "use strict";
  const chapters = window.snabbfragorData.chapters;
  const total = chapters.reduce((sum, chapter) => sum + chapter.questions.length, 0);
  document.querySelector("#all-questions .question-count").textContent = `${total} frågor`;
  const container = document.getElementById("chapter-groups");
  for (let start = 1; start <= chapters.length; start += 4) {
    const group = chapters.filter(chapter => chapter.number >= start && chapter.number <= start + 3);
    const end = group[group.length - 1].number;
    const section = document.createElement("section"); section.className = "chapter-group";
    const heading = document.createElement("h2"); heading.textContent = `Kapitel ${start}–${end}`; section.appendChild(heading);
    const grid = document.createElement("div"); grid.className = "card-grid";
    function card(href, labelText, titleText, count, className = "mode-card") {
      const link = document.createElement("a"); link.className = className; link.href = href;
      const label = document.createElement("span"); label.textContent = labelText;
      const title = document.createElement("strong"); title.textContent = titleText;
      const amount = document.createElement("span"); amount.textContent = `${count} frågor`;
      link.append(label, title, amount); return link;
    }
    const count = group.reduce((sum, chapter) => sum + chapter.questions.length, 0);
    grid.appendChild(card(`slumpfragor.html?chapters=${start}-${end}`, `Kapitel ${start}–${end}`, `Alla frågor i kapitel ${start}–${end}`, count, "mode-card group-card"));
    group.forEach(chapter => grid.appendChild(card(`kap-${chapter.number}.html`, `Kapitel ${chapter.number}`, chapter.title, chapter.questions.length)));
    section.appendChild(grid); container.appendChild(section);
  }
}());
