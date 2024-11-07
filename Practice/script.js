// Initialize the map with a satellite view
const map = L.map('map').setView([51.505, -0.09], 5); // Adjust initial coordinates and zoom

// Satellite view layer (Esri World Imagery)
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.esri.com">Esri</a> &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
}).addTo(map);

// Variable to store polygon
let currentPolygon;

// Geocoder control for area search
L.Control.geocoder({
    defaultMarkGeocode: false
})
.on('markgeocode', function(e) {
    const bbox = e.geocode.bbox;

    // Remove previous polygon if it exists
    if (currentPolygon) {
        map.removeLayer(currentPolygon);
    }

    // Create a polygon with the bounding box coordinates
    currentPolygon = L.polygon([
        bbox.getSouthEast(),
        bbox.getNorthEast(),
        bbox.getNorthWest(),
        bbox.getSouthWest()
    ], { color: 'blue' }).addTo(map);

    map.fitBounds(currentPolygon.getBounds());  // Fit map to polygon bounds

    // Place a marker at the searched location
    L.marker(e.geocode.center).addTo(map)
        .bindPopup(e.geocode.name)
        .openPopup();
})
.addTo(map);

// Capture the map view as an image with polygon bounds
document.getElementById('capture-btn').addEventListener('click', () => {
    if (currentPolygon) {
        // Fit the map to the polygon bounds before capturing
        map.fitBounds(currentPolygon.getBounds());

        // Wait briefly to ensure the map is adjusted to bounds
        setTimeout(() => {
            html2canvas(document.getElementById('map'), {
                useCORS: true, // Handle cross-origin map tiles
                scale: 3       // Higher scale for better quality
            }).then(canvas => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = 'map-view.png';
                link.click();
            });
        }, 500);  // Adjust delay as needed for rendering
    } else {
        alert("Please select an area before capturing.");
    }
});
