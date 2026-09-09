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
- FIA — official steward/document source, Car Presentation Submissions, and event Competition Notes circuit maps. The circuit-map documents are used to identify official S1/S2 intermediate locations and Straight Mode activation information where available. F1 Hub derives broad component-location markers from Car Presentation text; the schematic is a user-supplied technical reference and is not team CAD geometry.
- Jina Reader — readable-text extraction of publicly accessible FIA PDFs for the in-app steward document view.
- RacingNews365 and timepenalty — public penalty/reprimand reference pages; F1 Hub stores only small derived counts/expiry information and links back to sources.
- Wikipedia / Wikimedia Commons — fallback driver profile images when an OpenF1/Formula 1 headshot is unavailable. Arvid Lindblad now uses the same official OpenF1/Formula 1 portrait chain as the rest of the grid.
- TracingInsights public season archives — raw `corners.json` fallback for circuit corner numbers, coordinates, rotation and distance when the direct circuit metadata endpoint is unavailable. The repositories credit FastF1/MultiViewer for this data and are Apache-2.0 licensed.
- MasterPlay007/F1-Track-Layouts-SVG — circuit SVG assets (repository states CC0-1.0).
- F1DB circuit assets — used for newer layouts where specified; CC BY 4.0.
- LibreWXR — primary in-app precipitation radar/short-term nowcast source. F1 Hub consumes its RainViewer-compatible public metadata and tiles, including nowcast frames and precipitation-motion arrows.
- RainViewer Weather Maps API — fallback radar source when LibreWXR is unavailable; attribution is shown on the map.
- OpenStreetMap — base map tiles and map data attribution for the in-app radar.
- Leaflet — interactive web-map library used by the in-app radar.
- bacinger/f1-circuits — MIT-licensed WGS84 GeoJSON circuit paths used to place the circuit outline at its real map location/orientation.
- Windy — optional external full-radar link centred on circuit coordinates.

The all-time F1 Records cards are bundled from publicly available Formula 1 career/team statistics and are current to the app release date; they are refreshed when F1 Hub itself is updated.

No official Formula 1 logo or official Formula 1 typeface is included in the app.

