class Gun {
  constructor(context, x, y) {
    this.ctx = context;
    this.x = x;
    this.y = y;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.rect(this.x, this.y, 20, 20);
    this.ctx.fill();
  }
}

export default Gun;
