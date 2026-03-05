# SwissAI Guard

Browser-Erweiterung für lokalen Datenschutz bei der Nutzung von KI-Webtools wie ChatGPT, Claude oder Gemini.

SwissAI Guard erkennt sensible Daten direkt im Browser und verhindert deren Übermittlung an externe KI-Dienste.
Die gesamte Analyse erfolgt lokal – ohne Cloud-API, ohne Telemetrie, ohne Tracking.

## Hintergrund

Viele Unternehmen nutzen KI-Tools im Alltag. Dabei werden häufig personenbezogene Daten in Prompts kopiert – etwa Namen, Telefonnummern oder Kontodaten.

SwissAI Guard reduziert dieses Risiko.
Die Erweiterung prüft Texteingaben vor dem Absenden und greift ein, wenn sensible Daten erkannt werden.

Der Fokus liegt auf Datenmustern, die im Schweizer Kontext besonders relevant sind (z. B. AHV-Nummern oder IBAN).

## Funktionen

### Lokale Analyse
Alle Prüfungen laufen im Browser des Nutzers. Es werden keine Texte an Server des Entwicklers übertragen.

### Drei Interventionsmodi
- **Blockieren** – verhindert das Absenden des Textes
- **Anonymisieren** – ersetzt erkannte Daten durch Platzhalter
- **Warnen** – Hinweis vor dem Absenden

*Beispiel:* `Hans Muster → [PERSON_1]`

### Netzwerk-Schutz
Zusätzlich zur UI-Analyse kann die Erweiterung ausgehende Requests an bekannte KI-Endpunkte blockieren, falls sensible Inhalte erkannt werden.
Technisch umgesetzt über:
- `declarativeNetRequest`
- Content Scripts
- Fetch-Interception

## Erkannte Datentypen

Die Erkennung basiert auf regulären Ausdrücken und heuristischen Regeln. Unter anderem:
- AHV-Nummern
- IBAN-Kontonummern
- Schweizer Telefonnummern
- E-Mail-Adressen
- Personennamen (heuristisch)
- Adressmuster

*Die Erkennung reduziert Risiken, kann aber keine vollständige Fehlerfreiheit garantieren.*

## Datenschutz

SwissAI Guard verfolgt einen Privacy-by-Design Ansatz:
- keine Cloud-Analyse
- kein Tracking
- keine Telemetrie
- keine Datenspeicherung ausserhalb des Browsers

Gespeichert werden nur lokale Einstellungen (Filterkonfiguration, Whitelist-Domains) am Speicherort `chrome.storage.local`.
Temporäre Anonymisierungs-Mappings werden nur im Tab gespeichert (`sessionStorage`) und verschwinden nach dem Schliessen des Tabs.

Weitere Details: siehe `PRIVACY_POLICY.md`

## Installation

### Chrome Web Store
Installation über den offiziellen Store:
*[Link folgt]*

### Entwicklerinstallation
Repository klonen:
```bash
git clone https://github.com/<username>/swissai-guard.git
```

Dann:
1. Chrome öffnen
2. `chrome://extensions` aufrufen
3. **Developer Mode** aktivieren
4. **Load unpacked** wählen
5. Projektordner auswählen

## Repository-Struktur
```text
src/
  background.js
  content/
  utils/
  popup/
assets/
  icons
  images
_locales/
  Sprachdateien
manifest.json
PRIVACY_POLICY.md
```

## Hinweis zur Nutzung
SwissAI Guard ist eine technische Schutzmassnahme zur Risikominimierung.
Die Erweiterung ersetzt keine internen Datenschutzrichtlinien oder Compliance-Schulungen. Organisationen bleiben für die datenschutzkonforme Nutzung externer KI-Dienste selbst verantwortlich.

## Kontakt
Oliver Gwerder  
Schweiz  
E-Mail: oliver.gwerder@gmail.com
