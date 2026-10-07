(function () {
  "use strict";
  const data = window.snabbfragorData;
  if (!data) return;
  const chapterParam = new URLSearchParams(window.location.search).get("chapters");
  let selected = data.chapters;
  if (chapterParam) {
    const match = chapterParam.match(/^(\d+)-(\d+)$/);
    if (match) selected = data.chapters.filter(c => c.number >= Number(match[1]) && c.number <= Number(match[2]));
  }
  const questions = selected.flatMap(c => c.questions.map(q => ({ number: c.number, title: c.title, question: q[0], answer: q[1] })));
  function shuffle(items) {
    for (let i = items.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
  }
  shuffle(questions);
  const heading = document.getElementById("deck-title");
  heading.textContent = chapterParam ? `Kapitel ${chapterParam.replace("-", "–")}` : "Hela kursen";
  document.title = `${heading.textContent} – snabbfrågor`;
  let index = 0;
  let showingAnswer = false;
  const chapter = document.getElementById("chapter");
  const position = document.getElementById("position");
  const question = document.getElementById("question");
  const answer = document.getElementById("answer");
  const show = document.getElementById("show-answer");
  const previous = document.getElementById("previous-random");
  const next = document.getElementById("next-random");
  function render() {
    const item = questions[index];
    chapter.textContent = `Kapitel ${item.number} · ${item.title}`;
    position.textContent = `Fråga ${index + 1} av ${questions.length}`;
    question.textContent = item.question;
    answer.textContent = item.answer;
    answer.hidden = true; show.hidden = false; next.hidden = true;
    previous.disabled = index === 0; showingAnswer = false;
  }
  function reveal() {
    answer.hidden = false; show.hidden = true; next.hidden = false;
    next.textContent = index === questions.length - 1 ? "Blanda om och börja om" : "Nästa fråga";
    showingAnswer = true; next.focus();
  }
  function forward() {
    if (!showingAnswer) { reveal(); return; }
    if (index === questions.length - 1) { shuffle(questions); index = 0; render(); return; }
    index += 1; render(); show.focus();
  }
  function back() { if (index > 0) { index -= 1; render(); } }
  show.addEventListener("click", reveal);
  next.addEventListener("click", forward);
  previous.addEventListener("click", back);
  document.addEventListener("keydown", event => {
    if (event.key === " " || event.key === "ArrowRight") { event.preventDefault(); forward(); }
    if (event.key === "ArrowLeft") { event.preventDefault(); back(); }
  });
  render();
}());
