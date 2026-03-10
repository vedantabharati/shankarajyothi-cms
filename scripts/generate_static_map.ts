import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import fs from 'fs'

async function generateMap() {
  try {
    const payload = await getPayload({ config: configPromise })
    const expeditions = await payload.find({
      collection: 'expeditions',
      depth: 2,
      limit: 1,
    })

    const exp = expeditions.docs[0]
    if (!exp) {
      console.log('No expedition found')
      return;
    }

    const locations = (exp.itinerary || [])
      .map((item: any) => {
        if (item.location && typeof item.location === 'object') {
          return {
            name: item.location.name,
            lat: item.location.coordinates?.latitude,
            lng: item.location.coordinates?.longitude,
          }
        }
        return null;
      })
      .filter((loc: any) => loc && loc.lat && loc.lng)

    // Find the index of Nanded
    const nandedIndex = locations.findIndex((l: any) => l.name.toLowerCase().includes('nanded'))
    
    let connectedLocations = locations;
    if (nandedIndex !== -1) {
       connectedLocations = locations.slice(0, nandedIndex + 1);
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Expedition Static Map</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <style>
        body, html { margin: 0; padding: 0; height: 100%; }
        #map { width: 100%; height: 100vh; }
        .custom-marker {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 12px;
            height: 12px;
            background-color: #622300;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .connected-marker {
            background-color: #F57702;
        }
        .nanded-marker {
            background-color: #10b981;
            width: 16px;
            height: 16px;
        }
    </style>
</head>
<body>

<div id="map"></div>

<script>
    const map = L.map('map').setView([22.0, 78.0], 5);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
    }).addTo(map);

    const allLocations = ${JSON.stringify(locations)};
    const connectedLocations = ${JSON.stringify(connectedLocations)};
    const nandedIndex = ${nandedIndex};

    const markers = [];
    const routeCoordinates = connectedLocations.map(l => [l.lat, l.lng]);

    // Draw the polyline for the connected route
    if (routeCoordinates.length > 1) {
        L.polyline(routeCoordinates, {
            color: '#F57702',
            weight: 6,
            opacity: 0.8,
        }).addTo(map);
    }

    // Draw markers for all locations
    allLocations.forEach((loc, index) => {
        let className = 'custom-marker';
        if (index <= nandedIndex) {
             className += ' connected-marker';
        }
        if (index === nandedIndex) {
             className += ' nanded-marker';
        }

        const icon = L.divIcon({
            html: \`<div class="\${className}"></div>\`,
            className: '',
            iconSize: [16, 16],
            iconAnchor: [8, 8],
        });

        const marker = L.marker([loc.lat, loc.lng], { icon }).addTo(map);
        marker.bindPopup('<b>' + loc.name + '</b>');
        markers.push(marker);
    });

    if (markers.length > 0) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.05));
    }
</script>

</body>
</html>
    `;

    fs.writeFileSync('static_map.html', html)
    console.log('✅ Generated static_map.html successfully.')
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

generateMap()
