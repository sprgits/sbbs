const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// 주인공 전투기 이미지 로드
const playerImg = new Image();
playerImg.src = "주인공전투기.png";

// 게임 상태
let player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 70,
  width: 50,
  height: 50,
  speed: 5,
};

let bullets = [];
let enemies = [];
let keys = {};

// 키보드 이벤트
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

// 총알 생성
function shootBullet() {
  bullets.push({
    x: player.x + player.width / 2 - 2.5,
    y: player.y,
    width: 5,
    height: 10,
    speed: 7,
  });
}

// 적 생성
function spawnEnemy() {
  enemies.push({
    x: Math.random() * (canvas.width - 40),
    y: -40,
    width: 40,
    height: 40,
    speed: 2 + Math.random() * 3,
  });
}

// 충돌 체크
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// 게임 업데이트
function updateGame() {
  // 플레이어 이동
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x + player.width < canvas.width) player.x += player.speed;
  if (keys[" "] && bullets.length < 5) shootBullet();

  // 총알 이동
  bullets = bullets.filter((bullet) => bullet.y > 0);
  bullets.forEach((bullet) => (bullet.y -= bullet.speed));

  // 적 이동
  enemies.forEach((enemy) => (enemy.y += enemy.speed));
  enemies = enemies.filter((enemy) => enemy.y < canvas.height);

  // 충돌 처리
  bullets.forEach((bullet, bIndex) => {
    enemies.forEach((enemy, eIndex) => {
      if (isColliding(bullet, enemy)) {
        bullets.splice(bIndex, 1);
        enemies.splice(eIndex, 1);
      }
    });
  });
}

// 게임 그리기
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 플레이어 그리기
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // 총알 그리기
  bullets.forEach((bullet) => {
    ctx.fillStyle = "yellow";
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });

  // 적 그리기
  enemies.forEach((enemy) => {
    ctx.fillStyle = "red";
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });
}

// 게임 루프
function gameLoop() {
  updateGame();
  drawGame();
  requestAnimationFrame(gameLoop);
}

// 적 생성 타이머
setInterval(spawnEnemy, 1000);

// 이미지 로드 후 게임 시작
playerImg.onload = () => {
  gameLoop();
};
