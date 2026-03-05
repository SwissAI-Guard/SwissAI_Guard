# Datenschutzerklärung für SwissAI Guard

**Stand:** 05.03.2026
**Verantwortlicher:** Oliver Gwerder, oliver.gwerder@gmail.com, [LinkedIn](https://www.linkedin.com/in/oliver-gwerder-1bb3a5123/)

Diese Datenschutzerklärung beschreibt die Datenverarbeitung im Zusammenhang mit der Browser-Erweiterung "SwissAI Guard".

## 1. Grundprinzip der Verarbeitung
SwissAI Guard ist so konzipiert, dass die Analyse von Texteingaben ausschliesslich lokal im Browser des Nutzers erfolgt.

Die Erweiterung:
- übermittelt keine geprüften Texte an Server des Entwicklers
- nutzt keine externen Analyse- oder Cloud-Dienste
- führt die Erkennung sensibler Muster innerhalb der Browser-Umgebung aus

Die eigentliche Nutzung von KI-Webdiensten (z. B. ChatGPT oder andere Anbieter) erfolgt unabhängig von dieser Erweiterung und unterliegt den Datenschutzbestimmungen des jeweiligen Dienstes.

## 2. Welche Daten verarbeitet die Erweiterung?
Die Erweiterung verarbeitet Texteingaben ausschliesslich lokal zum Zweck der Mustererkennung. 

Gespeichert werden lediglich technische Konfigurationen, insbesondere:
- gewählte Filterstufen
- definierte Ausnahmen (Whitelist-Domains)
- lokale Aktivierungszustände

Temporäre Zuordnungen bei der Anonymisierung (z. B. "Name → Platzhalter") werden nur während der laufenden Browser-Sitzung im `sessionStorage` gehalten und beim Schliessen des Tabs oder Browsers gelöscht.

## 3. Speicherort
Einstellungen werden über die Browser-API `chrome.storage.local` auf dem Gerät des Nutzers gespeichert.

Es erfolgt durch die Erweiterung:
- keine Synchronisation auf Server des Entwicklers
- keine zentrale Speicherung
- keine Fernübertragung dieser Konfigurationsdaten

## 4. Berechtigungen der Erweiterung
Zur technischen Umsetzung werden folgende Berechtigungen benötigt:

*   **`storage`:** Speicherung lokaler Einstellungen.
*   **Host-Berechtigungen für definierte KI-Domains:** Erforderlich, um Eingabefelder auf diesen Seiten lokal analysieren zu können.
*   **`declarativeNetRequest`:** Ermöglicht das lokale Blockieren ausgehender Anfragen an bestimmte Endpunkte, falls sensible Muster erkannt werden.

Diese Berechtigungen dienen ausschliesslich der beschriebenen Funktionalität.

## 5. Tracking und Analyse
Die Erweiterung enthält keine Tracking-Mechanismen.
Es werden keine Nutzungsstatistiken erhoben oder an Dritte übermittelt.

## 6. Rechte der Nutzer
Da durch den Entwickler keine personenbezogenen Daten zentral gespeichert oder verarbeitet werden, bestehen gegenüber dem Entwickler keine auskunfts- oder löschpflichtigen Datensätze.

Die Deinstallation der Erweiterung entfernt sämtliche lokal gespeicherten Konfigurationsdaten aus dem Browser.

## 7. Haftungshinweis
SwissAI Guard ist eine technische Schutzmassnahme zur Risikominimierung.
Die Erkennung sensibler Inhalte basiert auf Mustern und heuristischen Verfahren und kann keine vollständige Fehlerfreiheit garantieren.

Die Verantwortung für die datenschutzkonforme Nutzung externer KI-Dienste liegt beim jeweiligen Nutzer bzw. der Organisation.

## 8. Kontakt

Oliver Gwerder
Langwies 11 
8824 Schönenberg ZH, Schweiz  
oliver.gwerder@gmail.com 
https://www.linkedin.com/in/oliver-gwerder-1bb3a5123/