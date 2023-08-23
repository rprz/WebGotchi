let gameState = {
    stage: 'egg',
    age: 0,
    hunger: 5,
    cleanliness: 5,
    happiness: 5,
    lastChecked: new Date().getTime()
};

let playTimer, hungerTimer, cleanlinessTimer;

function loadGameState() {
    const savedState = JSON.parse(localStorage.getItem('webgotchi'));
    if (savedState) {
        gameState = savedState;

        const now = new Date().getTime();
        const elapsedMinutes = (now - gameState.lastChecked) / (60 * 1000);

        const playRemainder = elapsedMinutes % 15;
        const hungerRemainder = elapsedMinutes % 20;
        const cleanlinessRemainder = elapsedMinutes % 25;
    updateCountdown('play-timer', (15 - playRemainder) * 60);
    updateCountdown('hunger-timer', (20 - hungerRemainder) * 60);
    updateCountdown('cleanliness-timer', (25 - cleanlinessRemainder) * 60);
        gameState.happiness = Math.max(0, gameState.happiness - playEvents);
        gameState.hunger = Math.max(0, gameState.hunger - hungerEvents);
        gameState.cleanliness = Math.max(0, gameState.cleanliness - cleanlinessEvents);
    }

    //gameState.lastChecked = new Date().getTime();
    updateStatsDisplay();
    startTimers();
}

function saveGameState() {
    gameState.lastChecked = new Date().getTime();
    localStorage.setItem('webgotchi', JSON.stringify(gameState));
    updateStatsDisplay();
}

function updateStatsDisplay() {
    document.getElementById('age').textContent = gameState.age;
    document.getElementById('status').textContent = gameState.stage;
    document.getElementById('happiness-level').textContent = gameState.happiness;
    document.getElementById('hunger-level').textContent = gameState.hunger;
    document.getElementById('cleanliness-level').textContent = gameState.cleanliness;
}

function updateCountdown(elementId, totalSeconds) {
    let remainingSeconds = totalSeconds;

    function tick() {
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        document.getElementById(elementId).textContent = `(${minutes}:${seconds < 10 ? '0' : ''}${seconds})`;
        remainingSeconds--;

        if (remainingSeconds < 0) {
            clearInterval(interval);
        }
    }

    const interval = setInterval(tick, 1000);
    tick();
}
function startTimers() {
    const elapsedMinutes = (new Date().getTime() - gameState.lastChecked) / (60 * 1000);

    // Calculate the delay for each timer
    const playDelay = (15 - elapsedMinutes % 15) * 60 * 1000;
    const hungerDelay = (20 - elapsedMinutes % 20) * 60 * 1000;
    const cleanlinessDelay = (25 - elapsedMinutes % 25) * 60 * 1000;

    // Play Timer
    setTimeout(() => {
        notifyUser('Webgotchi wants to play!');
        if (gameState.happiness > 0) gameState.happiness--;
        checkStage();
        saveGameState();
        updateCountdown('play-timer', 15 * 60); // Reset countdown
        // Restart the interval
        playTimer = setInterval(() => {
            notifyUser('Webgotchi wants to play!');
            if (gameState.happiness > 0) gameState.happiness--;
            checkStage();
            saveGameState();
            updateCountdown('play-timer', 15 * 60); // Reset countdown
        }, 15 * 60 * 1000);
    }, playDelay);

    // Hunger Timer
    setTimeout(() => {
        notifyUser('Webgotchi is hungry!');
        if (gameState.hunger > 0) gameState.hunger--;
        checkStage();
        saveGameState();
        updateCountdown('hunger-timer', 20 * 60); // Reset countdown
        // Restart the interval
        hungerTimer = setInterval(() => {
            notifyUser('Webgotchi is hungry!');
            if (gameState.hunger > 0) gameState.hunger--;
            checkStage();
            saveGameState();
            updateCountdown('hunger-timer', 20 * 60); // Reset countdown
        }, 20 * 60 * 1000);
    }, hungerDelay);

    // Cleanliness Timer
    setTimeout(() => {
        notifyUser('Webgotchi is getting dirty!');
        if (gameState.cleanliness > 0) gameState.cleanliness--;
        checkStage();
        saveGameState();
        updateCountdown('cleanliness-timer', 25 * 60); // Reset countdown
        // Restart the interval
        cleanlinessTimer = setInterval(() => {
            notifyUser('Webgotchi is getting dirty!');
            if (gameState.cleanliness > 0) gameState.cleanliness--;
            checkStage();
            saveGameState();
            updateCountdown('cleanliness-timer', 25 * 60); // Reset countdown
        }, 25 * 60 * 1000);
    }, cleanlinessDelay);

    // Start the countdowns for each stat
    updateCountdown('play-timer', playDelay / 1000);
    updateCountdown('hunger-timer', hungerDelay / 1000);
    updateCountdown('cleanliness-timer', cleanlinessDelay / 1000);
}

function resetTimers() {
    clearInterval(playTimer);
    clearInterval(hungerTimer);
    clearInterval(cleanlinessTimer);
    startTimers();
}

function notifyUser(message) {
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notifications.");
    } else if (Notification.permission === "granted") {
        new Notification(message);
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(message);
            }
        });
    }
}

function checkStage() {
    // For this example, let's say the egg hatches at happiness, hunger, and cleanliness >= 8
    // and moves to next stage when any of them is <= 2.
    if (gameState.stage === 'egg' && gameState.happiness >= 8 && gameState.hunger >= 8 && gameState.cleanliness >= 8) {
        gameState.stage = 'child';
    } else if (gameState.stage === 'child' && (gameState.happiness <= 2 || gameState.hunger <= 2 || gameState.cleanliness <= 2)) {
        gameState.stage = 'adult';
    }
}

function feed() {
    if (gameState.hunger < 10) gameState.hunger++;
    saveGameState();
    resetTimers();
}

function clean() {
    if (gameState.cleanliness < 10) gameState.cleanliness++;
    saveGameState();
    resetTimers();
}

function play() {
    if (gameState.happiness < 10) gameState.happiness++;
    saveGameState();
    resetTimers();
}

function resetGame() {
    clearInterval(playTimer);
    clearInterval(hungerTimer);
    clearInterval(cleanlinessTimer);

    gameState = {
        stage: 'egg',
        age: 0,
        hunger: 5,
        cleanliness: 5,
        happiness: 5,
        lastChecked: new Date().getTime()
    };

    updateStatsDisplay();
    startTimers();
    localStorage.removeItem('webgotchi');
}

window.onload = loadGameState;
