/**
 * Smart Campus Navigation System
 * Final Corrected Coordinates for SAU Maidan Garhi
 * Group: Ganta Obed & Kushagra Upadhyay
 */

// 1. Center map on the SAU Campus area visible in your image
const sauCenter = [28.4984, 77.1790]; 
const map = L.map('map').setView(sauCenter, 17);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 2. Facility Database (Pins are now moved to the bottom-right university zone)
const campusData = [
    { id: "ACAD_B", name: "Academic Block", coords: [28.4988, 77.1785], desc: "Lecture halls and faculty offices." },
    { id: "LIB_01", name: "University Library", coords: [28.4992, 77.1778], desc: "Central library and research center." },
    { id: "ADM_01", name: "Administrative Block", coords: [28.5000, 77.1770], desc: "Registrar and student services." },
    { id: "GATE_1", name: "Main Campus Entrance", coords: [28.5005, 77.1762], desc: "Entry point near Daffodil Lane." }
];

// Add the markers to the map
campusData.forEach(loc => {
    const marker = L.marker(loc.coords).addTo(map);
    marker.bindPopup(`<b>${loc.name}</b><br>${loc.desc}`);
    
    marker.on('click', () => {
        document.getElementById('target-name').innerText = loc.name;
        document.getElementById('target-desc').innerText = loc.desc;
    });
});

// 3. Search and QR Logic
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
            };
            resultsBox.appendChild(div);
        });
    }
});

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
    });
};