const fs = require('fs');
const path = require('path');
const [,, id1, score, id2, week, tournament] = process.argv;

if (!id1 || !score || !id2 || !week || !tournament) {
    console.log("❌ Eksik bilgi! Kullanım:");
    console.log("node add.js <takım1> <skor> <takım2> <hafta> <ucl|uel|uecl>");
    process.exit(1);
}

const tournamentFolders = {
    'ucl': 'Champions',
    'uel': 'Europa',
    'uecl': 'Conference'
};

const folder = tournamentFolders[tournament.toLowerCase()];

if (!folder) {
    console.log("❌ Geçersiz turnuva! Seçenekler: ucl, uel, uecl");
    process.exit(1);
}

const matchesPath = path.join(__dirname, folder, 'data', 'matches.json');
const teamsPath = path.join(__dirname, folder, 'data', 'teams.json');
if (!fs.existsSync(matchesPath) || !fs.existsSync(teamsPath)) {
    console.log(`❌ Hata: ${folder} klasöründe data dosyaları bulunamadı!`);
    process.exit(1);
}

let matches = JSON.parse(fs.readFileSync(matchesPath, 'utf8'));
let teams = JSON.parse(fs.readFileSync(teamsPath, 'utf8'));

const t1 = teams.find(t => t.id === id1);
const t2 = teams.find(t => t.id === id2);

if (!t1 || !t2) {
    console.log(`❌ Hata: ${!t1 ? id1 : id2} ID'si ${folder} içinde bulunamadı!`);
    process.exit(1);
}

const [s1, s2] = score.split('-').map(Number);
const getRes = (myGoals, oppGoals) => myGoals > oppGoals ? 'W' : (myGoals < oppGoals ? 'L' : 'D');

const update = (myId, oppId, oppName, finalScore, res, homeStatus) => {
    const entry = matches.find(m => m.id === myId);
    if (entry) {
        entry.matches.push({
            week: parseInt(week),
            opponent: oppName,
            opponentId: oppId,
            score: finalScore,
            result: res,
            is_home: homeStatus
        });
    }
};

update(id1, id2, t2.name, score, getRes(s1, s2), true);
update(id2, id1, t1.name, score, getRes(s2, s1), false);
fs.writeFileSync(matchesPath, JSON.stringify(matches, null, 2));
console.log(`✅ [${folder}] Başarıyla eklendi: ${t1.name} ${score} ${t2.name} (Hafta ${week})`);