const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 50, y: 50, size: 30, dx: 0, dy: 0 };
let dot = spawnDot();
let score = 0;
let speed = 2;
let gameOver = false;
let direction = "right";

// Generate a random dot within canvas
function spawnDot() {
  return {
    x: Math.random() * (canvas.width - 10) + 5,
    y: Math.random() * (canvas.height - 10) + 5,
    size: 11 };
}

// Draw Pic Man with direction-based mouth
function drawPlayer() {
  ctx.save();
  ctx.shadowBlur = 10;
  ctx.shadowColor = "white";
  ctx.fillStyle = "yellow";

  let startAngle, endAngle;
  if (direction === 'right') {
    startAngle = 0.25 * Math.PI;
    endAngle = 1.75 * Math.PI;
  } else if (direction === 'left') {
    startAngle = 1.25 * Math.PI;
    endAngle = 0.75 * Math.PI;
  } else if (direction === 'up') {
    startAngle = 1.75 * Math.PI;
    endAngle = 1.25 * Math.PI;
  } else if (direction === 'down') {
    startAngle = 0.75 * Math.PI;
    endAngle = 0.25 * Math.PI;
  }

  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size / 2, startAngle, endAngle);
  ctx.lineTo(player.x, player.y);
  ctx.fill();
  ctx.restore();
}

// Draw rainbow-colored dot
function drawDot() {
  const gradient = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, dot.size);
  gradient.addColorStop(0, "red");
  gradient.addColorStop(0.2, "orange");
  gradient.addColorStop(0.4, "yellow");
  gradient.addColorStop(0.6, "green");
  gradient.addColorStop(0.8, "blue");
  gradient.addColorStop(1, "violet");

  ctx.save();
  ctx.shadowBlur = 8;
  ctx.shadowColor = "white";
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Update player position and check collisions
function update() {
  player.x += player.dx * speed;
  player.y += player.dy * speed;

  // Boundary collision
  if (
    player.x < player.size / 2 ||
    player.x > canvas.width - player.size / 2 ||
    player.y < player.size / 2 ||
    player.y > canvas.height - player.size / 2
  ) {
    endGame("👾 Game Over!");
    return;
  }

  // Dot collision
  const dist = Math.hypot(player.x - dot.x, player.y - dot.y);
  if (dist < player.size) {
    score += 1;
    document.getElementById("score").textContent = "Score: " + score;
    dot = spawnDot();

    // Gradually increase speed
    if (score > 0 && score % 20 === 0) {
      speed += 0.2;
    }

    // Win condition
    if (score >= 20) {
      endGame("🎉 You Win!");
    }
  }
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawDot();
}

// Game loop
function gameLoop() {
  if (!gameOver) {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }
}

// Show end-game overlay
function endGame(message) {
  gameOver = true;
  setTimeout(() => {
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.innerHTML = `<h2>${message}</h2><button onclick="restartGame()">Try Again</button>`;
    document.body.appendChild(overlay);
  }, 300);
}

// Restart the game
function restartGame() {
  const overlay = document.getElementById("overlay");
  if (overlay) overlay.remove();

  player = { x: 50, y: 50, size: 30, dx: 0, dy: 0 };
  dot = spawnDot();
  score = 0;
  speed = 2;
  direction = "right";
  gameOver = false;
  document.getElementById("score").textContent = "Score: 0";
  gameLoop();
}

// Keyboard controls
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp")    { player.dy = -1; player.dx = 0; direction = 'up'; }
  if (e.key === "ArrowDown")  { player.dy = 1;  player.dx = 0; direction = 'down'; }
  if (e.key === "ArrowLeft")  { player.dx = -1; player.dy = 0; direction = 'left'; }
  if (e.key === "ArrowRight") { player.dx = 1;  player.dy = 0; direction = 'right'; }
});

// Mobile touch controls
function setDirection(dir) {
  direction = dir;
  if (dir === 'up')    { player.dx = 0;  player.dy = -1; }
  if (dir === 'down')  { player.dx = 0;  player.dy = 1; }
  if (dir === 'left')  { player.dx = -1; player.dy = 0; }
  if (dir === 'right') { player.dx = 1;  player.dy = 0; }
}

gameLoop();
