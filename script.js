let score = 0;
let gameInterval, asteroidInterval;
let ship = document.getElementById("ship");
let playArea = document.getElementById("play-area");
let scoreDisplay = document.getElementById("score");
let startButton = document.getElementById("start-button");
let leaderboard = document.getElementById("leaderboard");

let shipX = playArea.offsetWidth / 2 - 25;
let isBoosting = false;
let hasShield = false;
let gameOver = false;
ship.style.left = `${shipX}px`;

function startGame() {
    score = 0;
    gameOver = false;
    scoreDisplay.textContent = score;
    startButton.disabled = true;

    gameInterval = setInterval(() => {
        if (!gameOver) {
            score++;
            scoreDisplay.textContent = score;
        }
    }, 100);

    asteroidInterval = setInterval(createAsteroid, 1000);
    setInterval(spawnShieldPowerUp, 10000);
}

function createAsteroid() {
    if (gameOver) return;

    let asteroid = document.createElement("div");
    asteroid.classList.add("asteroid");
    playArea.appendChild(asteroid);

    let size = Math.random() * 30 + 20;
    asteroid.style.width = `${size}px`;
    asteroid.style.height = `${size}px`;

    let startX = Math.random() * (playArea.offsetWidth - size);
    asteroid.style.left = `${startX}px`;
    asteroid.style.top = `-40px`;

    let fallSpeed = Math.random() * 3 + 2;

    function moveAsteroid() {
        if (gameOver) return;

        let currentTop = parseFloat(asteroid.style.top);
        asteroid.style.top = `${currentTop + fallSpeed}px`;

        if (currentTop > playArea.offsetHeight) {
            asteroid.remove();
        }

        if (!hasShield && checkCollision(ship, asteroid)) {
            endGame();
        } else {
            requestAnimationFrame(moveAsteroid);
        }
    }

    moveAsteroid();
}

function spawnShieldPowerUp() {
    if (gameOver) return;

    let powerUp = document.createElement("div");
    powerUp.classList.add("power-up");
    playArea.appendChild(powerUp);

    let startX = Math.random() * (playArea.offsetWidth - 30);
    powerUp.style.left = `${startX}px`;
    powerUp.style.top = `-40px`;

    let fallSpeed = 2;

    function movePowerUp() {
        if (gameOver) return;

        let currentTop = parseFloat(powerUp.style.top);
        powerUp.style.top = `${currentTop + fallSpeed}px`;

        if (currentTop > playArea.offsetHeight) {
            powerUp.remove();
        }

        if (checkCollision(ship, powerUp)) {
            activateShield();
            powerUp.remove();
        } else {
            requestAnimationFrame(movePowerUp);
        }
    }

    movePowerUp();
}

function activateShield() {
    hasShield = true;
    ship.style.background = "radial-gradient(circle, rgba(50, 255, 50, 0.9), rgba(20, 200, 20, 0.8))";
    setTimeout(() => {
        hasShield = false;
        ship.style.background = "radial-gradient(circle, rgba(0, 150, 255, 0.9), rgba(0, 100, 200, 0.8))";
    }, 5000);
}

function checkCollision(el1, el2) {
    let rect1 = el1.getBoundingClientRect();
    let rect2 = el2.getBoundingClientRect();
    return !(
        rect1.top > rect2.bottom ||
        rect1.bottom < rect2.top ||
        rect1.right < rect2.left ||
        rect1.left > rect2.right
    );
}

function endGame() {
    gameOver = true;
    clearInterval(gameInterval);
    clearInterval(asteroidInterval);
    document.querySelectorAll(".asteroid").forEach(ast => ast.remove());
    document.querySelectorAll(".power-up").forEach(pu => pu.remove());

    alert(`Game Over! Score: ${score}`);
    saveScore(score);
    startButton.disabled = false;
}

function saveScore(newScore) {
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.push(newScore);
    scores.sort((a, b) => b - a); // Tri des scores du plus grand au plus petit
    scores = scores.slice(0, 5); // On garde les 5 meilleurs
    localStorage.setItem("scores", JSON.stringify(scores));
    updateLeaderboard();
}

function updateLeaderboard() {
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    leaderboard.innerHTML = "";
    scores.forEach(score => {
        let li = document.createElement("li");
        li.textContent = `${score} points`;
        leaderboard.appendChild(li);
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && shipX > 0) {
        shipX -= 20;
    } else if (event.key === "ArrowRight" && shipX < playArea.offsetWidth - 50) {
        shipX += 20;
    } else if (event.key === "e") {
        activateBoost();
    }
    ship.style.left = `${shipX}px`;
});

function activateBoost() {
    if (!isBoosting && !gameOver) {
        isBoosting = true;
        let direction = Math.random() < 0.5 ? -100 : 100;
        shipX = Math.max(0, Math.min(playArea.offsetWidth - 50, shipX + direction));
        ship.style.left = `${shipX}px`;
        ship.style.transform = "scale(1.2)";
        setTimeout(() => {
            ship.style.transform = "scale(1)";
            isBoosting = false;
        }, 500);
    }
}

startButton.addEventListener("click", () => {
    updateLeaderboard();
    startGame();
});
