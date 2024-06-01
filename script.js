// Initialize the map
var map = L.map('map').setView([51.505, -0.09], 2);

// Load and display tile layer on the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to search for cities in a country and display the country on the map
async function searchCountry() {
    const countryName = document.getElementById('countryInput').value;
    const username = 'tunglv';  // Replace with your GeoNames username

    if (!countryName) {
        alert('Please enter a country name');
        return;
    }

    // Fetch the country coordinates
    fetch(`https://nominatim.openstreetmap.org/search?country=${countryName}&format=json&limit=1`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const country = data[0];
                const lat = country.lat;
                const lon = country.lon;
                map.setView([lat, lon], 5);

                // Optionally, add a marker for the searched country
                L.marker([lat, lon]).addTo(map)
                    .bindPopup(`<b>${country.display_name}</b>`)
                    .openPopup();

                // Fetch cities in the country
                fetchCities(countryName, username);
            } else {
                alert('Country not found');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to search country');
        });
}

// Function to fetch cities in the country using GeoNames API
async function fetchCities(countryName, username) {
    const apiUrl = `http://api.geonames.org/searchJSON?q=${countryName}&maxRows=100&username=${username}&featureClass=P`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Log the full response to see the structure of the data
        console.log('Full response:', data);

        if (data.geonames && data.geonames.length > 0) {
            const cities = data.geonames.map(city => city.name);

            // Log each city to the console
            console.log('Cities in', countryName, ':', cities);
        } else {
            console.error('No cities found or invalid country name');
            alert('No cities found or invalid country name');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error fetching data. See console for details.');
    }
}
