class Gun {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, 20, 20);
    ctx.fill();
  }
}
