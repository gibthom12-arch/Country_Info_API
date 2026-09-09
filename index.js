
Map_Maker();

async function fetchData(CountryName){
    try{
        const response = await fetch(`https://countries.dev/alpha/${CountryName}`)
        if (!response.ok) {
            throw new Error("Could not fetch resource");
        }
        // Get all the information you want from API and store it in variables
        // Pass variables into openPopup
        // Make spaces for variables to fill in HTML for popup
        const data = await response.json();
        console.log(data);
        const fullName = data.name;
        const NativeName = data.nativeName;
        const Demonym = data.demonym;
        const Subregion = data.subregion;
        const population = data.population;
        const timezone = data.timezones;
        const tld = data.topLevelDomain;
        const AbrevBorders = data.borders;
        const Capital = data.capital;
        const flag = data.flags.png;
        openPopup(fullName, NativeName, Demonym, Subregion, population, timezone, tld, AbrevBorders, Capital, flag);
    }
    catch(error) {
        console.error(error);
    }
}

function Map_Maker(){
    const bounds = [ [-180, -175], [180, 185]];
    const map = L.map('map', { maxBounds: bounds, maxBoundsViscosity: 0.9, minZoom: 3}).setView([0, 0], -5);
    L.tileLayer('https://api.maptiler.com/maps/hybrid-v4/{z}/{x}/{y}.jpg?key=Input_key', {
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

function openPopup(fullName, NativeName, Demonym, Subregion, population, timezone, tld, AbrevBorders, Capital, flag) {
    let popup = document.getElementById("popup");
    popup.classList.add("open-popup");

    popupTitle.textContent = fullName;
    popupNativeName.textContent = NativeName;
    popupCapital.textContent = Capital;
    popupdemonym.textContent = Demonym;
    popupSubRegion.textContent = Subregion;
    popupPopulation.textContent = population;
    popupTimezone.textContent = timezone;
    popupTLD.textContent = tld;
    popupBorderingCountries.textContent = AbrevBorders;
}

function closePopup() {
    let popup = document.getElementById("popup");
    popup.classList.remove("open-popup")
}
