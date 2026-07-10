# Prompt for att forbattra kapitelquiz

```text
Du ska forbattra flervalsfragorna i ett kapitelquiz for en gymnasiekurs.

Utga endast fran innehall, begrepp och exempel i det aktuella kapitlet. Skriv [ANTAL] fragor med fyra svarsalternativ: A, B, C och D.

Krav for varje fraga:
- Prova forstaelse, tillampning eller ett rimligt stallningstagande. Undvik rena ordlistedefinitioner nar ett scenario fungerar battre.
- Anvand tydligt och avskalat sprak som passar eleverna.
- Ha exakt ett korrekt svar.
- Skriv tre trovärdiga distraktorer. De ska bygga pa vanliga missforstand, forvaxlingar eller delvis korrekta resonemang, inte pa tokiga eller uppenbart felaktiga svar.
- Lat inte det ratta svaret vara tydligt langre, mer detaljerat eller mer formellt an de andra alternativen.
- Hall alternativen ungefar lika langa och grammatiskt parallella.
- Undvik svarsalternativ som avslöjar sig genom ord som "alltid", "aldrig", "bara", "helt omojligt" eller uppenbart ovidkommande innehall.
- Undvik att upprepa samma formulering fran fragestammen i det ratta svaret.
- Anvand inte "alla ovanstaende" eller "inget av ovanstaende".

Fordela korrekta svar mellan A, B, C och D sa jamnt som mojligt och i en slumpmassig ordning. Om antalet fragor ar delbart med fyra ska varje bokstav vara ratt lika manga ganger. Om det inte ar delbart med fyra ska skillnaden mellan bokstaverna vara hogst en.

Efter varje fraga ska du skriva:
1. Ratt svar: [bokstav]
2. Kort forklaring: Varfor ar svaret ratt och vilket missforstand representerar de starkaste felsvaren?

Gor sist en kontrolltabell med:
- fragans nummer
- ratt svar
- ungefarlig langd pa A, B, C och D
- fordelningen av ratta svar mellan A, B, C och D

Kapitelinnehall:
[KLISTRA IN KAPITLET ELLER EN SAMMANFATTNING HAR]
```
