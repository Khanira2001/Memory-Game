let trex = document.getElementById('trex');
let gameArea = document.getElementById('game-area');
let scoreDisplay = document.getElementById('score');
let popup = document.getElementById('popup');
let popupContent = document.getElementById('popup-content');
let score = 0;
let isJumping = false;
let gameInterval;
let obstacleInterval;
let obstacles = [];

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        jump();
    }
});

function startGame() {
    score = 0;
    scoreDisplay.textContent = 'Score: 0';
    trex.style.bottom = '0px';
    clearObstacles();
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    gameInterval = setInterval(updateGame, 20);
    obstacleInterval = setInterval(generateObstacle, 2000);
    popup.style.display = 'none';
}

function updateGame() {
    moveObstacles();
    checkCollisions();
    updateScore();
}

function jump() {
    if (isJumping) return;
    isJumping = true;
    let position = 0;
    let jumpInterval = setInterval(() => {
        if (position >= 150) {
            clearInterval(jumpInterval);
            let fallInterval = setInterval(() => {
                if (position <= 0) {
                    clearInterval(fallInterval);
                    isJumping = false;
                }
                position -= 5;
                trex.style.bottom = position + 'px';
            }, 20);
        }
        position += 5;
        trex.style.bottom = position + 'px';
    }, 20);
}

function generateObstacle() {
    let obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.right = '0px';
    gameArea.appendChild(obstacle);
    obstacles.push(obstacle);
}

function moveObstacles() {
    obstacles.forEach((obstacle, index) => {
        let obstacleRight = parseInt(window.getComputedStyle(obstacle).right);
        obstacle.style.right = (obstacleRight + 5) + 'px';
        if (obstacleRight > gameArea.clientWidth) {
            gameArea.removeChild(obstacle);
            obstacles.splice(index, 1);
            showPopup('NFT mined!');
        }
    });
}

function checkCollisions() {
    let trexBottom = parseInt(window.getComputedStyle(trex).bottom);
    let trexLeft = parseInt(window.getComputedStyle(trex).left);
    let trexWidth = parseInt(window.getComputedStyle(trex).width);
    let trexHeight = parseInt(window.getComputedStyle(trex).height);

    obstacles.forEach((obstacle) => {
        let obstacleRight = parseInt(window.getComputedStyle(obstacle).right);
        let obstacleWidth = parseInt(window.getComputedStyle(obstacle).width);
        let obstacleHeight = parseInt(window.getComputedStyle(obstacle).height);

        if (
            trexLeft + trexWidth > gameArea.clientWidth - obstacleRight &&
            trexLeft < gameArea.clientWidth - obstacleRight + obstacleWidth &&
            trexBottom < obstacleHeight
        ) {
            showPopup('Game Over!');
            clearInterval(gameInterval);
            clearInterval(obstacleInterval);
        }
    });
}

function updateScore() {
    score++;
    scoreDisplay.textContent = 'Score: ' + score;
}

function showPopup(message) {
    popupContent.textContent = message;
    popup.style.display = 'block';
}

function closePopup() {
    popup.style.display = 'none';
}

function clearObstacles() {
    obstacles.forEach((obstacle) => {
        gameArea.removeChild(obstacle);
    });
    obstacles = [];
}
