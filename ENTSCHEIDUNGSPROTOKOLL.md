# Entscheidungs- und Änderungsprotokoll

Dieses Protokoll dokumentiert die Produktentscheidungen für die Showcase-Version des Barista-Automaten: welche Anforderung/Idee jeweils zur Debatte stand, welche Alternativen betrachtet wurden, welche Entscheidung getroffen wurde und warum. Später ergänzt um Testergebnisse und daraus resultierende Änderungswünsche.

## Runde 1 – Grundlegende Produktentscheidungen

### 1. Getränkeauswahl und Zutaten

**Frage:** Welche Getränke soll der Automat anbieten?

**Optionen:**
- Klein: Espresso, Latte, Cappuccino (nur Wasser/Kaffee/Milch)
- Mittel: + Americano, Macchiato (weiterhin nur Wasser/Kaffee/Milch)
- Erweitert: Basis-Getränke + Sirup/Zucker als optionale Zusatzstoffe (neue Vorratskategorie)

**Entscheidung:** Erweitert – Basis-Getränke plus Sirup/Zucker als optionale Extra-Zutat.

**Begründung:** Höchster Realismus, zeigt Umgang mit optionalen Komponenten und einer zusätzlichen Vorratskategorie.

**Offen:** Genaue Basis-Getränkeliste (klein/mittel/groß) wird in Runde 2 festgelegt.

### 2. Größensystem

**Frage:** Wie soll das Größensystem funktionieren?

**Optionen:**
- Zwei Größen (Normal/Groß)
- Drei Größen (S/M/L) mit prozentualer Skalierung
- Keine Größenauswahl

**Entscheidung:** Drei Größen (S/M/L) mit prozentualer Skalierung der Zutatenmengen.

**Begründung:** Klassisches Café-Schema, guter Realismus und gute Preis-Staffelung.

### 3. Maschinenzustände

**Frage:** Welche Zustände soll die Maschine besitzen?

**Optionen:**
- Minimal: Aus, Aufheizen, Bereit, Zubereitung
- Erweitert: + eigener Fehler-Zustand
- Vollständig: + Wartung/Reinigung

**Entscheidung:** Erweitert – eigener Fehler-Zustand zusätzlich zu Aus, Aufheizen, Bereit, Zubereitung.

**Begründung:** Sauberer für Testfälle wie "Bedienung im Fehlerzustand", klarere Zustandsübergänge als eine reine Fehlermeldung im Zustand "Bereit".

### 4. Aufheizvorgang

**Frage:** Wie soll der Aufheizvorgang funktionieren?

**Optionen:**
- Feste Dauer mit Fortschrittsbalken
- Dauer abhängig von Temperaturdifferenz
- Kurze Verzögerung ohne Fortschrittsbalken

**Entscheidung:** Zunächst keine Verzögerungszeit einbauen (abweichend von den vorgeschlagenen Optionen).

**Begründung:** Bewusste Vereinfachung für den ersten Entwicklungsstand. Kann bei Bedarf später als Erweiterung nachgerüstet werden.

## Runde 2 – Getränkeliste und Zutaten

### 1. Basis-Getränkeliste

**Frage:** Welche Getränke soll die Showcase-Version konkret anbieten?

**Optionen:**
- 3 Kern-Getränke: Espresso, Latte, Cappuccino
- 5 Getränke: + Americano, Macchiato
- 5 + 1 Sonderfall-Getränk (z. B. ohne Kaffee)
- Eigene Liste

**Entscheidung:** 5 Getränke – Espresso, Latte, Cappuccino, Americano, Macchiato.

**Begründung:** Deckt unterschiedliche Zutatenverhältnisse gut ab (z. B. Americano ohne Milch, Macchiato mit wenig Milch), liefert mehr Testfälle als nur 3 Getränke.

### 2. Zutatenmengen je Getränk (Basis Größe M)

**Frage:** Aus welchen Zutaten und Mengen bestehen die Getränke, bevor die S/M/L-Skalierung angewendet wird?

**Entscheidung (eigene Werte des Nutzers):**

| Getränk | Wasser | Kaffee | Milch | Sirup/Zucker |
|---|---|---|---|---|
| Espresso | 30 ml | 18 g | 0 ml | optional |
| Americano | 150 ml | 18 g | 0 ml | optional |
| Macchiato | 30 ml | 18 g | 15 ml | optional |
| Cappuccino | 40 ml | 18 g | 120 ml | optional |
| Latte | 40 ml | 18 g | 210 ml | optional |

**Begründung:** Alle Getränke bauen auf einem Espresso-Shot (Wasser+Kaffee) auf; Milchmenge steigt Macchiato → Cappuccino → Latte, sodass Größenskalierung und Vorratswarnungen unterschiedlich stark greifen. Americano ersetzt Milch durch Wasser und dient als Testfall "kein Milchgetränk".

### 3. Volumenlogik bei Größenskalierung

**Frage:** Soll jedes Getränk seine eigene Basismenge behalten (Espresso bleibt klein) oder sollen alle Getränke bei Größe M ein ähnliches Gesamtvolumen erreichen?

**Optionen:**
- Eigene Basismenge je Getränk (Espresso bleibt klein)
- Ähnliches Gesamtvolumen für alle Getränke bei M

**Entscheidung:** Eigene Basismenge je Getränk.

**Begründung:** Realistischer – ein Espresso soll klein bleiben statt künstlich verdünnt zu werden. S/M/L bedeutet dadurch je Getränk eine andere ml-Spanne, was für ein Automatenmodell akzeptabel ist.

### 4. Sirup/Zucker-Dosierung

**Frage:** Wie wird die optionale Sirup/Zucker-Menge dosiert und mit der Größe verrechnet?

**Optionen:**
- Feste Portion, an/aus, ohne Größenskalierung
- Feste Portion, an/aus, mit Größenskalierung (wie die anderen Zutaten prozentual skaliert)
- Wählbare Anzahl Portionen ("Pumps")

**Entscheidung:** Feste Portion, mit Größenskalierung.

**Begründung:** Konsistent mit der restlichen Rezeptlogik (alle Zutaten werden gleich behandelt und prozentual mit S/M/L skaliert); einfacher als eine Pump-Anzahl-Auswahl, aber realistischer als eine größenunabhängige Fixmenge.

### 5. S/M/L-Skalierung der Zutatenmengen

**Frage:** Wie stark unterscheiden sich die Zutatenmengen zwischen S, M und L?

**Optionen:**
- Moderat: 80% / 100% / 130%
- Stark: 70% / 100% / 150%
- Eigene Prozentwerte

**Entscheidung:** Stark – 70% (S) / 100% (M) / 150% (L).

**Begründung:** Deutlicherer, klassischer Café-Unterschied zwischen den Größen statt eines nur leicht spürbaren Unterschieds.

### 6. Sirup/Zucker-Basismenge

**Frage:** Wie hoch ist die Sirup/Zucker-Menge bei Größe M (bevor S/M/L-Skalierung angewendet wird)?

**Optionen:**
- 10 ml Sirup / 5 g Zucker
- 20 ml Sirup / 10 g Zucker
- Eigener Wert

**Entscheidung:** 10 ml Sirup / 5 g Zucker (bei M, wird wie andere Zutaten mit 70/100/150% skaliert).

### 7. Preismodell

**Frage:** Wie setzen sich die Preise pro Getränk und Größe zusammen?

**Optionen:**
- Grundpreis + fester Größenaufschlag
- Grundpreis + prozentualer Aufschlag
- Eigene Preistabelle je Getränk/Größe

**Entscheidung:** Grundpreis (Größe M) + fester Größenaufschlag, gleich für alle Getränke.

**Begründung:** Einfach zu pflegen und nachvollziehbar, keine Rundungsprobleme wie bei prozentualem Aufschlag auf Cent-Beträge.

### 8. Konkrete Preise

**Entscheidung:**

| Getränk | Grundpreis (M) |
|---|---|
| Espresso | 2,20 € |
| Americano | 2,60 € |
| Macchiato | 2,80 € |
| Cappuccino | 3,20 € |
| Latte | 3,50 € |

Größenaufschlag: S = −0,30 €, L = +0,40 €. Sirup/Zucker-Aufpreis: fester Betrag +0,50 € (unabhängig von Getränk/Größe).

**Offen:** Vorratsverwaltung (maximale Kapazität je Vorratsart, Warnschwellen), Zustände/UI-Detailverhalten, Kassenbon-Aufbau, Fehler-/Sonderfälle werden in weiteren Runden festgelegt.

## Runde 3 – Vorratsverwaltung

### 1. Maximale Vorratskapazität

**Frage:** Wie groß soll der maximale Vorrat je Vorratsart sein?

**Optionen:**
- Realistischer Tagesvorrat (reicht für ~20–30 Getränke)
- Kleiner Demo-Vorrat (reicht für ~5–8 Getränke)
- Eigene Werte

**Entscheidung:** Kleiner Demo-Vorrat mit eigenen Werten des Nutzers:

| Vorratsart | Max. Kapazität |
|---|---|
| Wasser | 1000 ml |
| Kaffee | 150 g |
| Milch | 750 ml |
| Sirup | 100 ml |
| Zucker | 100 g |

**Begründung:** Kleiner Vorrat lässt leeren Vorrat, Warnungen und Nachfüllen in der Showcase/Demo schnell vorführen und testen, statt lange auf einen niedrigen Füllstand warten zu müssen.

### 2. Warn- und Sperrschwelle

**Frage:** Ab welchem Füllstand erscheint eine Warnung, und wann darf ein Getränk nicht mehr zubereitet werden?

**Optionen:**
- Warnung bei 20% der maximalen Kapazität, Sperre nur wenn die konkret benötigte Menge für Getränk/Größe nicht mehr reicht
- Warnung bei 20%, zusätzlich fester Sperrpuffer bei 10% (unabhängig von der konkreten Bestellung)
- Eigene Schwellenwerte

**Entscheidung:** Warnung bei 20% der maximalen Kapazität; Sperre der Zubereitung erst, wenn die für die konkrete Bestellung (Getränk × Größe) benötigte Menge einer Zutat nicht mehr im Vorrat vorhanden ist (exakte Prüfung je Bestellung, kein fester Sicherheitspuffer).

**Begründung:** Realistischste Prüfung – der Automat verweigert eine Bestellung erst dann, wenn sie tatsächlich nicht mehr zubereitet werden kann, statt vorsorglich schon bei einem pauschalen Restwert zu sperren.

### 3. Nachfüll-Mechanik

**Frage:** Wie soll das Nachfüllen der Vorräte funktionieren?

**Optionen:**
- Ein Klick pro Vorratsart auf 100%
- Frei wählbare Nachfüllmenge
- Ein Klick "Alles nachfüllen"

**Entscheidung:** Ein Klick pro Vorratsart, füllt jeweils auf die maximale Kapazität auf.

**Begründung:** Einfachste Bedienung, entspricht einem Servicetechniker, der einen vollen Behälter einsetzt; erlaubt trotzdem gezieltes Testen einzelner Vorratsarten (im Gegensatz zu "Alles nachfüllen").

### 4. Nachfüll-Zugriff nach Maschinenzustand

**Frage:** Wer darf nachfüllen und in welchem Maschinenzustand?

**Optionen:**
- Jederzeit möglich, außer während Zubereitung
- Nur im Zustand "Bereit"
- Immer möglich, auch während Zubereitung

**Entscheidung:** Jederzeit möglich (Aus, Aufheizen, Bereit, Fehler), außer während eine Zubereitung läuft.

**Begründung:** Verhindert Dateninkonsistenz mitten im Brauvorgang, erlaubt aber z. B. das Beheben eines Fehlerzustands (leerer Vorrat) durch sofortiges Nachfüllen.

## Runde 4 – Zustände im Detail

### 1. Auslöser für den Fehler-Zustand

**Frage:** Was genau soll den Fehler-Zustand auslösen?

**Optionen:**
- Nur eine fehlgeschlagene Bestellung (leerer Vorrat allein löst noch nichts aus)
- Automatisch bei leerem Vorrat (auch ohne Bestellversuch)
- Beides auslösend

**Entscheidung:** Beides – sowohl eine fehlgeschlagene Bestellung (Zutat reicht nicht) als auch ein automatisch auf 0 gefallener Vorrat lösen den Fehler-Zustand aus.

**Begründung:** Deckt beide realistischen Situationen ab und liefert mehr Testfälle (Fehler durch Bestellversuch vs. Fehler direkt nach Verbrauch der letzten Einheit).

### 2. Verlassen des Fehler-Zustands

**Frage:** Wie verlässt die Maschine den Fehler-Zustand wieder?

**Optionen:**
- Automatisch nach ausreichendem Nachfüllen
- Nachfüllen + zusätzlicher manueller Reset-Button

**Entscheidung:** Automatisch – sobald die betroffene(n) Zutat(en) ausreichend nachgefüllt wurden, wechselt die Maschine automatisch zurück zu "Bereit".

**Begründung:** Kein unnötiger Zusatzschritt; das Nachfüllen selbst ist bereits die behebende Handlung.

### 3. Bestellversuch während Aufheizen/Zubereitung

**Frage:** Was passiert, wenn ein Kunde während "Aufheizen" oder "Zubereitung" ein Getränk bestellen will?

**Optionen:**
- Bestellbuttons deaktiviert + Hinweistext
- Buttons bleiben aktiv, Bestellung wird per Fehlermeldung abgewiesen

**Entscheidung:** Bestellbuttons deaktiviert (ausgegraut/nicht klickbar) + Hinweistext ("Maschine heizt auf..." bzw. "Zubereitung läuft...").

**Begründung:** Verhindert den Fehlerfall bereits auf UI-Ebene, klar verständlich für den Nutzer.

### 4. Einschalten / Übergang Aus → Aufheizen → Bereit

**Frage:** Wie startet der Übergang von "Aus" zu "Bereit", und was passiert bei Bestellversuch im Zustand "Aus"?

**Optionen:**
- Ein/Aus-Taste startet Aufheizen; Bestellung im Zustand "Aus" nicht möglich (Buttons deaktiviert wie bei Aufheizen/Zubereitung)
- Bestellung startet automatisch das Einschalten (Aufheizen → Bereit → Zubereitung des gewählten Getränks)

**Entscheidung:** Ein/Aus-Taste startet den Übergang zu "Aufheizen" und danach automatisch zu "Bereit". Im Zustand "Aus" sind die Bestellbuttons ebenso deaktiviert wie während Aufheizen/Zubereitung.

**Begründung:** Konsistent mit Entscheidung 3 (Buttons deaktiviert statt Bestellung abzuweisen); einfacherer, expliziterer Ablauf ohne impliziten Nebeneffekt einer Bestellung.

## Runde 5 – Zubereitungsanzeige

### 1. Angezeigte Informationen während der Zubereitung

**Frage:** Welche Informationen sollen während der Zubereitung angezeigt werden?

**Optionen:**
- Fortschrittsbalken + Getränkename
- Fortschrittsbalken + Einzelschritte (z. B. "Wasser wird erhitzt" → "Kaffee wird gebrüht" → "Milch wird aufgeschäumt")
- Nur einfacher Ladehinweis ohne Fortschrittsbalken

**Entscheidung:** Fortschrittsbalken (0–100%) + Text mit Getränkename/Größe, z. B. "Bereite Cappuccino (M) zu...".

**Begründung:** Deckt den Kern-Testfall "Bedienung während Zubereitung" gut ab, ohne zusätzliche Zustandslogik für Einzelschritte.

### 2. Zubereitungsdauer

**Frage:** Wie lange dauert eine Zubereitung, und hängt das vom Getränk/Größe ab?

**Optionen:**
- Feste Dauer für alle Getränke
- Dauer abhängig von Getränk/Größe

**Entscheidung:** Feste Dauer von 5 Sekunden für alle Getränke und Größen.

**Begründung:** Einfach umzusetzen, reicht aus, um den Testfall "Bedienung während Zubereitung" nachzuvollziehen.

## Runde 6 – Kassenbon ersetzt durch Tagesüberblick

### 1. Grundsatzentscheidung: kein Einzelbon

**Frage:** Was soll der Kassenbon nach einer Bestellung enthalten?

**Entscheidung:** Kein Kassenbon/Beleg pro Bestellung. Stattdessen wird ein laufender Tagesüberblick über Verbrauch und Einnahmen geführt.

**Begründung:** Abweichung vom ursprünglich vorgeschlagenen Funktionsumfang ("Preise und Kassenbon") auf ausdrücklichen Wunsch des Nutzers – Bonerstellung pro Bestellung wird als nicht nötig erachtet, ein aggregierter Überblick ist wichtiger.

### 2. Inhalt des Verbrauchs-Trackings

**Frage:** Was genau soll bei "Verbrauch" im Tagesüberblick stehen?

**Optionen:**
- Verbrauchte Zutatenmengen gesamt je Vorratsart
- Anzahl verkaufter Getränke je Sorte/Größe
- Beides

**Entscheidung:** Verbrauchte Zutatenmengen gesamt je Vorratsart (z. B. insgesamt X ml Wasser, X g Kaffee, X ml Milch, X ml Sirup, X g Zucker verbraucht), plus Einnahmen (Summe der Preise) seit letztem Reset.

**Begründung:** Direkt aus den Bestellungen ableitbar, guter Testfall für "Vorräte korrekt reduziert" über mehrere Bestellungen hinweg.

### 3. Reset-Zeitpunkt

**Frage:** Wann wird der Tagesüberblick (Verbrauch/Einnahmen) zurückgesetzt?

**Optionen:**
- Automatisch beim Ausschalten der Maschine
- Manueller "Zurücksetzen"-Button
- Nie automatisch, läuft dauerhaft

**Entscheidung:** Manueller "Zurücksetzen"-Button, unabhängig vom Ein/Aus-Zustand der Maschine.

**Begründung:** Expliziter Schritt statt impliziertem Verhalten beim Ausschalten; Verbrauch/Einnahmen sollen bewusst zurückgesetzt werden, nicht als Nebeneffekt eines anderen Vorgangs.

## Runde 7 – UI-Layout und verbleibende Sonderfälle

### 1. Grundlegender UI-Aufbau

**Frage:** Wie soll die Benutzeroberfläche grundlegend aufgebaut sein?

**Optionen:**
- Ein Bildschirm mit klaren Bereichen (Status/Ein-Aus, Getränke-/Größenauswahl + Zubereitungsanzeige, Vorratsanzeige + Nachfüllen + Tagesüberblick)
- Zwei Ansichten: Kunde vs. Techniker/Admin, umschaltbar
- Eigener Vorschlag

**Entscheidung:** Ein Bildschirm mit klaren Bereichen – kein Ansichtswechsel.

**Begründung:** Alles auf einen Blick, kein Seitenwechsel nötig, günstig für responsive Darstellung (einer der Basisanforderungen).

### 2. Mehrfachbestellung/Warteschlange

**Bereits implizit entschieden:** Da die Bestellbuttons während "Zubereitung" deaktiviert sind (Runde 4, Entscheidung 3), ist keine Warteschlange möglich – es kann immer nur eine Bestellung gleichzeitig in Bearbeitung sein.

### 3. Sirup/Zucker-Vorrat reicht nicht, Basis-Zutaten aber schon

**Frage:** Was passiert, wenn Sirup/Zucker gewählt ist, aber der Sirup-/Zucker-Vorrat nicht reicht, während Wasser/Kaffee/Milch noch ausreichen?

**Optionen:**
- Ganze Bestellung wird blockiert (gleiche Regel wie bei jeder anderen Zutat)
- Getränk wird ohne Sirup/Zucker zubereitet, mit Hinweis an den Kunden

**Entscheidung:** Getränk wird trotzdem zubereitet, aber ohne den nicht verfügbaren Zusatz – mit Hinweistext ("Sirup aktuell nicht verfügbar, Getränk wird ohne zubereitet").

**Begründung:** Kundenfreundlicher als eine komplette Ablehnung nur wegen eines optionalen Zusatzstoffs; Sonderregel gilt explizit nur für die optionalen Zutaten Sirup/Zucker, nicht für die Basis-Zutaten Wasser/Kaffee/Milch.

**Offen:** Weitere Sonderfälle nach Bedarf; danach Übergang in die Implementierungsphase (showcase/).

## Runde 8 – Technische Basis der Showcase-Version

### 1. Tech-Stack

**Frage:** Mit welcher technischen Basis wird `showcase/` umgesetzt?

**Optionen:**
- Vanilla HTML/CSS/JS (wie unterrichtsversion/, sauberer strukturiert)
- TypeScript + Vite, kein Framework
- React + TypeScript + Vite

**Entscheidung:** React + TypeScript + Vite.

**Begründung:** Der Nutzer möchte bewusst ein "Vollgas"-Showcase, das aktuelle Marktkompetenz zeigt (Komponenten, Hooks, Typsystem) statt sich nur an der unterrichtsversion zu orientieren. Der Funktionsumfang (4 Maschinenzustände, 5 Getränke × 5 Vorratsarten, Tagesüberblick, Fehlerlogik) profitiert von Typsicherheit und Komponentenstruktur; der einzige Vorteil von Vanilla (Nähe zum Original) ist bewusst gewollter Kontrast, kein Muss. Der Nutzer selbst schreibt den React-Code nicht mit, testet aber die laufende Anwendung im Browser.

## Runde 9 – UI-Feinschliff nach erster lauffähiger Version

Nachträglich dokumentiert (Umsetzung erfolgte direkt im Code, ohne vorherige Options-Diskussion – wird hier für die Nachvollziehbarkeit ergänzt).

### 1. Getränke-Vorschaubild

**Frage:** Wie lässt sich das gewählte Getränk in der Auswahl visuell erkennbar machen, statt nur als Textname in der Buttonleiste?

**Entscheidung:** Neue Komponente `DrinkArt` – je Getränk ein PNG-Bild aus `showcase/src/assets/drinks/` (espresso, americano, macchiato, cappuccino, latte). Wird in `DrinkSelector` rechts neben Größe/Extras als eigene Vorschau-Spalte mit Getränkename angezeigt; auf schmalen Bildschirmen (< 520px) rutscht die Vorschau unter die Auswahl. Ebenso als PNG umgesetzt: das Logo in der `StatusBar` (`barista-automat-logo.png`), der Kaffeebohnen-Hintergrund im Kopfbereich (`coffee-beans-header.jpg`) sowie die Sirup-/Zucker-Icons im `InventoryPanel` (`sirup.png`, `zucker.png`).

**Begründung:** Rein visuelle Verbesserung der Wiedererkennbarkeit, keine Auswirkung auf Logik/Zustände. Statt Inline-SVG wurden fertige PNG-Bilddateien verwendet (einfacher umzusetzen, realistischere Optik); dafür sind Farben dieser Elemente nicht mehr über CSS-Variablen themefähig, sondern fix im Bildmaterial.

### 2. Extras als Buttons statt Checkboxen

**Frage:** Wie sollen die optionalen Extras (Sirup/Zucker) in der Oberfläche auswählbar sein?

**Entscheidung:** Umstellung von Checkbox+Label auf Toggle-Buttons (wie bei der Größenauswahl), mit `aria-pressed` und direkter Anzeige des Aufpreises (`+0,50 €`) auf dem Button selbst.

**Begründung:** Einheitlicheres Bedienkonzept (Größe und Extras sehen/funktionieren gleich), Aufpreis ist ohne Nachschlagen sofort sichtbar, größere Klickfläche als bei einer kleinen Checkbox.

### 3. Optisches Redesign StatusBar und Hintergrund

**Entscheidung:** Kopfbereich (`StatusBar`) erhält einen dekorativen Verlaufshintergrund mit Kaffeebohnen-Muster (SVG-Pattern) statt einfarbiger Fläche, größere Titel-/Symbolschrift, zentriertes Layout. Seitenhintergrund (`index.css`) erhält einen leichten Farbverlauf (`--bg` → neue Variable `--bg-2`) statt Flächenfarbe, in Hell- und Dunkelmodus jeweils eigene Werte.

**Begründung:** Rein gestalterische Auflockerung des ersten lauffähigen Standes, keine funktionale Änderung; Farben weiterhin über CSS-Variablen gepflegt, damit Light/Dark-Mode konsistent bleiben.

**Hinweis:** Alle drei Punkte sind reine UI-Änderungen ohne Auswirkung auf Zustandsmaschine, Preisberechnung oder Vorratslogik – bestehende Testfälle aus Runde 1–7 bleiben unverändert gültig.

## Runde 10 – Layout-Iteration nach Live-Test der ersten Version

Wie Runde 9 nachträglich dokumentiert: Umsetzung erfolgte direkt im Code anhand konkreter Rückmeldungen beim Testen der laufenden Anwendung im Browser, nicht als vorab diskutierte Optionsauswahl.

### 1. Vorrats-Icons vervollständigt

**Entscheidung:** Die bisher fehlenden Icons für Wasser, Kaffee und Milch (`wasser.png`, `kaffee.png`, `milch.png`) wurden ergänzt und im `InventoryPanel` genauso eingebunden wie die bereits vorhandenen Sirup-/Zucker-Icons. Damit hat jede der 5 Vorratsarten ein Bild.

### 2. Grundlayout neu geordnet

**Entscheidung:** Die Getränkeauswahl (`DrinkSelector`) liegt jetzt auf voller Breite direkt unter dem Header (vorher: linke Spalte einer Zweispalten-Ansicht). Ihre Innenelemente (Getränke-Buttons, Vorschaubild, Größen-/Extras-Buttons, Preis/Bestellen) wurden entsprechend hochskaliert, um die gewonnene Breite sinnvoll zu nutzen. Vorrat und Tagesüberblick stehen darunter nebeneinander in einer zweispaltigen Reihe (Container-Breite dafür von 1100px auf 1280px erweitert). Auf schmalen Bildschirmen (< 760px) stapeln sich Vorrat/Tagesüberblick weiterhin untereinander.

**Begründung:** Rein gestalterische Neugewichtung – die Getränkeauswahl ist die primäre Interaktion und bekommt entsprechend mehr Raum; Vorrat/Tagesüberblick sind nachgelagerte Infoflächen.

### 3. Bündige Ausrichtung der Auswahl-Elemente

**Entscheidung:** Getränke-Buttons, Größen-Buttons (S/M/L) und die Sirup-/Zucker-Buttons sind jetzt alle einheitlich 64px hoch. Das Getränke-Grid nutzt `auto-fit` statt `auto-fill`, damit keine unsichtbare leere Spalte mehr Platz wegnimmt und die 5 Buttons bündig bis zum rechten Rand reichen (bündig mit Größe/Extras darunter). Die Extras (Sirup/Zucker) stehen jetzt untereinander statt nebeneinander, jeweils über die volle verfügbare Breite. Das Getränke-Vorschaubild wurde minimal gekürzt (158px → 144px Höhe, per `object-fit: cover` zugeschnitten statt verzerrt), damit sein unterer Rand exakt mit dem unteren Rand des Zucker-Buttons abschließt.

**Begründung:** Rein optische Aufräumarbeit auf ausdrücklichen Wunsch, damit die Fläche aufgeräumter wirkt und der verfügbare Platz besser genutzt wird; keine funktionale Änderung. Der Bildzuschnitt betrifft alle 5 Getränkebilder gleichermaßen (alle im Ausgangsformat 700×700px quadratisch), daher kein ungleichmäßiger Effekt zwischen den Getränken.

### 4. Ein/Aus-Bedienung aus dem Header gelöst

**Entscheidung:** Der Header (`StatusBar`) zeigt nur noch das zentrierte Status-Badge (Aus/Aufheizen/Bereit/Zubereitung/Fehler), keinen Button mehr. Der Ein-/Ausschalt-Button wurde in eine neue, eigenständige Komponente `PowerButton` ausgelagert und erscheint jetzt groß unterhalb des Tagesüberblicks. Die Statusfarbe für "Aus" wurde von neutral/beige auf Rot umgestellt (analog zur bisherigen Grünfärbung von "Bereit"), in Hell- und Dunkelmodus jeweils eigene Werte in `index.css`.

**Begründung:** Klarere Trennung zwischen reiner Statusanzeige (Header) und Bedienelement (Power-Button); Rot für "Aus" macht den Maschinenzustand auf einen Blick erkennbar, ohne den Label-Text lesen zu müssen.

### 5. Zubereitungsanzeige in die Fußzeile der Getränkeauswahl verschoben

**Entscheidung:** Die während der Zubereitung sichtbare Fortschrittsanzeige (`ZubereitungsAnzeige`) ist keine eigenständige Karte mehr unterhalb der Getränkeauswahl, sondern sitzt jetzt in der Fußzeile des `DrinkSelector`, zwischen Preisanzeige und Bestellen-Button (füllt dort den verfügbaren Platz als kompakte horizontale Leiste mit Text, Fortschrittsbalken und Prozentwert). Auf schmalen Bildschirmen (< 640px) rutscht sie in eine eigene volle Zeile unterhalb von Preis/Button.

**Begründung:** Räumliche Nähe zur Bestellung, an der sie inhaltlich hängt, statt als separater Block weiter unten auf der Seite.

**Hinweis:** Alle fünf Punkte sind reine UI-/Layout-Änderungen ohne Auswirkung auf Zustandsmaschine, Preisberechnung oder Vorratslogik – bestehende Testfälle aus Runde 1–7 bleiben unverändert gültig.
