let score = 0;
let gameOver = false;
let ship = document.getElementById("ship");
let scoreDisplay = document.getElementById("score");
let startButton = document.getElementById("start-button");
let leaderboard = document.getElementById("leaderboard");

let shipX = 200;
let isBoosting = false;
let hasShield = false;

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

document.getElementById("controls-button").addEventListener("click", () => {
    document.getElementById("controls-popup").classList.remove("hidden");
});

document.getElementById("close-controls").addEventListener("click", () => {
    document.getElementById("controls-popup").classList.add("hidden");
});

startButton.addEventListener("click", () => {
    score = 0;
    gameOver = false;
    scoreDisplay.textContent = score;
    loadScores();
});
