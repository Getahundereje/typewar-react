class Bullet {
  constructor(context, x, y, velocity, radius) {
    this.ctx = context;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocity = velocity;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = "red";
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.closePath();
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y -= this.velocity.y;
  }

  isCollidedWithWord(wordPosition) {
    if (this.y < wordPosition.y) return true;
    return false;
  }
}

class Bullets {
  constructor() {
    this.bullets = [];
  }

  shootBullets(bullet) {
    this.bullets.push(bullet);
  }

  draw() {
    this.bullets.forEach((bullet) => bullet.draw());
  }

  update() {
    this.bullets = this.bullets.filter((bullet) => {
      bullet.update();
      if (
        (bullet.x + bullet.radius > CANVAS_WIDTH &&
          bullet.x - bullet.radius < 0) ||
        bullet.y - bullet.radius < 0
      ) {
        return false;
      }
      return true;
    });
  }

  remove() {
    this.bullets.shift();
  }
  head() {
    return this.bullets[0];
  }
}

export {
  Bullet,
  Bullets
}