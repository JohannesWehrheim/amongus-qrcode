const keys = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta'];
let scannedKeys = JSON.parse(localStorage.getItem('scannedKeys')) || [];

// 1. ZUERST die Buttons generieren (damit sie immer da sind, auch bei Kamera-Fehlern)
renderButtons();

function renderButtons() {
    const statusBar = document.getElementById('status-bar');
    statusBar.innerHTML = '';
    keys.forEach(key => {
        const btn = document.createElement('div');
        btn.className = 'task-btn';
        if (scannedKeys.includes(key)) {
            btn.classList.add('completed');
        }
        btn.innerText = key;
        
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
    document.getElementById('map-image').src = `images/map-${key.toLowerCase()}.jpg`;
    document.getElementById('map-modal').classList.remove('hidden');
}

function closeMap() {
    document.getElementById('map-modal').classList.add('hidden');
}

// 3. Kamera Logik mit Fehler-Schutz (Try-Catch)
try {
    const html5QrCode = new Html5Qrcode("reader");
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrCode.start({ facingMode: "user" }, config, onScanSuccess, onScanFailure)
    .catch(err => {
        console.log("Kamera-Start fehlgeschlagen:", err);
        // Fallback Button, falls Apple die Kamera blockiert
        document.getElementById('reader').innerHTML = `
            <div style="display:flex; height:100%; justify-content:center; align-items:center;">
                <button onclick="location.reload()" style="padding: 20px; font-size: 20px; background: red; color: white; border: 4px solid black;">Kamera blockiert? Seite neu laden und Zugriff erlauben!</button>
            </div>`;
    });
} catch (error) {
    console.error("QR Bibliothek nicht gefunden!", error);
    document.getElementById('reader').innerHTML = '<h2 style="color:red; text-align:center; margin-top:20px;">Systemfehler: html5-qrcode.min.js fehlt auf GitHub!</h2>';
}

function onScanSuccess(decodedText, decodedResult) {
    if (keys.includes(decodedText) && !scannedKeys.includes(decodedText)) {
        scannedKeys.push(decodedText);
        localStorage.setItem('scannedKeys', JSON.stringify(scannedKeys));
        renderButtons();
        closeMap();
    }
}

function onScanFailure(error) {
    // Ignorieren, passiert jeden Frame in dem kein Code sichtbar ist
}

// 4. Gewinn-Check
function checkWinCondition() {
    if (scannedKeys.length === keys.length && keys.length > 0) {
        document.getElementById('win-modal').classList.remove('hidden');
    }
}

// 5. Secret Reset (Für den Admin: Oben links versteckt)
let clickCount = 0;
function resetGame() {
    clickCount++;
    if (clickCount >= 3) {
        if(confirm("Spiel wirklich zurücksetzen?")) {
            localStorage.clear();
            location.reload();
        }
        clickCount = 0;
    }
}
