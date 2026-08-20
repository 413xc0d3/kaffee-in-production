# Grenzfälle und Testideen (Sammlung)

Diese Datei ist kein offizielles Testkonzept, sondern eine laufende Sammlung von Grenz- und Testfällen, die während der Anforderungsklärung und der Entwicklung der Showcase-Version auffallen. Die endgültige, systematische Testfallliste legt der Projektverantwortliche später im eigentlichen Softwareprojekt fest.

Format je Eintrag: Woher (Runde/Ort im Code), Beobachtung, ggf. offene Frage.

## Aus der Anforderungsphase (ENTSCHEIDUNGSPROTOKOLL.md)

- **Happy Path je Getränk:** Alle 5 Getränke (Espresso, Americano, Macchiato, Cappuccino, Latte) bei ausreichendem Vorrat bestellen.
- **Vorrat knapp, aber ausreichend:** Bestellung, bei der eine Zutat exakt bis auf 0 reicht (Grenzfall exakte Prüfung, Runde 3).
- **Vorrat reicht nicht:** je Zutat (Wasser, Kaffee, Milch) separat prüfen, ob die richtige Zutat als Ursache erkannt/gemeldet wird.
- **Milchgetränk vs. Americano:** Milchvorrat leer → Americano weiterhin bestellbar, alle anderen 4 Getränke nicht (Kontrasttest, Runde 2/3).
- **Größenskalierung:** gleiche Bestellung in S/M/L → Zutatenverbrauch und Preis korrekt mit 70/100/150 % bzw. Grundpreis ± Aufschlag.
- **Sirup/Zucker knapp:** Basis-Zutaten reichen, Sirup/Zucker-Vorrat nicht → Getränk wird ohne Zusatz zubereitet, Hinweistext erscheint (Runde 7).
- **Fehler-Auslöser doppelt testen:** einmal durch fehlgeschlagene Bestellung, einmal durch automatisches Erreichen von 0 nach einer (noch erfolgreichen) Bestellung (Runde 4).
- **Fehler-Zustand verlassen:** nach Nachfüllen der betroffenen Zutat(en) automatisch zurück zu "Bereit", ohne zusätzlichen Reset-Klick.
- **Bedienung während Aufheizen/Zubereitung/Aus:** Bestellbuttons in allen drei Zuständen deaktiviert + passender Hinweistext – je Zustand einzeln prüfen.
- **Nachfüllen während Zubereitung:** sollte nicht möglich sein (einziger Zustand mit Nachfüll-Sperre, Runde 3).
- **Nachfüllen im Fehler-Zustand:** muss möglich sein und sollte den Fehler-Zustand automatisch beenden.
- **Mehrfachbestellung hintereinander:** kumulative Vorratsreduktion über mehrere Bestellungen korrekt (nicht nur Einzelbestellung).
- **Tagesüberblick-Summierung:** verbrauchte Mengen je Vorratsart und Einnahmen korrekt über mehrere Bestellungen aufsummiert.
- **Tagesüberblick-Reset:** Reset-Button setzt Verbrauch und Einnahmen auf 0, unabhängig vom Ein/Aus-Zustand der Maschine.
- **Responsive Darstellung:** UI auf kleinen Bildschirmgrößen weiterhin bedienbar (ein Bildschirm, keine Ansichten-Umschaltung, Runde 7).

## Während der Implementierung entdeckt

- **Aufpreis bei mehreren Extras gleichzeitig:** Runde 2.8 legt "+0,50 € (unabhängig von Getränk/Größe)" fest, klärt aber nicht, ob der Aufpreis pauschal oder je Extra gilt. Umgesetzt: 0,50 € **je tatsächlich zubereitetem Extra** (Sirup *und* Zucker gewählt und beide verfügbar → +1,00 €). Nicht verfügbare, entfallene Extras werden nicht berechnet.
- **Start-Vorratsfüllstand:** war nicht explizit entschieden. Umgesetzt: Maschine startet mit vollen Behältern (100 % aller Vorratsarten).
- **Rundung bei Größenskalierung:** Zutatenmengen werden nach Anwendung von 70/100/150 % auf ganze Zahlen gerundet (z. B. Kaffee 18 g × 70 % = 12,6 g → 13 g). Kann bei vielen Bestellungen zu minimalen Abweichungen in der Tagesüberblick-Summe gegenüber einer Berechnung ohne Rundung führen.
- **Bestellbuttons im Fehler-Zustand:** Runde 4.3 deaktiviert die Bestellbuttons explizit nur für Aufheizen/Zubereitung, Runde 4.4 zusätzlich für Aus. Für den Fehler-Zustand selbst gab es keine explizite Entscheidung. Umgesetzt: Bestellbuttons sind auch im Fehler-Zustand deaktiviert (konsistent mit den übrigen Nicht-Bereit-Zuständen), mit Hinweistext "Fehler: bitte Vorrat auffüllen."
- **Aufheizen ohne Verzögerung (Runde 1.4) vs. Testfall "Bedienung während Aufheizen":** Da der Übergang Aufheizen → Bereit bewusst ohne künstliche Wartezeit erfolgt, ist der Zustand "Aufheizen" im laufenden Betrieb nur für einen einzigen Render-Tick sichtbar und dadurch per Hand kaum klickbar zu testen (wohl aber automatisiert/im React-DevTools nachvollziehbar). Falls der Testfall manuell nachstellbar sein soll, müsste die spätere "Aufheizdauer"-Erweiterung (siehe Runde 1.4 "Offen") vorgezogen werden.
- **Fehler-Ursache-Tracking:** Damit "nach ausreichendem Nachfüllen automatisch zurück zu Bereit" (Runde 4.2) präzise auslösbar ist, wird intern gespeichert, welche Vorratsart(en) den aktuellen Fehler ausgelöst haben. Der Fehler-Zustand endet automatisch erst, wenn genau diese Vorratsart(en) wieder auf 100 % aufgefüllt wurden (nicht schon bei einem beliebigen anderen Nachfüllen).
- **Ausschalten aus Bereit/Fehler:** Runde 4 behandelt nur das Einschalten (Aus → Aufheizen → Bereit), nicht das erneute Ausschalten. Als Erweiterung ergänzt: Ein/Aus-Taste schaltet aus den Zuständen Bereit und Fehler zurück zu Aus (nicht aus Aufheizen/Zubereitung). Vorrat und Tagesüberblick bleiben beim Ausschalten unverändert.

## Testdurchlauf 2026-08-20 (Live-Test im Browser durch Claude, auf Wunsch des Nutzers)

Folgende Fälle aus der Liste oben wurden live in der laufenden Anwendung nachgestellt bzw. am Reducer-Code (`baristaReducer.ts`) verifiziert. Alle bestanden, bis auf den einen unten explizit als Diskrepanz markierten Punkt.

- **Aus → Bereit ohne sichtbares Aufheizen:** bestätigt (Status wechselt im selben Tick, kein Klick auf "Aufheizen" möglich) – wie im Eintrag oben zu Runde 1.4 bereits vermerkt.
- **Happy Path Espresso M:** 30 ml Wasser + 18 g Kaffee korrekt verbraucht, 2,20 € verbucht, keine Konsolenfehler.
- **Vorrat wird bereits bei Bestellstart reduziert, nicht erst bei Abschluss der Zubereitung** (neu entdeckt): Vorrat/Tagesüberblick zeigen die volle Zielmenge schon bei z. B. 30 % Fortschrittsbalken. Da während der Zubereitung ohnehin keine zweite Bestellung möglich ist (Buttons gesperrt), führt das nicht zu Doppel-Verbrauch – aber es bedeutet, dass ein (aktuell nicht vorhandener) Abbruch einer laufenden Zubereitung die Zutaten nicht zurückbuchen würde.
- **Vorrat exakt ausreichend (Grenzfall Runde 3.2):** Cappuccino M bei exakt 120/750 ml Milch bestellt → Bestellung erfolgreich angenommen, Milch landet exakt bei 0.
- **Automatischer Fehler-Zustand nach Verbrauch auf 0 (Runde 4.1, Variante 2):** nach der o. g. Bestellung wechselt der Status nach Abschluss der Zubereitung automatisch zu "Fehler", Hinweis "Vorrat an Milch aufgebraucht.".
- **Sofort fehlgeschlagene Bestellung (Runde 4.1, Variante 1):** Latte L bei 120 ml Milch/15 g Kaffee bestellt (benötigt 315 ml/27 g) → Bestellung wird ohne Zubereitungsphase sofort abgelehnt, Hinweis "Bestellung fehlgeschlagen: nicht genug Kaffee, Milch für Latte (L).", Vorrat unverändert. Nennt korrekt beide fehlenden Zutaten gleichzeitig.
- **Fehler-Zustand automatisch verlassen:** nach Nachfüllen der betroffenen Zutat(en) sofort zurück zu "Bereit", kein Reset-Klick nötig.
- **Nachfüllen während Zubereitung blockiert:** Klick auf "Nachfüllen" während laufender Zubereitung hatte keine Wirkung (Vorratswert blieb unverändert bis Abschluss).
- **Sirup/Zucker knapp, Basis ausreichend (Runde 7.3):** Espresso L mit Sirup bei nur 10/100 ml Sirup (benötigt 15 ml) → Getränk wird ohne Sirup zubereitet, Hinweis "Sirup aktuell nicht verfügbar, Espresso wird ohne Sirup zubereitet.", Preis ohne Sirup-Aufpreis (2,60 € statt 3,10 €).
- **Tagesüberblick-Reset:** setzt Verbrauch/Einnahmen auf 0, Vorrat bleibt unberührt.
- **Ausschalten aus Bereit:** funktioniert, Vorrat/Tagesüberblick unverändert.
- **Responsive (375 px Breite):** kein horizontales Overflow (`scrollWidth` == `clientWidth` == 375), alle Inhalte weiterhin per Text zugänglich.
- **Größenskalierung/Preise stichprobenartig geprüft:** Latte L 3,90 € (3,50 + 0,40), Cappuccino M 3,20 € (kein Aufschlag), Espresso L 2,60 € ohne Sirup – jeweils korrekt.

### ✅ Behoben: Americano bei leerer Milch jetzt bestellbar (Runde 11)

Der ursprünglich notierte Testfall "Milchvorrat leer → Americano weiterhin bestellbar, alle anderen 4 Getränke nicht" (Kontrasttest, siehe oben) traf zunächst nicht zu (alle Getränke wurden im Fehler-Zustand pauschal gesperrt). Nutzer-Entscheidung: Sperre pro Getränk statt maschinenweit (siehe ENTSCHEIDUNGSPROTOKOLL.md Runde 11). Umgesetzt und live verifiziert: Espresso/Americano bleiben bei leerer Milch bestellbar, milchhaltige Getränke bleiben gesperrt; der Fehler-Zustand bleibt bestehen, bis die auslösende Zutat nachgefüllt wird, auch wenn zwischenzeitlich ein nicht betroffenes Getränk erfolgreich zubereitet wurde.

**Dabei zusätzlich entdeckt und mitbehoben:** Wenn Kaffee (von jedem Getränk benötigt) gleichzeitig eine Fehlerursache ist, sind konsequenterweise wieder alle Getränke gesperrt – das ist kein Fehler, sondern korrektes Verhalten der pro-Getränk-Logik.
