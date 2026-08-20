# Barista-Automat – Showcase (React + TypeScript + Vite)

Dies ist die "Vollgas"-Variante des Barista-Automat-Projekts: eine React/TypeScript/Vite-Umsetzung, die bewusst über die einfache `unterrichtsversion` (Vanilla JS) hinausgeht, um aktuelle Marktkompetenz (Komponenten, Hooks, Typsystem) zu zeigen.

Die fachliche Grundlage (Zustandsmaschine, 5 Getränke × 5 Vorratsarten, Preisberechnung, Fehlerlogik) ist identisch zur `unterrichtsversion` im Projekt-Root – nur die technische Umsetzung unterscheidet sich.

## Warum React/TS/Vite statt Vanilla?

Siehe [`../ENTSCHEIDUNGSPROTOKOLL.md`](../ENTSCHEIDUNGSPROTOKOLL.md) für die vollständige Begründung aller fachlichen und technischen Entscheidungen (inkl. UI-Feinschliff wie `DrinkArt`-Vorschaubilder, Extras-Buttons, StatusBar-Redesign).

Offene Grenzfälle und Testideen: [`GRENZFAELLE_UND_TESTIDEEN.md`](./GRENZFAELLE_UND_TESTIDEEN.md).

## Projektstruktur

- `src/components/` – UI-Komponenten (`StatusBar`, `DrinkSelector`, `DrinkArt`, `InventoryPanel`, …)
- `src/assets/` – Bildmaterial (Logo, Kaffeebohnen-Hintergrund, Getränke-/Zutaten-Icons als PNG)

## Entwicklung starten

```bash
npm install
npm run dev
```

---

## Vite-Template-Hinweise

Dieses Projekt basiert auf dem React + TypeScript + Vite Starter-Template mit HMR und Oxlint-Regeln.

Offiziell verfügbare Plugins:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) nutzt [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) nutzt [SWC](https://swc.rs/)

### React Compiler

Der React Compiler ist in diesem Template wegen der Auswirkung auf Dev-/Build-Performance nicht aktiviert. Siehe [Dokumentation](https://react.dev/learn/react-compiler/installation) zur Aktivierung.

### Oxlint-Konfiguration erweitern

Für produktive Anwendungen empfiehlt sich typsicheres Linting via `oxlint-tsgolint` und `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

Siehe [Oxlint-Regeldokumentation](https://oxc.rs/docs/guide/usage/linter/rules) für die vollständige Liste.
