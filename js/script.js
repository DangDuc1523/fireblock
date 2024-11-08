const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let playerX = canvas.width / 2 - 15;
let playerY = canvas.height - 50;
const playerWidth = 30;
const playerHeight = 30;
const bullets = [];
const enemies = [];
let score = 0;
let gameOver = false;

// Vẽ máy bay của người chơi
function drawPlayer() {
    ctx.fillStyle = "cyan";
    ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
}

// Tạo đạn
function shoot() {
    bullets.push({ x: playerX + playerWidth / 2 - 2, y: playerY, width: 4, height: 10 });
}

// Vẽ đạn
function drawBullets() {
    ctx.fillStyle = "yellow";
    bullets.forEach((bullet, index) => {
        bullet.y -= 5;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        if (bullet.y < 0) bullets.splice(index, 1);
    });
}

// Tạo máy bay địch
function createEnemy() {
    const x = Math.random() * (canvas.width - playerWidth);
    enemies.push({ x, y: 0, width: playerWidth, height: playerHeight });
}

// Vẽ máy bay địch
function drawEnemies() {
    ctx.fillStyle = "red";
    enemies.forEach((enemy, index) => {
        enemy.y += 2;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        if (enemy.y > canvas.height) enemies.splice(index, 1);
    });
}

// Kiểm tra va chạm
function checkCollisions() {
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                bullets.splice(bIndex, 1);
                enemies.splice(eIndex, 1);
                score += 10;
            }
        });
    });

    enemies.forEach((enemy) => {
        if (
            playerX < enemy.x + enemy.width &&
            playerX + playerWidth > enemy.x &&
            playerY < enemy.y + enemy.height &&
            playerY + playerHeight > enemy.y
        ) {
            gameOver = true;
        }
    });
}

// Vòng lặp game
function gameLoop() {
    if (gameOver) {
        alert("Game Over! Điểm của bạn: " + score);
        document.location.reload();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    drawEnemies();
    checkCollisions();

    // Thêm máy bay địch ngẫu nhiên
    if (Math.random() < 0.02) createEnemy();

    // Hiển thị điểm
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);

    requestAnimationFrame(gameLoop);
}

// Điều khiển di chuyển máy bay của người chơi
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && playerX > 0) {
        playerX -= 10;
    }
    if (e.key === "ArrowRight" && playerX < canvas.width - playerWidth) {
        playerX += 10;
    }
    if (e.key === " " || e.key === "ArrowUp") {
        shoot();
    }
});

gameLoop();
