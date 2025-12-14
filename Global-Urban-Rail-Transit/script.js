let map;
let allCities = [];
let markers = L.markerClusterGroup({
    maxClusterRadius: 50,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true
});
let currentCity = null;
let cityPopup = document.getElementById('cityCardPopup');
let currentOverlayChart = null;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

const systemFiles = {
    'Metro': 'metro.csv',
    'Tram': 'tram.csv',
    'Light Rail': 'light_rail.csv',
    'Monorail': 'Monorail.csv',
    'Maglev': 'Maglev.csv',
    'People Mover': 'PeopleMover.csv',
    'Airport Shuttle': 'AirportShuttle.csv',
    'Amusement Park': 'AmusementPark.csv',
    'Heritage Tram': 'heritage_tram.csv',
    'Tram Train': 'tram_train.csv',
    'Interurban': 'interurban.csv',
    'Special': 'specialTram.csv',
    'Streetcar': 'streetcar.csv'
};

const continentMapping = {
    'europe': ['Germany', 'France', 'Italy', 'Spain', 'United Kingdom', 'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Greece', 'Portugal', 'Ireland', 'Croatia', 'Serbia', 'Bulgaria', 'Slovakia', 'Latvia', 'Estonia', 'Lithuania', 'Luxembourg', 'Bosnia and Herzegovina', 'Russia', 'Ukraine', 'Belarus', 'Georgia', 'Armenia', 'Azerbaijan', 'Turkey'],
    'asia': ['China', 'Japan', 'South Korea', 'India', 'Turkey', 'Thailand', 'Malaysia', 'Singapore', 'Indonesia', 'Philippines', 'Vietnam', 'Taiwan', 'Hong Kong', 'Iran', 'Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kazakhstan', 'Uzbekistan', 'Georgia', 'Armenia', 'Azerbaijan', 'Bangladesh', 'Pakistan', 'Myanmar', 'North Korea', 'Israel'],
    'north_america': ['United States', 'Canada', 'Mexico', 'Panama', 'Costa Rica', 'Cuba', 'Dominican Republic'],
    'south_america': ['Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Venezuela', 'Ecuador', 'Bolivia', 'Uruguay'],
    'africa': ['Egypt', 'South Africa', 'Morocco', 'Algeria', 'Nigeria', 'Kenya', 'Ethiopia', 'Tanzania', 'Tunisia'],
    'oceania': ['Australia', 'New Zealand']
};

let allCountries = [];

function updateCountryList() {
    const countries = [...new Set(allCities.map(city => city.country))].sort();
    allCountries = countries;
    
    const countrySelect = document.getElementById('countrySelect');
    if (countrySelect) {
        const currentValue = countrySelect.value;
        countrySelect.innerHTML = '<option value="">All Countries</option>' +
            countries.map(country => `<option value="${country}">${country}</option>`).join('');
        
        if (currentValue && countries.includes(currentValue)) {
            countrySelect.value = currentValue;
        }
    }
}

function updateCountryListByContinent() {
    const continent = document.getElementById('continentFilter').value;
    const countrySelect = document.getElementById('countrySelect');
    
    if (!continent) {
        countrySelect.innerHTML = '<option value="">All Countries</option>' +
            allCountries.map(country => `<option value="${country}">${country}</option>`).join('');
    } else {
        const countriesInContinent = continentMapping[continent] || [];
        const availableCountries = allCountries.filter(country => countriesInContinent.includes(country));
        
        let continentName = continent.charAt(0).toUpperCase() + continent.slice(1).replace('_', ' ');
        countrySelect.innerHTML = '<option value="">All Countries in ' + continentName + '</option>' +
            availableCountries.map(country => `<option value="${country}">${country}</option>`).join('');
    }
    
    applyFilters();
}

function showLoading(show) {
    const loader = document.getElementById('loadingScreen');
    if (loader) loader.style.display = show ? 'flex' : 'none';
}

async function loadCSV(file) {
    try {
        const response = await fetch(`data/${file}`);
        const text = await response.text();
        return new Promise((resolve) => {
            Papa.parse(text, {
                header: true,
                skipEmptyLines: true,
                delimiter: '',
                complete: (results) => resolve(results.data)
            });
        });
    } catch (error) {
        console.error(`Error loading ${file}:`, error);
        return [];
    }
}

async function loadAllData() {
    showLoading(true);
    const combinedData = await loadCSV('combined.csv');
    const coordData = await loadCSV('city_coordinates.csv');
    const systemData = {};
    
    for (const [system, file] of Object.entries(systemFiles)) {
        systemData[system] = await loadCSV(file);
    }
    
    allCities = combinedData.map(city => {
        const cityName = city.CITY || city.city;
        const countryName = city.COUNTRY || city.country;
        
        const coord = coordData.find(c => {
            const coordCity = c.city || c.CITY;
            const coordCountry = c.country || c.COUNTRY;
            const coordSuccess = c.success || c.SUCCESS;
            return coordCity === cityName && coordCountry === countryName && (coordSuccess === 'True' || coordSuccess === 'true');
        });
        
        if (!coord) return null;
        
        const citySystems = {};
        let totalStations = 0;
        let totalLength = 0;
        let totalLines = 0;
        
        for (const [system, data] of Object.entries(systemData)) {
            const systemInfo = data.find(item => {
                const itemCity = item.CITY || item.city;
                const itemCountry = item.COUNTRY || item.country;
                return itemCity === cityName && itemCountry === countryName;
            });
            
            if (systemInfo) {
                const stations = systemInfo.STATIONS || systemInfo['STATION NUMBER'] || 'N/A';
                const length = systemInfo.LENGTH || systemInfo['LENGTH_KM'] || systemInfo['TOTAL LENGTH'] || 'N/A';
                const lines = systemInfo.LINES || 'N/A';
                
                citySystems[system] = { stations, length, lines };
                
                const stationsNum = parseInt(stations);
                const lengthNum = parseFloat(length);
                const linesNum = parseInt(lines);
                
                if (!isNaN(stationsNum)) totalStations += stationsNum;
                if (!isNaN(lengthNum)) totalLength += lengthNum;
                if (!isNaN(linesNum)) totalLines += linesNum;
            }
        }
        
        return {
            name: cityName,
            country: countryName,
            lat: parseFloat(coord.latitude || coord.LATITUDE),
            lng: parseFloat(coord.longitude || coord.LONGITUDE),
            systems: citySystems,
            totalStations: totalStations || 0,
            totalLength: totalLength || 0,
            totalLines: totalLines || 0,
            hasMetro: (city.HAS_METRO || city.has_metro) === 'True',
            hasTram: (city.HAS_TRAM || city.has_tram) === 'True',
            systemCount: Object.keys(citySystems).length
        };
    }).filter(city => city !== null);
    
    updateCountryList();
    applyFilters();
    updateStats();
    updateRankings();
    updateCompareSelectors();
    updateDashboard();
    showLoading(false);
}

function applyFilters() {
    const searchQuery = document.getElementById('citySearch').value.toLowerCase().trim();
    let filteredCities = allCities;
    
    const selectedSystems = Array.from(document.querySelectorAll('.system-filter:checked')).map(cb => cb.value);
    if (selectedSystems.length > 0) {
        filteredCities = filteredCities.filter(city => {
            if (city.systemCount === 0) return false;
            const citySystems = Object.keys(city.systems);
            return citySystems.some(sys => selectedSystems.includes(sys));
        });
    }
    
    const multiSystem = document.getElementById('multiSystemFilter').checked;
    if (multiSystem) {
        filteredCities = filteredCities.filter(city => city.systemCount > 1);
    }
    
    const continentFilter = document.getElementById('continentFilter').value;
    const countryFilter = document.getElementById('countrySelect').value;
    
    if (continentFilter) {
        const countriesInContinent = continentMapping[continentFilter] || [];
        filteredCities = filteredCities.filter(city => countriesInContinent.includes(city.country));
    }
    
    if (countryFilter) {
        filteredCities = filteredCities.filter(city => city.country === countryFilter);
    }
    
    const minSystems = parseInt(document.getElementById('minSystems').value);
    if (minSystems > 0) {
        filteredCities = filteredCities.filter(city => city.systemCount >= minSystems);
    }
    
    const minLines = parseInt(document.getElementById('minLines').value);
    if (minLines > 0) {
        filteredCities = filteredCities.filter(city => city.totalLines >= minLines);
    }
    
    const minLength = parseInt(document.getElementById('minLength').value);
    const maxLength = parseInt(document.getElementById('maxLength').value);
    filteredCities = filteredCities.filter(city => city.totalLength >= minLength && city.totalLength <= maxLength);
    
    const lengthPreset = document.getElementById('lengthPreset').value;
    if (lengthPreset) {
        if (lengthPreset === 'short') {
            filteredCities = filteredCities.filter(city => city.totalLength <= 50);
        } else if (lengthPreset === 'medium') {
            filteredCities = filteredCities.filter(city => city.totalLength > 50 && city.totalLength <= 200);
        } else if (lengthPreset === 'long') {
            filteredCities = filteredCities.filter(city => city.totalLength > 200);
        }
    }
    
    const systemCountPreset = document.getElementById('systemCountPreset').value;
    if (systemCountPreset) {
        if (systemCountPreset === 'single') {
            filteredCities = filteredCities.filter(city => city.systemCount === 1);
        } else if (systemCountPreset === 'few') {
            filteredCities = filteredCities.filter(city => city.systemCount >= 2 && city.systemCount <= 4);
        } else if (systemCountPreset === 'many') {
            filteredCities = filteredCities.filter(city => city.systemCount >= 5);
        }
    }
    
    if (searchQuery) {
        filteredCities = filteredCities.filter(city => 
            city.name.toLowerCase().includes(searchQuery) || 
            city.country.toLowerCase().includes(searchQuery)
        );
    }
    
    updateMapWithCities(filteredCities, searchQuery);
}

function updateMapWithCities(cities, isSearching = false) {
    markers.clearLayers();
    
    cities.forEach(city => {
        const systemCount = city.systemCount;
        const radius = Math.max(6, Math.min(20, systemCount * 3));
        const color = isSearching ? '#ffdd00' : city.hasMetro ? '#ff4757' : city.hasTram ? '#2ed573' : '#4a9eff';
        
        const marker = L.circleMarker([city.lat, city.lng], {
            radius: radius,
            fillColor: color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: isSearching ? 0.9 : 0.7
        });
        
        marker.on('click', () => {
            showCityCardPopup(city);
            map.setView([city.lat, city.lng], 10);
        });
        
        const popupContent = `
            <div class="popup-title">${city.name}, ${city.country}</div>
            <div class="popup-stats">
                Systems: ${systemCount}<br>
                ${city.totalLength > 0 ? `Length: ${city.totalLength.toFixed(1)} km<br>` : ''}
                ${city.totalStations > 0 ? `Stations: ${city.totalStations}<br>` : ''}
                ${city.totalLines > 0 ? `Lines: ${city.totalLines}` : ''}
            </div>
            <button class="popup-btn" onclick="showCityCardPopupFromPopup('${city.name}', '${city.country}')">View Details</button>
            <button class="compare-btn" onclick="openCompareModal('${city.name}', '${city.country}')">Compare with Other City</button>
        `;
        
        marker.bindPopup(popupContent);
        markers.addLayer(marker);
    });
    
    map.addLayer(markers);
    updateStats();
    
    if (cities.length === 1) {
        const singleCity = cities[0];
        showCityCardPopup(singleCity);
        map.setView([singleCity.lat, singleCity.lng], 10);
    } else if (cities.length > 0) {
        const continentFilter = document.getElementById('continentFilter').value;
        const countryFilter = document.getElementById('countrySelect').value;
        
        if (continentFilter || countryFilter) {
            const bounds = new L.LatLngBounds();
            cities.forEach(city => {
                bounds.extend([city.lat, city.lng]);
            });
            
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
        }
    }
}

function showCityCardPopupFromPopup(name, country) {
    const city = allCities.find(c => c.name === name && c.country === country);
    if (city) {
        showCityCardPopup(city);
    }
}

function makeDraggable(element) {
    const header = element.querySelector('.city-card-header');
    if (!header) return;
    
    header.addEventListener('mousedown', startDrag);
    header.addEventListener('touchstart', startDragTouch);
    
    function startDrag(e) {
        isDragging = true;
        const rect = element.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
        element.style.cursor = 'grabbing';
    }
    
    function startDragTouch(e) {
        if (e.touches.length !== 1) return;
        isDragging = true;
        const rect = element.getBoundingClientRect();
        dragOffset.x = e.touches[0].clientX - rect.left;
        dragOffset.y = e.touches[0].clientY - rect.top;
        
        document.addEventListener('touchmove', onDragTouch);
        document.addEventListener('touchend', stopDragTouch);
    }
    
    function onDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        element.style.left = (e.clientX - dragOffset.x) + 'px';
        element.style.top = (e.clientY - dragOffset.y) + 'px';
        element.style.right = 'auto';
        element.style.transform = 'none';
    }
    
    function onDragTouch(e) {
        if (!isDragging || e.touches.length !== 1) return;
        e.preventDefault();
        element.style.left = (e.touches[0].clientX - dragOffset.x) + 'px';
        element.style.top = (e.touches[0].clientY - dragOffset.y) + 'px';
        element.style.right = 'auto';
        element.style.transform = 'none';
    }
    
    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
        element.style.cursor = '';
    }
    
    function stopDragTouch() {
        isDragging = false;
        document.removeEventListener('touchmove', onDragTouch);
        document.removeEventListener('touchend', stopDragTouch);
    }
}

function makeChartDraggable(element) {
    element.addEventListener('mousedown', startChartDrag);
    element.addEventListener('touchstart', startChartDragTouch);
    
    function startChartDrag(e) {
        if (e.target.classList.contains('close-chart')) return;
        isDragging = true;
        const rect = element.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        
        document.addEventListener('mousemove', onChartDrag);
        document.addEventListener('mouseup', stopChartDrag);
        element.style.cursor = 'grabbing';
    }
    
    function startChartDragTouch(e) {
        if (e.touches.length !== 1 || e.target.classList.contains('close-chart')) return;
        isDragging = true;
        const rect = element.getBoundingClientRect();
        dragOffset.x = e.touches[0].clientX - rect.left;
        dragOffset.y = e.touches[0].clientY - rect.top;
        
        document.addEventListener('touchmove', onChartDragTouch);
        document.addEventListener('touchend', stopChartDragTouch);
    }
    
    function onChartDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        element.style.left = (e.clientX - dragOffset.x) + 'px';
        element.style.top = (e.clientY - dragOffset.y) + 'px';
        element.style.transform = 'none';
    }
    
    function onChartDragTouch(e) {
        if (!isDragging || e.touches.length !== 1) return;
        e.preventDefault();
        element.style.left = (e.touches[0].clientX - dragOffset.x) + 'px';
        element.style.top = (e.touches[0].clientY - dragOffset.y) + 'px';
        element.style.transform = 'none';
    }
    
    function stopChartDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', onChartDrag);
        document.removeEventListener('mouseup', stopChartDrag);
        element.style.cursor = '';
    }
    
    function stopChartDragTouch() {
        isDragging = false;
        document.removeEventListener('touchmove', onChartDragTouch);
        document.removeEventListener('touchend', stopChartDragTouch);
    }
}

function showCityCardPopup(city) {
    currentCity = city;
    document.getElementById('popupCityName').textContent = city.name;
    document.getElementById('popupCityCountry').textContent = city.country;            
    let systemsHTML = '';
    for (const [system, data] of Object.entries(city.systems)) {
        systemsHTML += `
            <div class="system-box" data-system="${system}">
                <div class="system-title">${system}</div>
                <div class="system-stats">
                    ${data.stations !== 'N/A' ? `Stations: ${data.stations}<br>` : ''}
                    ${data.lines !== 'N/A' ? `Lines: ${data.lines}<br>` : ''}
                    ${data.length !== 'N/A' ? `Length: ${data.length} km` : ''}
                </div>
            </div>
        `;
    }
    
    const hasAnyData = city.systemCount > 0;            
    const contentHTML = hasAnyData ? `
        <div class="systems-container">${systemsHTML}</div>
        <div class="total-box">
            <div class="total-title">TOTAL SUMMARY</div>
            <div class="total-stats">
                <div class="stat-item">
                    <div class="stat-label">Systems</div>
                    <div class="stat-value">${city.systemCount}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Stations</div>
                    <div class="stat-value">${city.totalStations}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Length</div>
                    <div class="stat-value">${city.totalLength.toFixed(1)} km</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Lines</div>
                    <div class="stat-value">${city.totalLines}</div>
                </div>
            </div>
        </div>
        <button class="compare-btn" onclick="openCompareModal('${city.name}', '${city.country}')">Compare with Other City</button>
    ` : `<div class="no-data">No transit data available</div>`;
    
    document.getElementById('popupCityContent').innerHTML = contentHTML;
    cityPopup.classList.add('active');            
    map.setView([city.lat, city.lng], 10);
    
    makeDraggable(cityPopup);
}

function closeCityPopup() {
    cityPopup.classList.remove('active');
    currentCity = null;
}

function openCompareModal(name, country) {
    const modal = document.getElementById('compareModal');
    document.getElementById('compareModalTitle').textContent = `Compare ${name} with:`;
    document.getElementById('city1Data').value = `${name}|${country}`;
    
    const cities = allCities.filter(c => !(c.name === name && c.country === country)).sort((a, b) => a.name.localeCompare(b.name));
    const options = cities.map(c => `<option value="${c.name}|${c.country}">${c.name}, ${c.country}</option>`).join('');
    document.getElementById('city2Select').innerHTML = '<option value="">Select City</option>' + options;
    
    modal.classList.add('active');
}

function closeCompareModal() {
    document.getElementById('compareModal').classList.remove('active');
}

function confirmCompare() {
    const city1 = document.getElementById('city1Data').value;
    const city2 = document.getElementById('city2Select').value;
    
    if (!city2) return;
    
    document.getElementById('compareCity1').value = city1;
    document.getElementById('compareCity2').value = city2;
    document.querySelector('.nav-tab[data-tab="compare"]').click();
    updateComparison();
    closeCompareModal();
}

function setupMapClickHandler() {
    map.on('click', function(e) {
        closeCityPopup();
    });
    map.on('zoomstart', function(e) {
        closeCityPopup();
    });
    map.on('movestart', function(e) {
        closeCityPopup();
    });
}

function showCityFromPopup(name, country) {
    const city = allCities.find(c => c.name === name && c.country === country);
    if (city) {
        showCityCardPopup(city);
    }
}

function initMap() {
    map = L.map('map', {
        center: [20, 0],
        zoom: 2,
        zoomControl: true,
        preferCanvas: true,
        attributionControl: false,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0,
        minZoom: 2
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap, © CARTO',
        noWrap: true
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);            
    setupMapClickHandler();
}

function initSearch() {
    document.getElementById('citySearch').addEventListener('input', applyFilters);
}

function initFilters() {
    document.querySelectorAll('.system-filter').forEach(cb => {
        cb.addEventListener('change', applyFilters);
    });
    
    document.getElementById('multiSystemFilter').addEventListener('change', applyFilters);
    document.getElementById('continentFilter').addEventListener('change', updateCountryListByContinent);
    document.getElementById('countrySelect').addEventListener('change', applyFilters);
    document.getElementById('lengthPreset').addEventListener('change', applyFilters);
    document.getElementById('systemCountPreset').addEventListener('change', applyFilters);
    
    document.getElementById('minSystems').addEventListener('input', (e) => {
        document.getElementById('minSystemsValue').textContent = e.target.value === '0' ? '0+' : e.target.value + '+';
        applyFilters();
    });
    
    document.getElementById('minLines').addEventListener('input', (e) => {
        document.getElementById('minLinesValue').textContent = e.target.value === '0' ? '0+' : e.target.value + '+';
        applyFilters();
    });
    
    document.getElementById('minLength').addEventListener('input', updateLengthRange);
    document.getElementById('maxLength').addEventListener('input', updateLengthRange);
}

function updateLengthRange() {
    const min = document.getElementById('minLength').value;
    const max = document.getElementById('maxLength').value;
    document.getElementById('lengthRangeValue').textContent = `${min}-${max}`;
    applyFilters();
}

function updateStats() {
    document.getElementById('totalCitiesCount').textContent = allCities.length;
    let totalSystems = 0;
    allCities.forEach(city => totalSystems += city.systemCount);
    document.getElementById('totalSystemsCount').textContent = totalSystems;
    document.getElementById('visibleCitiesCount').textContent = markers.getLayers().length;
}

function updateRankings() {
    const type = document.getElementById('rankingType')?.value || 'length';
    let sorted = [...allCities];
    
    switch(type) {
        case 'length':
            sorted.sort((a, b) => b.totalLength - a.totalLength);
            break;
        case 'stations':
            sorted.sort((a, b) => b.totalStations - a.totalStations);
            break;
        case 'lines':
            sorted.sort((a, b) => b.totalLines - a.totalLines);
            break;
        case 'systems':
            sorted.sort((a, b) => b.systemCount - a.systemCount);
            break;
    }
    
    const top20 = sorted.slice(0, 20).filter(c => {
        if (type === 'length') return c.totalLength > 0;
        if (type === 'stations') return c.totalStations > 0;
        if (type === 'lines') return c.totalLines > 0;
        return c.systemCount > 0;
    });
    
    const list = document.getElementById('rankingList');
    if (!list) return;
    
    list.innerHTML = top20.map((city, i) => {
        let value = '';
        if (type === 'length') value = city.totalLength.toFixed(1) + ' km';
        else if (type === 'stations') value = city.totalStations + ' stations';
        else if (type === 'lines') value = city.totalLines + ' lines';
        else value = city.systemCount + ' systems';
        
        return `
            <div class="ranking-item" onclick="showCityFromPopup('${city.name}', '${city.country}')">
                <div class="ranking-number">${i + 1}</div>
                <div class="ranking-info">
                    <div class="ranking-city">${city.name}</div>
                    <div class="ranking-country">${city.country}</div>
                </div>
                <div class="ranking-value">${value}</div>
            </div>
        `;
    }).join('');
}

function updateCompareSelectors() {
    const cities = allCities.filter(c => c.systemCount > 0).sort((a, b) => a.name.localeCompare(b.name));
    const options = cities.map(c => `<option value="${c.name}|${c.country}">${c.name}, ${c.country}</option>`).join('');
    
    const sel1 = document.getElementById('compareCity1');
    const sel2 = document.getElementById('compareCity2');
    if (!sel1 || !sel2) return;
    
    sel1.innerHTML = '<option value="">Select City 1</option>' + options;
    sel2.innerHTML = '<option value="">Select City 2</option>' + options;
    
    sel1.addEventListener('change', updateComparison);
    sel2.addEventListener('change', updateComparison);
}

function updateComparison() {
    const val1 = document.getElementById('compareCity1').value;
    const val2 = document.getElementById('compareCity2').value;
    
    if (!val1 || !val2) return;         
    const [name1, country1] = val1.split('|');
    const [name2, country2] = val2.split('|');          
    const city1 = allCities.find(c => c.name === name1 && c.country === country1);
    const city2 = allCities.find(c => c.name === name2 && c.country === country2);     
    if (!city1 || !city2) return;
    
    const table = document.getElementById('compareTable');
    table.innerHTML = `
        <div class="compare-row">
            <div class="compare-cell">City</div>
            <div class="compare-cell">${city1.name}</div>
            <div class="compare-cell">${city2.name}</div>
        </div>
        <div class="compare-row">
            <div class="compare-cell">Total Systems</div>
            <div class="compare-cell">${city1.systemCount}</div>
            <div class="compare-cell">${city2.systemCount}</div>
        </div>
        <div class="compare-row">
            <div class="compare-cell">Total Length</div>
            <div class="compare-cell">${city1.totalLength.toFixed(1)} km</div>
            <div class="compare-cell">${city2.totalLength.toFixed(1)} km</div>
        </div>
        <div class="compare-row">
            <div class="compare-cell">Total Stations</div>
            <div class="compare-cell">${city1.totalStations}</div>
            <div class="compare-cell">${city2.totalStations}</div>
        </div>
        <div class="compare-row">
            <div class="compare-cell">Total Lines</div>
            <div class="compare-cell">${city1.totalLines}</div>
            <div class="compare-cell">${city2.totalLines}</div>
        </div>
    `;
}

function updateDashboard() {
    const systemCounts = {};
    allCities.forEach(city => {
        Object.keys(city.systems).forEach(sys => {
            systemCounts[sys] = (systemCounts[sys] || 0) + 1;
        });
    });
    
    const ctx1 = document.getElementById('systemChart');
    if (ctx1 && window.Chart) {
        if (ctx1.chart) ctx1.chart.destroy();
        ctx1.chart = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: Object.keys(systemCounts),
                datasets: [{
                    label: 'Number of Cities',
                    data: Object.values(systemCounts),
                    backgroundColor: '#4a9eff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { 
                        beginAtZero: true,
                        ticks: { color: '#888' },
                        grid: { color: '#2a2a2a' }
                    },
                    x: { 
                        ticks: { color: '#888' },
                        grid: { display: false }
                    }
                }
            }
        });
    }
    
    const top10Length = allCities.filter(c => c.totalLength > 0).sort((a, b) => b.totalLength - a.totalLength).slice(0, 10);
    const ctx2 = document.getElementById('lengthChart');
    if (ctx2 && window.Chart) {
        if (ctx2.chart) ctx2.chart.destroy();
        ctx2.chart = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: top10Length.map(c => c.name),
                datasets: [{
                    label: 'Total Length (km)',
                    data: top10Length.map(c => c.totalLength),
                    backgroundColor: '#ff4757'
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    x: { 
                        beginAtZero: true,
                        ticks: { color: '#888' },
                        grid: { color: '#2a2a2a' }
                    },
                    y: { 
                        ticks: { color: '#888' },
                        grid: { display: false }
                    }
                }
            }
        });
    }
    
    const top10Stations = allCities.filter(c => c.totalStations > 0).sort((a, b) => b.totalStations - a.totalStations).slice(0, 10);
    const ctx3 = document.getElementById('stationsChart');
    if (ctx3 && window.Chart) {
        if (ctx3.chart) ctx3.chart.destroy();
        ctx3.chart = new Chart(ctx3, {
            type: 'bar',
            data: {
                labels: top10Stations.map(c => c.name),
                datasets: [{
                    label: 'Total Stations',
                    data: top10Stations.map(c => c.totalStations),
                    backgroundColor: '#2ed573'
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    x: { 
                        beginAtZero: true,
                        ticks: { color: '#888' },
                        grid: { color: '#2a2a2a' }
                    },
                    y: { 
                        ticks: { color: '#888' },
                        grid: { display: false }
                    }
                }
            }
        });
    }
    
    const top10Lines = allCities.filter(c => c.totalLines > 0).sort((a, b) => b.totalLines - a.totalLines).slice(0, 10);
    const ctx4 = document.getElementById('linesChart');
    if (ctx4 && window.Chart) {
        if (ctx4.chart) ctx4.chart.destroy();
        ctx4.chart = new Chart(ctx4, {
            type: 'bar',
            data: {
                labels: top10Lines.map(c => c.name),
                datasets: [{
                    label: 'Total Lines',
                    data: top10Lines.map(c => c.totalLines),
                    backgroundColor: '#ffa502'
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    x: { 
                        beginAtZero: true,
                        ticks: { color: '#888' },
                        grid: { color: '#2a2a2a' }
                    },
                    y: { 
                        ticks: { color: '#888' },
                        grid: { display: false }
                    }
                }
            }
        });
    }
}

function showRankingModal() {
    const modal = document.getElementById('rankingModal');
    modal.classList.add('active');
}

function closeRankingModal() {
    document.getElementById('rankingModal').classList.remove('active');
}

function showRankingOverlay() {
    const type = document.getElementById('rankingModalSelect').value;
    if (!type) return;
    
    const overlay = document.getElementById('overlayChart');
    const header = document.getElementById('chartHeader');
    const canvas = document.getElementById('overlayChartCanvas');
    
    if (currentOverlayChart) {
        currentOverlayChart.destroy();
    }
    
    let sorted = [...allCities];
    let title = '';
    let color = '#4a9eff';
    let isHorizontal = true;
    
    switch(type) {
        case 'length':
            sorted.sort((a, b) => b.totalLength - a.totalLength);
            title = 'Top 20 Cities by Total Length';
            color = '#ff4757';
            break;
        case 'stations':
            sorted.sort((a, b) => b.totalStations - a.totalStations);
            title = 'Top 20 Cities by Stations';
            color = '#2ed573';
            break;
        case 'lines':
            sorted.sort((a, b) => b.totalLines - a.totalLines);
            title = 'Top 20 Cities by Lines';
            color = '#ffa502';
            break;
        case 'systems':
            sorted.sort((a, b) => b.systemCount - a.systemCount);
            title = 'Top 20 Cities by Systems';
            color = '#4a9eff';
            break;
    }
    
    const top20 = sorted.slice(0, 20).filter(c => {
        if (type === 'length') return c.totalLength > 0;
        if (type === 'stations') return c.totalStations > 0;
        if (type === 'lines') return c.totalLines > 0;
        return c.systemCount > 0;
    });
    
    const labels = top20.map(c => c.name);
    const data = top20.map(c => {
        if (type === 'length') return c.totalLength;
        if (type === 'stations') return c.totalStations;
        if (type === 'lines') return c.totalLines;
        return c.systemCount;
    });
    
    header.textContent = title;
    currentOverlayChart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: data,
                backgroundColor: color
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { 
                    beginAtZero: true,
                    ticks: { color: '#888' },
                    grid: { color: '#2a2a2a' }
                },
                y: { 
                    ticks: { color: '#888' },
                    grid: { display: false }
                }
            }
        }
    });
    
    overlay.classList.add('active');
    makeChartDraggable(overlay);
    closeRankingModal();
}

function showOverlayChart(type) {
    const overlay = document.getElementById('overlayChart');
    const header = document.getElementById('chartHeader');
    const canvas = document.getElementById('overlayChartCanvas');
    
    if (currentOverlayChart) {
        currentOverlayChart.destroy();
    }
    
    let data, labels, title, color, isHorizontal = false;
    
    if (type === 'system') {
        const systemCounts = {};
        allCities.forEach(city => {
            Object.keys(city.systems).forEach(sys => {
                systemCounts[sys] = (systemCounts[sys] || 0) + 1;
            });
        });
        labels = Object.keys(systemCounts);
        data = Object.values(systemCounts);
        title = 'System Type Distribution';
        color = '#4a9eff';
        isHorizontal = false;
    } else if (type === 'length') {
        const top10 = allCities.filter(c => c.totalLength > 0).sort((a, b) => b.totalLength - a.totalLength).slice(0, 10);
        labels = top10.map(c => c.name);
        data = top10.map(c => c.totalLength);
        title = 'Top 10 Cities by Total Length';
        color = '#ff4757';
        isHorizontal = true;
    } else if (type === 'stations') {
        const top10 = allCities.filter(c => c.totalStations > 0).sort((a, b) => b.totalStations - a.totalStations).slice(0, 10);
        labels = top10.map(c => c.name);
        data = top10.map(c => c.totalStations);
        title = 'Top 10 Cities by Stations';
        color = '#2ed573';
        isHorizontal = true;
    } else if (type === 'lines') {
        const top10 = allCities.filter(c => c.totalLines > 0).sort((a, b) => b.totalLines - a.totalLines).slice(0, 10);
        labels = top10.map(c => c.name);
        data = top10.map(c => c.totalLines);
        title = 'Top 10 Cities by Lines';
        color = '#ffa502';
        isHorizontal = true;
    }
    
    header.textContent = title;
    currentOverlayChart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: data,
                backgroundColor: color
            }]
        },
        options: {
            indexAxis: isHorizontal ? 'y' : 'x',
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { 
                    beginAtZero: true,
                    ticks: { color: '#888' },
                    grid: { color: '#2a2a2a' }
                },
                y: { 
                    ticks: { color: '#888' },
                    grid: { display: false }
                }
            }
        }
    });
    
    overlay.classList.add('active');
    makeChartDraggable(overlay);
    document.getElementById('statsModal').classList.remove('active');
}

function closeOverlayChart() {
    document.getElementById('overlayChart').classList.remove('active');
    if (currentOverlayChart) {
        currentOverlayChart.destroy();
        currentOverlayChart = null;
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const showBtn = document.getElementById('showSidebarBtn');
    sidebar.classList.toggle('sidebar-hidden');
    
    if (sidebar.classList.contains('sidebar-hidden')) {
        showBtn.style.display = 'block';
        showBtn.textContent = '☰ Show Panel';
    } else {
        showBtn.style.display = 'none';
        showBtn.textContent = '☰';
    }
}

function exportData() {
    let csv = 'City,Country,Systems,Length,Stations,Lines\n';
    allCities.forEach(city => {
        csv += `${city.name},${city.country},${city.systemCount},${city.totalLength},${city.totalStations},${city.totalLines}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transit_data.csv';
    a.click();
}

function exportComparison() {
    const val1 = document.getElementById('compareCity1').value;
    const val2 = document.getElementById('compareCity2').value;
    if (!val1 || !val2) return;
    
    const [name1, country1] = val1.split('|');
    const [name2, country2] = val2.split('|');
    const city1 = allCities.find(c => c.name === name1 && c.country === country1);
    const city2 = allCities.find(c => c.name === name2 && c.country === country2);
    
    let csv = `Metric,${city1.name},${city2.name}\n`;
    csv += `Systems,${city1.systemCount},${city2.systemCount}\n`;
    csv += `Length,${city1.totalLength},${city2.totalLength}\n`;
    csv += `Stations,${city1.totalStations},${city2.totalStations}\n`;
    csv += `Lines,${city1.totalLines},${city2.totalLines}\n`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'comparison.csv';
    a.click();
}

document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab + 'Tab').classList.add('active');
    });
});

document.getElementById('rankingType')?.addEventListener('change', updateRankings);

window.onload = async function() {
    initMap();
    initSearch();
    initFilters();
    await loadAllData();
    document.getElementById('loadingScreen').style.display = 'none';
};