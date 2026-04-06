// Teknik 2 - shared site logic

const BOOK_TITLE = "Teknik 2 information och medieteknik";
const BOOK_SHORT_TITLE = "Teknik 2";

let chaptersData = [];

document.addEventListener("DOMContentLoaded", () => {
  loadChaptersData();
  setupMenuToggle();
  applyBranding();
});

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
    homeSubtitle.textContent =
      "En kursbok byggd för läsning, övning och kodning sida vid sida med VS Code eller IDLE.";
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

  const chapterSubtitle = document.querySelector(
    ".chapter-page .chapter-hero .subtitle",
  );
  if (chapterSubtitle) {
    chapterSubtitle.textContent =
      "Läs kapitlet och håll reda på innehållet i en smal parallell vy.";
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

  const headings = Array.from(content.querySelectorAll("h2, h3")).filter(
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

      const isSubHeading = heading.tagName.toLowerCase() === "h3";
      const linkClass = isSubHeading ? "toc-link toc-link-sub" : "toc-link";
      return `<li><a class="${linkClass}" href="#${heading.id}">${heading.textContent.trim()}</a></li>`;
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

window.pythonbook = {
  getChapter,
  renderChapterPage,
};

window.teknik2 = window.pythonbook;
