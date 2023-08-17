// Create the map centered at a specific location
const myMap = L.map('map').setView([0, 0], 2);

// Add a base layer (OpenStreetMap)
const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// URL to the JSON earthquake data
const earthquakeURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Fetch earthquake data and add markers to the map
fetch(earthquakeURL)
  .then(response => response.json())
  .then(data => {
    const earthquakes = L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        const magnitude = feature.properties.mag;
        const depth = feature.geometry.coordinates[2];
        let color = 'darkblue';
        
        if (depth > 100) {
          color = 'red';
        } else if (depth > 50) {
          color = 'orange';
        }

        const radius = Math.sqrt(Math.abs(magnitude)) * 5;
        
        return L.circleMarker(latlng, {
          radius: radius,
          fillColor: color,
          color: 'black',
          weight: 0.5,
          opacity: 1,
          fillOpacity: 0.8
        }).bindPopup(`Location: ${feature.properties.place}<br>Magnitude: ${magnitude}<br>Depth: ${depth}`);
      }
    });

    // URL to the tectonic plates GeoJSON data (Optional Part 2)
    const tectonicPlatesURL = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json';

    // Fetch tectonic plates data and add it as a separate overlay map (Optional Part 2)
    fetch(tectonicPlatesURL)
      .then(response => response.json())
      .then(plateData => {
        const tectonicPlates = L.geoJSON(plateData, {
          style: {
            color: 'orange',
            weight: 2
          }
        });

        // Create layer controls
        const baseMaps = {
          'Street Map': streetMap
        };

        const overlayMaps = {
          'Tectonic Plates': tectonicPlates,
          'Earthquakes': earthquakes
        };

        L.control.layers(baseMaps, overlayMaps).addTo(myMap);
      });
  });

// Add the base layer to the map
streetMap.addTo(myMap);




