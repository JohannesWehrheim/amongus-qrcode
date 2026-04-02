const keys = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta'];
let scannedKeys = JSON.parse(localStorage.getItem('scannedKeys')) || [];

// 1. Buttons generieren
const statusBar = document.getElementById('status-bar');
function renderButtons() {
    statusBar.innerHTML = '';
    keys.forEach(key => {
        const btn = document.createElement('div');
        btn.className = 'task-btn';
        if (scannedKeys.includes(key)) {
            btn.classList.add('completed');
        }
        btn.innerText = key;
        
        // Wenn noch nicht erledigt, klick öffnet die Map
        if (!scannedKeys.includes(key)) {
            btn.onclick = () => openMap(key);
        }
        statusBar.appendChild(btn);
    });
    checkWinCondition();
}

// 2. Map Logik
function openMap(key) {
    document.getElementById('modal-title').innerText = `NODE ${key.toUpperCase()}`;
    // Sucht das Bild z.B. "map-alpha.jpg" im Ordner "images"
    document.getElementById('map-image').src = `images/map-${key.toLowerCase()}.jpg`;
    document.getElementById('map-modal').classList.remove('hidden');
}

function closeMap() {
    document.getElementById('map-modal').classList.add('hidden');
}

// 3. Scanner Logik (Läuft dauerhaft)
const html5QrCode = new Html5Qrcode("reader");
const config = { fps: 10, qrbox: { width: 300, height: 300 } };

// "user" nutzt die Frontkamera des iPads
html5QrCode.start({ facingMode: "user" }, config, onScanSuccess, onScanFailure)
.catch(err => console.log("Kamera-Fehler:", err));

function onScanSuccess(decodedText, decodedResult) {
    // Wenn der gescannte Text (z.B. "Alpha") in unserer Liste ist und noch nicht gescannt wurde
    if (keys.includes(decodedText) && !scannedKeys.includes(decodedText)) {
        scannedKeys.push(decodedText);
        localStorage.setItem('scannedKeys', JSON.stringify(scannedKeys));
        renderButtons(); // Statusleiste aktualisieren
        closeMap(); // Falls eine Karte offen war, schließen
    }
}

function onScanFailure(error) {
    // Wird sehr oft aufgerufen, wenn kein Code im Bild ist. Einfach ignorieren.
}

// 4. Gewinn-Check
function checkWinCondition() {
    if (scannedKeys.length === keys.length) {
        document.getElementById('win-modal').classList.remove('hidden');
    }
}

// 5. Secret Reset (Für den Admin: Oben links versteckt)
let clickCount = 0;
function resetGame() {
    clickCount++;
    if (clickCount >= 3) { // 3 mal tippen zum Zurücksetzen
        if(confirm("Spiel wirklich zurücksetzen?")) {
            localStorage.clear();
            location.reload();
        }
        clickCount = 0;
    }
}

// Start
renderButtons();
