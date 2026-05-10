/**
 * Smart Campus Navigation System - Version 2.0
 * Group: Ganta Obed & Kushagra Upadhyay
 */

// Verification Log - Open your browser console (F12) to see this
console.log("SUCCESS: Smart Campus Nav Version 2.0 is Live at SAU Maidan Garhi!");

// 1. Center map on the SAU Campus area
const sauCenter = [28.4984, 77.1790]; 
const map = L.map('map').setView(sauCenter, 17);

// Load OpenStreetMap Tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 2. Updated Facility Database - Calibrated to SAU Campus [cite: 6]
const campusData = [
    { id: "GATE_1", name: "Main Campus Entrance", coords: [28.5005, 77.1762], desc: "Primary entry point near Daffodil Lane." },
    { id: "ACAD_B", name: "Academic Block", coords: [28.4988, 77.1785], desc: "Main lecture halls and faculty offices." },
    { id: "LIB_01", name: "University Library", coords: [28.4992, 77.1778], desc: "Central library and research center." },
    { id: "ADM_01", name: "Administrative Block", coords: [28.5000, 77.1770], desc: "Registrar and student services." }
];

// Add markers and bind click events
campusData.forEach(loc => {
    const marker = L.marker(loc.coords).addTo(map);
    marker.bindPopup(`<b>${loc.name}</b><br>${loc.desc}`);
    
    marker.on('click', () => {
        document.getElementById('target-name').innerText = loc.name;
        document.getElementById('target-desc').innerText = loc.desc;
    });
});

// 3. Search Functionality [cite: 17, 20]
const searchInput = document.getElementById('location-search');
const resultsBox = document.getElementById('search-results');

searchInput.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    resultsBox.innerHTML = '';
    
    if (val.length > 0) {
        const matches = campusData.filter(loc => loc.name.toLowerCase().includes(val));
        matches.forEach(match => {
            const div = document.createElement('div');
            div.className = 'result-item';
            div.innerText = match.name;
            div.onclick = () => {
                map.flyTo(match.coords, 18);
                document.getElementById('target-name').innerText = match.name;
                document.getElementById('target-desc').innerText = match.desc;
                resultsBox.innerHTML = '';
                searchInput.value = match.name;
            };
            resultsBox.appendChild(div);
        });
    }
});

// 4. QR Scanner Logic [cite: 22]
const html5QrCode = new Html5Qrcode("qr-reader");
document.getElementById("scan-qr-btn").onclick = () => {
    document.getElementById("qr-modal").style.display = "block";
    html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: 250 }, (text) => {
        const found = campusData.find(c => c.id === text);
        if (found) {
            map.flyTo(found.coords, 19);
            document.getElementById("qr-modal").style.display = "none";
            html5QrCode.stop();
        }
    }).catch(err => console.error("Scanner Error:", err));
};

// Utility: Function to close modal
window.closeModal = function() {
    html5QrCode.stop();
    document.getElementById("qr-modal").style.display = "none";
};