let score = 0;
let gameInterval, asteroidInterval;
let ship = document.getElementById("ship");
let playArea = document.getElementById("play-area");
let scoreDisplay = document.getElementById("score");
let startButton = document.getElementById("start-button");

let shipX = playArea.offsetWidth / 2 - 25;
ship.style.left = `${shipX}px`;

function startGame() {
    score = 0;
    scoreDisplay.textContent = score;
    startButton.disabled = true;
    
    gameInterval = setInterval(() => {
        score++;
        scoreDisplay.textContent = score;
    }, 100);

    asteroidInterval = setInterval(createAsteroid, 1000);

    setTimeout(() => {
        endGame();
    }, 30000); // Durée du jeu : 30 secondes
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(asteroidInterval);
    document.querySelectorAll(".asteroid").forEach(ast => ast.remove());
    alert(`Game Over! Score: ${score}`);
    startButton.disabled = false;
}

function createAsteroid() {
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
        let currentTop = parseFloat(asteroid.style.top);
        asteroid.style.top = `${currentTop + fallSpeed}px`;

        if (currentTop > playArea.offsetHeight) {
            asteroid.remove();
        }

        if (checkCollision(ship, asteroid)) {
            endGame();
        } else {
            requestAnimationFrame(moveAsteroid);
        }
    }

    moveAsteroid();
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

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && shipX > 0) {
        shipX -= 20;
    } else if (event.key === "ArrowRight" && shipX < playArea.offsetWidth - 50) {
        shipX += 20;
    }
    ship.style.left = `${shipX}px`;
});

startButton.addEventListener("click", startGame);
