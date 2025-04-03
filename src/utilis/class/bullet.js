class Bullet {
  constructor(context, x, y, angle, radius) {
    this.ctx = context;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.angle = angle;
    this.speed = 15;
  }

  draw() {
    this.ctx.fillStyle = "#B87333";
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  update() {
    this.draw();
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
  }

  isCollidedWithWord(wordRect) {
    return this.y < wordRect.y + wordRect.height;
  }
}

class Bullets {
  constructor() {
    this.bullets = [];
  }

  shootBullets(bullet) {
    this.bullets.push(bullet);
  }

  update() {
    this.bullets.forEach((bullet) => {
      bullet.update();
    });
  }

  remove() {
    this.bullets.shift();
  }
  head() {
    return this.bullets[0];
  }
}

export { Bullet, Bullets };
