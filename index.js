//const response = await fetch("https://api.aviationstack.com/v1/flights?access_key=7db7a9d97d3f8d40b257f2e71e0faafb")
Map_Maker();

async function fetchData(CountryName){
    try{
        const response = await fetch(`https://countries.dev/alpha/${CountryName}`)
        if (!response.ok) {
            throw new Error("Could not fetch resource");
        }
        const data = await response.json();
        console.log(data);
    }
    catch(error) {
        console.error(error);
    }
}

function Map_Maker(){
    const bounds = [ [-180, -175], [180, 185]];
    var map = L.map('map', { maxBounds: bounds, maxBoundsViscosity: 0.9, minZoom: 3}).setView([0, 0], -5);
    L.tileLayer('https://api.maptiler.com/maps/hybrid-v4/{z}/{x}/{y}.jpg?key=ihEX9ouMm5tQKqtHxBFw', {
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    }).addTo(map);

    fetch("countries.geojson")
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, { style: {
                fillOpacity: 0,
                opacity: 0.1
            },
            onEachFeature: function(feature, Layer) {
                Layer.on("click", function() {
                    fetchData(feature.properties["ISO3166-1-Alpha-2"]);
                });
            }}).addTo(map);
        });
}
