
let countries;
let markers = [];

var MapTileLayer = L.tileLayer('https://api.maptiler.com/maps/hybrid-v4/{z}/{x}/{y}.jpg?key=EnterKey', {
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    })

const bounds = [ [-180, -170], [180, 190]];
const map = L.map('map', { maxBounds: bounds, maxBoundsViscosity: 0.9, minZoom: 3}).setView([0, 0], -5);
Map_Maker();

async function fetchData(CountryISO){
    try{
        const response = await fetch(`https://countries.dev/alpha/${CountryISO}`)
        if (!response.ok) {
            throw new Error("Could not fetch resource");
            openPopup(null, null, null, null, null, null, null, null, null, null, "Could not fetch resource");
        }
        const data = await response.json();
        document.querySelector(".spinner").style.display = "none";
        //console.log(CountryISO);
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
        const LatLng = data.latlng;
        const Error = "False"
        Marker_Maker(LatLng);
        openPopup(fullName, NativeName, Demonym, Subregion, population, timezone, tld, AbrevBorders, Capital, flag, Error);
    }
    catch(error) {
        console.error(error);
        openPopup(null, null, null, null, null, null, null, null, null, null, error);
    }
}

function change_map() {
    const WithNames = L.tileLayer('https://api.maptiler.com/maps/hybrid-v4/{z}/{x}/{y}.jpg?key=EnterKey', {
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    });
    const NoNames = L.tileLayer('https://api.maptiler.com/maps/satellite-v4/{z}/{x}/{y}.jpg?key=EnterKey', {
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    });

    const MapType = document.getElementById("maps").value;

    if (MapType.toLowerCase() == "remove") {
        MapTileLayer = NoNames;
        Map_Maker();
    }

    else {
        MapTileLayer = WithNames;
        Map_Maker();
    }
}

function Marker_Maker(LatLng) {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    const marker = L.marker(LatLng).addTo(map);
    markers.push(marker);
}

function Map_Maker(){
    MapTileLayer.addTo(map);

    fetch("countries.geojson")
        .then(response => response.json())
        .then(data => {

            countries = data;

            L.geoJSON(data, { style: {
                fillOpacity: 0,
                opacity: 0.15
            },
            onEachFeature: function(feature, Layer) {
                Layer.on("click", function() {
                    document.querySelector(".spinner").style.display = "block"
                    fetchData(feature.properties["ISO3166-1-Alpha-2"]);
                });
            }}).addTo(map);
        });
}

function findISO(InputName) {
    if (!InputName) {
        console.log("Error Name not entered");
        return null;
    }

    else{
        for (let country of countries.features) {
            if (country.properties.name.toLowerCase() == InputName.toLowerCase()) {
                return country.properties["ISO3166-1-Alpha-2"];
            }
        }
    }
    return null;
}

function SearchName() {
    document.querySelector(".spinner").style.display = "block"
    const InputName = document.getElementById("CountrySearch").value;
    const CountryISO = findISO(InputName);

    if (!CountryISO) {
        console.log("Error country name invalid");
        openPopup(null, null, null, null, null, null, null, null, null, null, "Error country name invalid");
        return;
    }
    fetchData(CountryISO);
}

function openPopup(fullName, NativeName, Demonym, Subregion, population, timezone, tld, AbrevBorders, Capital, flag, Error) {
    let popup = document.getElementById("popup");
    popup.classList.add("open-popup");

    if (Error == "False")
    {
        document.querySelector(".ErrorPopup").style.display = "none";
        document.getElementById("popupTitle").style.display = "block";
        document.querySelectorAll(".info").forEach(info => {
            info.style.display = "flex";
        });
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

    else
    {
        document.querySelector(".spinner").style.display = "none";
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
        document.getElementById("popupTitle").style.display = "none";
        document.querySelectorAll(".info").forEach(info => {
            info.style.display = "none";
        });
        document.querySelector(".ErrorPopup").style.display = "flex";
        ErrorType.textContent = Error;
    }   
}

function closePopup() {
    let popup = document.getElementById("popup");
    popup.classList.remove("open-popup")
}
