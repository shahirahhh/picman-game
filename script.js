const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 50, y: 50, size: 30, dx: 0, dy: 0 };
let dot = spawnDot();
let score = 0;
let speed = 1;
let gameOver = false;

function spawnDot() {
  return {
    x: Math.random() * (canvas.width - 10) + 5,
    y: Math.random() * (canvas.height - 10) + 5,
    size: 5
  };
}

function drawPlayer() {
  ctx.save();
  ctx.shadowBlur = 10;
  ctx.shadowColor = "yellow";
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size / 2, 0.25 * Math.PI, 1.75 * Math.PI);
  ctx.lineTo(player.x, player.y);
  ctx.fill();
  ctx.restore();
}

function drawDot() {
  ctx.save();
  ctx.shadowBlur = 8;
  ctx.shadowColor = "white";
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function update() {
  player.x += player.dx * speed;
  player.y += player.dy * speed;

  // Wall check
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
    score += 10;
    document.getElementById("score").textContent = "Score: " + score;
    dot = spawnDot();

    if (score % 50 === 0) speed += 0.5;
    if (score >= 200) endGame("🎉 You Win!");
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawDot();
}

function gameLoop() {
  if (!gameOver) {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }
}

function endGame(message) {
  gameOver = true;
  setTimeout(() => {
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.innerHTML = `<h2>${message}</h2><button onclick="restartGame()">Try Again</button>`;
    document.body.appendChild(overlay);
  }, 300);
}

function restartGame() {
  const overlay = document.getElementById("overlay");
  if (overlay) overlay.remove();

  player = { x: 50, y: 50, size: 30, dx: 0, dy: 0 };
  dot = spawnDot();
  score = 0;
  speed = 4;
  gameOver = false;
  document.getElementById("score").textContent = "Score: 0";
  gameLoop();
}

// Desktop keyboard controls
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp")    { player.dy = -1; player.dx = 0; }
  if (e.key === "ArrowDown")  { player.dy = 1;  player.dx = 0; }
  if (e.key === "ArrowLeft")  { player.dx = -1; player.dy = 0; }
  if (e.key === "ArrowRight") { player.dx = 1;  player.dy = 0; }
});

// Mobile button controls
function setDirection(dir) {
  if (dir === 'up')    { player.dx = 0;  player.dy = -1; }
  if (dir === 'down')  { player.dx = 0;  player.dy = 1; }
  if (dir === 'left')  { player.dx = -1; player.dy = 0; }
  if (dir === 'right') { player.dx = 1;  player.dy = 0; }
}

gameLoop();
