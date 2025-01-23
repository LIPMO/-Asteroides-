let score = 0;
let gameOver = false;
let ship = document.getElementById("ship");
let scoreDisplay = document.getElementById("score");
let startButton = document.getElementById("start-button");
let controlsButton = document.getElementById("controls-button");
let controlsPopup = document.getElementById("controls-popup");
let closeControlsButton = document.getElementById("close-controls");

let asteroids = [];
let gameInterval;
let asteroidInterval;

// Bouton pour démarrer
startButton.addEventListener("click", () => {
    startGame();
});

// Bouton pour afficher/fermer les contrôles
controlsButton.addEventListener("click", () => {
    controlsPopup.classList.remove("hidden");
});

closeControlsButton.addEventListener("click", () => {
    controlsPopup.classList.add("hidden");
});

// Fonction pour démarrer le jeu
function startGame() {
    score = 0;
    gameOver = false;
    scoreDisplay.textContent = score;
    asteroids = [];
    ship.style.left = "50%";  // Réinitialiser la position du vaisseau

    gameInterval = setInterval(() => {
        if (!gameOver) {
            score++;
            scoreDisplay.textContent = score;
        }
    }, 100);

    asteroidInterval = setInterval(() => {
        if (!gameOver) {
            spawnAsteroid();
        }
    }, 1500);

    // Détecter la touche pour déplacer le vaisseau
    document.addEventListener("keydown", moveShip);
    // Arrêter le jeu après 30 secondes
    setTimeout(() => {
        clearInterval(gameInterval);
        clearInterval(asteroidInterval);
        endGame();
    }, 30000);
}

// Fonction pour afficher un astéroïde
function spawnAsteroid() {
    let asteroid = document.createElement("div");
    asteroid.classList.add("asteroid");
    asteroid.style.position = "absolute";
    asteroid.style.width = "30px";
    asteroid.style.height = "30px";
    asteroid.style.background = "gray";
    asteroid.style.borderRadius = "50%";
    asteroid.style.top = "0px";
    asteroid.style.left = `${Math.random() * (600 - 30)}px`;

    document.getElementById("play-area").appendChild(asteroid);

    asteroids.push(asteroid);

    // Faire tomber l'astéroïde
    let asteroidFall = setInterval(() => {
        if (!gameOver) {
            let asteroidTop = parseInt(asteroid.style.top.replace("px", ""));
            if (asteroidTop < 400) {
                asteroid.style.top = asteroidTop + 3 + "px";
            } else {
                clearInterval(asteroidFall);
                document.getElementById("play-area").removeChild(asteroid);
                asteroids = asteroids.filter(a => a !== asteroid);
            }

            // Vérifier la collision avec le vaisseau
            if (checkCollision(asteroid)) {
                endGame();
            }
        }
    }, 30);
}

// Vérifier la collision entre le vaisseau et un astéroïde
function checkCollision(asteroid) {
    let shipRect = ship.getBoundingClientRect();
    let asteroidRect = asteroid.getBoundingClientRect();

    return !(shipRect.right < asteroidRect.left ||
             shipRect.left > asteroidRect.right ||
             shipRect.bottom < asteroidRect.top ||
             shipRect.top > asteroidRect.bottom);
}

// Fonction pour déplacer le vaisseau
function moveShip(e) {
    if (gameOver) return;
    let shipRect = ship.getBoundingClientRect();
    if (e.key === "ArrowLeft" && shipRect.left > 0) {
        ship.style.left = shipRect.left - 15 + "px";
    } else if (e.key === "ArrowRight" && shipRect.right < 600) {
        ship.style.left = shipRect.left + 15 + "px";
    }
}

// Fin du jeu
function endGame() {
    gameOver = true;
    alert(`Game Over! Score: ${score}`);
}
