const htmlRoot = document.getElementById('htmlRoot');
const savedTheme = localStorage.getItem('theme');
let currentTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
htmlRoot.setAttribute('data-theme', currentTheme);

function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  htmlRoot.setAttribute('data-theme', currentTheme);
  localStorage.setItem('theme', currentTheme);
}

let allPhones = [];
let selectedForCompare = null;
let deviceStore = {};

async function loadPhones() {
  try {
    const res = await fetch('/data/phones_fixed.json');
    allPhones = await res.json();
    displayPhones(allPhones.slice(0, 30));
    populateBrands();
  } catch (e) {
    console.error(e);
    document.getElementById('phoneGrid').innerHTML = '<p>Error loading data.</p>';
  }
}

function populateBrands() {
  const sel = document.getElementById('brandFilter');
  const brands = [...new Set(allPhones.map(b => b.brand_name))].sort();
  brands.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b;
    opt.textContent = b;
    sel.appendChild(opt);
  });
}

function displayPhones(list) {
  const grid = document.getElementById('phoneGrid');
  grid.innerHTML = '';
  list.forEach(brand => {
    brand.devices.forEach(device => {
      const id = brand.brand_name + '_' + device.model_name.replace(/\s+/g, '-');
      deviceStore[id] = device;
      const card = document.createElement('div');
      card.className = 'phone-card';
      card.onclick = () => openModal(brand.brand_name, device);
      const img = (device.imageUrl || '').trim() || 'https://via.placeholder.com/150?text=No+Image';
      card.innerHTML = `
        <img src="${img}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
        <h3>${brand.brand_name} ${device.model_name}</h3>
        <button class="compare-btn" onclick="event.stopPropagation(); startCompare('${brand.brand_name}', '${device.model_name.replace(/'/g, "\\'")}', '${id}')">Compare</button>
      `;
      grid.appendChild(card);
    });
  });
}

function openModal(brand, device) {
  document.getElementById('modalTitle').innerText = `${brand} ${device.model_name}`;
  const imgEl = document.getElementById('modalImage');
  imgEl.src = (device.imageUrl || '').trim() || 'https://via.placeholder.com/300?text=No+Image';

  const specsDiv = document.getElementById('modalSpecs');
  specsDiv.innerHTML = '';
  const specs = device.specifications || {};

  for (const [cat, items] of Object.entries(specs)) {
    if (typeof items === 'object' && !Array.isArray(items)) {
      const catDiv = document.createElement('div');
      catDiv.className = 'spec-category';
      catDiv.innerHTML = `<h3>${cat}</h3>`;
      for (const [key, val] of Object.entries(items)) {
        const item = document.createElement('div');
        item.className = 'spec-item';
        item.innerHTML = `<span class="spec-key">${key}:</span> <span class="spec-value">${val || '—'}</span>`;
        catDiv.appendChild(item);
      }
      specsDiv.appendChild(catDiv);
    }
  }
  document.getElementById('phoneModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('phoneModal').style.display = 'none';
}

function startCompare(brand, model, deviceId) {
  const device = deviceStore[deviceId];
  if (!device) return;
  selectedForCompare = { brand, model, device };
  renderLeftCompare();
  document.getElementById('compareModal').style.display = 'flex';
}

function renderLeftCompare() {
  const el = document.getElementById('compare-left-phone');
  if (!selectedForCompare) {
    el.innerHTML = '<p>No phone selected</p>';
    return;
  }
  const { brand, model, device } = selectedForCompare;
  const img = (device.imageUrl || '').trim() || 'https://via.placeholder.com/150?text=No+Image';
  el.innerHTML = `
    <img src="${img}" style="width:120px;height:120px;object-fit:contain;margin-bottom:12px;">
    <div style="font-weight:bold;">${brand} ${model}</div>
  `;
}

function searchForCompare() {
  const q = document.getElementById('compareSearchInput').value.toLowerCase();
  const results = [];
  allPhones.forEach(brand => {
    brand.devices.forEach(device => {
      if (device.model_name.toLowerCase().includes(q) || brand.brand_name.toLowerCase().includes(q)) {
        results.push({ brand: brand.brand_name, model: device.model_name, device });
      }
    });
  });
  displayCompareResults(results.slice(0, 20));
}

function displayCompareResults(list) {
  const container = document.getElementById('compareResults');
  container.innerHTML = '';
  if (list.length === 0) {
    container.innerHTML = '<p>No phones found</p>';
    return;
  }
  list.forEach(item => {
    const div = document.createElement('div');
    div.className = 'compare-result-item';
    div.textContent = `${item.brand} ${item.model}`;
    div.onclick = () => finalizeCompare(item);
    container.appendChild(div);
  });
}

function finalizeCompare(other) {
  const compareList = [
    { brand: selectedForCompare.brand, model: selectedForCompare.model, device: selectedForCompare.device },
    { brand: other.brand, model: other.model, device: other.device }
  ];
  openCompareTable(compareList);
}

function openCompareTable(compareList) {
  closeCompareTableModal();
  const specs = [
    'Network.Technology', 'Network.2G bands', 'Body.Dimensions', 'Body.Weight', 'Body.SIM',
    'Display.Type', 'Display.Size', 'Display.Resolution', 'Platform.OS', 'Memory.Internal',
    'Memory.Card slot', 'Main Camera', 'Selfie camera', 'Sound.Loudspeaker', 'Battery.Type',
    'Comms.WLAN', 'Comms.Bluetooth', 'Comms.USB', 'Comms.Positioning', 'Features.Sensors',
    'Launch.Announced', 'Launch.Status', 'Misc.Colors'
  ];

  let tableHtml = `<table class="compare-table"><thead><tr><th>Specification</th>`;
  compareList.forEach(item => {
    tableHtml += `<th>${item.brand} ${item.model}</th>`;
  });
  tableHtml += `</tr></thead><tbody>`;

  specs.forEach(path => {
    const keys = path.split('.');
    const keyName = keys[keys.length - 1];

    let hasValue = false;
    const values = [];
    for (let item of compareList) {
      let val = item.device.specifications;
      for (let k of keys) {
        if (val && val[k] !== undefined) {
          val = val[k];
        } else {
          val = null;
          break;
        }
      }
      if (val !== null && val !== '' && val !== '—') {
        hasValue = true;
      }
      values.push(val);
    }

    if (!hasValue) return;

    tableHtml += `<tr><td>${keyName}</td>`;
    values.forEach(val => {
      if (val === null || val === '') {
        tableHtml += `<td>—</td>`;
      } else if (typeof val === 'object') {
        let str = '';
        for (let k in val) {
          if (val.hasOwnProperty(k)) {
            str += `${k}: ${val[k]}<br>`;
          }
        }
        tableHtml += `<td>${str || '—'}</td>`;
      } else {
        tableHtml += `<td>${String(val)}</td>`;
      }
    });
    tableHtml += `</tr>`;
  });

  tableHtml += `</tbody></table><button class="clear-compare" onclick="closeCompareTableModal()" style="margin-top:20px;padding:8px 16px;background:#ff6b6b;color:white;border:none;border-radius:6px;cursor:pointer;">Close</button>`;

  const modal = document.createElement('div');
  modal.id = 'compareTableModal';
  modal.className = 'modal';
  modal.style.display = 'flex';
  modal.innerHTML = `
    <div class="modal-content compare-table-content">
      <div class="rotate-message">In order to see the comparison table, rotate your phone.</div>
      <div class="compare-table-wrapper">${tableHtml}</div>
    </div>
  `;
  modal.onclick = (e) => {
    if (e.target.id === 'compareTableModal') closeCompareTableModal();
  };
  document.body.appendChild(modal);
}


function closeCompareTableModal() {
  const el = document.getElementById('compareTableModal');
  if (el) el.remove();
}

function closeCompareModal() {
  document.getElementById('compareModal').style.display = 'none';
  selectedForCompare = null;
}

function applyFilters() {
  const brand = document.getElementById('brandFilter').value;
  const minRAM = parseInt(document.getElementById('ramFilter').value) || 0;
  const minStorage = parseInt(document.getElementById('storageFilter').value) || 0;
  const minBattery = parseInt(document.getElementById('batteryRange').value);
  const minScreen = parseFloat(document.getElementById('screenRange').value);
  const need5G = document.getElementById('feature5G').checked;
  const needNFC = document.getElementById('featureNFC').checked;
  const needHeadphone = document.getElementById('featureHeadphone').checked;

  const filtered = allPhones.map(b => ({
    ...b,
    devices: b.devices.filter(d => {
      if (brand && b.brand_name !== brand) return false;

      const memoryStr = d.specifications?.Memory?.Internal || '';
      const gbMatches = memoryStr.match(/(\d+)GB/g);
      let ram = 0, storage = 0;
      if (gbMatches && gbMatches.length >= 1) {
        storage = parseInt(gbMatches[0]);
      }
      if (gbMatches && gbMatches.length >= 2) {
        ram = parseInt(gbMatches[1]);
      }

      if (minRAM > 0 && ram < minRAM) return false;
      if (minStorage > 0 && storage < minStorage) return false;

      const batteryStr = d.specifications?.Battery?.Type || '';
      const batteryMatch = batteryStr.match(/(\d+)\s*mAh/);
      const battery = batteryMatch ? parseInt(batteryMatch[1]) : 0;
      if (battery < minBattery) return false;

      const displayStr = d.specifications?.Display?.Size || '';
      const screenMatch = displayStr.match(/([\d.]+)\s*inches/);
      const screenSize = screenMatch ? parseFloat(screenMatch[1]) : 0;
      if (screenSize < minScreen) return false;

      if (need5G && !d.specifications?.Network?.['5G bands']) return false;
      if (needNFC && d.specifications?.Comms?.NFC !== 'Yes') return false;
      if (needHeadphone && d.specifications?.Sound?.['3.5mm jack'] !== 'Yes') return false;

      return true;
    })
  })).filter(b => b.devices.length > 0);

  displayPhones(filtered.flat().slice(0, 30));
}

function searchPhones() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const filtered = allPhones.map(b => ({
    ...b,
    devices: b.devices.filter(d => d.model_name.toLowerCase().includes(q) || b.brand_name.toLowerCase().includes(q))
  })).filter(b => b.devices.length > 0);
  displayPhones(filtered.flat().slice(0, 30));
}

document.getElementById('searchInput').addEventListener('keyup', function(e) {
  if (e.key === 'Enter') searchPhones();
});

document.getElementById('compareSearchInput').addEventListener('keyup', function(e) {
  if (e.key === 'Enter') searchForCompare();
});

document.getElementById('batteryValue').textContent = document.getElementById('batteryRange').value + ' mAh';
document.getElementById('screenValue').textContent = document.getElementById('screenRange').value + '"';

loadPhones();