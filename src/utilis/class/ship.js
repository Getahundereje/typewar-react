class Ship {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.originalAngle = -Math.PI / 2;
    this.aimAngle = this.originalAngle;
    this.shootAngle = this.aimAngle;
    this.scale = 0.4;
    this.image = new Image();
    this.image.src = "/assets/game-assets/images/Ship.png";
    this.imageLoaded = false;

    this.image.onload = () => {
      this.imageLoaded = true;
    };
  }

  smoothRotate(targetAngle) {
    let rotationSpeed = 0.35;
    this.aimAngle = this.lerpAngle(this.aimAngle, targetAngle, rotationSpeed);
  }

  lerpAngle(current, target, amount) {
    let diff = ((target - current + Math.PI) % (Math.PI * 2)) - Math.PI;
    return current + diff * amount;
  }

  updateDirection(word) {
    let targetAngle = null;
    if (word) {
      const { x: wordX, y: wordY, width: wordWidth } = word.getWordRect();
      const wordCenterX =
        wordX < this.x ? wordX + wordWidth / 2 : wordX + wordWidth;
      targetAngle = Math.atan2(wordY - this.y, wordCenterX - this.x);
      this.shootAngle = targetAngle;
    } else {
      targetAngle = this.originalAngle;
    }

    this.smoothRotate(targetAngle);
  }

  getTipPosition() {
    let tipX =
      this.x + Math.cos(this.aimAngle) * ((this.image.height * this.scale) / 2);
    let tipY =
      this.y + Math.sin(this.aimAngle) * ((this.image.height * this.scale) / 2);
    return { x: tipX, y: tipY };
  }

  draw(context) {
    if (!this.imageLoaded) return;

    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.aimAngle);
    context.drawImage(
      this.image,
      (-this.image.width * this.scale) / 2,
      (-this.image.height * this.scale) / 2,
      this.image.width * this.scale,
      this.image.height * this.scale
    );

    context.restore();
  }

  update(context, word) {
    this.updateDirection(word);
    this.draw(context);
  }
}

export default Ship;
