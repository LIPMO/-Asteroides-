let score = 0;
let gameOver = false;
let ship = document.getElementById("ship");
let scoreDisplay = document.getElementById("score");
let startButton = document.getElementById("start-button");
let leaderboard = document.getElementById("leaderboard");

// Boutons et popup
let controlsButton = document.getElementById("controls-button");
let controlsPopup = document.getElementById("controls-popup");
let closeControlsButton = document.getElementById("close-controls");

// Événements des boutons
controlsButton.addEventListener("click", () => {
    controlsPopup.classList.remove("hidden");
});

closeControlsButton.addEventListener("click", () => {
    controlsPopup.classList.add("hidden");
});

startButton.addEventListener("click", () => {
    startGame();
});

// Charger les scores au démarrage
loadScores();

async function loadScores() {
    try {
        let response = await fetch('scores.json');
        let scores = await response.json();
        updateLeaderboard(scores);
    } catch (error) {
        console.error("Erreur chargement scores:", error);
    }
}

async function saveScore(newScore) {
    try {
        let response = await fetch('scores.json');
        let scores = await response.json();
        scores.push(newScore);
        scores.sort((a, b) => b - a);
        scores = scores.slice(0, 5);

        await fetch('save_scores.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(scores)
        });

        updateLeaderboard(scores);
    } catch (error) {
        console.error("Erreur sauvegarde scores:", error);
    }
}

function updateLeaderboard(scores) {
    leaderboard.innerHTML = "";
    scores.forEach(score => {
        let li = document.createElement("li");
        li.textContent = `${score} points`;
        leaderboard.appendChild(li);
    });
}

function startGame() {
    score = 0;
    gameOver = false;
    scoreDisplay.textContent = score;

    let gameInterval = setInterval(() => {
        if (!gameOver) {
            score++;
            scoreDisplay.textContent = score;
        }
    }, 100);

    setTimeout(() => {
        clearInterval(gameInterval);
        endGame();
    }, 30000);
}

function endGame() {
    gameOver = true;
    alert(`Game Over! Score: ${score}`);
    saveScore(score);
}
