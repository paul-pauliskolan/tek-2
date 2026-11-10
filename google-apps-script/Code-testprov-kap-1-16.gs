const SPREADSHEET_ID = "1OuYzQOEpXEr0KM5yfCpsqTmHm5o9bNuKG4SCobOssj4";
const ANSWERS_SHEET_NAME = "Svar";

const TEST_SHEETS = {
  "teknik2-kapitel-1-9-q7m9": "testprov kap 1-9",
  "teknik2-kapitel-1-16-r4n8": "testprov kap 1-16 r4n8",
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Quizstatistik")
    .addItem("Skapa eller kontrollera testflikar", "setupTestSheets")
    .addToUi();
}

function safeText(value, maxLength) {
  let text = String(value || "").trim().slice(0, maxLength);
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text;
}

function setupTestSheets() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);

  Object.values(TEST_SHEETS).forEach((sheetName) => {
    let sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) sheet = spreadsheet.insertSheet(sheetName);

    sheet.getRange("A1:D1").setValues([[
      "Tid",
      "Förnamn",
      "Antal rätt",
      "Rekommenderad repetition",
    ]]);

    sheet.setFrozenRows(1);
    sheet.getRange("A1:D1")
      .setFontWeight("bold")
      .setFontColor("#ffffff")
      .setBackground("#137a4a")
      .setHorizontalAlignment("center");

    sheet.setColumnWidth(1, 150);
    sheet.setColumnWidth(2, 140);
    sheet.setColumnWidth(3, 110);
    sheet.setColumnWidth(4, 520);
    sheet.getRange("C2:C").setHorizontalAlignment("center");
    sheet.getRange("D2:D").setWrap(true);

    if (!sheet.getFilter()) {
      sheet.getRange(1, 1, Math.max(sheet.getMaxRows(), 2), 4).createFilter();
    }
  });
}

function doGet() {
  return ContentService.createTextOutput(
    "Quizstatistik och testprovsinsamling är aktiv.",
  );
}

function saveTestSummary(data) {
  const testId = safeText(data.testId, 100);
  const sheetName = TEST_SHEETS[testId];
  const firstName = safeText(data.studentName, 50);
  const score = Math.max(0, Number(data.score) || 0);
  const recommendations = safeText(data.recommendations, 2000);

  if (!sheetName) {
    return ContentService.createTextOutput("Okänt test-ID.");
  }
  if (!firstName || !recommendations) {
    return ContentService.createTextOutput(
      "Förnamn eller repetitionsrekommendation saknas.",
    );
  }

  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID)
    .getSheetByName(sheetName);
  if (!sheet) {
    return ContentService.createTextOutput(
      "Testfliken saknas. Kör setupTestSheets.",
    );
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    sheet.appendRow([new Date(), firstName, score, recommendations]);
  } finally {
    lock.releaseLock();
  }

  return ContentService.createTextOutput("OK");
}

function saveAnonymousQuizAnswers(data) {
  if (!Array.isArray(data.answers) || !data.answers.length) {
    return ContentService.createTextOutput("Inga svar att spara.");
  }

  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID)
    .getSheetByName(ANSWERS_SHEET_NAME);
  if (!sheet) {
    return ContentService.createTextOutput("Fliken Svar saknas.");
  }

  const timestamp = new Date();
  const rows = data.answers.map((answer) => [
    timestamp,
    safeText(data.quizId, 100),
    safeText(data.chapter, 100),
    Number(answer.questionNumber) || "",
    safeText(answer.questionText, 1000),
    safeText(answer.selectedAnswer, 500),
    safeText(answer.correctAnswer, 500),
    answer.isCorrect ? 1 : 0,
    safeText(data.pagePath, 500),
  ]);

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    sheet
      .getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length)
      .setValues(rows);
  } finally {
    lock.releaseLock();
  }

  return ContentService.createTextOutput("OK");
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data && data.type === "testSummary") {
      return saveTestSummary(data);
    }
    if (!data) {
      return ContentService.createTextOutput("Ingen data att spara.");
    }

    return saveAnonymousQuizAnswers(data);
  } catch (error) {
    console.error(error);
    return ContentService.createTextOutput("Ogiltig data.");
  }
}

// Creates only the new tab; existing tabs and results are untouched.
function setupNewTestSheet() {
  const book = SpreadsheetApp.openById(SPREADSHEET_ID);
  const name = TEST_SHEETS["teknik2-kapitel-1-16-r4n8"];
  if (book.getSheetByName(name)) return;
  const sheet = book.insertSheet(name);
  sheet.getRange("A1:D1").setValues([["Tid", "Förnamn", "Antal rätt", "Rekommenderad repetition"]]);
  sheet.setFrozenRows(1);
  sheet.getRange("A1:D1").setFontWeight("bold").setFontColor("#ffffff").setBackground("#137a4a");
  sheet.setColumnWidth(1, 150); sheet.setColumnWidth(2, 140); sheet.setColumnWidth(3, 110); sheet.setColumnWidth(4, 520);
  sheet.getRange("D2:D").setWrap(true);
  if (sheet.getMaxColumns() > 4) sheet.deleteColumns(5, sheet.getMaxColumns() - 4);
  sheet.getRange(1, 1, sheet.getMaxRows(), 4).createFilter();
}
