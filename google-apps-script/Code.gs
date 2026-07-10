const SPREADSHEET_ID = "1OuYzQOEpXEr0KM5yfCpsqTmHm5o9bNuKG4SCobOssj4";
const SHEET_NAME = "Svar";

function doGet() {
  return ContentService.createTextOutput("Quizstatistik ar aktiv.");
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (!data || !Array.isArray(data.answers) || !data.answers.length) {
    return ContentService.createTextOutput("Inga svar att spara.");
  }

  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const timestamp = new Date();
  const rows = data.answers.map((answer) => [
    timestamp,
    data.quizId || "",
    data.chapter || "",
    answer.questionNumber || "",
    answer.questionText || "",
    answer.selectedAnswer || "",
    answer.correctAnswer || "",
    answer.isCorrect ? 1 : 0,
    data.pagePath || "",
  ]);

  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
  return ContentService.createTextOutput("OK");
}
