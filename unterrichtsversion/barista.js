console.log("Externe JS geladen ")
 /* Variablen, Selektion */
        let anzeige = document.getElementById("display");
        let btnHeizen = document.getElementById("btnHeizen");
        let btnStart = document.getElementById("btnStart");
        let wasser = 1000;
        let kaffee = 250;
        let milch = 500;
        let espressoWasser = 50;
        let espressoKaffee = 25;
        let latteWasser = 50;
        let latteKaffee = 25;
        let latteMilch = 150;

        let temperatur = 20;
        let wahl = "";

        /* Funktionen */
        /* Aufheizen */
        function aufheizen(){
            console.log("aufheizen gedrückt");
            while(temperatur < 90){
                //temperatur = temperatur + 10;
                temperatur += 10;
                console.log("Temperatur steigt: "+ temperatur);
            }
            anzeige.innerHTML = "Status: Temperatur von "+temperatur+"° erreicht";
            btnStart.disabled = false;
        }


        /* Getränke-Auswahl */
        function auswahl(getraenk){
            console.log("Getränk wurde ausgewählt:", getraenk);
            wahl = getraenk;
            switch(wahl){
                case "Espresso":
                    anzeige.innerHTML = "Auswahl: Espresso";
                    break;
                case "Latte":
                    anzeige.innerHTML = "Auswahl: Latte";
                    break;
                default:
                    /* falls in wahl etwas anderes stehen würde ....
                    kann bei uns aber eigentlich nicht passieren */
        
            }

        }
        /* Zubereitung */
        function bruehen(){
            console.log("Start wurde gedrückt");
            // 1. Prüfung - Temperatur
            // 2. Prfüung - welches Getränk?
            if(temperatur < 90)
            {
                anzeige.innerHTML = "Fehler: Maschine muss noch heizen";
            }else if(wahl == "")
            {
                anzeige.innerHTML = "Fehler: Keine Auswahl getroffen ";
            }
            else if (wahl == "Espresso" && wasser < espressoWasser)
            {
                anzeige.innerHTML = "Fehler: Nicht genug Wasser für Espresso";
            }
            else if (wahl == "Espresso" && kaffee < espressoKaffee)
            {
                anzeige.innerHTML = "Fehler: Nicht genug Kaffee für Espresso";
            }
            else if (wahl == "Latte" && wasser < latteWasser)
            {
                anzeige.innerHTML = "Fehler: Nicht genug Wasser für Latte";
            }
            else if (wahl == "Latte" && kaffee < latteKaffee)
            {
                anzeige.innerHTML = "Fehler: Nicht genug Kaffee für Latte";
            }
            else if (wahl == "Latte" && milch < latteMilch)
            {
                anzeige.innerHTML = "Fehler: Nicht genug Milch für Latte";
            }
            else
            {
                if (wahl == "Espresso") {
                    wasser -= espressoWasser;
                    kaffee -= espressoKaffee;
                } else if (wahl == "Latte") {
                    wasser -= latteWasser;
                    kaffee -= latteKaffee;
                    milch -= latteMilch;
                }
                anzeige.innerHTML = ("Fertig! Wasser: " +wasser+ " ml, Kaffee: "+kaffee+" g, Milch: "+milch+" ml");
            }
        }

        /* Bindung der Events */
        btnHeizen.onclick = aufheizen;
        btnStart.onclick = bruehen;
