(function () {
  "use strict";
  const number = Number(document.body.dataset.chapter);
  const chapter = window.snabbfragorData.chapters.find(item => item.number === number);
  if (!chapter) return;
  document.title = `Kapitel ${number} – snabbfrågor`;
  document.getElementById("chapter-heading").textContent = `Kapitel ${number} · ${chapter.title}`;
  const question = document.getElementById("question"); const answer = document.getElementById("answer");
  const status = document.getElementById("status"); const previous = document.getElementById("previous");
  const next = document.getElementById("next"); const reveal = document.getElementById("show-answer");
  let index = 0; let showingAnswer = false;
  function render() {
    status.textContent = `Fråga ${index + 1} av ${chapter.questions.length}`;
    question.textContent = chapter.questions[index][0]; answer.textContent = chapter.questions[index][1];
    answer.hidden = true; reveal.hidden = false; next.textContent = "Nästa";
    previous.disabled = index === 0; showingAnswer = false;
  }
  function showAnswer() {
    answer.hidden = false; reveal.hidden = true; showingAnswer = true;
    next.textContent = index === chapter.questions.length - 1 ? "Till översikten" : "Nästa fråga";
  }
  function forward() {
    if (!showingAnswer) { showAnswer(); return; }
    if (index === chapter.questions.length - 1) { window.location.href = "index.html"; return; }
    index += 1; render();
  }
  function back() {
    if (showingAnswer) { answer.hidden = true; reveal.hidden = false; next.textContent = "Nästa"; showingAnswer = false; return; }
    if (index > 0) { index -= 1; render(); showAnswer(); }
  }
  reveal.addEventListener("click", showAnswer); previous.addEventListener("click", back); next.addEventListener("click", forward);
  document.addEventListener("keydown", event => {
    if (event.key === " " || event.key === "ArrowRight") { event.preventDefault(); forward(); }
    if (event.key === "ArrowLeft") { event.preventDefault(); back(); }
  });
  render();
}());
