/* Save as script.js */
let judgeFile = document.getElementById("judgeFile");
let judgeThinking = document.getElementById("judgeThinking");
let judgePreview = document.getElementById("judgePreview");
let judgeResult = document.getElementById("judgeResult");
let judgeButton = document.getElementById("judgeButton");
let judgeReset = document.getElementById("judgeReset");

let timerMins = document.getElementById("timerMins");
let timerStart = document.getElementById("timerStart");
let timerStop = document.getElementById("timerStop");
let timerDisplay = document.getElementById("timerDisplay");
let timerId = null;
let timerEnd = 0;
let timerFinished = false;

let stockCanvas = document.getElementById("stockCanvas");
let ctx = stockCanvas.getContext("2d");
let stockCandleBtn = document.getElementById("stockCandle");
let stockPriceEl = document.getElementById("stockPrice");
let stockNote = document.getElementById("stockNote");
let marketMood = document.getElementById("marketMood");
let stockHistory = [];
let useCandles = false;

let deliveryStatus = document.getElementById("deliveryStatus");
let refreshStatus = document.getElementById("refreshStatus");
let etaBtn = document.getElementById("etaBtn");
let deliveryId = document.getElementById("deliveryId");
deliveryId.textContent = "PH-" + Math.floor(Math.random() * 90000 + 10000);

let statuses = [
    "Bananas are stuck in traffic behind an elephant.",
    "Your pazhampori has been eaten by the delivery boy.",
    "Driver stopped to rescue a poetic cat. Delay +20 min.",
    "Bananas formed a union; negotiation ongoing.",
    "Parcel briefly declared independence. Talks ongoing.",
    "Drone refused to fly until bribed with mango slices.",
    "Road closed for a goat fashion show. ETA unknown.",
    "Package smells suspiciously like coconut. Investigation continues.",
    "Driver lost to local chess champion. Rematch scheduled.",
    "Bananas are sunbathing; minor delay expected.",
    "Item replaced with a brick of ambiguous quality.",
    "Courier stopped to learn the lyrics of a sad song."
];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

refreshStatus.onclick = () => { deliveryStatus.textContent = rand(statuses); };
etaBtn.onclick = () => {
    let base = Math.floor(Math.random() * 60) + 1;
    if (Math.random() < 0.25) base += Math.floor(Math.random() * 240);
    deliveryStatus.textContent = "ETA: about " + base + " minutes. (Driver stopped for tea)";
};

// Judge logic
let fakeSteps = [
    "Scanning banana pixels...",
    "Measuring crunch frequencies...",
    "Detecting emotional crispiness...",
    "Applying deep-fry neural networks...",
    "Almost there... probably..."
];

judgeFile.addEventListener("change", () => {
    judgeThinking.textContent = "";
    judgeResult.textContent = "Awaiting judgement...";
    judgePreview.style.display = "none";
    let f = judgeFile.files[0];
    if (!f) return;
    judgePreview.src = URL.createObjectURL(f);
    judgePreview.style.display = "block";
    let delay = 0;
    fakeSteps.forEach((s, i) => {
        setTimeout(() => { judgeThinking.textContent = s; }, delay);
        delay += 700 + Math.random() * 900;
    });
    setTimeout(() => { judgeThinking.textContent = ""; }, delay + 400);
});
judgeButton.addEventListener("click", () => {
    judgeThinking.textContent = "AI thinking...";
    let sequences = [
        "Crunch vectors aligning...",
        "Probability of love low...",
        "Recalculating existential batter..."
    ];
    let idx = 0;
    let ti = setInterval(() => { judgeThinking.textContent = sequences[idx % sequences.length]; idx++; }, 600);
    setTimeout(() => {
        clearInterval(ti);
        judgeThinking.textContent = "";
        judgeResult.textContent = "Could be better, try adding love.";
    }, 1500 + Math.random() * 1200);
});
judgeReset.addEventListener("click", () => {
    judgeFile.value = "";
    judgePreview.style.display = "none";
    judgeThinking.textContent = "";
    judgeResult.textContent = "Upload a pazhampori to get judged.";
});

// --- New Party Popper Timer Logic ---
// Replace your existing partyPopperEffect function with this one
function partyPopperEffect() {
    // Play sound
    const sound = document.getElementById('popperSound');
    sound.play().catch(e => console.error("Audio play failed. User may need to interact with the page first."));

    // Full screen confetti
    const count = 200;
    const defaults = { 
        origin: { y: 0.7 }, 
        zIndex: 9999 /* This high value ensures it's on top of everything */
    };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
        }));
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
}

function clearTimer() { clearInterval(timerId); timerId = null; }

timerStart.addEventListener("click", () => {
    clearTimer();
    timerFinished = false;
    let mins = Math.max(0.1, Number(timerMins.value) || 5);
    let base = mins * 60 * 1000;
    let jitter = (Math.random() * 2 - 1) * 0.5;
    if (Math.random() < 0.2) jitter += Math.random() * 4;
    let realMs = Math.max(500, base * (1 + 0.1 * jitter));
    if (Math.random() < 0.25) realMs = (Math.random() * 2) * 1000;
    timerEnd = Date.now() + realMs;
    timerId = setInterval(() => {
        let rem = timerEnd - Date.now();
        if (rem <= 0) {
            clearTimer();
            timerDisplay.textContent = "Done! 🎉";
            timerFinished = true;
            partyPopperEffect(); // Trigger celebration!
            return;
        }
        let s = Math.ceil(rem / 1000);
        if (Math.random() < 0.03) {
            clearTimer();
            timerDisplay.textContent = "Done! (Surprise!) 🎉";
            timerFinished = true;
            partyPopperEffect(); // Trigger celebration!
            return;
        }
        timerDisplay.textContent = s + "s remaining (subjective)";
    }, 250);
    timerDisplay.textContent = "Timer started. Trust nothing.";
});
timerStop.addEventListener("click", () => { clearTimer(); timerDisplay.textContent = timerFinished ? "Already Done! 🎉" : "Stopped. Time is an illusion."; });


// --- Stock market simulation ---
function seedHistory() {
    stockHistory = [];
    let p = 40 + Math.random() * 20; 
    for (let i = 0; i < 60; i++) {
        let o = p;
        let c = Math.max(40, Math.min(60, o + (Math.random() - 0.5) * 2));
        let high = Math.max(o, c) + Math.random();
        let low = Math.min(o, c) - Math.random();
        stockHistory.push({ o, c, h: high, l: low });
        p = c;
    }
}

function drawChart() {
    let w = stockCanvas.width, h = stockCanvas.height;
    ctx.clearRect(0, 0, w, h);
    let len = stockHistory.length;
    let pad = 20;
    let chartW = w - 2 * pad, chartH = h - 2 * pad;
    let max = 62, min = 38; 

    let xStep = chartW / (len - 1 || 1);
    if (useCandles) {
        for (let i = 0; i < len; i++) {
            let item = stockHistory[i];
            let x = pad + i * xStep;
            let yO = pad + (max - item.o) / (max - min) * chartH;
            let yC = pad + (max - item.c) / (max - min) * chartH;
            let yH = pad + (max - item.h) / (max - min) * chartH;
            let yL = pad + (max - item.l) / (max - min) * chartH;
            ctx.beginPath();
            ctx.moveTo(x, yH); ctx.lineTo(x, yL);
            ctx.strokeStyle = "#a0a8b0"; ctx.lineWidth = 1.5; ctx.stroke();
            let candleW = Math.max(6, xStep * 0.6);
            if (item.c >= item.o) { ctx.fillStyle = "#1b8f3b"; ctx.fillRect(x - candleW / 2, yC, candleW, yO - yC); } else { ctx.fillStyle = "#d43f3f"; ctx.fillRect(x - candleW / 2, yO, candleW, yC - yO); }
        }
    } else {
        ctx.beginPath();
        for (let i = 0; i < len; i++) {
            let v = stockHistory[i].c;
            let x = pad + i * xStep;
            let y = pad + (max - v) / (max - min) * chartH;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "#2db34b"; ctx.lineWidth = 2; ctx.stroke();
    }
    let latest = stockHistory[stockHistory.length - 1].c;
    stockPriceEl.textContent = latest.toFixed(2);
    marketMood.textContent = (Math.random() < 0.5 ? "calm" : "frenzied");
}

function stepMarket() {
    let last = stockHistory[stockHistory.length - 1];
    let base = last.c;
    
    let pullToMean = (50 - base) * 0.1; 
    let randomChange = (Math.random() - 0.5) * 2;
    let newPrice = base + pullToMean + randomChange;
    newPrice = Math.max(40, Math.min(60, newPrice));

    let o = base;
    let c = newPrice;
    let high = Math.max(o, c) + Math.random();
    let low = Math.min(o, c) - Math.random();
    stockHistory.push({ o, c, h: high, l: low });
    if (stockHistory.length > 120) stockHistory.shift();
    
    drawChart();
}

stockCandleBtn.addEventListener("click", () => { useCandles = !useCandles; drawChart(); });

// --- Autostart the market simulation ---
seedHistory();
drawChart();
setInterval(stepMarket, 500);