# Teknik 2 – testprov kapitel 1–16

- Prov: `teknik2-kapitel-1-16-testprov-r4n8.html`
- Test-ID: `teknik2-kapitel-1-16-r4n8`
- Lokal nyckel: `teknik2-kapitel-1-16-r4n8-senaste-resultat`
- Kalkylark: `1OuYzQOEpXEr0KM5yfCpsqTmHm5o9bNuKG4SCobOssj4` (Quizstatistik Teknik 2).
- Ny flik: `testprov kap 1-16 r4n8`, gid `720250502`.
- Endast kolumnerna Tid, Förnamn, Antal rätt, Rekommenderad repetition.

## Verifierad implementering

Apps Script-projektets namn är **Quiz Webb 1**, men den här implementeringen använder Teknik 2-kalkylarket ovan.

- Projekt-ID: `18zaoiQ4jqoygASkW59gTZTT7XEsoO9IswtoHZdMFAaVRV4e9NQ_h7CJM`
- Implementerings-ID: `AKfycbz1rjRfNskh1N1Usgfb9ASGy421wF64Q5oXfTy1B45aS2WMLpwuuShZW13Z6S2exGU0`
- Befintlig `/exec`-adress behållen.
- Publicerad version **6**, 10 november 2026 kl. 20:28 svensk tid.
- Beskrivning: Teknik 2 – kapitel 1–16 r4n8; kapitel 1–9 bevarat.
- Gammalt test-ID `teknik2-kapitel-1-9-q7m9` och dess resultatflik behållna.
- `setupNewTestSheet` skapade endast den nya fliken och återanvänder en redan befintlig flik utan att skriva i den.
- Övriga implementeringar uppdaterades inte.
- Projektets tidigare arbetskod återställdes efter versionspubliceringen för att inte lämna ändringar i ett projekt som delas av flera kurser. Version 6 är fryst och fortsätter fungera. Vid framtida uppdatering: utgå från version 6 eller källfilen `Code-testprov-kap-1-16.gs`, inte från arbetskopian. Kontrollera alltid spreadsheet-ID och implementerings-ID.

`Code-testprov-kap-1-16.gs` innehåller samma funktioner och test-ID-mappning som publicerad version 6; den äldre lokala filen för kapitel 1–9 har inte ändrats.

## Genomförd verifiering

- Automatisk kontroll: 1 000 slumpningar med 20 unika frågor, fyra unika alternativ, korrekt facit efter slumpning och exakt fem rätt per position A–D.
- Automatisk kontroll av tomt/blankt namn, obesvarade frågor, rättning med 20/20 och 10/20, lagring med unik nyckel, MD-innehåll och nedladdningsblob, kopierad sammanfattning och JSON utan enskilda elevsvar.
- Dubbla inlämningar blockeras i samma provomgång.
- Webbläsare: obligatoriskt förnamn, obesvarad fråga, föregående/nästa, sparat radioval, tangentbordsval och hela flödet med 20 svar.
- Mobilvy: 390 × 844, läsbar pseudokod och alternativ samt staplade knappar.
- Webbläsartest med alla A gav exakt 5/20 (25 %); både pseudokodunderlag fanns kvar i felgenomgången.
- Verklig nedladdad MD-fil granskades; samtliga 15 fel, alternativ, elevsvar, facit, förklaringar och båda kodunderlagen fanns med.
- Faktisk Google-rad A2:D2 lästes via connector: `TEK2-TEST-R4N8-20261110`, 5 rätt och tre repetitionsråd. Endast den verifierade testraden raderades. Ny avläsning visade enbart rubriker.

Kör det automatiska testet med Node och paketet `linkedom` tillgängligt (vid behov via `NODE_PATH`):

```sh
node scripts/test-tek2-kapitel-1-16.cjs
```

## Publicerad webbsida

- Publicerad via commit `ed5a26b` på `master` i kursens befintliga GitHub Pages-projekt.
- Publika HTML-filen och bedömningsguidens MD-fil hämtades och jämfördes byte för byte med källfilerna.
- Ett komplett prov med alla rätt genomfördes på den publika HTTPS-adressen: 20/20 och 100 %.
- Kopieringsknappen på den publika sidan visade bekräftelsen ”Sammanfattningen har kopierats.”
- Även den publika inlämningens faktiska rad A2:D2 verifierades: `TEK2-PUBLIK-R4N8-20261110`, 20 rätt, fördjupningsråd. Serverkörningen var långsam men raden sparades. Endast denna testrad togs därefter bort; slutlig avläsning visade enbart rubrikerna.
- Inga provlänkar har lagts till i kursnavigationen och inga gamla provfiler har ändrats.
