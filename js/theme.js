(function () {
  "use strict";

  const storageKey = "teknik2-theme";
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  function storedTheme() {
    try {
      const value = localStorage.getItem(storageKey);
      return value === "light" || value === "dark" ? value : null;
    } catch (_) {
      return null;
    }
  }

  function systemTheme() {
    return media.matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    updateButton(theme);
  }

  function updateButton(theme) {
    const button = document.getElementById("theme-toggle");
    if (!button) return;
    const isDark = theme === "dark";
    const action = isDark ? "Byt till ljust tema" : "Byt till mörkt tema";
    button.textContent = isDark ? "☀️" : "🌙";
    button.title = action;
    button.setAttribute("aria-label", action);
    button.setAttribute("aria-pressed", String(isDark));
  }

  applyTheme(storedTheme() || systemTheme());

  function createButton() {
    if (document.getElementById("theme-toggle")) return;
    const button = document.createElement("button");
    button.id = "theme-toggle";
    button.className = "theme-toggle";
    button.type = "button";
    button.addEventListener("click", function () {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem(storageKey, next); } catch (_) {}
      applyTheme(next);
    });

    const host = document.querySelector(".navbar, .presentation-topbar");
    if (host) host.appendChild(button);
    else document.body.appendChild(button);
    updateButton(document.documentElement.dataset.theme || systemTheme());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createButton, { once: true });
  } else {
    createButton();
  }

  const onSystemChange = function () {
    if (!storedTheme()) applyTheme(systemTheme());
  };
  if (media.addEventListener) media.addEventListener("change", onSystemChange);
  else media.addListener(onSystemChange);
})();
