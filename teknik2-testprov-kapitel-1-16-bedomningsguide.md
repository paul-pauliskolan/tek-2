# Bedömningsguide – Teknik 2, kapitel 1–16

Test-ID: `teknik2-kapitel-1-16-r4n8`. 20 frågor, fyra alternativ och exakt ett rätt svar per fråga. Resultatet används för repetition, inte automatisk betygssättning. Provet är olistat men inte lösenordsskyddat.

## Underlag och fördelning

Frågorna utgår från aktuell `data/chapters.json`, kapitel 1–16, och motsvarande kapitelsidor. Kapitelövningar och de 120 övningsfrågorna har använts som inspiration; situationerna är nyskrivna. Den äldre provmodellens kapitelnumrering används inte.

| Kapitel | Innehåll | Antal | Fråge-ID |
| --- | --- | ---: | --- |
| 1 | Teknikutveckling från problem till prototyp | 1 | 1 |
| 2 | Testning, iteration och tekniska lösningars livscykel | 1 | 2 |
| 3 | Entreprenörskap, uppfinningar och innovation | 1 | 3 |
| 4 | Entreprenörskapets villkor och möjligheter | 1 | 4 |
| 5 | Tekniska problem och orsaksanalys | 1 | 5 |
| 6 | Lösningar, implementering och systematisk testning | 1 | 6 |
| 7 | Projektplanering, roller och samarbete | 1 | 7 |
| 8 | Arbetsmetoder och agila projekt | 1 | 8 |
| 9 | Programmeringsprocessen från problem till test | 2 | 9, 10 |
| 10 | Programförbättring, automatisering och kvalitet | 1 | 11 |
| 11 | Kvalitetssäkring och riskanalys | 2 | 12, 13 |
| 12 | Riskhantering, miljösäkring och arbetsmiljö | 1 | 14 |
| 13 | Begrepp, teorier, modeller och systemkonstruktion | 1 | 15 |
| 14 | Dimensionering, beräkningar och rimlighetsbedömning | 2 | 16, 17 |
| 15 | Modellering och simulering i digitala system | 1 | 18 |
| 16 | Simulering i spel och andra teknikområden | 2 | 19, 20 |

Kapitel 9, 11, 14 och 16 får två frågor vardera för kodförståelse och planering, kvalitet och risk, beräkningar samt simulering. Övriga kapitel får en fråga.

## Facit och återkoppling

ID är stabila lärarreferenser. Elevens frågenummer och bokstäver slumpas. Facit anges därför som svarstext. Vid varje start placeras exakt fem rätta svar på vardera A–D.

### ID 1 – Kapitel 1: Behovsanalys

En simklubb vill minska köerna vid bokning av träningspass. Vad ger bäst underlag innan gruppen väljer teknisk lösning?

**Rätt svar:** Kartlägg hur bokningen fungerar och intervjua medlemmar om problemen

**Förklaring:** Behovsanalys och research visar vilket problem som behöver lösas och för vilka användare.

**Vanlig missuppfattning:** Att en viss teknik automatiskt innebär att användarnas behov är kända.

**Repetition:** Beskriv ett bokningsproblem och skriv tre intervjufrågor.

### ID 2 – Kapitel 2: Iteration och livscykel

En digital orienteringskarta är publicerad. Nya stigar tillkommer och användare rapporterar otydliga symboler. Vilken plan följer ett livscykelperspektiv?

**Rätt svar:** Uppdatera kartdata, förbättra symbolerna och testa ändringarna

**Förklaring:** En produkt behöver underhåll och förbättring efter lansering. Ändringar följs av nya tester.

**Vanlig missuppfattning:** Att publicering betyder att allt tekniskt arbete är färdigt.

**Repetition:** Rita en cykel med användaråterkoppling, ändring och test efter lansering.

### ID 3 – Kapitel 3: Uppfinning och innovation

Ett nytt sensorkoncept finns bara som laboratorieprototyp. Senare börjar växthus använda det för att minska vattenförbrukningen. Vad visar övergången?

**Rätt svar:** En uppfinning blir en innovation när den används och skapar värde

**Förklaring:** Kursen skiljer en ny idé eller teknik från en lösning som används i praktiken och skapar värde.

**Vanlig missuppfattning:** Att en ny idé på papper alltid är en innovation.

**Repetition:** Skriv ett eget exempel med stegen idé, prototyp och använd lösning.

### ID 4 – Kapitel 4: Entreprenörskapets villkor

En grupp har finansiering till en leveransapp men vet inte om småbutiker vill betala för den. Hur minskar gruppen osäkerheten bäst?

**Rätt svar:** Undersök butikernas behov och testa ett begränsat erbjudande tidigt

**Förklaring:** Finansiering och marknadens behov är olika villkor. Tidiga tester ger underlag innan stora resurser satsas.

**Vanlig missuppfattning:** Att pengar till utveckling garanterar att produkten har en marknad.

**Repetition:** Gör en enkel plan för att testa ett erbjudande med två tänkta kunder.

### ID 5 – Kapitel 5: Orsaksanalys

En biljettjänst kraschar bara när antalet biljetter är noll. Vad bör utvecklaren göra först för att hitta orsaken?

**Rätt svar:** Återskapa fallet med noll biljetter och följ värden och loggar

**Förklaring:** Ett reproducerbart fel och spårning av relevanta värden gör orsaksanalysen systematisk.

**Vanlig missuppfattning:** Att symptom kan lösas genom ändringar utan att orsaken undersöks.

**Repetition:** Skriv en felrapport med indata, steg, förväntat och faktiskt resultat.

### ID 6 – Kapitel 6: Implementering och test

En ändrad mobilmeny löser ett visningsfel på en telefon. Vad bör ingå innan ändringen betraktas som klar?

**Rätt svar:** Testa både det ursprungliga fallet och andra relevanta skärmar och funktioner

**Förklaring:** Efter implementering behöver man kontrollera att problemet är löst och att ändringen inte skapat nya fel.

**Vanlig missuppfattning:** Att ett lyckat test innebär att alla användningsfall är kontrollerade.

**Repetition:** Gör en testtabell med mobil, dator, tidigare fel och närliggande funktioner.

### ID 7 – Kapitel 7: Projektplanering

Två elever bygger samma bokningsfunktion samtidigt medan ingen testar systemet. Vilken åtgärd hjälper gruppen mest?

**Rätt svar:** Fördela ansvar för utveckling och test och följ upp en gemensam plan

**Förklaring:** Tydliga roller, uppgifter och regelbunden kommunikation motverkar dubbelarbete och bortglömda delar.

**Vanlig missuppfattning:** Att samarbete fungerar utan gemensam ansvarsfördelning.

**Repetition:** Gör en plan med uppgift, ansvarig, tid och kontrollpunkt.

### ID 8 – Kapitel 8: Agilt arbete och MVP

En grupp vill prova om besökare använder digital köbokning. Vilket alternativ beskriver bäst en MVP?

**Rätt svar:** En enkel fungerande köbokning som riktiga besökare använder och ger återkoppling på

**Förklaring:** En MVP är en minsta fungerande produktversion hos riktiga användare, som ger återkoppling för fortsatt utveckling.

**Vanlig missuppfattning:** Att en MVP är samma sak som en intern skiss eller en helt färdig produkt.

**Repetition:** Jämför en pappersprototyp och en MVP för köbokning och ange vad varje version kan testa.

### ID 9 – Kapitel 9: Kodförståelse

Följ pseudokoden. Vilket värde skrivs ut?

```text
Pseudokod:
antal ← 0
FÖR VARJE värde I [5, 8, 7, 11]
    OM värde > 7
        antal ← antal + 1
SKRIV antal
```

**Rätt svar:** 2

**Förklaring:** Värdena 8 och 11 är större än 7. Villkoret är falskt för 5 och 7, så räknaren ökas två gånger.

**Vanlig missuppfattning:** Att större än även omfattar gränsvärdet.

**Repetition:** Gör en spårningstabell med varje värde, villkorets resultat och räknarens värde.

### ID 10 – Kapitel 9: Planera program

Ett program ska beräkna genomsnittlig restid. Vad behöver definieras innan kod skrivs?

**Rätt svar:** Vilka restider som läses in, hur snittet beräknas och vad som händer om inga restider finns

**Förklaring:** En plan behöver indata, bearbetning, utdata och relevanta specialfall. En tom mängd får inte behandlas som vanlig division med antal.

**Vanlig missuppfattning:** Att kodning kan påbörjas utan bestämd indata och förväntat resultat.

**Repetition:** Skriv pseudokod för ett snitt och ange hantering av tom indata.

### ID 11 – Kapitel 10: Logiska fel och förbättring

Pseudokoden ska beräkna totalkostnaden för likadana reservdelar. Vid pris 40 och antal 3 blir resultatet 43. Vilken ändring rättar beräkningen?

```text
Pseudokod:
pris ← 40
antal ← 3
total ← pris + antal
SKRIV total
```

**Rätt svar:** Byt pris + antal mot pris × antal

**Förklaring:** Programmet går att köra men använder fel räknesätt. Total kostnad beräknas som styckpris multiplicerat med antal.

**Vanlig missuppfattning:** Att körbar kod automatiskt är logiskt korrekt.

**Repetition:** Prova den rättade regeln med antal 0, 1 och 4 och skriv förväntade resultat.

### ID 12 – Kapitel 11: Välja testtyp

En informationstjänst ger korrekta uppgifter men blir långsam när många ansluter samtidigt. Vilken testtyp undersöker problemet mest direkt?

**Rätt svar:** Prestandatest med realistisk samtidig belastning

**Förklaring:** Prestandatest undersöker snabbhet och stabilitet under belastning. Korrekta svar vid enstaka anrop räcker inte.

**Vanlig missuppfattning:** Att funktionell korrekthet garanterar god prestanda.

**Repetition:** Planera ett belastningstest med antal samtidiga användare och mätning av svarstid.

### ID 13 – Kapitel 11: Riskanalys

En förenings medlemsregister finns på en enda lagringsenhet. Vilket underlag behövs för att prioritera risken för dataförlust?

**Rätt svar:** Bedöm hur sannolik förlusten är och vilka konsekvenser den skulle få

**Förklaring:** Riskanalys identifierar möjliga problem och bedömer hur allvarliga de är för att kunna prioritera förebyggande åtgärder.

**Vanlig missuppfattning:** Att en risk kan bedömas utan hänsyn till konsekvenser.

**Repetition:** Beskriv sannolikhet, konsekvens och åtgärd för dataförlust och driftstopp.

### ID 14 – Kapitel 12: Miljö och arbetsmiljö

Ett team kör onödiga nattliga beräkningar och arbetar återkommande utan pauser. Vilken kombination angriper båda problemen?

**Rätt svar:** Minska onödiga körningar och planera rimliga arbetspass med pauser

**Förklaring:** Resurseffektiv drift minskar onödigt energibehov. Rimlig belastning och pauser förbättrar arbetsförhållandena.

**Vanlig missuppfattning:** Att digital drift saknar miljöpåverkan eller att arbetsmiljö ligger utanför teknikprojektet.

**Repetition:** Föreslå en mätbar resursbesparing och en konkret förbättring av arbetsplaneringen.

### ID 15 – Kapitel 13: Systemkonstruktion

En utlåningstjänst ska byggas. Vilket beslut hör främst till konstruktionen av systemet?

**Rätt svar:** Bestäm hur gränssnitt, server och datalagring ska samverka

**Förklaring:** Konstruktion omfattar struktur, tekniska val och hur systemets delar fungerar tillsammans.

**Vanlig missuppfattning:** Att konstruktion enbart betyder att skriva färdig kod.

**Repetition:** Rita tjänstens komponenter och beskriv ansvar och informationsutbyte.

### ID 16 – Kapitel 14: Dimensionering

Ett arkiv ska lagra 600 ljudfiler på 12 MB vardera. Lägg till 25 procent kapacitetsmarginal. Hur mycket lagringsutrymme ska minst planeras?

**Rätt svar:** 9 000 MB

**Förklaring:** 600 × 12 = 7 200 MB. En marginal på 25 procent ger 7 200 × 1,25 = 9 000 MB.

**Vanlig missuppfattning:** Att procentuell marginal är ett fast antal MB eller att grundbehovet räcker.

**Repetition:** Räkna först grundbehovet och sedan en procentuell marginal för ett eget filarkiv.

### ID 17 – Kapitel 14: Rimlighetsbedömning

Varje överföring innehåller 3 MB. En kalkyl säger att 200 överföringar tillsammans omfattar 60 000 MB. Vilken kontroll är rimlig?

**Rätt svar:** 200 × 3 ger 600 MB, så kalkylen är hundra gånger för stor

**Förklaring:** Antal överföringar gånger datamängd per överföring ger total datamängd. Ett överslag avslöjar storleksfelet.

**Vanlig missuppfattning:** Att en siffra i en kalkyl är trovärdig utan kontroll av enheter och storleksordning.

**Repetition:** Gör tre överslag med antal × storlek och skriv ut enheterna.

### ID 18 – Kapitel 15: Välja modell

En grupp behöver planera tabeller för verktyg, låntagare och lån samt relationerna mellan dem. Vilken modell passar bäst?

**Rätt svar:** Ett databasschema

**Förklaring:** Ett databasschema beskriver hur information organiseras i tabeller och relationer.

**Vanlig missuppfattning:** Att alla typer av modeller visar samma egenskaper hos ett system.

**Repetition:** Skissa tabeller för verktyg, låntagare och lån och markera hur de kopplas.

### ID 19 – Kapitel 16: Simuleringens begränsningar

En spelsimulering visar att en figur aldrig glider på en ramp. Modellen har dock felaktigt antagit mycket hög friktion. Vilken slutsats är bäst?

**Rätt svar:** Rätta friktionsantagandet och jämför nya körningar med ett relevant verkligt beteende

**Förklaring:** Simuleringen beror på modellens antaganden och indata. Felaktiga regler kan ge missvisande resultat även i en avancerad modell.

**Vanlig missuppfattning:** Att många körningar kompenserar för ett systematiskt fel i modellen.

**Repetition:** Lista tre antaganden i en fysiksimulering och beskriv hur de kan kontrolleras.

### ID 20 – Kapitel 16: Digital tvilling

En fabrik vill pröva hur service av en maskin påverkar produktionen utan att stoppa den verkliga fabriken. Vilken användning passar en digital tvilling?

**Rätt svar:** Simulera service och belastning i en digital representation av fabriken

**Förklaring:** En digital tvilling representerar ett fysiskt system och kan användas för att simulera bland annat underhåll, belastning och fel.

**Vanlig missuppfattning:** Att en digital tvilling enbart är en bild utan möjlighet att undersöka systemets beteende.

**Repetition:** Beskriv vilka komponenter och driftsdata en digital tvilling av en verkstad behöver.

## Användning av resultat

Prioritera högst tre kapitel utifrån antalet fel, med lägre kapitelnummer som skiljeregel vid lika antal. Ge konkreta aktiviteter inom de områden där eleven svarat fel. Be gärna eleven förklara en ny situation muntligt efter repetition. Full poäng ger en fördjupningsuppgift. Procenttal är inte betygsgränser.

Elevens nedladdade MD innehåller förnamn, datum, resultat, råd samt frågor, underlag, alternativ, elevens svar, rätt svar och förklaringar för alla fel. Google-fliken får endast Tid, Förnamn, Antal rätt och Rekommenderad repetition.
