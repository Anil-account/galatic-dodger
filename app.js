

const gameArea = document.getElementById('gameArea');
const player = document.getElementById('player');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const restartBtn = document.getElementById('restartBtn');


let score = 0;
let best = localStorage.getItem('gd_best') || 0;
let speed = 2;
let running = true;
let playerX = 50;
let spawnInterval;


bestEl.textContent = best;


/* ======================= */
/* PLAYER MOVEMENT */
/* ======================= */


document.addEventListener('keydown', e => {
if (!running) return;


if (e.key === 'ArrowLeft') {
playerX -= 5;
}


if (e.key === 'ArrowRight') {
playerX += 5;
}


playerX = Math.max(0, Math.min(90, playerX));
player.style.left = playerX + '%';
});


/* ======================= */
/* ASTEROID LOGIC */
/* ======================= */

function spawnAsteroid() {
if (!running) return;


const asteroid = document.createElement('div');
asteroid.className = 'asteroid';
asteroid.style.left = Math.random() * 90 + '%';
asteroid.style.top = '-40px';
gameArea.appendChild(asteroid);


let y = -40;


const fall = setInterval(() => {
if (!running) {
clearInterval(fall);
asteroid.remove();
return;
}


y += speed;
asteroid.style.top = y + 'px';


if (checkCollision(player, asteroid)) {
gameOver();
}


if (y > gameArea.offsetHeight) {
clearInterval(fall);
asteroid.remove();
score++;
scoreEl.textContent = score;
speed += 0.05;
}
}, 20);
}


spawnInterval = setInterval(spawnAsteroid, 900);

/* ======================= */
/* COLLISION */
/* ======================= */


function checkCollision(a, b) {
const ar = a.getBoundingClientRect();
const br = b.getBoundingClientRect();


return !(
ar.right < br.left ||
ar.left > br.right ||
ar.bottom < br.top ||
ar.top > br.bottom
);
}


/* ======================= */
/* GAME OVER */
/* ======================= */


function gameOver() {
if (!running) return; // ✅ prevents repeat calls


running = false;
clearInterval(spawnInterval);


if (score > best) {
best = score;
localStorage.setItem('gd_best', best);
bestEl.textContent = best;
}


showGameOver();
}


function showGameOver() {
const overlay = document.createElement('div');
overlay.style.position = 'absolute';
overlay.style.inset = 0;
overlay.style.background = 'rgba(2,6,23,0.92)';
overlay.style.display = 'flex';
overlay.style.flexDirection = 'column';
overlay.style.justifyContent = 'center';
overlay.style.alignItems = 'center';
overlay.style.color = '#fff';
overlay.style.borderRadius = '14px';


overlay.innerHTML = `
<h2 style="font-size:28px;margin-bottom:10px">💥 Game Over</h2>
<p style="margin-bottom:14px">Score: <strong>${score}</strong></p>
<p style="font-size:13px;opacity:.7">Press Restart to play again</p>
`;


gameArea.appendChild(overlay);
}


/* ======================= */
/* RESTART */
/* ======================= */


restartBtn.addEventListener('click', () => {
location.reload();
});
