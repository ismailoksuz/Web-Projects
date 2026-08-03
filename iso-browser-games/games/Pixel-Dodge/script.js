const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const GRID_SIZE = 20;
const PLAYER_SPEED = 8;
const OBSTACLE_SPEED = 3;
const SPAWN_RATE = 30;

let player = {
    x: canvas.width / 2 - GRID_SIZE / 2,
    y: canvas.height - GRID_SIZE * 3,
    width: GRID_SIZE,
    height: GRID_SIZE,
    color: '#00ff88'
};

let obstacles = [];
let score = 0;
let highScore = localStorage.getItem('pixelDodgeHighScore') || 0;
let gameRunning = false;
let gameLoopId;
let spawnCounter = 0;
let keys = {};

highScoreDisplay.textContent = highScore;

function drawPixelBackground() {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < canvas.width; i += GRID_SIZE * 2) {
        for (let j = 0; j < canvas.height; j += GRID_SIZE * 2) {
            ctx.fillStyle = '#252542';
            ctx.fillRect(i, j, GRID_SIZE, GRID_SIZE);
        }
    }
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    ctx.fillStyle = '#00cc66';
    ctx.fillRect(player.x + 2, player.y + 2, player.width - 4, player.height - 4);
}

function createObstacle() {
    const types = [
        { width: GRID_SIZE * 2, height: GRID_SIZE, color: '#ff3366' },
        { width: GRID_SIZE, height: GRID_SIZE * 2, color: '#ff9933' },
        { width: GRID_SIZE * 3, height: GRID_SIZE, color: '#3366ff' },
        { width: GRID_SIZE, height: GRID_SIZE, color: '#ffcc00' }
    ];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const maxX = canvas.width - type.width;
    
    return {
        x: Math.floor(Math.random() * (maxX / GRID_SIZE)) * GRID_SIZE,
        y: -type.height,
        width: type.width,
        height: type.height,
        color: type.color,
        speed: OBSTACLE_SPEED + Math.random() * 2
    };
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        ctx.fillStyle = '#cc1144';
        ctx.fillRect(obstacle.x + 2, obstacle.y + 2, obstacle.width - 4, obstacle.height - 4);
    });
}

function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.y += obstacle.speed;
    });
    
    obstacles = obstacles.filter(obstacle => obstacle.y < canvas.height);
    
    spawnCounter++;
    if (spawnCounter >= SPAWN_RATE - Math.min(score / 100, 20)) {
        obstacles.push(createObstacle());
        spawnCounter = 0;
    }
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function updatePlayer() {
    if (!touchActive) {
        if (keys.ArrowLeft || keys.KeyA) {
            player.x = Math.max(0, player.x - PLAYER_SPEED);
        }
        if (keys.ArrowRight || keys.KeyD) {
            player.x = Math.min(canvas.width - player.width, player.x + PLAYER_SPEED);
        }
    }
}

function updateGame() {
    if (!gameRunning) return;
    
    updatePlayer();
    updateObstacles();
    
    for (const obstacle of obstacles) {
        if (checkCollision(player, obstacle)) {
            gameOver();
            return;
        }
    }
    
    score++;
    scoreDisplay.textContent = score;
}

function drawGame() {
    drawPixelBackground();
    drawPlayer();
    drawObstacles();
    
    ctx.fillStyle = '#ffcc00';
    ctx.font = '12px "Press Start 2P"';
    ctx.fillText(`SCORE: ${score}`, 10, 20);
}

function gameLoop() {
    updateGame();
    drawGame();
    if (gameRunning) {
        gameLoopId = requestAnimationFrame(gameLoop);
    }
}

function startGame() {
    if (gameRunning) return;
    
    player.x = canvas.width / 2 - GRID_SIZE / 2;
    player.y = canvas.height - GRID_SIZE * 3;
    obstacles = [];
    score = 0;
    spawnCounter = 0;
    gameRunning = true;
    
    startBtn.style.display = 'none';
    restartBtn.style.display = 'inline-block';
    
    scoreDisplay.textContent = score;
    gameLoop();
}

function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(gameLoopId);
    
    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;
        localStorage.setItem('pixelDodgeHighScore', highScore);
    }
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ff3366';
    ctx.font = '24px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
    
    ctx.fillStyle = '#ffcc00';
    ctx.font = '16px "Press Start 2P"';
    ctx.fillText(`SCORE: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText(`HIGH: ${highScore}`, canvas.width / 2, canvas.height / 2 + 50);
}

function restartGame() {
    if (gameRunning) {
        cancelAnimationFrame(gameLoopId);
    }
    startGame();
}

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

leftBtn.addEventListener('mousedown', () => keys.ArrowLeft = true);
leftBtn.addEventListener('mouseup', () => keys.ArrowLeft = false);
leftBtn.addEventListener('touchstart', () => keys.ArrowLeft = true);
leftBtn.addEventListener('touchend', () => keys.ArrowLeft = false);

rightBtn.addEventListener('mousedown', () => keys.ArrowRight = true);
rightBtn.addEventListener('mouseup', () => keys.ArrowRight = false);
rightBtn.addEventListener('touchstart', () => keys.ArrowRight = true);
rightBtn.addEventListener('touchend', () => keys.ArrowRight = false);

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

let touchActive = false;
let touchStartX = 0;

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    touchActive = true;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    touchStartX = touch.clientX - rect.left;
});

canvas.addEventListener('touchmove', (e) => {
    if (!touchActive || !gameRunning) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    
    const moveThreshold = 5;
    if (Math.abs(touchX - touchStartX) > moveThreshold) {
        player.x = touchX - player.width / 2;
        player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    }
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    touchActive = false;
});

drawGame();