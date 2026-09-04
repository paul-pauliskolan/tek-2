(function () {
  "use strict";
  const slides = Array.from(document.querySelectorAll(".slide"));
  if (!slides.length) return;
  const status = document.getElementById("status");
  const previous = document.getElementById("previous");
  const next = document.getElementById("next");
  let index = 0;

  function render() {
    slides.forEach((slide, i) => { slide.hidden = i !== index; });
    const questionNumber = Math.floor(index / 2) + 1;
    const kind = index % 2 === 0 ? "Fråga" : "Facit";
    status.textContent = `${kind} ${questionNumber} av ${slides.length / 2}`;
    previous.disabled = index === 0;
    next.textContent = index === slides.length - 1 ? "Till översikten" : "Nästa";
  }
  function forward() {
    if (index === slides.length - 1) window.location.href = "index.html";
    else { index += 1; render(); }
  }
  function back() { if (index > 0) { index -= 1; render(); } }
  previous.addEventListener("click", back);
  next.addEventListener("click", forward);
  document.addEventListener("keydown", (event) => {
    if (event.key === " " || event.key === "ArrowRight") { event.preventDefault(); forward(); }
    if (event.key === "ArrowLeft") { event.preventDefault(); back(); }
  });
  render();
}());
