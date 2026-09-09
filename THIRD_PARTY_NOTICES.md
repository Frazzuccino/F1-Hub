# Third-party data / assets

F1 Hub is an unofficial personal project and is not affiliated with Formula 1, the FIA, or any team.

- Jolpica F1 API — current/historical Formula 1 calendar, standings and classification data.
- OpenF1 — post-session classifications, tyre stints, lap metadata, race control, team radio and driver headshots where available.
- Formula 1 official static timing archive — post-session `CarData.z` / `Position.z` telemetry fallback where available.
- Open-Meteo — weather forecast data.
- BBC Sport Formula 1 RSS — news headlines; stories open at the publisher.
- Autosport RSS — Formula 1 news headlines; stories open at the publisher.
- Motorsport.com — Formula 1 news headlines plus a read-only current drivers’ standings fallback used when the primary championship API is delayed after a race.
- RaceFans RSS — Formula 1 news headlines; stories open at the publisher.
- The Race RSS — Formula 1 news headlines where its feed is reachable; stories open at the publisher.
- rss2json — browser-side RSS-to-JSON transport.
- Google News RSS — source-specific recent-news discovery fallback used when publisher RSS delivery is delayed; article links continue to the original publishers.
- FIA — official steward/document source and official Car Presentation Submissions used for the Car Development section, including event-specific decision-document archives for completed race weekends. F1 Hub derives broad component-location markers from the submission text. The Car Development location map uses a cleaned/cropped technical reference schematic supplied by the user for this personal app; F1 Hub overlays approximate markers and does not claim team CAD geometry.
- Jina Reader — readable-text extraction of publicly accessible FIA PDFs for the in-app steward document view.
- RacingNews365 and timepenalty — public penalty/reprimand reference pages; F1 Hub stores only small derived counts/expiry information and links back to sources.
- Wikipedia / Wikimedia Commons — fallback driver profile images when an OpenF1 headshot is unavailable. Arvid Lindblad uses the CC0 Wikimedia Commons image “Arvid lindblad Budapest 2026.jpg”.
- TracingInsights public season archives — raw `corners.json` fallback for circuit corner numbers, coordinates, rotation and distance when the direct circuit metadata endpoint is unavailable. The repositories credit FastF1/MultiViewer for this data and are Apache-2.0 licensed.
- MasterPlay007/F1-Track-Layouts-SVG — circuit SVG assets (repository states CC0-1.0).
- F1DB circuit assets — used for newer layouts where specified; CC BY 4.0.
- RainViewer Weather Maps API — in-app historical/latest radar tiles (past two hours); RainViewer attribution is shown on the map.
- OpenStreetMap — base map tiles and map data attribution for the in-app radar.
- Leaflet — interactive web-map library used by the in-app radar.
- bacinger/f1-circuits — MIT-licensed WGS84 GeoJSON circuit paths used to place the circuit outline at its real map location/orientation.
- Windy — optional external full-radar link centred on circuit coordinates.

The all-time F1 Records cards are bundled from publicly available Formula 1 career/team statistics and are current to the app release date; they are refreshed when F1 Hub itself is updated.

No official Formula 1 logo or official Formula 1 typeface is included in the app.

