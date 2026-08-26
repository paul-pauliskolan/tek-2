// Teknik 2 - shared site logic

const BOOK_TITLE = "Teknik 2 - IN";
const BOOK_SHORT_TITLE = "Teknik 2";
// Set this to the deployed Google Apps Script web-app URL to enable anonymous quiz statistics.
const QUIZ_STATISTICS_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbylqSA4P8tGRWikq_3VU5Ypt4jKsO4poJvJk2f-JzZCvL5vcILHiloNPofGVaaiqDzC/exec";

let chaptersData = [];

function recordQuizStatistics({ quizId, chapter, answers }) {
  if (!QUIZ_STATISTICS_ENDPOINT || !Array.isArray(answers) || !answers.length) {
    return;
  }

  const payload = {
    quizId,
    chapter,
    pagePath: window.location.pathname,
    answers,
  };

  fetch(QUIZ_STATISTICS_ENDPOINT, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  }).catch(() => {
    // Quiz correction must still work if statistics cannot be sent.
  });
}

window.teknik2QuizStatistics = {
  isEnabled: Boolean(QUIZ_STATISTICS_ENDPOINT),
  record: recordQuizStatistics,
};

document.addEventListener("DOMContentLoaded", () => {
  loadChaptersData();
  setupMenuToggle();
  injectSiteSearch();
  applyBranding();
});

function injectSiteSearch() {
  if (document.querySelector(".site-search-panel, .page-search-shell")) {
    return;
  }

  const searchScript = document.createElement("script");
  searchScript.async = true;
  searchScript.src = "https://cse.google.com/cse.js?cx=714e09b881eff46fd";

  const searchBox = document.createElement("div");
  searchBox.className = "gcse-search";

  let searchToggle = null;
  let searchPanel = null;

  const buildSearchPanel = () => {
    const panel = document.createElement("div");
    panel.className = "site-search-panel";
    panel.id = "site-search-panel";
    panel.append(searchScript, searchBox);
    return panel;
  };

  const buildSearchToggle = () => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "site-search-toggle";
    button.setAttribute("aria-label", "Öppna sök");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", "site-search-panel");
    button.textContent = "🔍";
    return button;
  };

  const navbar = document.querySelector(".navbar");
  if (navbar) {
    searchToggle = buildSearchToggle();
    searchPanel = buildSearchPanel();
    const menuToggle = navbar.querySelector(".menu-toggle");
    if (menuToggle) {
      navbar.insertBefore(searchToggle, menuToggle);
      navbar.insertBefore(searchPanel, menuToggle);
    } else {
      navbar.append(searchToggle, searchPanel);
    }
  } else {
    const searchWrapper = document.createElement("div");
    searchWrapper.className = "site-search page-search-shell";
    searchToggle = buildSearchToggle();
    searchPanel = buildSearchPanel();
    searchWrapper.append(searchToggle, searchPanel);
    const body = document.body;
    const firstBlock = body.querySelector(".container, main, .page-stack");
    if (firstBlock) {
      body.insertBefore(searchWrapper, firstBlock);
    } else {
      body.prepend(searchWrapper);
    }
  }

  const closeSiteSearch = () => {
    document.body.classList.remove("site-search-open");
    searchToggle.setAttribute("aria-expanded", "false");
  };

  const openSiteSearch = () => {
    document.body.classList.add("site-search-open");
    searchToggle?.setAttribute("aria-expanded", "true");
    window.setTimeout(() => {
      const input = searchPanel?.querySelector("input.gsc-input");
      if (input) {
        input.focus();
      }
    }, 50);
  };

  searchToggle?.addEventListener("click", () => {
    if (document.body.classList.contains("site-search-open")) {
      closeSiteSearch();
    } else {
      openSiteSearch();
    }
  });

  document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("site-search-open")) return;
    if (
      searchToggle?.contains(event.target) ||
      searchPanel?.contains(event.target)
    )
      return;
    closeSiteSearch();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSiteSearch();
    }
  });
}

function applyBranding() {
  const logo = document.querySelector(".navbar .logo");
  if (logo) {
    logo.textContent = `⚙️ ${BOOK_SHORT_TITLE}`;
    if (!logo.getAttribute("href")) {
      logo.setAttribute("href", "index.html");
    }
  }

  const homeEyebrow = document.querySelector(".home-page .eyebrow");
  if (homeEyebrow) {
    homeEyebrow.textContent = BOOK_SHORT_TITLE;
  }

  const homeTitle = document.querySelector(".home-page .hero h1");
  if (homeTitle) {
    homeTitle.textContent = BOOK_TITLE;
  }

  const homeSubtitle = document.querySelector(".home-page .subtitle");
  if (homeSubtitle) {
    homeSubtitle.textContent = "En kursbok byggd för läsning och övning.";
  }

  const previewHeader = document.querySelector(".preview-header h1");
  if (previewHeader) {
    previewHeader.textContent = `📖 ${BOOK_TITLE}`;
  }

  const pageTitle = document.title || "";
  if (
    pageTitle.includes("Programmering nivå 1") ||
    pageTitle.includes("Space Safari")
  ) {
    document.title = pageTitle.replace(
      /Programmering nivå 1 med Python|Programmering nivå 1|Space Safari/g,
      BOOK_TITLE,
    );
  }

  const chapterHeroEyebrow = document.querySelector(
    ".chapter-page .chapter-hero .eyebrow",
  );
  if (chapterHeroEyebrow) {
    chapterHeroEyebrow.textContent = BOOK_SHORT_TITLE;
  }

  const chapterHomeTitle = document.querySelector(
    ".chapter-page header h1 a, .chapter-page header h1",
  );
  if (chapterHomeTitle) {
    chapterHomeTitle.textContent = `⚙️ ${BOOK_SHORT_TITLE}`;
  }
}

function setupMenuToggle() {
  const menuToggle = document.getElementById("menu-toggle");
  const menuClose = document.getElementById("menu-close");
  const sideMenu = document.getElementById("side-menu");
  const chapterLinks = document.querySelectorAll(".side-menu .chapter-link");

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      if (sideMenu.classList.contains("active")) {
        closeMenu();
      } else {
        sideMenu.classList.add("active");
        document.body.classList.add("menu-open");
      }
    });
  }

  if (menuClose) {
    menuClose.addEventListener("click", (e) => {
      e.preventDefault();
      closeMenu();
    });
  }

  chapterLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  // Close menu when clicking overlay on mobile
  document.addEventListener("click", (e) => {
    if (
      sideMenu.classList.contains("active") &&
      !sideMenu.contains(e.target) &&
      !(menuToggle && menuToggle.contains(e.target))
    ) {
      closeMenu();
    }
  });
}

function closeMenu() {
  const sideMenu = document.getElementById("side-menu");
  sideMenu.classList.remove("active");
  document.body.classList.remove("menu-open");
}

function loadChaptersData() {
  const jsonPath = document.body.classList.contains("chapter-page")
    ? "../data/chapters.json"
    : "data/chapters.json";

  fetch(jsonPath)
    .then((response) => response.json())
    .then((data) => {
      chaptersData = data.chapters;
      renderChapterMenu();

      // Render homepage menu if it exists
      const homepageMenu = document.getElementById("chapters-menu-homepage");
      if (homepageMenu) {
        renderChapterMenuFullWidth(homepageMenu);
      }
    })
    .catch((error) => console.error("Error loading chapters:", error));
}

function renderChapterMenu() {
  const menu = document.getElementById("chapters-menu");
  if (!menu) return;

  menu.innerHTML = "";
  chaptersData.forEach((chapter) => {
    const link = document.createElement("a");
    const isChapterPage = document.body.classList.contains("chapter-page");
    link.href = isChapterPage
      ? `chapter-${chapter.number}.html`
      : `chapters/chapter-${chapter.number}.html`;
    link.className = "chapter-link";

    link.innerHTML = `<span class="chapter-number">${String(chapter.number).padStart(2, "0")}</span><span class="chapter-title">${chapter.title}</span>`;

    menu.appendChild(link);
  });
}

function renderChapterMenuFullWidth(menuElement) {
  menuElement.innerHTML = "";
  chaptersData.forEach((chapter) => {
    const link = document.createElement("a");
    link.href = `chapters/chapter-${chapter.number}.html`;
    link.className = "chapter-link";

    link.innerHTML = `<span class="chapter-number">${String(chapter.number).padStart(2, "0")}</span><span class="chapter-title">${chapter.title}</span>`;

    menuElement.appendChild(link);
  });
}

function getChapter(chapterNumber) {
  return chaptersData.find((ch) => ch.number === parseInt(chapterNumber));
}

function getPreviousChapter(chapterNumber) {
  const chapter = getChapter(chapterNumber);
  if (!chapter || chapter.number === 1) return null;
  return getChapter(chapter.number - 1);
}

function getNextChapter(chapterNumber) {
  const chapter = getChapter(chapterNumber);
  if (!chapter || chapter.number === chaptersData.length) return null;
  return getChapter(chapter.number + 1);
}

function removeLegacyChapterContent() {
  const chapterMain = document.querySelector(".chapter-page .chapter-main");
  if (!chapterMain) return;

  const allowedSelectors = new Set([
    ".chapter-hero",
    ".chapter-header",
    "#chapter-content",
    "#chapter-summary",
    ".chapter-nav",
  ]);

  Array.from(chapterMain.children).forEach((child) => {
    if (
      child.matches &&
      Array.from(allowedSelectors).some((selector) => child.matches(selector))
    ) {
      return;
    }
    child.remove();
  });
}

function slugifyHeading(text, fallbackIndex) {
  const base = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return base || `del-${fallbackIndex}`;
}

function renderChapterToc() {
  const toc = document.getElementById("chapter-toc");
  if (!toc) return;

  const content = document.getElementById("chapter-content");
  if (!content) {
    toc.innerHTML =
      '<p class="toc-empty">Innehållsförteckningen kunde inte laddas.</p>';
    return;
  }

  const headings = Array.from(content.querySelectorAll("h2")).filter(
    (heading) => heading.textContent.trim().length > 0,
  );

  if (headings.length === 0) {
    toc.innerHTML =
      '<p class="toc-empty">Inga rubriker hittades i kapitlet.</p>';
    return;
  }

  const existingIds = new Set(
    Array.from(content.querySelectorAll("[id]")).map((el) => el.id),
  );

  const itemsHtml = headings
    .map((heading, index) => {
      if (!heading.id) {
        const baseId = slugifyHeading(heading.textContent.trim(), index + 1);
        let nextId = baseId;
        let counter = 2;

        while (existingIds.has(nextId)) {
          nextId = `${baseId}-${counter}`;
          counter += 1;
        }

        heading.id = nextId;
        existingIds.add(nextId);
      }

      return `<li><a class="toc-link" href="#${heading.id}">${heading.textContent.trim()}</a></li>`;
    })
    .join("");

  toc.innerHTML = `<ul class="chapter-toc-list">${itemsHtml}</ul>`;
}

function renderChapterPage(chapterNumber) {
  const chapter = getChapter(chapterNumber);
  if (!chapter) {
    window.location.href = "/";
    return;
  }

  removeLegacyChapterContent();

  document.title = `${chapter.title} - ${BOOK_TITLE}`;

  const header = document.querySelector(".chapter-header");
  if (header) {
    header.innerHTML = `
        <h1>Kapitel ${chapter.number}: ${chapter.title}</h1>
        `;
  }

  const content = document.querySelector("#chapter-content");
  if (content) {
    content.innerHTML = chapter.contentHtml || "";
    if (chapterNumber === 1) {
      const processHeading = Array.from(content.querySelectorAll("h2")).find((heading) =>
        heading.textContent.trim().toLowerCase().includes("teknikkutvecklingsprocessens steg"),
      );
      if (processHeading) {
        processHeading.insertAdjacentHTML(
          "afterend",
          '<div class="development-link-under-steps"><p><a href="chapter-1-development.html" target="_blank" rel="noopener noreferrer">Öppna teknikutvecklingsprocessens steg (ny flik)</a></p><img src="../assets/images/teknikutveckling.png" alt="Flödesschema för teknikutvecklingsprocessen" loading="lazy" style="display:block;max-width:100%;height:auto;margin-top:12px"></div>',
        );
      }
    }
  }

  renderChapterToc();

  const summary = document.querySelector("#chapter-summary");
  if (summary) {
    summary.innerHTML = `
            <div class="content-section">
          <h2>Sammanfattning</h2>
                <p>${chapter.summary}</p>
                <div class="key-topics">
                    ${chapter.keyTopics.map((topic) => `<span>${topic}</span>`).join("")}
                </div>
            </div>
        `;
  }

  const navContainer = document.querySelector(".chapter-nav");
  if (navContainer) {
    const prevChapter = getPreviousChapter(chapterNumber);
    const nextChapter = getNextChapter(chapterNumber);

    let html = "";

    if (prevChapter) {
      html += `
                <a href="chapter-${prevChapter.number}.html" class="nav-button">
                    <div>
                        <div class="nav-label">← Föregående</div>
                        <div class="nav-title">${prevChapter.title}</div>
                    </div>
                </a>
            `;
    } else {
      html += `<a href="../index.html" class="nav-button"><div class="nav-label">← Startsida</div></a>`;
    }

    if (nextChapter) {
      html += `
                <a href="chapter-${nextChapter.number}.html" class="nav-button">
                    <div style="text-align: right;">
              <div class="nav-label">Nästa →</div>
                        <div class="nav-title">${nextChapter.title}</div>
                    </div>
                </a>
            `;
    }

    navContainer.innerHTML = html;
  }
}

const chapterQuizData = {
// Migrated quizzes from original chapters 1 and 2
  1: [
                {
                    text: 'En elevgrupp ska utveckla en app för skolans öppet hus. Vad bör de göra först?',
                    options: [
                        'Börja koda startsidan direkt.',
                        'Formulera vilket problem appen ska lösa och för vem.',
                        'Bestämma färger och typsnitt.',
                        'Publicera appen och ändra efteråt.'
                    ],
                    answer: 'B',
                    explanation: 'I början behöver gruppen förstå problemet och målgruppen innan lösningen byggs.'
                },
                {
                    text: 'Varför är research viktig tidigt i teknikutvecklingsprocessen?',
                    options: [
                        'För att hitta behov, begränsningar och liknande lösningar.',
                        'För att kunna hoppa över testning senare.',
                        'För att bestämma exakt slutprodukt innan användare tillfrågas.',
                        'För att undvika att ändra idén under arbetet.'
                    ],
                    answer: 'A',
                    explanation: 'Research hjälper gruppen förstå behov, alternativ och begränsningar innan en lösning väljs.'
                },
                {
                    text: 'Vilket alternativ beskriver bäst skillnaden mellan en idé och en prototyp?',
                    options: [
                        'En prototyp är alltid den slutliga produkten.',
                        'En idé är färdig att lansera, en prototyp används bara för dokumentation.',
                        'En idé beskriver en möjlig lösning, en prototyp går att prova eller visa.',
                        'En idé behöver testas, men en prototyp behöver inte testas.'
                    ],
                    answer: 'C',
                    explanation: 'En prototyp är en tidig version eller modell som kan användas för att testa idén.'
                },
                {
                    text: 'En grupp bygger en klickbar skiss av en webbplats för att se om användare hittar rätt information. Vilket steg passar bäst?',
                    options: [
                        'Produktion.',
                        'Prototyp och testning.',
                        'Avveckling.',
                        'Upphovsrätt.'
                    ],
                    answer: 'B',
                    explanation: 'En klickbar skiss är en prototyp, och den används här för att testa användarens väg genom webbplatsen.'
                },
                {
                    text: 'Vad betyder iteration i teknikutveckling?',
                    options: [
                        'Att man följer planen exakt och aldrig ändrar något.',
                        'Att man lanserar flera produkter samtidigt.',
                        'Att man bara arbetar med dokumentation.',
                        'Att man testar, förbättrar och provar igen.'
                    ],
                    answer: 'D',
                    explanation: 'Iteration betyder att lösningen utvecklas i flera varv genom testning och förbättring.'
                },
                {
                    text: 'Efter ett användartest märker gruppen att många inte hittar menyknappen. Vad är ett rimligt nästa steg?',
                    options: [
                        'Ta bort testresultatet eftersom prototypen redan är klar.',
                        'Lansera direkt eftersom felet bara gäller vissa användare.',
                        'Ändra designen och testa igen.',
                        'Börja om med ett helt annat problem utan analys.'
                    ],
                    answer: 'C',
                    explanation: 'Testresultat används för att förbättra lösningen och sedan prova den igen.'
                },
                {
                    text: 'Vilket exempel visar en tydlig problemformulering?',
                    options: [
                        'Nya elever hittar inte schema och lokaler under första veckan.',
                        'Vi ska använda AI.',
                        'Vi ska göra en snygg app.',
                        'Vi ska göra något modernt.'
                    ],
                    answer: 'A',
                    explanation: 'En tydlig problemformulering beskriver vad som inte fungerar och vem som påverkas.'
                },
                {
                    text: 'Varför behöver man tänka på målgruppen när man utvecklar teknik?',
                    options: [
                        'För att målgruppen alltid bestämmer all teknik själva.',
                        'För att lösningen ska passa dem som faktiskt ska använda den.',
                        'För att tekniken annars inte behöver testas.',
                        'För att alla användare har exakt samma behov.'
                    ],
                    answer: 'B',
                    explanation: 'Tekniken behöver utformas efter användarnas behov, förutsättningar och sammanhang.'
                },
                {
                    text: 'Vad menas med livscykelperspektiv för en digital produkt?',
                    options: [
                        'Att produkten behöver underhållas, uppdateras och ibland avvecklas.',
                        'Att arbetet är slut så fort produkten publiceras.',
                        'Att bara prototypen räknas som teknisk lösning.',
                        'Att testning bara görs innan problemet är formulerat.'
                    ],
                    answer: 'A',
                    explanation: 'En digital produkt behöver ofta hanteras även efter lansering, till exempel med uppdateringar och underhåll.'
                },
                {
                    text: 'När behöver upphovsrätt särskilt beaktas i ett digitalt projekt?',
                    options: [
                        'När man testar om en knapp fungerar.',
                        'När man väljer vilka användare som ska intervjuas.',
                        'När man skriver om sin egen problemformulering.',
                        'När man använder bilder, text, musik eller annat material som andra har skapat.'
                    ],
                    answer: 'D',
                    explanation: 'Upphovsrätt gäller material som andra har skapat, till exempel bilder, text, musik och film.'
                }
            ],
  2: [
                {
                    text: 'Ett team har byggt en tekniskt avancerad app, men ingen elevgrupp verkar behöva den. Vilken slutsats passar bäst?',
                    options: [
                        'Appen är automatiskt en innovation eftersom den är tekniskt avancerad.',
                        'Teamet bör lägga all tid på marknadsföring innan de undersöker behovet.',
                        'Entreprenörskap handlar också om att förstå användare, behov och värde.',
                        'Om tekniken fungerar behövs ingen målgrupp.'
                    ],
                    answer: 'C',
                    explanation: 'En teknisk lösning behöver skapa verkligt värde för en målgrupp, inte bara fungera tekniskt.'
                },
                {
                    text: 'Vilket alternativ beskriver bäst skillnaden mellan en uppfinning och en innovation?',
                    options: [
                        'En uppfinning är en ny idé eller teknik, medan en innovation används och skapar värde.',
                        'En uppfinning är alltid lönsam, medan en innovation bara är en prototyp.',
                        'En uppfinning måste vara fysisk, medan en innovation alltid är digital.',
                        'Det finns ingen viktig skillnad mellan begreppen.'
                    ],
                    answer: 'A',
                    explanation: 'En uppfinning kan vara en ny idé eller teknik, men en innovation används i praktiken och skapar nytta.'
                },
                {
                    text: 'En grupp beskriver sin målgrupp som "alla som använder internet". Vad är det största problemet?',
                    options: [
                        'Målgruppen blir för smal för att kunna testas.',
                        'Målgruppen blir för bred för att ge tydliga beslut om behov och funktioner.',
                        'Målgruppen gör att lösningen inte får innehålla teknik.',
                        'Målgruppen visar att finansiering inte behövs.'
                    ],
                    answer: 'B',
                    explanation: 'En för bred målgrupp gör det svårt att veta vilka behov lösningen ska prioritera.'
                },
                {
                    text: 'Vilket alternativ är ett tydligt värdeerbjudande?',
                    options: [
                        'Vi ska bygga en modern app med många funktioner.',
                        'Vi ska använda den senaste tekniken.',
                        'För små föreningar som har svårt att hålla information aktuell erbjuder vi en lättskött webbplats.',
                        'Vår lösning ska bli bättre än alla andra.'
                    ],
                    answer: 'C',
                    explanation: 'Ett värdeerbjudande kopplar målgrupp, behov, lösning och nytta.'
                },
                {
                    text: 'En digital tjänst ska hantera elevers namn och resultat. Vilket villkor behöver gruppen särskilt tänka på?',
                    options: [
                        'Att material som bilder och texter får användas med rätt licens.',
                        'Att serverkapaciteten räcker om många använder tjänsten samtidigt.',
                        'Att tjänsten har en tydlig målgrupp och ett begripligt värde.',
                        'Att personuppgifter hanteras lagligt, säkert och med tydlig information.'
                    ],
                    answer: 'D',
                    explanation: 'Namn och resultat är personuppgifter. Därför behöver gruppen ta hänsyn till GDPR och användarnas förtroende.'
                },
                {
                    text: 'Vad kan finansiering användas till i ett teknikprojekt?',
                    options: [
                        'Att köpa sig fri från risker när tekniken är svår att utveckla.',
                        'Att täcka kostnader för utveckling, verktyg, drift eller lansering.',
                        'Att slippa undersöka om målgruppen faktiskt behöver lösningen.',
                        'Att göra lagar, licenser och säkerhetskrav mindre viktiga.'
                    ],
                    answer: 'B',
                    explanation: 'Finansiering kan ge resurser, men den tar inte bort behovet av testning, analys och bra beslut.'
                },
                {
                    text: 'Varför är risk och osäkerhet viktiga att tänka på i entreprenörskap?',
                    options: [
                        'För att risk visar att projektet bör pausas tills all osäkerhet är borta.',
                        'För att risk främst handlar om att välja rätt namn och grafisk profil.',
                        'För att osäkerhet försvinner när den tekniska prototypen fungerar.',
                        'För att idén kan falla på teknik, ekonomi, behov eller konkurrens.'
                    ],
                    answer: 'D',
                    explanation: 'Tidiga tester och analys minskar risken att lägga mycket tid på en lösning som inte håller.'
                },
                {
                    text: 'Ett team testar en enkel prototyp och upptäcker att användarna tolkar funktionen fel. Vad visar det bäst?',
                    options: [
                        'Att resultatet bör analyseras inför nästa version.',
                        'Att prototypen bör ersättas direkt utan mer undersökning.',
                        'Att användare helst ska vänta tills produkten är färdig.',
                        'Att idén inte längre kan bli en innovation efter testet.'
                    ],
                    answer: 'A',
                    explanation: 'Erfarenhet blir lärande först när teamet analyserar resultatet och ändrar sitt nästa beslut.'
                }
            ],
  3: [
    {
      text: "En knapp på en webbplats ger ingen reaktion när användaren klickar. Vad bör man göra först?",
      options: [
        "Skriva om hela webbplatsen för att vara säker på att felet försvinner.",
        "Byta design på knappen eftersom alla knappfel beror på utseende.",
        "Beskriva exakt vad som händer, var felet uppstår och vad som förväntades.",
        "Publicera sidan igen och vänta på mer återkoppling från användare.",
      ],
      answer: "C",
      explanation:
        "Första steget är att identifiera problemet tydligt innan man börjar ändra lösningen.",
    },
    {
      text: "Vilket alternativ visar bäst skillnaden mellan symptom och orsak?",
      options: [
        "Sidan laddar långsamt; orsaken kan vara för stora bilder.",
        "Symptomet är lösningen; orsaken är alltid användarens misstag.",
        "Symptom och orsak betyder samma sak i tekniska system.",
        "Orsaken är det första man ser; symptomet är ändringen man gör.",
      ],
      answer: "A",
      explanation:
        "Symptomet är det synliga problemet. Orsaken är det som ligger bakom och behöver undersökas.",
    },
    {
      text: "Ett formulär misslyckas ibland, men bara med vissa inmatningar. Vad är ett rimligt nästa steg?",
      options: [
        "Ta bort formuläret och bygg en annan funktion direkt.",
        "Testa olika inmatningar och dokumentera när felet uppstår.",
        "Ändra flera delar samtidigt så att någon ändring troligen hjälper.",
        "Vänta tills felet uppstår hos fler användare innan det undersöks.",
      ],
      answer: "B",
      explanation:
        "Systematisk testning gör det lättare att se vilka villkor som utlöser felet.",
    },
    {
      text: "Ett program startar men kraschar när användaren försöker dividera med noll. Vilken feltyp passar bäst?",
      options: [
        "Syntaxfel.",
        "Logiskt fel.",
        "Designfel.",
        "Exekveringsfel.",
      ],
      answer: "D",
      explanation:
        "Ett exekveringsfel uppstår när programmet körs men avbryts när ett problem inträffar.",
    },
    {
      text: "Vad innebär dekomposition vid problemlösning?",
      options: [
        "Att dela upp ett större problem i mindre delar.",
        "Att ta bort detaljer tills ingen lösning går att kontrollera.",
        "Att välja den första lösningen innan orsaken är känd.",
        "Att dokumentera slutresultatet men hoppa över analysen.",
      ],
      answer: "A",
      explanation:
        "Dekomposition gör ett stort problem mer hanterbart genom att dela upp det i mindre delar.",
    },
    {
      text: "När är pseudokod särskilt användbar i problemlösning?",
      options: [
        "När man vill undvika att tänka igenom programmets logik.",
        "När färdig kod redan är testad och lanserad.",
        "När man vill beskriva lösningens steg före riktig kod.",
        "När man behöver ersätta alla tester med en textbeskrivning.",
      ],
      answer: "C",
      explanation:
        "Pseudokod beskriver logiken på ett begripligt sätt innan den skrivs i ett programmeringsspråk.",
    },
    {
      text: "Varför bör man ändra en sak i taget när man felsöker?",
      options: [
        "För att lösningen annars alltid blir långsammare.",
        "För att se vilken ändring som påverkade resultatet.",
        "För att dokumentation bara behövs när flera ändringar görs.",
        "För att användaren inte ska märka att systemet testas.",
      ],
      answer: "B",
      explanation:
        "Om flera saker ändras samtidigt blir det svårt att veta vilken ändring som löste eller skapade problemet.",
    },
    {
      text: "Efter en ändring fungerar den trasiga knappen igen. Vad bör testningen också kontrollera?",
      options: [
        "Att knappen har fått en mer avancerad design.",
        "Att koden innehåller fler rader än tidigare.",
        "Att samma fel aldrig kan uppstå i något annat system.",
        "Att närliggande funktioner fortfarande fungerar.",
      ],
      answer: "D",
      explanation:
        "Testning efter en ändring ska kontrollera både att ursprungsfelet är löst och att inget annat har gått sönder.",
    },
  ],
  4: [
    {
      text: "Vad kännetecknar ett projekt?",
      options: [
        "Ett arbete med tydligt mål, tidsplan och slut.",
        "Ett arbete som aldrig avslutas.",
        "En samling löpande uppgifter utan gemensamt mål.",
        "Ett spontant arbete utan planering.",
      ],
      answer: "A",
      explanation:
        "Ett projekt är avgränsat i tid och har ett tydligt mål, en tidsplan och ett slut.",
    },
    {
      text: "Varför är planering viktig i ett tekniskt projekt?",
      options: [
        "För att projektet ska kunna undvika all testning.",
        "För att mål, arbetsuppgifter, resurser och tidsplan blir tydliga.",
        "För att alla ska arbeta med samma uppgift samtidigt.",
        "För att dokumentation inte längre behövs, även när det inte stämmer med kapitlets innehåll.",
      ],
      answer: "B",
      explanation:
        "Planering gör arbetet tydligare och minskar risken för stress, missförstånd och förseningar.",
    },
    {
      text: "Vad innebär iterativ utveckling?",
      options: [
        "Att hela projektet görs färdigt innan något testas.",
        "Att projektet saknar tydliga roller och samtidigt hoppa över viktiga delar av processen.",
        "Att man bygger, testar och förbättrar i flera omgångar.",
        "Att dokumentationen skrivs först efter lansering.",
      ],
      answer: "C",
      explanation:
        "Iterativ utveckling betyder att lösningen växer fram genom upprepade versioner, tester och förbättringar.",
    },
    {
      text: "Vilken roll kontrollerar ofta att systemet fungerar och letar efter fel?",
      options: ["Designer", "Projektledare", "Programmerare", "Testare"],
      answer: "D",
      explanation:
        "Testaren kontrollerar att systemet fungerar och försöker hitta fel innan lösningen används.",
    },
    {
      text: "Vad är en MVP i ett agilt projekt?",
      options: [
        "En minsta fungerande produktversion som kan testas av användare.",
        "En fullständig slutversion utan begränsningar.",
        "En tidsplan för hela projektet, utan att ta hänsyn till användare, testning eller resultat.",
        "En lista över alla möjliga framtida funktioner.",
      ],
      answer: "A",
      explanation:
        "En MVP innehåller precis tillräckligt många funktioner för att kunna testas och ge användbar feedback.",
    },
  ],
  5: [
    {
      text: "Vad används programmering till i problemlösning?",
      options: [
        "Att skapa instruktioner som löser problem, automatiserar uppgifter eller bygger system.",
        "Att undvika att förstå problemet innan arbetet börjar.",
        "Att ersätta all testning med gissningar, utan att kontrollera om det verkligen passar frågan.",
        "Att bara skriva text som inte körs av datorn.",
      ],
      answer: "A",
      explanation:
        "Programmering används för att ge datorn instruktioner som löser problem eller skapar digitala funktioner.",
    },
    {
      text: "Varför bör man planera lösningen innan man skriver kod?",
      options: [
        "För att kod då aldrig behöver testas, även när det inte stämmer med kapitlets innehåll.",
        "För att det blir lättare att välja struktur, steg och logik.",
        "För att variabler och funktioner inte ska behövas.",
        "För att programmet ska sakna tydligt mål.",
      ],
      answer: "B",
      explanation:
        "Planering gör det lättare att dela upp problemet och skriva kod som är begriplig och möjlig att testa.",
    },
    {
      text: "Vad är en bugg?",
      options: [
        "En färdig funktion som alltid fungerar.",
        "En kommentar som förklarar kod och samtidigt hoppa över viktiga delar av processen.",
        "Ett fel i programmet som gör att det inte fungerar som tänkt.",
        "Ett namn på ett programmeringsspråk.",
      ],
      answer: "C",
      explanation:
        "En bugg är ett fel i programmet som behöver hittas, förstås och rättas.",
    },
    {
      text: "Vad gör en loop i ett program?",
      options: [
        "Sparar alltid en bildfil.",
        "Stoppar programmet från att kunna köras.",
        "Tar bort alla villkor, utan att ta hänsyn till användare, testning eller resultat.",
        "Upprepar kod så länge ett villkor eller antal steg gäller.",
      ],
      answer: "D",
      explanation:
        "Loopar används när samma kod behöver köras flera gånger.",
    },
    {
      text: "Varför är testning viktig i programmering?",
      options: [
        "För att kontrollera att programmet fungerar och hitta fel tidigt.",
        "För att göra koden omöjlig att ändra, utan att kontrollera om det verkligen passar frågan.",
        "För att undvika att användaren kan prova programmet.",
        "För att ersätta tydliga variabelnamn.",
      ],
      answer: "A",
      explanation:
        "Testning visar om programmet gör det det ska och hjälper utvecklaren att hitta problem.",
    },
  ],
  6: [
    {
      text: "Vad innebär systematiskt kvalitetsarbete?",
      options: [
        "Att arbeta planerat med kvalitet, risker, miljö och arbetsmiljö.",
        "Att bara kontrollera kvalitet när projektet redan är avslutat.",
        "Att undvika testning för att spara tid.",
        "Att enbart fokusera på utseende, även när det inte stämmer med kapitlets innehåll.",
      ],
      answer: "A",
      explanation:
        "Systematiskt kvalitetsarbete innebär att kvalitet säkras stegvis och medvetet under arbetet.",
    },
    {
      text: "Vad är kvalitetssäkring?",
      options: [
        "Att ignorera användarnas behov och samtidigt hoppa över viktiga delar av processen.",
        "Att arbeta för att upptäcka och förebygga fel innan lösningen används.",
        "Att bara dokumentera fel utan att åtgärda dem.",
        "Att minska all planering i projektet.",
      ],
      answer: "B",
      explanation:
        "Kvalitetssäkring handlar om metoder som testning, granskning och rutiner för att minska fel.",
    },
    {
      text: "Vad är syftet med riskanalys?",
      options: [
        "Att skapa fler problem i projektet.",
        "Att ersätta arbetsmiljöarbete, utan att ta hänsyn till användare, testning eller resultat.",
        "Att identifiera risker och planera hur de kan minskas.",
        "Att bevisa att teknik aldrig kan misslyckas.",
      ],
      answer: "C",
      explanation:
        "Riskanalys gör det möjligt att upptäcka hot i förväg och välja åtgärder som minskar konsekvenserna.",
    },
    {
      text: "Varför hör arbetsmiljö ihop med kvalitet?",
      options: [
        "För att arbetsmiljö bara handlar om möbler, utan att kontrollera om det verkligen passar frågan.",
        "För att dålig arbetsmiljö alltid gör tekniken snabbare.",
        "För att arbetsmiljö gör dokumentation onödig.",
        "För att människor som arbetar säkert och hållbart kan göra bättre tekniskt arbete.",
      ],
      answer: "D",
      explanation:
        "En bra arbetsmiljö minskar stress, skador och misstag, vilket påverkar projektets kvalitet.",
    },
    {
      text: "Vad kan miljösäkring handla om inom IT?",
      options: [
        "Att minska energiförbrukning och tänka på teknikens miljöpåverkan.",
        "Att alltid köpa ny hårdvara utan behov.",
        "Att strunta i drift och resursanvändning.",
        "Att göra system långsammare med flit, även när det inte stämmer med kapitlets innehåll.",
      ],
      answer: "A",
      explanation:
        "Digital teknik påverkar miljön genom exempelvis energi, hårdvara och drift, så detta behöver vägas in.",
    },
  ],
  7: [
    {
      text: "Varför används modeller i tekniska lösningar?",
      options: [
        "För att förenkla och förstå system innan de byggs eller bedöms.",
        "För att alla detaljer alltid ska tas bort för gott.",
        "För att slippa tänka på användning i verkligheten.",
        "För att ersätta alla beräkningar och samtidigt hoppa över viktiga delar av processen.",
      ],
      answer: "A",
      explanation:
        "Modeller gör komplexa system lättare att förstå, planera och analysera.",
    },
    {
      text: "Vad betyder dimensionering inom informationsteknik?",
      options: [
        "Att välja färg på ett gränssnitt, utan att ta hänsyn till användare, testning eller resultat.",
        "Att anpassa resurser som lagring, bandbredd eller serverkapacitet efter behov.",
        "Att ta bort alla krav från ett system.",
        "Att bara beskriva systemet muntligt.",
      ],
      answer: "B",
      explanation:
        "Dimensionering handlar om att välja tillräckliga resurser för att lösningen ska fungera rimligt i praktiken.",
    },
    {
      text: "Vad kan en rimlighetsbedömning användas till?",
      options: [
        "Att göra testning onödig, utan att kontrollera om det verkligen passar frågan.",
        "Att undvika att jämföra siffror.",
        "Att avgöra om en teknisk lösning verkar möjlig och proportionerlig.",
        "Att alltid välja den dyraste lösningen.",
      ],
      answer: "C",
      explanation:
        "Rimlighetsbedömning hjälper dig att se om beräkningar och tekniska val verkar realistiska.",
    },
    {
      text: "Vilket exempel passar bäst på beräkning inom informationsteknik?",
      options: [
        "Att välja projektnamn.",
        "Att skriva en slogan, även när det inte stämmer med kapitlets innehåll.",
        "Att rita en logotyp utan krav.",
        "Att beräkna lagringsbehov eller bandbredd för ett system.",
      ],
      answer: "D",
      explanation:
        "Beräkningar kan användas för att bedöma exempelvis lagring, trafik, kapacitet och prestanda.",
    },
    {
      text: "Varför är tekniska begrepp viktiga?",
      options: [
        "För att kunna beskriva och diskutera lösningar på ett tydligt sätt.",
        "För att göra kommunikationen mer otydlig.",
        "För att undvika modeller och samtidigt hoppa över viktiga delar av processen.",
        "För att ersätta praktiskt arbete.",
      ],
      answer: "A",
      explanation:
        "Gemensamma begrepp gör det lättare att förstå, konstruera och bedöma tekniska lösningar.",
    },
  ],
  8: [
    {
      text: "Vad innebär modellering?",
      options: [
        "Att skapa en förenklad beskrivning av ett system eller en process.",
        "Att alltid bygga den färdiga produkten direkt.",
        "Att undvika att planera tekniska lösningar, utan att ta hänsyn till användare, testning eller resultat.",
        "Att bara testa utan att beskriva något först.",
      ],
      answer: "A",
      explanation:
        "Modellering handlar om att beskriva viktiga delar av ett system så att de kan förstås och analyseras.",
    },
    {
      text: "Vad innebär simulering?",
      options: [
        "Att ta bort alla modeller, utan att kontrollera om det verkligen passar frågan.",
        "Att testa hur ett system kan bete sig utan att behöva prova allt i verkligheten.",
        "Att skriva dokumentation efter lansering.",
        "Att ersätta alla beslut med gissningar, utan att kontrollera om det verkligen passar frågan.",
      ],
      answer: "B",
      explanation:
        "Simulering används för att undersöka beteenden, flöden eller konsekvenser innan eller under utveckling.",
    },
    {
      text: "Vilket är ett exempel på modellering inom programmering?",
      options: [
        "Att bara publicera koden direkt.",
        "Att radera alla krav, även när det inte stämmer med kapitlets innehåll.",
        "Att göra flödesschema eller pseudokod för programlogik.",
        "Att undvika att beskriva funktioner.",
      ],
      answer: "C",
      explanation:
        "Flödesscheman och pseudokod hjälper till att modellera programlogik innan kod skrivs.",
    },
    {
      text: "Varför används fysiksimulering i spelutveckling?",
      options: [
        "För att ta bort all interaktion.",
        "För att undvika testning av spelmekanik.",
        "För att göra databaser onödiga och samtidigt hoppa över viktiga delar av processen.",
        "För att efterlikna rörelse, krafter och kollisioner i spelet.",
      ],
      answer: "D",
      explanation:
        "Fysiksimulering gör att objekt kan röra sig och reagera mer trovärdigt i spelmiljön.",
    },
    {
      text: "Varför har modeller begränsningar?",
      options: [
        "För att de förenklar verkligheten och därför inte visar allt.",
        "För att de alltid är mer exakta än verkligheten.",
        "För att de aldrig kan användas i IT, utan att ta hänsyn till användare, testning eller resultat.",
        "För att de bara fungerar utan användare.",
      ],
      answer: "A",
      explanation:
        "En modell visar utvalda delar av verkligheten, så den kan missa detaljer eller förändringar.",
    },
  ],
  9: [
    {
      text: "Vad menas med tekniska framsteg?",
      options: [
        "Utveckling av nya eller förbättrade tekniska lösningar.",
        "Att teknik alltid används på samma sätt.",
        "Att gamla system aldrig ersätts, utan att kontrollera om det verkligen passar frågan.",
        "Att digital teknik saknar påverkan på samhället.",
      ],
      answer: "A",
      explanation:
        "Tekniska framsteg innebär att teknik utvecklas, förbättras eller används på nya sätt.",
    },
    {
      text: "Vilket exempel hör till framtidens teknik i kapitlet?",
      options: [
        "Papperskalender utan digital koppling.",
        "AI, VR, robotik eller kvantdatorer.",
        "Manuell sortering utan tekniska hjälpmedel.",
        "Analog kommunikation utan digitala system.",
      ],
      answer: "B",
      explanation:
        "Kapitlet lyfter framtidsteknik som AI, VR, robotik och kvantdatorer.",
    },
    {
      text: "Vad handlar hållbar utveckling om i tekniksammanhang?",
      options: [
        "Att använda resurser utan ansvar, även när det inte stämmer med kapitlets innehåll.",
        "Att alltid byta ut fungerande teknik.",
        "Att utveckla teknik med hänsyn till miljö, människor och framtida behov.",
        "Att ignorera elektroniskt avfall.",
      ],
      answer: "C",
      explanation:
        "Hållbar utveckling innebär att teknik ska skapa nytta utan att förbruka resurser på ett oansvarigt sätt.",
    },
    {
      text: "Vad är en utmaning med ny teknik?",
      options: [
        "Att den aldrig påverkar integritet.",
        "Att den alltid saknar kostnader.",
        "Att den automatiskt är hållbar och samtidigt hoppa över viktiga delar av processen.",
        "Att den kan skapa problem kring integritet, miljö, säkerhet eller ojämlikhet.",
      ],
      answer: "D",
      explanation:
        "Ny teknik kan ge stora möjligheter men också skapa risker och konsekvenser som behöver granskas.",
    },
    {
      text: "Vad innebär cirkulär ekonomi?",
      options: [
        "Att resurser återanvänds, repareras eller återvinns i stället för att snabbt kastas.",
        "Att produkter alltid används en enda gång.",
        "Att elektronikavfall inte behöver hanteras.",
        "Att hållbarhet aldrig värderas, utan att ta hänsyn till användare, testning eller resultat.",
      ],
      answer: "A",
      explanation:
        "Cirkulär ekonomi handlar om att minska avfall och använda resurser mer ansvarsfullt.",
    },
  ],
  10: [
    {
      text: "Vad innebär det att värdera en teknisk lösning?",
      options: [
        "Att analysera fördelar, nackdelar och konsekvenser ur flera perspektiv.",
        "Att bara kontrollera om lösningen ser modern ut.",
        "Att alltid välja snabbaste lösningen, utan att kontrollera om det verkligen passar frågan.",
        "Att undvika frågor om etik och hållbarhet.",
      ],
      answer: "A",
      explanation:
        "Värdering innebär att bedöma teknik utifrån flera aspekter, som funktion, säkerhet, etik och hållbarhet.",
    },
    {
      text: "Varför är etik viktig när man utvecklar teknik?",
      options: [
        "För att tekniken aldrig påverkar människor.",
        "För att tekniska lösningar kan påverka integritet, rättvisa och människors vardag.",
        "För att etik ersätter all testning, även när det inte stämmer med kapitlets innehåll.",
        "För att användardata alltid är oviktig.",
      ],
      answer: "B",
      explanation:
        "Etik behövs eftersom teknik kan påverka människors rättigheter, val, data och livsmiljö.",
    },
    {
      text: "Vad handlar integritet om i digital teknik?",
      options: [
        "Att samla in all data utan skäl och samtidigt hoppa över viktiga delar av processen.",
        "Att dölja hur systemet fungerar.",
        "Att skydda personlig information och använda data ansvarsfullt.",
        "Att användare inte får veta något om sina uppgifter.",
      ],
      answer: "C",
      explanation:
        "Integritet handlar om skydd av personuppgifter och respekt för användarens kontroll över sin data.",
    },
    {
      text: "Vad kan hållbar utveckling betyda när man värderar teknik?",
      options: [
        "Att bara tänka på kortsiktig vinst.",
        "Att alltid välja mest resurskrävande lösning.",
        "Att bortse från miljöpåverkan, utan att ta hänsyn till användare, testning eller resultat.",
        "Att väga in resursanvändning, livslängd och miljökonsekvenser.",
      ],
      answer: "D",
      explanation:
        "Hållbar värdering tar hänsyn till hur tekniken påverkar miljö och samhälle över tid.",
    },
    {
      text: "Vad är en rimlig bedömning av teknik?",
      options: [
        "En genomtänkt bedömning där flera aspekter vägs mot varandra.",
        "En bedömning som bara bygger på första intrycket.",
        "En bedömning där risker aldrig nämns, utan att kontrollera om det verkligen passar frågan.",
        "En bedömning som alltid väljer billigaste alternativet.",
      ],
      answer: "A",
      explanation:
        "En rimlig bedömning väger samman funktion, kostnad, risker, etik och hållbarhet.",
    },
  ],
  11: [
    {
      text: "Vad betyder digitalisering?",
      options: [
        "Att använda digital teknik för att hantera information och processer.",
        "Att ta bort all teknik från produktion, även när det inte stämmer med kapitlets innehåll.",
        "Att bara använda papper i kommunikation.",
        "Att digital teknik aldrig påverkar vardagen.",
      ],
      answer: "A",
      explanation:
        "Digitalisering innebär att information, kommunikation och arbetssätt hanteras med digital teknik.",
    },
    {
      text: "Hur påverkar digitalisering produktion?",
      options: [
        "Genom att all automatisering försvinner.",
        "Genom automatisering, dataanalys och uppkopplade system.",
        "Genom att maskiner aldrig samlar in data.",
        "Genom att planering blir omöjlig och samtidigt hoppa över viktiga delar av processen.",
      ],
      answer: "B",
      explanation:
        "I produktion kan digitalisering ge automatiserade processer, bättre data och smartare styrning.",
    },
    {
      text: "Vad är Industri 4.0?",
      options: [
        "Ett namn för helt manuellt arbete utan data.",
        "Ett system där digital kommunikation är förbjuden.",
        "Uppkopplad och datadriven produktion med smarta system.",
        "En metod för att undvika digital kompetens, utan att ta hänsyn till användare, testning eller resultat.",
      ],
      answer: "C",
      explanation:
        "Industri 4.0 handlar om uppkopplade maskiner, data, automatisering och smart produktion.",
    },
    {
      text: "Vilken är en utmaning med digitalisering?",
      options: [
        "Att den aldrig kräver säkerhet, utan att kontrollera om det verkligen passar frågan.",
        "Att den tar bort behovet av kompetens.",
        "Att integritet alltid löser sig själv.",
        "Att den kan skapa säkerhetsrisker, integritetsproblem och teknikberoende.",
      ],
      answer: "D",
      explanation:
        "Digitalisering ger möjligheter men kräver också ansvar kring säkerhet, integritet och beroende av system.",
    },
    {
      text: "Vad innebär digital kompetens?",
      options: [
        "Förmågan att förstå, använda och värdera digital teknik.",
        "Att aldrig behöva lära sig nya verktyg.",
        "Att bara kunna använda ett enda program.",
        "Att undvika källkritik och säkerhet, även när det inte stämmer med kapitlets innehåll.",
      ],
      answer: "A",
      explanation:
        "Digital kompetens handlar både om praktisk användning och om att förstå risker, möjligheter och konsekvenser.",
    },
  ],
  12: [
    {
      text: "Varför är kommunikation viktig i tekniska projekt?",
      options: [
        "För att teamet ska kunna dela information, samordna arbete och undvika missförstånd.",
        "För att dokumentation då blir förbjuden.",
        "För att ingen ska veta vad andra gör och samtidigt hoppa över viktiga delar av processen.",
        "För att tekniska problem alltid löser sig själva.",
      ],
      answer: "A",
      explanation:
        "Tydlig kommunikation gör att människor kan samarbeta och förstå projektets mål, beslut och problem.",
    },
    {
      text: "Vad innebär dokumentation?",
      options: [
        "Att muntligt gissa hur systemet fungerar, utan att ta hänsyn till användare, testning eller resultat.",
        "Att beskriva hur teknik, kod eller projekt fungerar så att det går att förstå i efterhand.",
        "Att ta bort all information efter projektet.",
        "Att bara presentera slutresultatet utan förklaring.",
      ],
      answer: "B",
      explanation:
        "Dokumentation är projektets minne och hjälper andra att förstå, underhålla och vidareutveckla lösningen.",
    },
    {
      text: "Vad används versionshantering till?",
      options: [
        "Att radera äldre versioner utan spår.",
        "Att göra samarbete omöjligt, utan att kontrollera om det verkligen passar frågan.",
        "Att spara ändringar, följa historik och samarbeta kring kod eller filer.",
        "Att ersätta alla kodkommentarer.",
      ],
      answer: "C",
      explanation:
        "Versionshantering, till exempel med Git, gör det möjligt att följa ändringar och arbeta tillsammans.",
    },
    {
      text: "Varför kan kodkommentarer vara viktiga?",
      options: [
        "För att göra koden långsammare med flit.",
        "För att ersätta alla tydliga variabelnamn.",
        "För att dölja hur programmet fungerar, även när det inte stämmer med kapitlets innehåll.",
        "För att förklara svåra delar, antaganden eller varför en lösning valdes.",
      ],
      answer: "D",
      explanation:
        "Bra kommentarer hjälper andra och dig själv att förstå viktiga delar av koden senare.",
    },
    {
      text: "Vad är en teknisk presentation till för?",
      options: [
        "Att visa och förklara en lösning så att andra förstår funktion och nytta.",
        "Att undvika frågor från mottagaren.",
        "Att bara visa kod utan sammanhang och samtidigt hoppa över viktiga delar av processen.",
        "Att ersätta all kommunikation i projektet.",
      ],
      answer: "A",
      explanation:
        "Presentationer gör tekniska lösningar begripliga för lärare, kunder, användare eller teammedlemmar.",
    },
  ],
  13: [
    {
      text: "Vad är en teknisk ritning?",
      options: [
        "En visuell beskrivning av hur något ska byggas eller fungera.",
        "En slumpmässig bild utan tekniskt syfte.",
        "En färdig kodfil utan struktur, utan att ta hänsyn till användare, testning eller resultat.",
        "En muntlig instruktion utan visualisering.",
      ],
      answer: "A",
      explanation:
        "Tekniska ritningar används för att visa struktur, funktion eller konstruktion på ett tydligt sätt.",
    },
    {
      text: "Vilken fördel har digitala ritningar?",
      options: [
        "De går aldrig att dela, utan att kontrollera om det verkligen passar frågan.",
        "De är enkla att ändra, dela och visa i 2D eller 3D.",
        "De kan inte användas i informationsteknik.",
        "De saknar koppling till planering.",
      ],
      answer: "B",
      explanation:
        "Digitala ritningar är flexibla eftersom de kan uppdateras, delas och visas på olika sätt.",
    },
    {
      text: "Vad visar ett flödesschema?",
      options: [
        "Endast färgerna i en webbplats.",
        "Bara vilka filer som finns i en mapp.",
        "Steg, processer och beslut i ett program eller arbetsflöde.",
        "Enbart hårdvarans pris, även när det inte stämmer med kapitlets innehåll.",
      ],
      answer: "C",
      explanation:
        "Flödesscheman visar hur något sker steg för steg och hur beslut påverkar fortsättningen.",
    },
    {
      text: "Vad visar ett nätverksdiagram?",
      options: [
        "Hur en berättelse är uppbyggd.",
        "Vilka färger en app ska ha.",
        "Hur ett spel låter och samtidigt hoppa över viktiga delar av processen.",
        "Hur datorer, servrar och nätverksenheter är kopplade.",
      ],
      answer: "D",
      explanation:
        "Nätverksdiagram visar kopplingar och kommunikation mellan enheter i ett nätverk.",
    },
    {
      text: "Varför är modeller viktiga i tekniskt arbete?",
      options: [
        "För att planera, kommunicera och upptäcka problem innan lösningen byggs färdigt.",
        "För att göra tekniska idéer svårare att förstå.",
        "För att ersätta all testning och analys.",
        "För att undvika samarbete, utan att ta hänsyn till användare, testning eller resultat.",
      ],
      answer: "A",
      explanation:
        "Modeller hjälper människor att förstå och förbättra lösningar innan allt är färdigbyggt.",
    },
  ],
};

const quizQuestion = (text, options, answer, explanation) => ({
  text,
  options,
  answer,
  explanation,
});

// Revised eight-question chapter quizzes. These replace the earlier draft data above.
Object.assign(chapterQuizData, {
  4: [
    quizQuestion("Ett team ska bygga en bokningsapp. Vad behöver vara tydligt innan arbetet delas upp?", ["Färdig grafisk profil för alla vyer.", "Gemensamt mål, avgränsning och prioriterade uppgifter.", "Komplett lista över framtida extrafunktioner.", "Presentation av den färdiga appen."], "B", "Projektet behöver ett gemensamt mål och en avgränsning innan uppgifter fördelas."),
    quizQuestion("Två uppgifter måste bli klara före testningen. Vad ska projektplanen visa?", ["Att uppgifterna har samma ansvarig.", "Att testningen läggs före planeringen.", "Att uppgifterna saknar tidsramar.", "Att testningen är beroende av de tidigare uppgifterna."], "D", "Beroenden visar vilka uppgifter som måste vara klara före nästa steg."),
    quizQuestion("Användare förstår inte en viktig funktion i en prototyp. Vilket arbetssätt är mest agilt?", ["Justera lösningen, testa igen och utvärdera.", "Vänta med ändringen tills projektet är klart.", "Behålla lösningen eftersom planen säger så.", "Lägga till fler funktioner före analys."], "A", "Agilt arbete använder återkoppling för att förbättra lösningen i korta cykler."),
    quizQuestion("Vad är projektledarens huvudsakliga uppgift i ett mindre teknikprojekt?", ["Att skriva all kod som används.", "Att ensam godkänna designbeslut.", "Att samordna arbetet och följa upp planen.", "Att bara dokumentera efter leveransen."], "C", "Projektledaren håller ihop mål, planering och uppföljning."),
    quizQuestion("En grupp vill prova sin idé innan hela systemet byggs. Vad är en rimlig MVP?", ["En detaljerad kravspecifikation.", "En produkt med samtliga funktioner.", "En fullständig designmanual.", "En enkel fungerande version av den viktigaste användarresan."], "D", "En MVP innehåller tillräckligt för att användare ska kunna ge relevant återkoppling."),
    quizQuestion("Varför är en tydlig ansvarsfördelning värdefull i ett projektteam?", ["Det visar vem som driver och följer upp varje uppgift.", "Det gör att alla kan arbeta utan kontakt.", "Det gör gemensam planering mindre viktig.", "Det tar bort behovet av testning."], "A", "Tydliga roller minskar risken att uppgifter faller mellan stolarna."),
    quizQuestion("Vilken aktivitet hör främst hemma i projektets uppföljning?", ["Bestämma att första planen aldrig ändras.", "Jämföra läget med mål, tidplan och risker.", "Ersätta testresultat med antaganden.", "Flytta beslut till sista projektdagen."], "B", "Uppföljning används för att bedöma läget och justera arbetet."),
    quizQuestion("En funktion är klar men har inte prövats mot användarnas behov. Vilket steg saknas?", ["Resursplanering för nästa fas.", "Dokumentation av arbetsroller.", "Testning och utvärdering med relevanta användare.", "Presentation av slutrapporten."], "C", "En funktion behöver valideras mot behoven den är tänkt att möta."),
  ],
  5: [
    quizQuestion("Ett program ska räkna totalpris för flera varor. Vad är en bra första deluppgift?", ["Välja färger till programmets fönster.", "Bestämma indata, beräkningar och resultat.", "Skriva all kod i en enda funktion.", "Lägga till felmeddelanden före reglerna."], "B", "Indata, bearbetning och utdata gör problemet möjligt att dela upp."),
    quizQuestion("En funktion ger fel resultat när antalet är noll. Vilken testning ger bäst underlag?", ["Byta namn på alla variabler.", "Lägga fler funktioner runt beräkningen.", "Testa bara stora positiva tal.", "Testa noll, gränsvärden och normala värden."], "D", "Gränsvärden hjälper till att avslöja logiska fel."),
    quizQuestion("Vad är huvudsyftet med en funktion i ett program?", ["Att samla återanvändbar logik med ett tydligt ansvar.", "Att lagra alla värden permanent.", "Att ersätta villkor och loopar.", "Att göra programmet svårare att dela upp."], "A", "Funktioner delar upp programmet i hanterbara, återanvändbara delar."),
    quizQuestion("Ett formulär ska kräva ett tal mellan 1 och 10. Vilket begrepp beskriver kontrollen?", ["Sortering av resultat.", "Iteration över alternativen.", "Validering av indata.", "Dokumentation av design."], "C", "Validering kontrollerar att indata följer programmets krav."),
    quizQuestion("Vad behöver en loop ha för att avslutas på rätt sätt?", ["En färg som visar varvet.", "En kommentar om hela programmet.", "En kopia av användargränssnittet.", "Ett villkor eller en räknare som styr avslutet."], "D", "En loop behöver ett tydligt stoppvillkor eller en räknare."),
    quizQuestion("Varför är pseudokod användbar före programmering?", ["Den körs snabbare än färdig kod.", "Den beskriver logik utan att låsa syntaxen.", "Den ersätter testning efteråt.", "Den lagrar programmets data."], "B", "Pseudokod gör det lättare att resonera om algoritmen före syntaxen."),
    quizQuestion("En elev ändrar flera saker samtidigt vid felsökning. Vilken risk ökar?", ["Det blir svårt att se vilken ändring som gav resultatet.", "Programmet får automatiskt bättre struktur.", "Testningen kan hoppas över.", "Variablerna får korrekta värden."], "A", "En ändring i taget gör felsökning mer spårbar."),
    quizQuestion("Vilket exempel visar en algoritm?", ["En fil med färgtema.", "En lista med utvecklare.", "En stegvis beskrivning av hur en uppgift löses.", "En kommentar med filnamnet."], "C", "En algoritm är en följd av steg som leder till en lösning."),
  ],
  6: [
    quizQuestion("Ett team vill minska risken att fel når användarna. Vilken rutin är mest förebyggande?", ["Vänta på felrapporter efter lansering.", "Granska krav och testa under utvecklingen.", "Dokumentera bara redan inträffade fel.", "Låta en person godkänna utan underlag."], "B", "Kvalitetssäkring använder granskning och testning för att förebygga fel."),
    quizQuestion("En extern tjänst kan sluta fungera. Vilken åtgärd passar i riskanalysen?", ["Ta bort beroendet ur dokumentationen.", "Anta att tjänsten alltid fungerar.", "Flytta risken till slutet av planen.", "Planera en reservlösning och hur den aktiveras."], "D", "Riskhantering omfattar åtgärder om en risk inträffar."),
    quizQuestion("Vad skiljer kvalitetskontroll från kvalitetssäkring?", ["Kontroll granskar resultat, säkring förebygger fel i processen.", "Kontroll gäller design och säkring bara kod.", "Kontroll sker före och säkring efter projektet.", "Det är två ord för exakt samma sak."], "A", "Kvalitetskontroll hittar problem, medan kvalitetssäkring också minskar risken för dem."),
    quizQuestion("Varför är återkommande stress och hög belastning en teknikfråga?", ["Det påverkar bara lokalernas utseende.", "Det avgör programmeringsspråket.", "Det kan öka misstag, ohälsa och brister i leveransen.", "Det gör riskanalys mindre viktig."], "C", "Arbetsmiljö påverkar möjligheten att arbeta säkert och med god kvalitet."),
    quizQuestion("Vilket beslut är ett exempel på miljösäkring i ett digitalt system?", ["Spara fler kopior av all data.", "Byta fungerande datorer enligt intervall.", "Välja maximal serverkapacitet året runt.", "Anpassa drift och resurser efter faktiskt behov."], "D", "Miljösäkring väger in energianvändning och resursförbrukning."),
    quizQuestion("Ett test visar att en funktion ibland misslyckas. Vad bör dokumenteras?", ["Testmiljö, indata och faktiskt resultat.", "Bara att gruppen vill se över funktionen.", "Alla funktioner som inte testades.", "Slutresultatet utan felinformation."], "A", "Tydliga felrapporter gör att fel kan återskapas och åtgärdas."),
    quizQuestion("Varför behöver risker prioriteras?", ["Varje risk måste få lika mycket tid.", "Resurser kan riktas mot risker med stor konsekvens.", "Risker behöver inte följas upp.", "Projektets mål kan ersättas av risklistan."], "B", "Prioritering fokuserar arbetet på risker som påverkar mest."),
    quizQuestion("Vilket visar systematiskt kvalitetsarbete?", ["Kvalitetskrav bestäms när produkten är klar.", "Varje person använder egna testmetoder.", "Krav, tester, resultat och förbättringar följs upp löpande.", "En lyckad demonstration räcker som kvalitet."], "C", "Systematiskt kvalitetsarbete är planerat, återkommande och dokumenterat."),
  ],
  7: [
    quizQuestion("En webbplats väntas få 500 samtidiga användare. Vad handlar dimensionering främst om?", ["Att välja typografi för små skärmar.", "Att anpassa server, lagring och nätverk efter belastningen.", "Att beskriva användarnas behov längre.", "Att ersätta prestandatest med uppskattning."], "B", "Dimensionering anpassar resurser till den belastning lösningen ska klara."),
    quizQuestion("En beräkning ger 2 GB lagring för 50 000 högupplösta bilder. Vad bör teamet göra?", ["Acceptera värdet eftersom det är beräknat.", "Byta bildformat utan granskning.", "Bestämma att lagring inte kan uppskattas.", "Kontrollera enheter, antaganden och rimlighet."], "D", "Rimlighetsbedömning granskar om resultatet passar situationen."),
    quizQuestion("Vad är en fördel med en modell av ett tekniskt system?", ["Den visar viktiga samband utan att allt byggs först.", "Den gör testresultat onödiga.", "Den ersätter mätning av resurser.", "Den gör verkliga krav mindre viktiga."], "A", "Modeller förenklar komplexa system så att samband kan analyseras."),
    quizQuestion("Vilken uppgift kräver mest sannolikt en beräkning av bandbredd?", ["Att välja namn på menysidor.", "Att planera färger i ett diagram.", "Att bedöma dataflödet för en videoström.", "Att fördela talartid i en presentation."], "C", "Bandbredd beskriver hur mycket data som kan överföras per tidsenhet."),
    quizQuestion("Ett system har lagring men svarar långsamt vid hög belastning. Vad bör granskas?", ["Bildformaten i gränssnittet.", "Serverns kapacitet för samtidiga förfrågningar.", "Antalet rubriker i dokumentationen.", "Databasens namn."], "B", "Långsamma svar under belastning kan bero på otillräcklig server- eller databaskapacitet."),
    quizQuestion("Vad innebär korrekt användning av tekniska begrepp?", ["Att välja flest möjliga fackord.", "Att ersätta beräkningar med abstrakta ord.", "Att använda samma ord för alla resurser.", "Att skilja på resurser och använda rätt begrepp."], "D", "Korrekta begrepp gör tekniska resonemang tydligare."),
    quizQuestion("Vilken slutsats är mest rimlig efter en kapacitetsberäkning?", ["Jämför resultatet med krav och säkerhetsmarginaler.", "Använd alltid första uppskattningen.", "Systemet är klart när ett tal finns.", "Beräkningen ersätter användartester."], "A", "Beräkningar bygger på antaganden och behöver följas av rimlighetsbedömning."),
    quizQuestion("Vad visar bäst skillnaden mellan konstruktion och dimensionering?", ["Konstruktion handlar om kostnad, dimensionering om användare.", "Konstruktion väljer färg, dimensionering väljer form.", "Konstruktion utformar lösningen, dimensionering väljer resurser.", "Konstruktion görs efter drift, dimensionering före planering."], "C", "Konstruktion utformar lösningen; dimensionering bedömer resurserna den behöver."),
  ],
  8: [
    quizQuestion("En trafikmodell visar köer när fler bussar sätts in. Vad gör modellen främst?", ["Den ersätter data från verklig trafik.", "Den förenklar ett system för att undersöka samband.", "Den garanterar exakt verkligt utfall.", "Den beskriver bara bussarnas utseende."], "B", "En modell väljer ut viktiga delar av verkligheten för att undersöka systemet."),
    quizQuestion("När är simulering särskilt användbar?", ["När resultatet måste bli identiskt varje gång.", "När en lösning saknar mätbara värden.", "När praktiska tester ska undvikas permanent.", "När verkliga försök är dyra, farliga eller svåra."], "D", "Simulering kan undersöka förlopp när fullskaliga försök är olämpliga."),
    quizQuestion("En grupp ritar ett flödesschema före programmering. Vad modellerar den?", ["Programmets logik och beslut i olika steg.", "Programmets hastighet på alla datorer.", "Färger i användargränssnittet.", "Användarnas bedömning av produkten."], "A", "Flödesschemat modellerar processer och villkor i programmet."),
    quizQuestion("En simulering ger oväntat resultat. Vad bör granskas först?", ["Simuleringens gränssnitt.", "Modellens färgval.", "Om antaganden och indata motsvarar situationen.", "Hur resultatet presenteras."], "C", "Resultatet är bara så relevant som modellens antaganden och indata."),
    quizQuestion("Vilken begränsning har en modell?", ["Den kan inte förklara samband.", "Den måste innehålla alla detaljer.", "Den behöver inte testas mot exempel.", "Den kan missa faktorer som förenklingen utelämnar."], "D", "Modeller förenklar och kan därför utelämna viktiga faktorer."),
    quizQuestion("Vad skiljer främst en modell från en simulering?", ["En modell beskriver systemet, simulering visar möjliga förlopp.", "Modeller används bara i spel.", "Modeller är alltid fysiska.", "Modeller saknar antaganden."], "A", "Modellen är beskrivningen; simuleringen använder den för att undersöka beteende."),
    quizQuestion("Varför ändra en parameter i taget i en simulering?", ["För att välja ett bättre färgtema.", "För att se vilken parameter som påverkar resultatet.", "För att undvika dokumentation.", "För att ta bort alla antaganden."], "B", "En parameter i taget gör analys av orsak och effekt tydligare."),
    quizQuestion("Vilket är ett rimligt användningsområde för fysiksimulering i spel?", ["Att välja användarnamn.", "Att lagra poäng i databas.", "Att beräkna rörelse, krafter och kollisioner.", "Att ersätta speldesign."], "C", "Fysiksimulering efterliknar hur objekt rör sig och reagerar."),
  ],
  9: [
    quizQuestion("En skola överväger sensorer för ventilation. Vilken fråga hör till hållbar utveckling?", ["Vilket varumärke har flest funktioner?", "Hur energi, livslängd och material påverkas över tid.", "Hur snabbt systemet installeras utan planering.", "Hur många färger gränssnittet kan visa."], "B", "Hållbar utveckling väger in resursanvändning och långsiktiga konsekvenser."),
    quizQuestion("Vilken beskrivning passar bäst för cirkulär ekonomi inom teknik?", ["Att uppgradera hårdvara så snart nytt finns.", "Att bara återvinna redan kasserade produkter.", "Att välja kort livslängd och låg kostnad.", "Att reparera, återanvända och återvinna när det går."], "D", "Cirkulär ekonomi försöker hålla produkter och material i användning längre."),
    quizQuestion("Vad är ett tekniskt framsteg?", ["En ny eller förbättrad lösning som möter ett behov.", "En teknik som används på samma sätt som tidigare.", "En produkt utan konsekvenser för omgivningen.", "En idé som inte behöver prövas."], "A", "Tekniska framsteg kan vara nya lösningar eller förbättringar av befintlig teknik."),
    quizQuestion("Varför behöver framtidsteknik värderas kritiskt?", ["Ny teknik kan aldrig ge samhällsnytta.", "Tekniska möjligheter är alltid förbjudna.", "Den kan påverka integritet, miljö och ojämlikhet.", "All teknik får samma konsekvenser."], "C", "Ny teknik kan ge nytta men också konsekvenser som behöver granskas."),
    quizQuestion("Vilken åtgärd minskar elektronikavfall mest?", ["Göra batteriet svårt att byta.", "Låta programvaran sluta fungera efter garantitiden.", "Öka mängden engångstillbehör.", "Utforma produkten för reparation och uppdatering."], "D", "Reparerbarhet och längre livslängd kan minska avfall och resursanvändning."),
    quizQuestion("Vilken är en möjlig social konsekvens av automatisering?", ["Arbetsuppgifter förändras och kan kräva ny kompetens.", "Energianvändningen blir alltid noll.", "Alla beslut blir automatiskt rättvisa.", "Människor behöver inte förstå systemen."], "A", "Automatisering kan förändra arbete och behovet av kompetens."),
    quizQuestion("En AI-tjänst sparar tid men använder mycket el. Vad visar en hållbar bedömning?", ["Att bara räkna tiden användare sparar.", "Att väga nyttan mot energianvändning och förbättringar.", "Att digitala tjänster saknar miljöpåverkan.", "Att förbjuda tjänsten utan analys."], "B", "Hållbar bedömning väger flera konsekvenser mot varandra."),
    quizQuestion("Vad gör en teknisk lösning framtidssäker i rimlig mening?", ["Att ha flest funktioner från början.", "Att alltid använda nyaste hårdvaran.", "Att kunna anpassas, underhållas och utvecklas.", "Att undvika standarder."], "C", "En anpassningsbar lösning fungerar bättre när krav och teknik förändras."),
  ],
  10: [
    quizQuestion("En app samlar platsdata för lokala tips. Vilken fråga är viktigast för integritet?", ["Om appens ikon känns igen.", "Om användaren förstår vilken data som samlas in och varför.", "Om platsdata kan visas i fler teman.", "Om appen har fler funktioner än konkurrenterna."], "B", "Integritet kräver tydlighet och ansvarsfull användning av data."),
    quizQuestion("Ett automatiserat urval missgynnar ofta en grupp. Vilken bedömning behövs?", ["Om systemet kan köras snabbare.", "Om gränssnittet känns modernt.", "Om beräkningen blir billigare.", "Om data och regler skapar orättvisa effekter."], "D", "Etisk värdering granskar om resultat behandlar grupper rättvist."),
    quizQuestion("Vad innebär det att värdera teknik ur flera perspektiv?", ["Att väga funktion, kostnad, risker, etik och miljö.", "Att välja lösningen med flest tekniska detaljer.", "Att bara utgå från hur snabbt den byggs.", "Att låta en intressent avgöra allt."], "A", "En genomtänkt värdering tar hänsyn till flera konsekvenser och intressen."),
    quizQuestion("En produkt är billig men kräver mycket energi i drift. Vad bör bedömningen inkludera?", ["Bara inköpspriset.", "Bara materialet i förpackningen.", "Energi, livslängd och kostnader under användningen.", "Endast företagets grafiska profil."], "C", "Hållbar värdering ser till hela livscykeln, inte bara inköpspriset."),
    quizQuestion("Varför är transparens viktig i system som fattar beslut om människor?", ["Koden behöver då inte testas.", "Systemet kan samla mer data utan information.", "Användare kan alltid ändra algoritmen.", "Beslut kan förstås, granskas och ifrågasättas."], "D", "Transparens underlättar ansvar och granskning av beslut."),
    quizQuestion("Vilket är ett etiskt dilemma i teknik?", ["En lösning ger nytta men minskar kontrollen över persondata.", "En funktion har två namn i samma dokument.", "En testplan har datum och ansvariga.", "En server har reserverad kapacitet."], "A", "Etiska dilemman uppstår när värden som nytta och integritet kan krocka."),
    quizQuestion("Vilket underlag ger mest balanserad värdering av två digitala tjänster?", ["Bara leverantörens marknadsföring.", "Tester, kostnader, behov, risker, miljö och integritet.", "En jämförelse av logotyper och färger.", "En lista med flest tekniska ord."], "B", "Balanserad värdering kombinerar funktionella, ekonomiska, sociala och hållbara perspektiv."),
    quizQuestion("Vad är en rimlig slutsats när teknik både ger nytta och risker?", ["Risken saknar betydelse när tekniken är ny.", "Nyttan saknar betydelse vid en risk.", "Båda vägs mot skyddsåtgärder och alternativ.", "Berörda användare behöver inte beaktas."], "C", "Teknikvärdering handlar om avvägningar och om hur risker kan minskas."),
  ],
  11: [
    quizQuestion("En fabrik använder sensorer för att justera produktionen vid ändrad efterfrågan. Vad visar det?", ["Att produktionen har blivit helt manuell.", "Att data och uppkopplade system kan styra processer i realtid.", "Att sensorer ersätter mänskliga beslut helt.", "Att digitalisering bara handlar om dokument."], "B", "Digitaliserad produktion kan använda sensorer och data för att anpassa processer."),
    quizQuestion("Vad skiljer digitalisering från att bara göra ett dokument digitalt?", ["Digitalisering kan förändra arbetssätt och processer med teknik.", "Digitalisering gör all kommunikation offentlig.", "Digitalisering tar bort behovet av planering.", "Digitalisering används bara för filer."], "A", "Digitalisering handlar ofta om förändrade processer, inte bara filformat."),
    quizQuestion("Vilken utmaning uppstår när samhället blir beroende av digitala tjänster?", ["Skärmar använder mindre el i alla situationer.", "Information på nätet blir automatiskt tillförlitlig.", "Störningar kan påverka arbete, kommunikation och vardag.", "Digitala system behöver inte underhållas."], "C", "Beroende av system gör samhället sårbart när viktiga tjänster inte fungerar."),
    quizQuestion("Vilket exempel beskriver IoT?", ["En dator utan nätverk.", "En rapport som skickas som pdf.", "En webbplats med statisk information.", "Uppkopplade enheter som samlar data och kommunicerar."], "D", "IoT består av uppkopplade saker som kan utbyta data."),
    quizQuestion("Vad ingår i digital kompetens utöver att använda en app?", ["Att förstå och kritiskt granska information och system.", "Att installera samma program överallt.", "Att acceptera villkor utan att läsa dem.", "Att undvika frågor om dataanvändning."], "A", "Digital kompetens omfattar användning, förståelse och kritisk granskning."),
    quizQuestion("En skola inför digital frånvarohantering. Vilken integritetsfråga är relevant?", ["Om systemet har skolans färger.", "Vilka uppgifter som lagras, vem som ser dem och hur länge.", "Om systemet startar i fler webbläsare.", "Om alla lärare har samma lösenord."], "B", "Integritet handlar om nödvändig data, åtkomst och tydlig hantering."),
    quizQuestion("Vad beskriver Industri 4.0 bäst?", ["Produktion utan användning av data.", "Fristående maskiner utan kommunikation.", "Uppkopplad produktion med automation och dataanalys.", "Digital kommunikation i hemmet."], "C", "Industri 4.0 kopplar samman produktion, data och automatisering."),
    quizQuestion("Vilken förändring är ett exempel på digitaliserad kommunikation?", ["Fler meddelanden skrivs ut på papper.", "Möten måste ske i samma rum.", "Information blir svårare att dela i team.", "Team samarbetar i delade dokument, chatt och videomöten."], "D", "Digitala verktyg gör samarbete möjligt oberoende av plats."),
  ],
  12: [
    quizQuestion("En ny utvecklare ska rätta ett fel. Vilken dokumentation hjälper mest först?", ["En lista över färgval.", "En beskrivning av systemets delar, dataflöde och beslut.", "En bild av första startsidan.", "En presentation av slutresultatet."], "B", "Systembeskrivning och dokumenterade beslut hjälper förståelse och felsökning."),
    quizQuestion("Vad är huvudsyftet med versionshantering?", ["Att följa, jämföra och återställa ändringar i filer.", "Att automatiskt göra all kod felfri.", "Att ersätta planering och dokumentation.", "Att hindra samarbete i projekt."], "A", "Versionshantering sparar historik och underlättar samarbete."),
    quizQuestion("En kommentar förklarar varför en ovanlig beräkning används. Vilken funktion har kommentaren?", ["Den ändrar beräkningens värde.", "Den gör testning onödig.", "Den kommunicerar ett viktigt designval till läsaren.", "Den ersätter tydliga variabelnamn."], "C", "Kommentarer kan förklara viktiga val som inte framgår direkt av koden."),
    quizQuestion("Vilken presentation passar bäst för att förklara dataflöde mellan systemdelar?", ["En muntlig redovisning utan stöd.", "En skärmbild av startsidan.", "En lista över projektets filer.", "Ett diagram med komponenter och kopplingar."], "D", "Diagram kan göra samband och informationsflöden tydliga."),
    quizQuestion("Varför behöver teknisk kommunikation anpassas till mottagaren?", ["Detaljer för utvecklare kan vara otydliga för användare.", "Alla mottagare behöver samma facktermer.", "Viktiga begrepp ska lämnas oförklarade.", "Dokumentation ska bara läsas av författaren."], "A", "Tydlig kommunikation utgår från mottagarens behov och förkunskaper."),
    quizQuestion("Ett team är osäkert på vem som gör nästa uppgift. Vilken rutin hjälper?", ["Alla arbetar vidare utan kontakt.", "Mötesanteckningar och ansvariga uppgifter dokumenteras gemensamt.", "Bara projektledaren får läsa planen.", "Uppföljning väntar till slutet."], "B", "Gemensam dokumentation av beslut och ansvar minskar missförstånd."),
    quizQuestion("När är visualisering särskilt användbar i en teknisk presentation?", ["När lösningen saknar samband att förklara.", "När publiken redan kan alla detaljer.", "När struktur och flöden blir tydligare i bild än i text.", "När dekoration är viktigare än innehåll."], "C", "Diagram och modeller kan göra komplex teknik mer begriplig."),
    quizQuestion("Vad skiljer Git från GitHub?", ["Git är språk och GitHub editor.", "Git är molntjänst och GitHub fysisk server.", "Git används för bilder och GitHub för kod.", "Git hanterar versioner och GitHub stödjer lagring och samarbete."], "D", "Git är versionshanteringssystemet, medan GitHub är en plattform kring Git."),
  ],
  13: [
    quizQuestion("En tekniker vill visa hur routrar, servrar och klienter är kopplade. Vilken modell passar bäst?", ["En wireframe för webbplatsen.", "Ett nätverksdiagram med enheter och anslutningar.", "Ett flödesschema för användarval.", "En tabell med projektets tidplan."], "B", "Nätverksdiagram visar hur nätverksenheter och anslutningar hänger ihop."),
    quizQuestion("Vad är huvudsyftet med en teknisk ritning eller modell?", ["Att visa viktiga delar så lösningen kan planeras och förstås.", "Att ersätta alla tekniska krav.", "Att beskriva flest möjliga detaljer.", "Att användas först efter byggandet."], "A", "Ritningar och modeller gör det möjligt att planera och kommunicera före byggandet."),
    quizQuestion("Vad visar en databasmodell främst?", ["Vilka datorer som finns i nätverket.", "Hur programmet fattar beslut.", "Hur data organiseras i tabeller och relationer.", "Hur en fysisk produkt ser ut."], "C", "Databasmodeller beskriver tabeller, nycklar och relationer i data."),
    quizQuestion("En systemmodell utelämnar detaljer. Varför kan det vara en fördel?", ["Den blir automatiskt mer exakt.", "Den kan användas utan tolkning.", "Den ersätter testning av lösningen.", "Den visar samband som annars är svåra att överblicka."], "D", "Förenkling kan göra viktiga delar och samband lättare att se."),
    quizQuestion("Vilket exempel passar bäst för en 2D-modell?", ["Ett flödesschema över en process.", "En spelvärld med djup och rörelse.", "En fysisk prototyp i full storlek.", "En simulering av krafter i 3D."], "A", "Flödesscheman och planritningar är typiska tvådimensionella modeller."),
    quizQuestion("En webbplats ska planeras före kod. Vad visar sidans struktur och innehåll?", ["Ett nätverksdiagram över servrar.", "En wireframe av sidans gränssnitt.", "En databasbackup med användare.", "En loggbok från möten."], "B", "En wireframe är en enkel modell av sidans organisering och gränssnitt."),
    quizQuestion("Vilket element visar vanligen ett beslut i ett flödesschema?", ["En linje för dokumentets marginal.", "En tabell med flera poster.", "En symbol där vägen beror på ett villkor.", "En bild av programmets tema."], "C", "Beslutssymbolen visar att processen fortsätter olika beroende på villkoret."),
    quizQuestion("Varför är digitala ritningar praktiska i teknikprojekt?", ["De behöver inte delas i team.", "De är alltid mindre exakta än skisser.", "De används bara för fysiska produkter.", "De kan ändras, delas och visas i olika vyer."], "D", "Digitala ritningar kan uppdateras och delas när lösningen utvecklas."),
  ],
});

function insertChapterQuiz(chapterNumber) {
  const sourceChapter = Math.ceil(chapterNumber / 2);
  const sourceQuestions = chapterQuizData[sourceChapter];
  const chapterQuizAllocation = {
    1: [[0, 1, 2, 3, 6, 7, 9], [4, 5, 8]],
    2: [[0, 1, 2, 3, 7], [4, 5, 6]],
    3: [[0, 1, 3, 4, 5], [2, 6, 7]],
    4: [[0, 1, 3, 5], [2, 4, 6, 7]],
    5: [[0, 2, 4, 5, 7], [1, 3, 6]],
    6: [[0, 2, 5, 7], [1, 3, 4, 6]],
    7: [[2, 5, 7], [0, 1, 3, 4, 6]],
    8: [[0, 1, 2, 5], [3, 4, 6, 7]],
    9: [[0, 1, 2, 3], [4, 5, 6, 7]],
    10: [[0, 1, 2, 4, 5], [3, 6, 7]],
    11: [[0, 1, 6, 7], [2, 3, 4, 5]],
    12: [[0, 2, 4, 5], [1, 3, 6, 7]],
    13: [[0, 1, 2, 3, 6, 7], [4, 5]],
  };
  const partIndex = chapterNumber % 2 === 1 ? 0 : 1;
  const allocatedIndexes = chapterQuizAllocation[sourceChapter]?.[partIndex];
  const questions = sourceQuestions && allocatedIndexes
    ? allocatedIndexes.map((index) => sourceQuestions[index])
    : null;
  if (!questions) return true;

  const content = document.getElementById("chapter-content");
  if (!content) return false;
  if (content.querySelector(".chapter-quiz")) return true;

  const headings = content.querySelectorAll("h2");
  const targetHeading = Array.from(headings).find((el) => {
    const txt = el.textContent.trim().toLowerCase();
    return (
      txt === "reflektionsfrågor" ||
      txt === "refelktionsfrågor" ||
      txt === "frågor att arbeta med"
    );
  });

  const insertionTarget = targetHeading || document.getElementById("chapter-summary");
  if (!insertionTarget) return false;

  const quiz = document.createElement("section");
  quiz.className = "content-section chapter-quiz";
  quiz.setAttribute("aria-labelledby", `chapter-${chapterNumber}-quiz-title`);
  quiz.innerHTML = `
      <h2 id="chapter-${chapterNumber}-quiz-title">Quiz</h2>
      <form class="chapter-quiz-form">
          ${questions
            .map(
              (question, questionIndex) => `
              <fieldset class="quiz-question">
                  <legend>${questionIndex + 1}. ${question.text}</legend>
                  <div class="quiz-options">
                      ${question.options
                        .map((option, optionIndex) => {
                          const letter = String.fromCharCode(65 + optionIndex);
                          const inputId = `chapter-${chapterNumber}-quiz-q${questionIndex + 1}-${letter}`;
                          return `
                              <label class="quiz-option" for="${inputId}">
                                  <input type="radio" id="${inputId}" name="chapter-${chapterNumber}-quiz-q${questionIndex + 1}" value="${letter}">
                                  <span class="quiz-option-letter">${letter}</span>
                                  <span>${option}</span>
                              </label>
                          `;
                        })
                        .join("")}
                  </div>
                  <p class="quiz-feedback" data-feedback-for="chapter-${chapterNumber}-quiz-q${questionIndex + 1}"></p>
              </fieldset>
          `,
            )
            .join("")}
          <button type="button" class="quiz-submit">Rätta quizet</button>
          <p class="quiz-result" aria-live="polite"></p>
          ${
            QUIZ_STATISTICS_ENDPOINT
              ? '<p class="quiz-statistics-notice">Anonyma svar används för att förbättra quizet.</p>'
              : ""
          }
      </form>
  `;

  const form = quiz.querySelector(".chapter-quiz-form");
  const result = quiz.querySelector(".quiz-result");
  const submit = quiz.querySelector(".quiz-submit");

  submit.addEventListener("click", () => {
    let score = 0;

    questions.forEach((question, questionIndex) => {
      const name = `chapter-${chapterNumber}-quiz-q${questionIndex + 1}`;
      const selected = form.querySelector(`input[name="${name}"]:checked`);
      const feedback = form.querySelector(`[data-feedback-for="${name}"]`);
      const options = form.querySelectorAll(`input[name="${name}"]`);

      options.forEach((option) => {
        option.closest(".quiz-option").classList.remove("is-correct", "is-wrong");
      });

      if (selected && selected.value === question.answer) {
        score += 1;
        selected.closest(".quiz-option").classList.add("is-correct");
        feedback.textContent = "Rätt.";
        feedback.className = "quiz-feedback is-correct";
      } else {
        const correctInput = form.querySelector(
          `input[name="${name}"][value="${question.answer}"]`,
        );
        correctInput.closest(".quiz-option").classList.add("is-correct");
        if (selected) {
          selected.closest(".quiz-option").classList.add("is-wrong");
          feedback.textContent = `Fel. Rätt svar är ${question.answer}. ${question.explanation}`;
        } else {
          feedback.textContent = `Inget svar valt. Rätt svar är ${question.answer}. ${question.explanation}`;
        }
        feedback.className = "quiz-feedback is-wrong";
      }
    });

    result.textContent = `Du fick ${score} av ${questions.length} rätt.`;

    if (!form.dataset.statisticsSent) {
      recordQuizStatistics({
        quizId: `kapitel-${chapterNumber}`,
        chapter: `Kapitel ${chapterNumber}`,
        answers: questions.map((question, questionIndex) => {
          const name = `chapter-${chapterNumber}-quiz-q${questionIndex + 1}`;
          const selected = form.querySelector(`input[name="${name}"]:checked`);
          return {
            questionNumber: questionIndex + 1,
            questionText: question.text,
            selectedAnswer: selected ? selected.value : "",
            correctAnswer: question.answer,
            isCorrect: Boolean(selected && selected.value === question.answer),
          };
        }),
      });
      form.dataset.statisticsSent = "true";
    }
  });

  insertionTarget.insertAdjacentElement("beforebegin", quiz);
  return true;
}

window.pythonbook = {
  getChapter,
  insertChapterQuiz,
  renderChapterPage,
};

window.teknik2 = window.pythonbook;
