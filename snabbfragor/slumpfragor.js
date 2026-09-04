const questionBank = [
  [1,"Teknikutveckling från problem till prototyp","Vad är huvudsyftet med teknikutveckling?","Att skapa nya eller förbättrade lösningar som löser problem eller uppfyller behov."],
  [1,"Teknikutveckling från problem till prototyp","Vilka frågor hjälper dig att identifiera ett problem?","Vad är problemet, vem påverkas, vad behöver förbättras och vad ska lösningen klara?"],
  [1,"Teknikutveckling från problem till prototyp","Varför gör man research innan man väljer lösning?","För att förstå användarnas behov, befintliga lösningar, tekniska begränsningar samt lagar och regler."],
  [1,"Teknikutveckling från problem till prototyp","Varför bör man ta fram flera idéer under idégenereringen?","Flera idéer gör det möjligt att jämföra alternativ och minskar risken att man låser sig vid den första lösningen."],
  [1,"Teknikutveckling från problem till prototyp","Vad är en prototyp och vad används den till?","En prototyp är en tidig version som används för att prova idén, testa funktioner och upptäcka problem."],
  [2,"Testning, iteration och tekniska lösningars livscykel","Vad bör testas på en webbplats innan lansering?","Bland annat länkar, utseende i olika webbläsare, mobilanpassning, användbarhet och prestanda."],
  [2,"Testning, iteration och tekniska lösningars livscykel","Vad betyder iteration i teknikutveckling?","Att utveckla i omgångar: bygga, testa, förbättra och testa igen."],
  [2,"Testning, iteration och tekniska lösningars livscykel","Vad innebär produktion för en digital produkt?","Att lösningen lanseras eller distribueras så att användarna kan börja använda den."],
  [2,"Testning, iteration och tekniska lösningars livscykel","Vad ingår i en teknisk lösnings livscykel efter lanseringen?","Underhåll, uppdateringar, förbättringar och till sist eventuell ersättning eller avveckling."],
  [2,"Testning, iteration och tekniska lösningars livscykel","Vad är teknisk skuld?","Framtida extraarbete som uppstår när till exempel planering, design eller testning har stressats igenom."],
  [3,"Entreprenörskap, uppfinningar och innovation","Vad betyder entreprenörskap inom teknik?","Att se möjligheter, utveckla idéer och skapa tekniska lösningar som ger värde."],
  [3,"Entreprenörskap, uppfinningar och innovation","Vad skiljer en uppfinning från en innovation?","En uppfinning är en ny idé eller teknik; en innovation är en ny eller förbättrad lösning som används i praktiken."],
  [3,"Entreprenörskap, uppfinningar och innovation","Varför räcker inte teoretisk kunskap ensam för entreprenöriell förmåga?","Omdöme och handlingsförmåga utvecklas också genom praktiskt arbete, samarbete, testning och återkoppling."],
  [3,"Entreprenörskap, uppfinningar och innovation","Hur kan misstag bidra till entreprenörskap?","När misstagen analyseras visar de vad som behöver ändras och gör nästa försök bättre."],
  [3,"Entreprenörskap, uppfinningar och innovation","Varför måste en teknikidé kopplas till en marknad eller målgrupp?","För att lösningen behöver möta verkliga användares behov och skapa ett värde som de efterfrågar."],
  [4,"Entreprenörskapets villkor och möjligheter","Nämn fyra villkor som kan påverka om en teknikidé lyckas.","Till exempel användarbehov, kompetens, finansiering, lagar, konkurrens, tid och tekniska resurser."],
  [4,"Entreprenörskapets villkor och möjligheter","Vilka två lagområden är särskilt viktiga när en IT-lösning hanterar personuppgifter och kreativt innehåll?","GDPR skyddar personuppgifter och upphovsrätten skyddar exempelvis texter, bilder och musik."],
  [4,"Entreprenörskapets villkor och möjligheter","Vad innebär risk i ett teknikprojekt?","Osäkerhet om idén fungerar eller lyckas, exempelvis tekniskt, ekonomiskt eller på marknaden."],
  [4,"Entreprenörskapets villkor och möjligheter","Vad bör en kort pitch om en teknikidé förklara?","Problemet, lösningen, målgruppen, värdet och gärna hur idén kan genomföras."],
  [4,"Entreprenörskapets villkor och möjligheter","Hur kan man arbeta entreprenöriellt i ett skolprojekt?","Genom att hitta ett verkligt behov, skapa och testa en lösning, ta emot respons och förbättra den."],
  [5,"Tekniska problem och orsaksanalys","Vad är ett tekniskt problem?","Något som inte fungerar som avsett, saknar en lösning eller behöver förbättras."],
  [5,"Tekniska problem och orsaksanalys","Vad betyder dekomposition?","Att bryta ner ett stort problem i mindre delar som är lättare att förstå och lösa."],
  [5,"Tekniska problem och orsaksanalys","Vad betyder abstraktion i problemlösning?","Att bortse från oviktiga detaljer och fokusera på det som är relevant för lösningen."],
  [5,"Tekniska problem och orsaksanalys","Vad är skillnaden mellan syntaxfel och logiska fel?","Ett syntaxfel bryter mot språkets skrivregler; ett logiskt fel körs men ger fel beteende eller resultat."],
  [5,"Tekniska problem och orsaksanalys","Varför försöker man reproducera ett fel?","För att se när och under vilka villkor felet uppstår och därmed lättare hitta orsaken."],
  [6,"Lösningar, implementering och systematisk testning","Varför bör man överväga flera lösningar på samma problem?","För att kunna jämföra konsekvenser och välja alternativet som fungerar bäst för hela systemet."],
  [6,"Lösningar, implementering och systematisk testning","Varför är det klokt att ändra en sak i taget vid implementering?","Då blir det lättare att avgöra vilken förändring som löste problemet eller skapade ett nytt fel."],
  [6,"Lösningar, implementering och systematisk testning","Vad måste kontrolleras efter att en lösning implementerats?","Att ursprungsproblemet är löst, att systemet fungerar i fler situationer och att inga nya fel har uppstått."],
  [6,"Lösningar, implementering och systematisk testning","Vad är systemoptimering?","Att förbättra hur ett system använder resurser eller fungerar, exempelvis snabbhet, stabilitet eller laddningstid."],
  [6,"Lösningar, implementering och systematisk testning","Hur fungerar gummiankemetoden?","Du förklarar kod och problem högt steg för steg; då blir logiska luckor och felaktiga antaganden ofta synliga."]
];
(function () {
  "use strict";
  const questions = questionBank.map(q => q.slice());
  for (let i = questions.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [questions[i], questions[j]] = [questions[j], questions[i]]; }
  let index = 0, showingAnswer = false;
  const chapter = document.getElementById("chapter"), position = document.getElementById("position"), question = document.getElementById("question"), answer = document.getElementById("answer"), show = document.getElementById("show-answer"), next = document.getElementById("next-random");
  function render() { const q = questions[index]; chapter.textContent = `Kapitel ${q[0]} · ${q[1]}`; position.textContent = `Fråga ${index + 1} av ${questions.length}`; question.textContent = q[2]; answer.textContent = q[3]; answer.hidden = true; show.hidden = false; next.hidden = true; showingAnswer = false; }
  function reveal() { answer.hidden = false; show.hidden = true; next.hidden = false; next.textContent = index === questions.length - 1 ? "Blanda om och börja om" : "Nästa slumpfråga"; showingAnswer = true; next.focus(); }
  show.addEventListener("click", reveal);
  next.addEventListener("click", () => { if (index === questions.length - 1) window.location.reload(); else { index += 1; render(); show.focus(); } });
  document.addEventListener("keydown", e => { if (e.key === " ") { e.preventDefault(); showingAnswer ? next.click() : reveal(); } });
  render();
}());
