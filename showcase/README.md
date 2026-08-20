# Barista-Automat – Showcase (React + TypeScript + Vite)

Die "Vollgas"-Variante des Barista-Automat-Projekts: eine React/TypeScript/Vite-Umsetzung, die
bewusst über die einfache `unterrichtsversion` (Vanilla JS) im Projekt-Root hinausgeht.

Kontext, Rollenverteilung und Entstehungsgeschichte stehen im [Root-README](../README.md).
Alle fachlichen und technischen Entscheidungen (inkl. UI-Feinschliff) sind in
[`../ENTSCHEIDUNGSPROTOKOLL.md`](../ENTSCHEIDUNGSPROTOKOLL.md) dokumentiert.
Offene Grenzfälle und Testideen: [`GRENZFAELLE_UND_TESTIDEEN.md`](./GRENZFAELLE_UND_TESTIDEEN.md).

## Projektstruktur

- `src/components/` – UI-Komponenten (`StatusBar`, `PowerButton`, `DrinkSelector`, `DrinkArt`,
  `ZubereitungsAnzeige`, `InventoryPanel`, `DayOverviewPanel`, `HinweiseListe`, …)
- `src/logic/` – reine Zustandslogik (Reducer, Preisberechnung, Rezept-Skalierung)
- `src/data/` – Getränke- und Konfigurationsdaten
- `src/assets/` – Bildmaterial (Logo, Kaffeebohnen-Hintergrund, Getränke-/Zutaten-Icons)

## Layout (Stand Runde 10)

Getränkeauswahl auf voller Breite direkt unter dem Header; Vorrat und Tagesüberblick darunter
nebeneinander (auf schmalen Bildschirmen untereinander gestapelt). Der Ein-/Ausschalten-Button
sitzt groß unterhalb des Tagesüberblicks; der Header zeigt nur noch den zentrierten Status ("Aus"
rot, "Bereit" grün hinterlegt). Die Zubereitungsanzeige erscheint während einer laufenden
Zubereitung in der Fußzeile der Getränkeauswahl, zwischen Preis und Bestellen-Button.

## Entwicklung starten

```bash
npm install
npm run dev
```

Weitere Skripte: `npm test` (Vitest), `npm run lint` (Oxlint), `npm run build` (Typecheck + Vite-Build).
