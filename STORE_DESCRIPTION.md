SwissAI Guard – Lokaler Datenschutz-Filter für KI-Tools (nDSG)

### Kurzbeschreibung

Lokaler nDSG-Filter für ChatGPT, Claude und Gemini. Erkennt, blockiert oder anonymisiert sensible Daten direkt im Browser.

---

### Überblick

SwissAI Guard ist eine Browser-Erweiterung für Unternehmen und Organisationen in der Schweiz. Sie prüft Texteingaben in KI-Webanwendungen, bevor diese an externe Server übermittelt werden.

* **Lokal:** Die Analyse erfolgt ausschliesslich im Browser des Nutzers.
* **Konform:** Unterstützt die Reduktion unbeabsichtigter Übermittlungen von Personendaten gemäss Schweizer Datenschutzgesetz (nDSG).
* **Präventiv:** Interveniert, bevor Daten das Endgerät verlassen.

### Funktionsweise

Die Erweiterung erkennt sensible Inhalte während der Eingabe auf unterstützten KI-Webseiten. Je nach Konfiguration bietet das Tool drei Schutzstufen:

1. **Blockieren:** Verhindert das Absenden der Nachricht.
2. **Anonymisieren:** Ersetzt sensible Daten automatisch durch Platzhalter.
3. **Warnen:** Weist den Nutzer vor dem Absenden auf gefundene Muster hin.

Zusätzlich verfügt die Erweiterung über einen Netzwerk-Schutz, der ausgehende Anfragen an definierte KI-Endpunkte lokal unterbricht, falls diese sensible Inhalte enthalten.

### Erkannte Datenkategorien

Die Erkennung basiert auf regulären Ausdrücken und lokalen heuristischen Verfahren. Unterstützt werden unter anderem:

* AHV-Nummern
* IBANs
* Schweizer Telefonnummern
* Adressmuster
* E-Mail-Adressen
* Personennamen (heuristisch)

### Datenschutz & Architektur

* **Keine Cloud-Analyse:** 100% lokale Verarbeitung.
* **Keine Exfiltration:** Keine Übermittlung von Daten an Server des Entwicklers oder Drittanbieter-APIs.
* **Kein Tracking:** Es findet keine Erfassung des Nutzerverhaltens statt.
* **Speichermanagement:** Einstellungen werden lokal via `chrome.storage.local` gespeichert. Temporäre Anonymisierungs-Zuordnungen verbleiben im flüchtigen `sessionStorage` und werden beim Schliessen des Tabs gelöscht.

### Unterstützte Plattformen

Optimiert für die Web-Interfaces von:

* chatgpt.com
* claude.ai
* gemini.google.com

### Anwendungsbereiche

* **HR & Personalwesen:** Maskierung von Bewerberdaten bei der Analyse von Lebensläufen.
* **Öffentliche Verwaltung:** Schutz von Bürgerdaten bei der Textoptimierung.
* **Rechtsberatung & Consulting:** Reduktion von Risiken bei der Zusammenfassung von Dokumenten.

### Wichtiger Hinweis

SwissAI Guard ist eine technische Schutzmassnahme (TOM). Die Erkennung reduziert Risiken signifikant, ersetzt jedoch keine manuelle Prüfung. Die Erweiterung unterstützt die Einhaltung interner Richtlinien, entbindet den Nutzer jedoch nicht von der Verantwortung für eine datenschutzkonforme Nutzung von KI-Diensten.
