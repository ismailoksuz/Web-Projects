const map = L.map('map', {
    zoomControl: false,
    minZoom: 3
}).setView([48, 10], 4);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

const clusterGroup = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 45,
    spiderfyOnMaxZoom: true
});

let teamsData = [],
    matchesData = [],
    markers = {};

async function init() {
    try {
        const [tRes, mRes] = await Promise.all([
            fetch('data/teams.json'),
            fetch('data/matches.json')
        ]);
        teamsData = await tRes.json();
        matchesData = await mRes.json();
        render();
    } catch (e) {
        console.error("Veri yükleme hatası!", e);
    }
}

function render() {
    teamsData.forEach(team => {
        const icon = L.divIcon({
            className: 'custom-team-marker',
            html: `
        <div class="marker-logo-only">
            <img src="${team.logo_url}" onerror="this.src='https://img.uefa.com/imgml/uefacom/elements/main-nav/uefa-logo.svg'">
        </div>
    `,
            iconSize: [50, 50],
            iconAnchor: [25, 25]
        });

        const marker = L.marker(team.coords, {
            icon
        });
        markers[team.id] = marker;
        marker.on('click', function(e) {
            const currentZoom = map.getZoom();
            const targetZoom = currentZoom < 8 ? 8 : currentZoom;
            map.flyTo(e.latlng, targetZoom, {
                duration: 1.2,
                easeLinearity: 0.25
            });
        });

        marker.bindPopup(() => createPopup(team), {
            closeButton: false
        });
        clusterGroup.addLayer(marker);
    });
    map.addLayer(clusterGroup);
}



function createPopup(team) {
    const flag = `https://api.fifa.com/api/v3/picture/flags-sq-2/${team.country_code}`;
    const teamMatchObj = matchesData.find(m => m.id.toLowerCase() === team.id.toLowerCase());
    const matches = teamMatchObj ? [...teamMatchObj.matches].reverse() : [];
    const getStageName = (week) => {
        if (week >= 1 && week <= 8) return `Group Stage Matchday ${week}`;
        if (week == 9) return "Play-Off Leg 1";
        if (week == 10) return "Play-Off Leg 2";
        if (week == 11) return "Round Of 16 Leg 1";
        if (week == 12) return "Round Of 16 Leg 2";
        if (week == 13) return "Quarter Final Leg 1";
        if (week == 14) return "Quarter Final Leg 2";
        if (week == 15) return "Semi Final Leg 1";
        if (week == 16) return "Semi Final Leg 2";
        if (week == 17) return "Final";
        return `W${week}`;
    };

    let matchHtml = matches.map(m => `
        <div class="match-row" onclick="jumpTo('${m.opponentId}')">
            <div class="res-badge ${m.result.toLowerCase()}">${m.result}</div>
            <div style="display: flex; flex-direction: column; flex-grow: 1;">
                <span style="font-size: 12px; font-weight: 700;">${m.opponent}</span>
                <span style="font-size: 9px; color: var(--ucl-gold); font-weight: 800; letter-spacing: 0.5px;">${getStageName(m.week)}</span>
            </div>
            <span class="m-score">${m.score}</span>
        </div>
    `).join('');

    return `
        <div class="ucl-card">
            <div class="card-header">
                <div class="bg-flag" style="background-image: url('${flag}')"></div>
                <img src="${team.logo_url}" class="team-logo-card">
            </div>
            <div class="card-body">
                <h2 class="team-name">${team.name}</h2>
                <div class="team-meta">
                    <span>EST. ${team.founded}</span> • <span>${team.stadium}</span> • <span>${team.city}</span>
                </div>
                <div class="match-list">
                    ${matchHtml || '<p style="font-size:11px; color:#555; padding:10px;">No matches found.</p>'}
                </div>
            </div>
        </div>
    `;
}

map.on('popupopen', function() {
    if (window.innerWidth <= 768) {
        document.body.classList.add('popup-open');
    }
});

map.on('popupclose', function() {
    document.body.classList.remove('popup-open');
});

window.jumpTo = function(id) {
    const target = teamsData.find(t => t.id.toLowerCase() === id.toLowerCase());
    if (target) {
        map.closePopup();
        map.flyTo(target.coords, 8, {
            duration: 1.5
        });
        setTimeout(() => {
            const marker = markers[target.id];
            if (marker) {
                clusterGroup.zoomToShowLayer(marker, () => marker.openPopup());
            }
        }, 1800);
    }
};

init();