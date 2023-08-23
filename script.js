const petElement = document.getElementById('pet');

let gameState = {
    stage: 'egg',
    age: 0,  // in days
    hunger: 5,
    cleanliness: 5,
    happiness: 5
};


let playTimer, hungerTimer, cleanlinessTimer;


function loadGameState() {
    const savedState = JSON.parse(localStorage.getItem('webgotchi'));
    if (savedState) {
        gameState = savedState;
        
        // Check if a day has passed since the last game load
        const lastLoaded = new Date(savedState.lastLoaded);
        const now = new Date();
        if (now.toDateString() !== lastLoaded.toDateString()) {
            gameState.age += 1;
        }
    }
    gameState.lastLoaded = new Date().toISOString();

    updatePetImage();
    updateStatsDisplay();
    startTimers();
}

function saveGameState() {
    localStorage.setItem('webgotchi', JSON.stringify(gameState));
}
function updatePetImage() {
    switch (gameState.stage) {
        case 'egg':
            petElement.src = 'egg.png';
            break;
        case 'child':
            petElement.src = 'child.png';
            break;
        case 'adult':
            petElement.src = 'adult.png';
            break;
        case 'dead':
            petElement.src = 'dead.png';
            break;
    }
}

function feed() {
    if (gameState.hunger < 10) gameState.hunger++;
    checkStage();
    saveGameState();
    resetTimers();  // Reset the hunger timer when fed
}

function clean() {
    if (gameState.cleanliness < 10) gameState.cleanliness++;
    checkStage();
    saveGameState();
    resetTimers();  // Reset the cleanliness timer when cleaned
}

function play() {
    if (gameState.happiness < 10) gameState.happiness++;
    checkStage();
    saveGameState();
    resetTimers();  // Reset the cleanliness timer when cleaned
	updateStatsDisplay();
}

function checkStage() {
    if (gameState.hunger === 0 || gameState.cleanliness === 0 || gameState.happiness === 0) {
        gameState.stage = 'dead';
    } else if (gameState.happiness > 7 && gameState.cleanliness > 7 && gameState.hunger > 7) {
        gameState.stage = 'adult';
    } else if (gameState.happiness > 5 && gameState.cleanliness > 5 && gameState.hunger > 5) {
        gameState.stage = 'child';
    } else {
        gameState.stage = 'egg';
    }
    updatePetImage();
}


function startTimers() {
    // Play timer
    playTimer = setInterval(() => {
        notifyUser('Webgotchi wants to play!');
        if (gameState.happiness > 0) {
            gameState.happiness--;
        }
        checkStage();
        saveGameState();
    }, 15 * 60 * 1000);  // Every 15 minutes

    // Hunger timer
    hungerTimer = setInterval(() => {
        notifyUser('Webgotchi is hungry!');
        if (gameState.hunger > 0) {
            gameState.hunger--;
        }
        checkStage();
        saveGameState();
    }, 20 * 60 * 1000);  // Every 20 minutes

    // Cleanliness timer
    cleanlinessTimer = setInterval(() => {
        notifyUser('Webgotchi is getting dirty!');
        if (gameState.cleanliness > 0) {
            gameState.cleanliness--;
        }
        checkStage();
        saveGameState();
    }, 25 * 60 * 1000);  // Every 25 minutes
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

function updateStatsDisplay() {
    document.getElementById('age').textContent = gameState.age;
    document.getElementById('status').textContent = capitalizeFirstLetter(gameState.stage);
    document.getElementById('happiness-level').textContent = gameState.happiness;
    document.getElementById('cleanliness-level').textContent = gameState.cleanliness;
    document.getElementById('hunger-level').textContent = gameState.hunger;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function resetGame() {
    // Stop the current play timer
    clearInterval(playTimer);

    // Reset game state
    gameState = {
        stage: 'egg',
        age: 0,
        hunger: 5,
        cleanliness: 5,
        happiness: 5
    };

    // Update UI
    updatePetImage();
    updateStatsDisplay();

    // Restart play timer
	resetTimers();
    // Remove saved state from local storage
    localStorage.removeItem('webgotchi');
}

loadGameState();

