// Initialize the map
var map = L.map('map').setView([51.505, -0.09], 2);

// Load and display tile layer on the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to search and display the country
function searchCountry() {
    var countryName = document.getElementById('countryInput').value;

    fetch(`https://nominatim.openstreetmap.org/search?country=${countryName}&format=json&limit=1`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                var country = data[0];
                var lat = country.lat;
                var lon = country.lon;
                map.setView([lat, lon], 5);

                // Optionally, add a marker for the searched country
                L.marker([lat, lon]).addTo(map)
                    .bindPopup(`<b>${country.display_name}</b>`)
                    .openPopup();
            } else {
                alert('Country not found');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to search country');
        });
}