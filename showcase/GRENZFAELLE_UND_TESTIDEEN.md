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
