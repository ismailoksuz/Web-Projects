let currentQualifiers = {};
let currentMode = 'ranking';
let KnockoutResults = {};
const FLAG_URL = (code) => {
    const clean = (code || 'TBD').trim().replace(/\s+/g, '');
    return `https://api.fifa.com/api/v3/picture/flags-sq-2/${clean}`;
};
const TEAM_CODES = {
    'Mexico': 'MEX',
    'S. Korea': 'KOR',
    'S. Africa': 'RSA',
    'Denmark': 'DEN',
    'Czechia': 'CZE',
    'Rep. of Ireland': 'IRL',
    'N. Macedonia': 'MKD',
    'Canada': 'CAN',
    'Switzerland': 'SUI',
    'Qatar': 'QAT',
    'Italy': 'ITA',
    'Wales': 'WAL',
    'Bosnia & H.': 'BIH',
    'N. Ireland': 'NIR',
    'Brazil': 'BRA',
    'Morocco': 'MAR',
    'Scotland': 'SCO',
    'Haiti': 'HAI',
    'USA': 'USA',
    'Australia': 'AUS',
    'Paraguay': 'PAR',
    'Turkey': 'TUR',
    'Romania': 'ROU',
    'Slovakia': 'SVK',
    'Kosovo': 'KOS',
    'Germany': 'GER',
    'Ecuador': 'ECU',
    'Ivory Coast': 'CIV',
    'Curacao': 'CUW',
    'Netherlands': 'NED',
    'Japan': 'JPN',
    'Tunisia': 'TUN',
    'Ukraine': 'UKR',
    'Poland': 'POL',
    'Albania': 'ALB',
    'Sweden': 'SWE',
    'Belgium': 'BEL',
    'Iran': 'IRN',
    'Egypt': 'EGY',
    'N. Zealand': 'NZL',
    'Spain': 'ESP',
    'Uruguay': 'URU',
    'Saudi Arabia': 'KSA',
    'Cape Verde': 'CPV',
    'France': 'FRA',
    'Senegal': 'SEN',
    'Norway': 'NOR',
    'Iraq': 'IRQ',
    'Bolivia': 'BOL',
    'Suriname': 'SUR',
    'Argentina': 'ARG',
    'Austria': 'AUT',
    'Algeria': 'ALG',
    'Jordan': 'JOR',
    'Portugal': 'POR',
    'Colombia': 'COL',
    'Uzbekistan': 'UZB',
    'Jamaica': 'JAM',
    'DR Congo': 'COD',
    'N. Caledonia': 'NCL',
    'England': 'ENG',
    'Croatia': 'CRO',
    'Panama': 'PAN',
    'Ghana': 'GHA',
    'TBD': 'TBD',
    'UEFA Path D Winner': 'EUW',
    'UEFA Path A Winner': 'EUW',
    'UEFA Path C Winner': 'EUW',
    'UEFA Path B Winner': 'EUW',
    'FIFA P/O 1 Winner': 'FIW',
    'FIFA P/O 2 Winner': 'FIW',
};
const initialGroups = {
    A: ['Mexico', 'S. Korea', 'S. Africa', 'UEFA Path D Winner'],
    B: ['Canada', 'Switzerland', 'Qatar', 'UEFA Path A Winner'],
    C: ['Brazil', 'Morocco', 'Scotland', 'Haiti'],
    D: ['USA', 'Australia', 'Paraguay', 'UEFA Path C Winner'],
    E: ['Germany', 'Ecuador', 'Ivory Coast', 'Curacao'],
    F: ['Netherlands', 'Japan', 'Tunisia', 'UEFA Path B Winner'],
    G: ['Belgium', 'Iran', 'Egypt', 'N. Zealand'],
    H: ['Spain', 'Uruguay', 'Saudi Arabia', 'Cape Verde'],
    I: ['France', 'Senegal', 'Norway', 'FIFA P/O 2 Winner'],
    J: ['Argentina', 'Austria', 'Algeria', 'Jordan'],
    K: ['Portugal', 'Colombia', 'Uzbekistan', 'FIFA P/O 1 Winner'],
    L: ['England', 'Croatia', 'Panama', 'Ghana']
};
const PATH_OPTIONS = {
    'pathA_winner': ['Italy', 'Wales', 'Bosnia & H.', 'N. Ireland'],
    'pathB_winner': ['Ukraine', 'Poland', 'Albania', 'Sweden'],
    'pathC_winner': ['Turkey', 'Romania', 'Slovakia', 'Kosovo'],
    'pathD_winner': ['Denmark', 'Czechia', 'Rep. of Ireland', 'N. Macedonia'],
    'pathFIFA1_winner': ['Jamaica', 'DR Congo', 'N. Caledonia'],
    'pathFIFA2_winner': ['Iraq', 'Bolivia', 'Suriname']
};
const PATH_MAPPING = {
    'UEFA Path D Winner': 'pathD_winner',
    'UEFA Path A Winner': 'pathA_winner',
    'UEFA Path C Winner': 'pathC_winner',
    'UEFA Path B Winner': 'pathB_winner',
    'FIFA P/O 1 Winner': 'pathFIFA1_winner',
    'FIFA P/O 2 Winner': 'pathFIFA2_winner',
};
const KNOCKOUT_SLOTS = [
    { id: 'M1', team1: 'A2', team2: 'B2', round: 'r32' },
    { id: 'M2', team1: 'E1', team2: 'T1', round: 'r32' },
    { id: 'M3', team1: 'F1', team2: 'C2', round: 'r32' },
    { id: 'M4', team1: 'C1', team2: 'F2', round: 'r32' },
    { id: 'M5', team1: 'I1', team2: 'T2', round: 'r32' },
    { id: 'M6', team1: 'E2', team2: 'I2', round: 'r32' },
    { id: 'M7', team1: 'A1', team2: 'T3', round: 'r32' },
    { id: 'M8', team1: 'L1', team2: 'T4', round: 'r32' },
    { id: 'M9', team1: 'D1', team2: 'T5', round: 'r32' },
    { id: 'M10', team1: 'G1', team2: 'T6', round: 'r32' },
    { id: 'M11', team1: 'K2', team2: 'L2', round: 'r32' },
    { id: 'M12', team1: 'H1', team2: 'J2', round: 'r32' },
    { id: 'M13', team1: 'B1', team2: 'T7', round: 'r32' },
    { id: 'M14', team1: 'J1', team2: 'H2', round: 'r32' },
    { id: 'M15', team1: 'K1', team2: 'T8', round: 'r32' },
    { id: 'M16', team1: 'D2', team2: 'G2', round: 'r32' },
    { id: 'R17', team1: 'M1W', team2: 'M3W', round: 'r16' },
    { id: 'R18', team1: 'M2W', team2: 'M5W', round: 'r16' },
    { id: 'R19', team1: 'M4W', team2: 'M6W', round: 'r16' },
    { id: 'R20', team1: 'M7W', team2: 'M8W', round: 'r16' },
    { id: 'R21', team1: 'M9W', team2: 'M10W', round: 'r16' },
    { id: 'R22', team1: 'M11W', team2: 'M12W', round: 'r16' },
    { id: 'R23', team1: 'M13W', team2: 'M15W', round: 'r16' },
    { id: 'R24', team1: 'M14W', team2: 'M16W', round: 'r16' },
    { id: 'Q25', team1: 'R17W', team2: 'R18W', round: 'qf' },
    { id: 'Q26', team1: 'R21W', team2: 'R22W', round: 'qf' },
    { id: 'Q27', team1: 'R19W', team2: 'R20W', round: 'qf' },
    { id: 'Q28', team1: 'R23W', team2: 'R24W', round: 'qf' },
    { id: 'S29', team1: 'Q25W', team2: 'Q26W', round: 'sf' },
    { id: 'S30', team1: 'Q27W', team2: 'Q28W', round: 'sf' },
    { id: 'T32', team1: 'S29L', team2: 'S30L', round: 'third' },
    { id: 'F31', team1: 'S29W', team2: 'S30W', round: 'final' }
];

let isPathsComplete = false;
let isGroupStageComplete = false;
let dragItem = null;

function getTeamFlag(teamName) {
    const code = TEAM_CODES[teamName] || 'TBD';
    return `<img src="${FLAG_URL(code)}" class="flag" onerror="this.src='${FLAG_URL('TBD')}'" alt="${teamName}">`;
}

function checkStaging() {
    const groupStageSection = document.getElementById('groupStageSection');
    const knockoutSection = document.getElementById('knockoutSection');
    const pathSelects = document.querySelectorAll('.paths-selection select');
    isPathsComplete = Array.from(pathSelects).every(s => s.value !== '');

    if (isPathsComplete) {
        groupStageSection.style.display = 'block';
    } else {
        groupStageSection.style.display = 'none';
        knockoutSection.style.display = 'none';
        isGroupStageComplete = false;
    }

    if (currentMode === 'score') {
        let totalCompletedGroups = 0;
        const totalGroups = Object.keys(initialGroups).length;
        document.querySelectorAll('.group-box').forEach(groupBox => {
            let matchesEnteredInGroup = 0;
            groupBox.querySelectorAll('.match').forEach((matchDiv, index) => {
                const score1Input = matchDiv.querySelector(`.score-input[data-match="${groupBox.dataset.group}-${index}-1"]`);
                const score2Input = matchDiv.querySelector(`.score-input[data-match="${groupBox.dataset.group}-${index}-2"]`);
                if (score1Input.value !== '' && score2Input.value !== '') {
                    matchesEnteredInGroup++;
                }
            });
            if (matchesEnteredInGroup === 6) {
                totalCompletedGroups++;
            }
        });
        isGroupStageComplete = (totalCompletedGroups === totalGroups);
    } else {
        isGroupStageComplete = window.rankingsConfirmed || false;
    }

    if (isGroupStageComplete) {
        knockoutSection.style.display = 'block';
    } else {
        knockoutSection.style.display = 'none';
    }
}

function initializePathSelectors() {
    for (const pathId in PATH_OPTIONS) {
        const select = document.getElementById(pathId);
        select.innerHTML = '<option value="">Select Winner</option>';
        PATH_OPTIONS[pathId].forEach(team => {
            select.innerHTML += `<option value="${team}">${getTeamFlag(team)} ${team}</option>`;
        });
    }
}

function updateGroupTeams() {
    const winners = {};
    document.querySelectorAll('.paths-selection select').forEach(select => {
        winners[select.id] = select.value;
    });
    const updatedGroups = JSON.parse(JSON.stringify(initialGroups));
    for (const groupKey in updatedGroups) {
        updatedGroups[groupKey] = updatedGroups[groupKey].map(team => {
            const pathId = PATH_MAPPING[team];
            if (pathId && winners[pathId] && winners[pathId] !== '') {
                return winners[pathId];
            }
            return team;
        });
    }
    if (currentMode === 'score') {
        renderGroups(updatedGroups);
    } else {
        renderRankingMode(updatedGroups);
    }
    updateKnockoutStage();
    checkStaging();
}

function renderGroups(groupsData) {
    const groupStageDiv = document.getElementById('groupStage');
    groupStageDiv.innerHTML = '';
    for (const groupName in groupsData) {
        const teams = groupsData[groupName];
        const groupBox = document.createElement('div');
        groupBox.className = 'group-box';
        groupBox.dataset.group = groupName;
        groupBox.innerHTML = `<h3>Group ${groupName}</h3>`;
        const matches = [
            [teams[0], teams[1]],
            [teams[2], teams[3]],
            [teams[0], teams[2]],
            [teams[1], teams[3]],
            [teams[0], teams[3]],
            [teams[1], teams[2]]
        ];
        matches.forEach((match, index) => {
            const matchDiv = document.createElement('div');
            matchDiv.className = 'match';
            matchDiv.innerHTML = `
                <span class="team-display"><span class="team-name" title="${match[0]}">${match[0]}</span> ${getTeamFlag(match[0])}</span>
                <input type="number" min="0" max="99" class="score-input" data-match="${groupName}-${index}-1" oninput="updateKnockoutStage()">
                -
                <input type="number" min="0" max="99" class="score-input" data-match="${groupName}-${index}-2" oninput="updateKnockoutStage()">
                <span class="team-display left">${getTeamFlag(match[1])} <span class="team-name" title="${match[1]}">${match[1]}</span></span>
            `;
            groupBox.appendChild(matchDiv);
        });
        groupStageDiv.appendChild(groupBox);
    }
}

function calculateGroupStandings(group, matches) {
    const standings = {};
    group.forEach(team => {
        standings[team] = { P: 0, G: 0, B: 0, M: 0, AG: 0, YG: 0, AV: 0, PTS: 0, Group: '', Name: team };
    });
    matches.forEach(match => {
        const [t1, t2, s1, s2] = [match.team1, match.team2, parseInt(match.score1), parseInt(match.score2)];
        if (isNaN(s1) || isNaN(s2) || !standings[t1] || !standings[t2]) return;
        standings[t1].AG += s1;
        standings[t1].YG += s2;
        standings[t2].AG += s2;
        standings[t2].YG += s1;
        standings[t1].P++;
        standings[t2].P++;
        if (s1 > s2) {
            standings[t1].PTS += 3;
            standings[t1].G += 1;
            standings[t2].M += 1;
        } else if (s1 < s2) {
            standings[t2].PTS += 3;
            standings[t2].G += 1;
            standings[t1].M += 1;
        } else {
            standings[t1].PTS += 1;
            standings[t2].PTS += 1;
            standings[t1].B += 1;
            standings[t2].B += 1;
        }
    });
    Object.values(standings).forEach(team => {
        team.AV = team.AG - team.YG;
    });
    return Object.values(standings).sort((a, b) => {
        if (b.PTS !== a.PTS) return b.PTS - a.PTS;
        if (b.AV !== a.AV) return b.AV - a.AV;
        if (b.AG !== a.AG) return b.AG - a.AG;
        return (FIFA_RANKING[a.Name] || 100) - (FIFA_RANKING[b.Name] || 100);
    });
}

function renderStandings(groupName, standings) {
    const groupBox = document.querySelector(`.group-box[data-group="${groupName}"]`);
    if (!groupBox) return;
    let tableHTML = `<table class="standings-table" id="standings-${groupName}"><tr><th>#</th><th>Team</th><th>P</th><th>G</th><th>B</th><th>M</th><th>GF</th><th>GA</th><th>GD</th><th>PTS</th></tr>`;
    standings.forEach((team, index) => {
        tableHTML += `<tr><td>${index + 1}</td><td style="text-align: left; white-space: nowrap;">${getTeamFlag(team.Name)} ${team.Name}</td><td>${team.P}</td><td>${team.G}</td><td>${team.B}</td><td>${team.M}</td><td>${team.AG}</td><td>${team.YG}</td><td>${team.AV > 0 ? '+' + team.AV : team.AV}</td><td>${team.PTS}</td></tr>`;
    });
    tableHTML += '</table>';
    const existingTable = groupBox.querySelector(`#standings-${groupName}`);
    if (existingTable) {
        existingTable.outerHTML = tableHTML;
    } else {
        groupBox.insertAdjacentHTML('beforeend', tableHTML);
    }
}

function updateKnockoutStage() {
    if (currentMode === 'ranking' && isGroupStageComplete && Object.keys(currentQualifiers).length > 0) {
        renderKnockout();
        return;
    }

    const allThirdPlaceTeams = [];
    const qualifiers = {};
    let allGroupsCompleted = true;

    document.querySelectorAll('.group-box').forEach(groupBox => {
        const groupName = groupBox.dataset.group;
        const teams = [];
        const matches = [];
        let matchesEnteredInGroup = 0;

        groupBox.querySelectorAll('.match').forEach((matchDiv, index) => {
            const teamNames = matchDiv.querySelectorAll('.team-name');
            const team1 = teamNames[0] ? teamNames[0].textContent.trim() : '';
            const team2 = teamNames[1] ? teamNames[1].textContent.trim() : '';
            const score1Input = matchDiv.querySelector(`.score-input[data-match="${groupName}-${index}-1"]`);
            const score2Input = matchDiv.querySelector(`.score-input[data-match="${groupName}-${index}-2"]`);

            if (team1 && !teams.includes(team1)) teams.push(team1);
            if (team2 && !teams.includes(team2)) teams.push(team2);

            if (score1Input.value !== '' && score2Input.value !== '') {
                matches.push({
                    team1,
                    team2,
                    score1: score1Input.value,
                    score2: score2Input.value
                });
                matchesEnteredInGroup++;
            }
        });

        if (teams.length === 4) {
            const standings = calculateGroupStandings(teams, matches);
            renderStandings(groupName, standings);

            if (matchesEnteredInGroup === 6) {
                qualifiers[`${groupName}1`] = standings[0].Name;
                qualifiers[`${groupName}2`] = standings[1].Name;
                if (standings.length >= 3) {
                    standings[2].Group = groupName;
                    allThirdPlaceTeams.push(standings[2]);
                }
            } else {
                allGroupsCompleted = false;
            }
        } else {
            allGroupsCompleted = false;
        }
    });

    const bestThirdPlace = allThirdPlaceTeams.sort((a, b) => {
        if (b.PTS !== a.PTS) return b.PTS - a.PTS;
        if (b.AV !== a.AV) return b.AV - a.AV;
        if (b.AG !== a.AG) return b.AG - a.AG;
        return (FIFA_RANKING[a.Name] || 100) - (FIFA_RANKING[b.Name] || 100);
    }).slice(0, 8);

    if (bestThirdPlace.length === 8) {
        const thirdGroups = bestThirdPlace.map(t => t.Group).sort();
        const key = thirdGroups.join('');
        const matchups = thirdPlacePairings[key];

        if (matchups) {
            const winnerToTSlot = {
                "1A": "T3",
                "1B": "T7",
                "1D": "T5",
                "1E": "T1",
                "1G": "T6",
                "1I": "T2",
                "1K": "T8",
                "1L": "T4"
            };

            for (const [winnerSlot, thirdSlot] of Object.entries(matchups)) {
                const group = thirdSlot.charAt(1);
                const team = bestThirdPlace.find(t => t.Group === group);
                const tSlot = winnerToTSlot[winnerSlot];
                if (team && tSlot) {
                    qualifiers[tSlot] = team.Name;
                }
            }

            const allTSlots = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8"];
            allTSlots.forEach(tSlot => {
                if (!qualifiers[tSlot]) {
                    const index = parseInt(tSlot.charAt(1)) - 1;
                    if (bestThirdPlace[index]) {
                        qualifiers[tSlot] = bestThirdPlace[index].Name;
                    }
                }
            });
        } else {
            bestThirdPlace.forEach((team, index) => {
                qualifiers[`T${index + 1}`] = team.Name;
            });
        }
    } else if (bestThirdPlace.length > 0) {
        bestThirdPlace.forEach((team, index) => {
            qualifiers[`T${index + 1}`] = team.Name;
        });
    }

    if (allGroupsCompleted) {
        currentQualifiers = qualifiers;
    } else {
        currentQualifiers = {};
    }

    checkStaging();
    renderKnockout();
}

function renderRankingMode(groupsData) {
    const groupStageDiv = document.getElementById('groupStage');
    groupStageDiv.innerHTML = '';

    for (const groupName in groupsData) {
        const teams = groupsData[groupName];
        const groupBox = document.createElement('div');
        groupBox.className = 'group-box';
        groupBox.innerHTML = `<h3>Group ${groupName} — Drag to Rank</h3>`;

        const list = document.createElement('ul');
        list.className = 'ranking-list';
        list.style.listStyle = 'none';
        list.style.padding = '0';
        list.style.minHeight = '100px';
        list.dataset.group = groupName;

        teams.forEach(team => {
            const li = document.createElement('li');
            li.className = 'draggable-team';
            li.innerHTML = `${getTeamFlag(team)} ${team}`;
            li.dataset.team = team;
            li.style.padding = '10px';
            li.style.border = '1px solid #ddd';
            li.style.borderRadius = '6px';
            li.style.margin = '4px 0';
            li.style.cursor = 'grab';
            li.style.backgroundColor = '#f9f9f9';
            li.style.position = 'relative';
            li.style.zIndex = '1';
            list.appendChild(li);
        });

        groupBox.appendChild(list);
        groupStageDiv.appendChild(groupBox);
    }

    setTimeout(() => {
        activateCustomDragDrop();
        checkAllGroupsRanked();
    }, 100);

    window.rankingsConfirmed = false;

    const selectThirdBtn = document.createElement('button');
    selectThirdBtn.id = 'selectThirdBtn';
    selectThirdBtn.textContent = '✅ Confirm Rankings & Select 8 Third-Place Teams';
    selectThirdBtn.style.display = 'block';
    selectThirdBtn.style.margin = '20px auto';
    selectThirdBtn.style.padding = '10px 20px';
    selectThirdBtn.style.backgroundColor = '#004d40';
    selectThirdBtn.style.color = 'white';
    selectThirdBtn.style.border = 'none';
    selectThirdBtn.style.borderRadius = '5px';
    selectThirdBtn.style.cursor = 'pointer';
    selectThirdBtn.disabled = true;
    selectThirdBtn.addEventListener('click', () => selectThirdPlaceTeams(groupsData));
    groupStageDiv.appendChild(selectThirdBtn);
}

function activateCustomDragDrop() {
    const draggables = document.querySelectorAll('.draggable-team');
    let draggedItem = null;
    let placeholder = null;
    let dragClone = null;

    draggables.forEach(item => {
        item.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            draggedItem = item;
            const parent = item.parentNode;            
            placeholder = item.cloneNode(true);
            placeholder.className = 'drag-placeholder';
            placeholder.style.opacity = '0.5';
            placeholder.style.pointerEvents = 'none';
            placeholder.style.listStyle = 'none';            
            parent.insertBefore(placeholder, item);            
            item.style.display = 'none';
            dragClone = item.cloneNode(true);
            const originalRect = item.getBoundingClientRect();
            dragClone.style.position = 'fixed';
            dragClone.style.zIndex = '9999';
            dragClone.style.left = originalRect.left + 'px';
            dragClone.style.top = originalRect.top + 'px';
            dragClone.style.width = originalRect.width + 'px';
            dragClone.style.height = originalRect.height + 'px';
            dragClone.style.opacity = '0.9';
            dragClone.style.cursor = 'grabbing';
            dragClone.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
            dragClone.style.pointerEvents = 'none';
            dragClone.style.listStyle = 'none';
            
            const computedStyle = window.getComputedStyle(item);
            ['backgroundColor', 'color', 'border', 'borderRadius', 
             'padding', 'fontSize', 'fontWeight', 'display',
             'alignItems', 'justifyContent'].forEach(prop => {
                dragClone.style[prop] = computedStyle[prop];
            });
            
            document.body.appendChild(dragClone);

            const shiftX = e.clientX - originalRect.left;
            const shiftY = e.clientY - originalRect.top;

            const onMouseMove = (e) => {
                const x = e.clientX - shiftX;
                const y = e.clientY - shiftY;
                dragClone.style.left = x + 'px';
                dragClone.style.top = y + 'px';

                const elements = document.elementsFromPoint(e.clientX, e.clientY);
                for (const el of elements) {
                    if (el !== placeholder && 
                        el.classList.contains('draggable-team') && 
                        el.parentNode === parent) {
                        
                        const rect = el.getBoundingClientRect();
                        const mid = rect.top + rect.height / 2;
                        
                        if (e.clientY < mid) {
                            parent.insertBefore(placeholder, el);
                        } else {
                            parent.insertBefore(placeholder, el.nextSibling);
                        }
                        break;
                    }
                }
            };

            const onMouseUp = () => {
                if (!draggedItem) return;                
                const placeholderRect = placeholder.getBoundingClientRect();
                dragClone.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                dragClone.style.left = placeholderRect.left + 'px';
                dragClone.style.top = placeholderRect.top + 'px';
                dragClone.style.opacity = '0.5';
                
                setTimeout(() => {
                    if (dragClone && dragClone.parentNode) {
                        dragClone.parentNode.removeChild(dragClone);
                    }
                    
                    draggedItem.style.display = '';
                    parent.insertBefore(draggedItem, placeholder);
                    parent.removeChild(placeholder);
                    
                    draggedItem = null;
                    placeholder = null;
                    dragClone = null;
                    checkAllGroupsRanked();
                }, 300);
                
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    });
}

function checkAllGroupsRanked() {
    const allLists = document.querySelectorAll('.ranking-list');
    let allRanked = true;
    allLists.forEach(list => {
        const items = list.querySelectorAll('.draggable-team');
        if (items.length !== 4) allRanked = false;
    });
    const btn = document.getElementById('selectThirdBtn');
    if (btn) btn.disabled = !allRanked;
}

function selectThirdPlaceTeams(groupsData) {
    currentQualifiers = {};
    document.querySelectorAll('.ranking-list').forEach(list => {
        const groupName = list.dataset.group;
        const items = list.querySelectorAll('.draggable-team');
        if (items[0]) currentQualifiers[`${groupName}1`] = items[0].dataset.team;
        if (items[1]) currentQualifiers[`${groupName}2`] = items[1].dataset.team;
    });
    
    const thirdTeams = [];
    document.querySelectorAll('.ranking-list').forEach(list => {
        const items = list.querySelectorAll('.draggable-team');
        if (items[2]) {
            thirdTeams.push({
                group: list.dataset.group,
                team: items[2].dataset.team
            });
        }
    });

    if (thirdTeams.length < 8) {
        alert('You need at least 8 groups to choose 8 third-place teams.');
        return;
    }

    const groupStageDiv = document.getElementById('groupStage');
    groupStageDiv.innerHTML = '<h3>Select 8 Best Third-Place Teams</h3><p>Click to select (8 required):</p>';

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexWrap = 'wrap';
    container.style.gap = '10px';
    container.style.marginTop = '10px';

    let selectedCount = 0;
    const selectedTeams = [];

    thirdTeams.forEach(({ group, team }) => {
        const card = document.createElement('div');
        card.className = 'third-team-card';
        card.innerHTML = `${getTeamFlag(team)} ${team} <small>(Group ${group})</small>`;
        card.style.padding = '10px';
        card.style.border = '1px solid #ccc';
        card.style.borderRadius = '6px';
        card.style.cursor = 'pointer';
        card.style.backgroundColor = '#f0f8ff';
        card.style.transition = 'background 0.2s';

        card.addEventListener('click', () => {
            if (selectedTeams.includes(team)) {
                selectedTeams.splice(selectedTeams.indexOf(team), 1);
                card.style.backgroundColor = '#f0f8ff';
                selectedCount--;
            } else if (selectedCount < 8) {
                selectedTeams.push(team);
                card.style.backgroundColor = '#a5d6a7';
                selectedCount++;
            }
            if (selectedCount === 8) {
                finalizeThirdPlaceSelection(selectedTeams, groupsData);
            }
        });

        container.appendChild(card);
    });

    groupStageDiv.appendChild(container);
}

function finalizeThirdPlaceSelection(selectedTeams, groupsData) {
    selectedTeams.slice(0, 8).forEach((team, i) => {
        currentQualifiers[`T${i + 1}`] = team;
    });

    isGroupStageComplete = true;
    window.rankingsConfirmed = true;
    document.getElementById('knockoutSection').style.display = 'block';
    renderKnockout();
}

const resolveTeam = (slotId) => {
    if (currentQualifiers[slotId]) return currentQualifiers[slotId];
    if (KnockoutResults[slotId]) return KnockoutResults[slotId];
    if (slotId.endsWith('W')) {
        const base = slotId.slice(0, -1);
        return KnockoutResults[base] || 'TBD';
    }
    if (slotId.endsWith('L')) {
        const base = slotId.slice(0, -1);
        const winner = KnockoutResults[base];
        if (!winner || winner === 'TBD') return 'TBD';
        const match = KNOCKOUT_SLOTS.find(m => m.id === base);
        if (!match) return 'TBD';
        const t1 = resolveTeam(match.team1);
        const t2 = resolveTeam(match.team2);
        return winner === t1 ? t2 : t1;
    }
    return 'TBD';
};

function handleClickTeam(matchId, clickedTeamName, team1Slot, team2Slot) {
    if (clickedTeamName === 'TBD') return;
    const team1Name = resolveTeam(team1Slot);
    const team2Name = resolveTeam(team2Slot);
    let winnerName = clickedTeamName;
    let loserName = (winnerName === team1Name) ? team2Name : team1Name;
    if (KnockoutResults[matchId] === winnerName) {
        winnerName = '';
        loserName = team2Name;
    }
    selectWinner(matchId, winnerName, loserName);
}

function selectWinner(matchId, winnerName, loserName) {
    if (KnockoutResults[matchId] !== winnerName) {
        KnockoutResults[matchId] = winnerName;
        if (matchId.startsWith('S')) {
            KnockoutResults[`${matchId}L`] = loserName;
        }
        renderKnockout();
    }
}

function renderMatchNode(slot) {
    const team1Slot = slot.team1;
    const team2Slot = slot.team2;
    const team1Name = resolveTeam(team1Slot);
    const team2Name = resolveTeam(team2Slot);
    const currentWinner = KnockoutResults[slot.id];
    const isTBD = team1Name === 'TBD' || team2Name === 'TBD';
    const team1Click = `handleClickTeam('${slot.id}', '${team1Name}', '${team1Slot}', '${team2Slot}')`;
    const team2Click = `handleClickTeam('${slot.id}', '${team2Name}', '${team1Slot}', '${team2Slot}')`;

    return `
        <div class="match-node" id="match-node-${slot.id}">
            <div class="team-option ${currentWinner === team1Name ? 'winner' : (currentWinner && currentWinner !== '') ? 'loser' : ''} ${team1Name === 'TBD' ? 'tbd' : ''}" onclick="${isTBD ? '' : team1Click}" data-teamname="${team1Name}">
                ${getTeamFlag(team1Name)} <span>${team1Name}</span>
            </div>
            <div class="team-option ${currentWinner === team2Name ? 'winner' : (currentWinner && currentWinner !== '') ? 'loser' : ''} ${team2Name === 'TBD' ? 'tbd' : ''}" onclick="${isTBD ? '' : team2Click}" data-teamname="${team2Name}">
                ${getTeamFlag(team2Name)} <span>${team2Name}</span>
            </div>
        </div>
    `;
}

function renderThirdPlaceMatch() {
    const S29L = resolveTeam('S29L');
    const S30L = resolveTeam('S30L');
    const T32Slot = KNOCKOUT_SLOTS.find(s => s.id === 'T32');
    const winner3rd = KnockoutResults.T32;
    const isTBD = S29L === 'TBD' || S30L === 'TBD';
    const team3rd1Click = `handleClickTeam('${T32Slot.id}', '${S29L}', '${T32Slot.team1}', '${T32Slot.team2}')`;
    const team3rd2Click = `handleClickTeam('${T32Slot.id}', '${S30L}', '${T32Slot.team1}', '${T32Slot.team2}')`;

    return `
        <div class="third-place-section" id="round-third">
            <h3>3rd Place Match</h3>
            <div class="round-matches">
                <div class="third-place-node match-node" id="match-node-T32">
                    <div class="team-option ${winner3rd === S29L ? 'winner' : (winner3rd && winner3rd !== '') ? 'loser' : ''} ${S29L === 'TBD' ? 'tbd' : ''}" onclick="${isTBD ? '' : team3rd1Click}" data-teamname="${S29L}">
                        ${getTeamFlag(S29L)} <span>${S29L}</span>
                    </div>
                    <div class="team-option ${winner3rd === S30L ? 'winner' : (winner3rd && winner3rd !== '') ? 'loser' : ''} ${S30L === 'TBD' ? 'tbd' : ''}" onclick="${isTBD ? '' : team3rd2Click}" data-teamname="${S30L}">
                        ${getTeamFlag(S30L)} <span>${S30L}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderFinalMatch() {
    const SFWinners = [resolveTeam('S29W'), resolveTeam('S30W')];
    const finalSlot = KNOCKOUT_SLOTS.find(s => s.id === 'F31');
    const winnerFinal = KnockoutResults.F31;
    const isTBD = SFWinners[0] === 'TBD' || SFWinners[1] === 'TBD';
    const teamFinal1Click = `handleClickTeam('${finalSlot.id}', '${SFWinners[0]}', '${finalSlot.team1}', '${finalSlot.team2}')`;
    const teamFinal2Click = `handleClickTeam('${finalSlot.id}', '${SFWinners[1]}', '${finalSlot.team1}', '${finalSlot.team2}')`;

    return `
        <div class="final-section" id="round-final">
            <h3>Final Match</h3>
            <div class="round-matches">
                <div class="final-match-node match-node" id="match-node-F31">
                    <div class="team-option ${winnerFinal === SFWinners[0] ? 'winner' : (winnerFinal && winnerFinal !== '') ? 'loser' : ''} ${SFWinners[0] === 'TBD' ? 'tbd' : ''}" onclick="${isTBD ? '' : teamFinal1Click}" data-teamname="${SFWinners[0]}">
                        ${getTeamFlag(SFWinners[0])} <span>${SFWinners[0]}</span>
                    </div>
                    <div class="team-option ${winnerFinal === SFWinners[1] ? 'winner' : (winnerFinal && winnerFinal !== '') ? 'loser' : ''} ${SFWinners[1] === 'TBD' ? 'tbd' : ''}" onclick="${isTBD ? '' : teamFinal2Click}" data-teamname="${SFWinners[1]}">
                        ${getTeamFlag(SFWinners[1])} <span>${SFWinners[1]}</span>
                    </div>
                </div>
            </div>
            <div class="champion-container">
                <h2>🏆 CHAMPION 🏆</h2>
                <p class="champion-text">${winnerFinal || 'TBD'}</p>
            </div>
        </div>
    `;
}

function renderKnockout() {
    if (currentMode === 'ranking' && isGroupStageComplete && Object.keys(currentQualifiers).length === 0) {
        document.getElementById('knockoutBracket').innerHTML = '<p style="color: red;">Please confirm group rankings and select third-place teams.</p>';
        return;
    }

    if (!isGroupStageComplete) {
        document.getElementById('knockoutBracket').innerHTML = '';
        return;
    }

    const container = document.getElementById('knockoutBracket');
    container.innerHTML = '';
    container.className = 'knockout-phase-container';

    const rounds = [
        { id: 'r32', title: 'Round of 32', slots: KNOCKOUT_SLOTS.slice(0, 16) },
        { id: 'r16', title: 'Round of 16', slots: KNOCKOUT_SLOTS.slice(16, 24) },
        { id: 'qf', title: 'Quarter-Finals', slots: KNOCKOUT_SLOTS.slice(24, 28) },
        { id: 'sf', title: 'Semi-Finals', slots: KNOCKOUT_SLOTS.slice(28, 30) }
    ];

    let previousRoundCompleted = true;
    rounds.forEach(round => {
        let roundHTML = `<div class="round-section" id="round-${round.id}"><h3>${round.title}</h3><div class="round-matches">`;
        if (previousRoundCompleted) {
            round.slots.forEach(slot => {
                roundHTML += renderMatchNode(slot);
            });
            roundHTML += `</div></div>`;
            container.innerHTML += roundHTML;
            const currentRoundCompleted = !round.slots.some(slot => !KnockoutResults[slot.id]);
            previousRoundCompleted = currentRoundCompleted;
        } else {
            container.innerHTML += `<div class="round-section" id="round-${round.id}"><h3>${round.title}</h3><p style="color: red; font-weight: bold;">The previous round was not completed.</p></div>`;
            previousRoundCompleted = false;
        }
    });

    const semiFinalCompleted = !KNOCKOUT_SLOTS.slice(28, 30).some(slot => !KnockoutResults[slot.id]);
    if (semiFinalCompleted) {
        container.innerHTML += renderThirdPlaceMatch();
        container.innerHTML += renderFinalMatch();
    } else {
        container.innerHTML += `
            <div class="round-section" id="round-third">
                <h3>3rd Place Match</h3>
                <p style="color: red; font-weight: bold;">Semi Final was not completed.</p>
            </div>
            <div class="round-section" id="round-final">
                <h3>Final Match</h3>
                <p style="color: red; font-weight: bold;">Semi Final was not completed.</p>
            </div>
        `;
    }
}

function fillRandomScores() {
    const scoreInputs = document.querySelectorAll('.score-input');
    scoreInputs.forEach(input => {
        input.value = Math.floor(Math.random() * 6);
    });
    updateKnockoutStage();
    const btn = document.getElementById('fillRandomBtn');
    btn.innerHTML = '✅ Scores Filled!';
    btn.style.backgroundColor = '#2e7d32';
    setTimeout(() => {
        btn.innerHTML = '🎲 Fill Random Scores';
        btn.style.backgroundColor = '#004d40';
    }, 1500);
}

document.addEventListener('DOMContentLoaded', () => {
    initializePathSelectors();
    updateGroupTeams();
    checkStaging();

    const fillBtn = document.getElementById('fillRandomBtn');
    if (currentMode === 'ranking') {
        fillBtn.style.display = 'none';
    }

    document.getElementById('modeToggleBtn').addEventListener('click', () => {
        KnockoutResults = {};
        currentQualifiers = {};
        isGroupStageComplete = false;
        window.rankingsConfirmed = false;
        
        document.getElementById('knockoutSection').style.display = 'none';
        document.getElementById('knockoutBracket').innerHTML = '';
    
        currentMode = currentMode === 'score' ? 'ranking' : 'score';
        const btn = document.getElementById('modeToggleBtn');
        const fillBtn = document.getElementById('fillRandomBtn');
    
        if (currentMode === 'ranking') {
            btn.textContent = '🔢 Switch to Score Mode';
            fillBtn.style.display = 'none';
            const winners = {};
            document.querySelectorAll('.paths-selection select').forEach(select => {
                winners[select.id] = select.value;
            });
            const updatedGroups = JSON.parse(JSON.stringify(initialGroups));
            for (const groupKey in updatedGroups) {
                updatedGroups[groupKey] = updatedGroups[groupKey].map(team => {
                    const pathId = PATH_MAPPING[team];
                    if (pathId && winners[pathId] && winners[pathId] !== '') {
                        return winners[pathId];
                    }
                    return team;
                });
            }
            renderRankingMode(updatedGroups);
        } else {
            btn.textContent = '🔄 Switch to Ranking Mode';
            fillBtn.style.display = 'inline-block';
            updateGroupTeams();
        }
    });

    document.getElementById('fillRandomBtn').addEventListener('click', fillRandomScores);
});
