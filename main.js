import './style.css';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let w, h, particles;
const particleDistance = 40;
const mouse = {
  x: undefined,
  y: undefined,
  radius: 100,
};

ctx.fillStyle = 'rgba(255,255,255,1)';
ctx.beginPath();
ctx.arc(100, 100, 4, 0, 2 * Math.PI);
ctx.closePath();
ctx.fill();

function init() {
  resizeReset();
  animationLoop();
}

function resizeReset() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;

  particles = [];
  for (
    let y = ((h - particleDistance) % particleDistance) + particleDistance;
    y < h;
    y += particleDistance
  ) {
    for (
      let x = ((w - particleDistance) % particleDistance) + particleDistance;
      x < w;
      x += particleDistance
    ) {
      particles.push(new Particle(x, y));
    }
  }
}

function animationLoop() {
  ctx.clearRect(0, 0, w, h);
  drawScene();
  requestAnimationFrame(animationLoop);
}

function drawScene() {
  for (const particle of particles) {
    particle.update();
    particle.draw();
  }

  drawLine();
}

function drawLine() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < particleDistance * 1.5) {
        ctx.globalAlpha = 1 - distance / (particleDistance * 1.5);
        ctx.strokeStyle = 'rgba(255,255,255,1)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

function mousemove(e) {
  mouse.x = e.x;
  mouse.y = e.y;
}

function mouseout() {
  mouse.x = undefined;
  mouse.y = undefined;
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 4;
    this.baseX = this.x;
    this.baseY = this.y;
    this.speed = 8;
  }

  draw() {
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
  }

  update() {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = mouse.radius;
    const force = (maxDistance - distance) / maxDistance; // 0-1
    const forceDirectionX = dx / distance;
    const forceDirectionY = dy / distance;
    const directionX = this.speed * force * forceDirectionX;
    const directionY = this.speed * force * forceDirectionY;

    if (distance < mouse.radius) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        const dx = this.x - this.baseX;
        this.x -= dx / 10;
      }

      if (this.y !== this.baseY) {
        const dy = this.y - this.baseY;
        this.y -= dy / 10;
      }
    }
  }
}

init();
window.addEventListener('resize', resizeReset);
window.addEventListener('mousemove', mousemove);
window.addEventListener('mouseout', mouseout);
