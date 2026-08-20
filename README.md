# kaffee-in-production ☕

> Arbeitstitel — Name wird vor Veröffentlichung final bestätigt.

Ein kleiner Barista-Automat als zwei Versionen: einmal aus dem Unterricht, einmal als
Weiterführung, bei der ich als Product Owner mit [Claude](https://claude.ai) als Entwickler
zusammengearbeitet habe. Der eigentliche Showcase hier ist weniger die App selbst als der
**Prozess dahinter** — wie ich Anforderungen formuliert, Entscheidungen getroffen, getestet und
KI als Entwicklungswerkzeug gezielt eingesetzt habe.

## Ehrlich gesagt: wer hat was gemacht?

- **Ich:** Anforderungen, Produktentscheidungen (Getränke, Preise, Fehlerverhalten, Layout, ...),
  Priorisierung, Testen der Ergebnisse, Feedback und Änderungswünsche.
- **Claude:** Technische Umsetzung basierend auf meinen Entscheidungen — Code, Komponentenstruktur,
  Implementierungsvorschläge.

Ich habe **nicht** den gesamten Code allein geschrieben. React, TypeScript und Vite waren für mich
vor diesem Projekt komplett neu — bewusst gewählt, um zu zeigen, wie ich mich mit KI-Unterstützung
gezielt in unbekanntes technisches Terrain vorwage, nicht um vorzutäuschen, ich sei darin bereits
erfahren.

## Zwei Versionen

| | `unterrichtsversion/` | `showcase/` |
|---|---|---|
| Entstanden | im Unterricht | danach, in Eigeninitiative |
| Tech-Stack | Vanilla JS/CSS/HTML | React + TypeScript + Vite |
| Autor:in | ich, allein | ich (Anforderungen/Entscheidungen/Tests) + Claude (Umsetzung) |
| Status | unverändert als Referenz | aktiv erweitert |

Die fachliche Grundlage (Zustandsmaschine, Getränke, Preisberechnung, Fehlerlogik) ist in beiden
Versionen identisch — nur die technische Umsetzung unterscheidet sich.

## Die eigentlichen Beweisstücke

Der Code allein zeigt nicht, wie er entstanden ist. Interessanter sind:

- [`ENTSCHEIDUNGSPROTOKOLL.md`](./ENTSCHEIDUNGSPROTOKOLL.md) — jede Produktentscheidung
  dokumentiert: welche Optionen standen zur Debatte, was wurde entschieden, warum, und was kam
  danach beim Testen heraus.
- [`showcase/GRENZFAELLE_UND_TESTIDEEN.md`](./showcase/GRENZFAELLE_UND_TESTIDEEN.md) — Grenzfälle
  und Testideen, die während der Entwicklung aufgefallen sind.

## Ausprobieren

```bash
cd showcase
npm install
npm run dev
```

Tests laufen mit `npm test`, Linting mit `npm run lint`, Produktions-Build mit `npm run build`
(alles innerhalb von `showcase/`). Ein GitHub-Actions-Workflow prüft das bei jedem Push automatisch
(siehe [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)).

Die `unterrichtsversion/` braucht keine Installation — `index.html` direkt im Browser öffnen.

## Lizenz

MIT, siehe [`LICENSE`](./LICENSE).
