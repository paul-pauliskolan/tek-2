// Teknik 2 - shared site logic

const BOOK_TITLE = "Teknik 2 - IN";
const BOOK_SHORT_TITLE = "Teknik 2";

let chaptersData = [];

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
  3: [
    {
      text: "Vad är ett tekniskt problem inom informationsteknik?",
      options: [
        "Något i ett system som inte fungerar som det ska eller behöver förbättras.",
        "En lösning som redan är färdig och inte behöver testas.",
        "En idé som inte får analyseras innan den byggs.",
        "En uppgift som saknar koppling till användare eller teknik.",
      ],
      answer: "A",
      explanation:
        "Ett tekniskt problem handlar om att något inte fungerar, saknas eller behöver förbättras i en teknisk lösning.",
    },
    {
      text: "Varför är analys viktig i problemlösningsprocessen?",
      options: [
        "För att man ska kunna hoppa över testningen.",
        "För att förstå orsaken till problemet innan man väljer lösning.",
        "För att alla lösningar alltid fungerar direkt.",
        "För att problemet ska bli mindre dokumenterat.",
      ],
      answer: "B",
      explanation:
        "Analys hjälper dig att förstå varför problemet uppstår, så att lösningen angriper rätt orsak.",
    },
    {
      text: "Vad innebär det att implementera en lösning?",
      options: [
        "Att bara beskriva problemet utan att ändra något.",
        "Att ta bort alla tester från projektet.",
        "Att genomföra lösningen i systemet, till exempel genom kod eller ändringar.",
        "Att avsluta arbetet innan resultatet kontrolleras.",
      ],
      answer: "C",
      explanation:
        "Implementering betyder att lösningen faktiskt genomförs i praktiken.",
    },
    {
      text: "Varför behöver resultatet testas efter en ändring?",
      options: [
        "För att göra problemet svårare att hitta.",
        "För att undvika att användare får ge återkoppling.",
        "För att ersätta analys med gissningar.",
        "För att kontrollera att lösningen fungerar och inte skapar nya fel.",
      ],
      answer: "D",
      explanation:
        "Testning visar om problemet verkligen är löst och om ändringen har skapat nya problem.",
    },
    {
      text: "Vad kännetecknar systematiskt problemlösningsarbete?",
      options: [
        "Att man följer steg som identifiering, analys, lösning och testning.",
        "Att man provar slumpmässigt tills något råkar fungera.",
        "Att man alltid börjar om från början utan att dokumentera.",
        "Att man undviker att jämföra olika lösningar.",
      ],
      answer: "A",
      explanation:
        "Systematiskt arbete innebär att man följer en tydlig process från problem till testad lösning.",
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
        "För att dokumentation inte längre behövs.",
      ],
      answer: "B",
      explanation:
        "Planering gör arbetet tydligare och minskar risken för stress, missförstånd och förseningar.",
    },
    {
      text: "Vad innebär iterativ utveckling?",
      options: [
        "Att hela projektet görs färdigt innan något testas.",
        "Att projektet saknar tydliga roller.",
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
        "En tidsplan för hela projektet.",
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
        "Att ersätta all testning med gissningar.",
        "Att bara skriva text som inte körs av datorn.",
      ],
      answer: "A",
      explanation:
        "Programmering används för att ge datorn instruktioner som löser problem eller skapar digitala funktioner.",
    },
    {
      text: "Varför bör man planera lösningen innan man skriver kod?",
      options: [
        "För att kod då aldrig behöver testas.",
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
        "En kommentar som förklarar kod.",
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
        "Tar bort alla villkor.",
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
        "För att göra koden omöjlig att ändra.",
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
        "Att enbart fokusera på utseende.",
      ],
      answer: "A",
      explanation:
        "Systematiskt kvalitetsarbete innebär att kvalitet säkras stegvis och medvetet under arbetet.",
    },
    {
      text: "Vad är kvalitetssäkring?",
      options: [
        "Att ignorera användarnas behov.",
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
        "Att ersätta arbetsmiljöarbete.",
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
        "För att arbetsmiljö bara handlar om möbler.",
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
        "Att göra system långsammare med flit.",
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
        "För att ersätta alla beräkningar.",
      ],
      answer: "A",
      explanation:
        "Modeller gör komplexa system lättare att förstå, planera och analysera.",
    },
    {
      text: "Vad betyder dimensionering inom informationsteknik?",
      options: [
        "Att välja färg på ett gränssnitt.",
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
        "Att göra testning onödig.",
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
        "Att skriva en slogan.",
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
        "För att undvika modeller.",
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
        "Att undvika att planera tekniska lösningar.",
        "Att bara testa utan att beskriva något först.",
      ],
      answer: "A",
      explanation:
        "Modellering handlar om att beskriva viktiga delar av ett system så att de kan förstås och analyseras.",
    },
    {
      text: "Vad innebär simulering?",
      options: [
        "Att ta bort alla modeller.",
        "Att testa hur ett system kan bete sig utan att behöva prova allt i verkligheten.",
        "Att skriva dokumentation efter lansering.",
        "Att ersätta alla beslut med gissningar.",
      ],
      answer: "B",
      explanation:
        "Simulering används för att undersöka beteenden, flöden eller konsekvenser innan eller under utveckling.",
    },
    {
      text: "Vilket är ett exempel på modellering inom programmering?",
      options: [
        "Att bara publicera koden direkt.",
        "Att radera alla krav.",
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
        "För att göra databaser onödiga.",
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
        "För att de aldrig kan användas i IT.",
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
        "Att gamla system aldrig ersätts.",
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
        "Att använda resurser utan ansvar.",
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
        "Att den automatiskt är hållbar.",
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
        "Att hållbarhet aldrig värderas.",
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
        "Att alltid välja snabbaste lösningen.",
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
        "För att etik ersätter all testning.",
        "För att användardata alltid är oviktig.",
      ],
      answer: "B",
      explanation:
        "Etik behövs eftersom teknik kan påverka människors rättigheter, val, data och livsmiljö.",
    },
    {
      text: "Vad handlar integritet om i digital teknik?",
      options: [
        "Att samla in all data utan skäl.",
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
        "Att bortse från miljöpåverkan.",
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
        "En bedömning där risker aldrig nämns.",
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
        "Att ta bort all teknik från produktion.",
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
        "Genom att planering blir omöjlig.",
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
        "En metod för att undvika digital kompetens.",
      ],
      answer: "C",
      explanation:
        "Industri 4.0 handlar om uppkopplade maskiner, data, automatisering och smart produktion.",
    },
    {
      text: "Vilken är en utmaning med digitalisering?",
      options: [
        "Att den aldrig kräver säkerhet.",
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
        "Att undvika källkritik och säkerhet.",
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
        "För att ingen ska veta vad andra gör.",
        "För att tekniska problem alltid löser sig själva.",
      ],
      answer: "A",
      explanation:
        "Tydlig kommunikation gör att människor kan samarbeta och förstå projektets mål, beslut och problem.",
    },
    {
      text: "Vad innebär dokumentation?",
      options: [
        "Att muntligt gissa hur systemet fungerar.",
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
        "Att göra samarbete omöjligt.",
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
        "För att dölja hur programmet fungerar.",
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
        "Att bara visa kod utan sammanhang.",
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
        "En färdig kodfil utan struktur.",
        "En muntlig instruktion utan visualisering.",
      ],
      answer: "A",
      explanation:
        "Tekniska ritningar används för att visa struktur, funktion eller konstruktion på ett tydligt sätt.",
    },
    {
      text: "Vilken fördel har digitala ritningar?",
      options: [
        "De går aldrig att dela.",
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
        "Enbart hårdvarans pris.",
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
        "Hur ett spel låter.",
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
        "För att undvika samarbete.",
      ],
      answer: "A",
      explanation:
        "Modeller hjälper människor att förstå och förbättra lösningar innan allt är färdigbyggt.",
    },
  ],
};

function insertChapterQuiz(chapterNumber) {
  const questions = chapterQuizData[chapterNumber];
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

  if (!targetHeading) return false;

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
  });

  targetHeading.insertAdjacentElement("beforebegin", quiz);
  return true;
}

window.pythonbook = {
  getChapter,
  insertChapterQuiz,
  renderChapterPage,
};

window.teknik2 = window.pythonbook;
