class Word {
  constructor(word, context, canvasHeight, x, y, dx, dy) {
    this.word = word;
    this.ctx = context;
    this.canvasHeight = canvasHeight;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.selectedLetters = "";
    this.notSelectedLetters = word;
    this.collidedLetters = "";
    this.collidedLettersColor = "#D6CFB4";
    this.notSelectedLettersColor = "#FFF574";
    this.fontSize = 18;
    this.life = 0;
    this.lifeCounter = 0;
  }

  update() {
    this.lifeCounter++;
    this.draw();
    if (
      this.x +
        (this.ctx.measureText(this.collidedLetters).width +
          this.ctx.measureText(this.selectedLetters).width +
          this.ctx.measureText(this.notSelectedLetters).width) >=
        600 ||
      this.x <= 0
    ) {
      this.dx = -this.dx;
    }
    if (
      this.y - this.ctx.measureText(this.word).actualBoundingBoxAscent >=
      this.canvasHeight
    ) {
      this.y = this.ctx.measureText(this.word).actualBoundingBoxAscent + 3;
    }

    if (this.lifeCounter === 20) {
      this.life++;
      this.lifeCounter = 0;
    }

    if (this.life > 30) {
      this.life = 0;
      this.dy = this.dy + this.dy / 3;
    }

    this.x += this.dx;
    this.y += this.dy;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.shadowColor = "gray";
    this.ctx.shadowBlur = 3;
    this.ctx.shadowOffsetX = 5;
    this.ctx.shadowOffsetY = 5;
    this.ctx.font = `bold ${this.fontSize}px courier`;

    this.ctx.fillStyle = this.collidedLettersColor;
    this.ctx.fillText(this.collidedLetters, this.x, this.y);

    this.ctx.fillStyle = this.notSelectedLettersColor;
    this.ctx.fillText(
      this.selectedLetters,
      this.x + this.ctx.measureText(this.collidedLetters).width,
      this.y
    );

    const selectedLettersWidth =
      this.ctx.measureText(this.collidedLetters).width +
      this.ctx.measureText(this.selectedLetters).width;

    this.ctx.fillStyle = this.notSelectedLettersColor;
    this.ctx.fillText(
      this.notSelectedLetters,
      this.x + selectedLettersWidth,
      this.y
    );
  }

  setCollidedLetter() {
    this.collidedLetters += this.selectedLetters.charAt(0);
    this.selectedLetters = this.selectedLetters.replace(
      this.selectedLetters.charAt(0),
      ""
    );
  }

  setSelectedLetters(selectedLetter) {
    if (this.notSelectedLetters.startsWith(selectedLetter.toUpperCase())) {
      this.selectedLetters += selectedLetter.toUpperCase();
      this.notSelectedLetters = this.notSelectedLetters.replace(
        selectedLetter.toUpperCase(),
        ""
      );
    }
  }

  notSelectedLettersIsEmpty = function () {
    return this.notSelectedLetters === "";
  };

  wordIsCompleted() {
    return this.collidedLetters.includes(this.word);
  }

  isVanished() {
    return this.y + 3 >= this.canvasHeight;
  }

  collisionEffect() {
    this.dy = -this.dy;
    this.life = this.life <= 10 ? 0 : this.life - 10;
    setTimeout(() => {
      this.dy = -this.dy;
    }, 100);
  }

  getWordRect() {
    return {
      x: this.x,
      y: this.y - this.ctx.measureText(this.word).actualBoundingBoxAscent,
      width: this.ctx.measureText(this.word).width,
      height: this.ctx.measureText(this.word).actualBoundingBoxAscent,
    };
  }

  checkCollitiondWithWord(word) {
    const { x, y, width, height } = this.getWordRect();
    const {
      x: otherX,
      y: otherY,
      width: otherWidth,
      height: otherHeght,
    } = word.getWordRect();

    if (
      x < otherX + otherWidth &&
      x + width > otherX &&
      y + height > otherY &&
      y < otherHeght + otherY
    ) {
      if (y < otherY) {
        this.y += 3;
        this.dx += this.dx * 0.1;

        word.dx -= word.dx * 0.1;
        word.y -= 3;
      } else {
        this.y -= 3;
        this.dx -= this.dx * 0.1;

        word.dx += word.dx * 0.1;
        word.y += 3;
      }
    }
  }

  isEqual(otherWord) {
    return this.word === otherWord.word;
  }
}

class Words {
  constructor() {
    this.words = [];
  }

  add(word) {
    this.words.push(word);
  }

  remove(wordToRemove) {
    let index = 0;
    this.words.forEach((w, i) => {
      if (w.word === wordToRemove.word) {
        index = i;
      }
    });

    this.words.splice(index, 1);
  }

  update() {
    this.words.forEach((word) => {
      word.update();
    });
  }

  getWord(startsWith) {
    return this.words.filter((w) => {
      return w.word.startsWith(startsWith.toUpperCase());
    })[0];
  }

  isEmpty() {
    return this.words.length === 0;
  }

  wordIsBellowWall() {
    let flag = false;
    this.words.forEach((word) => {
      if (word.isVanished()) {
        flag = true;
        word.y = 20;
      }
    });
    if (flag) return true;

    return false;
  }

  createBonus() {
    let index = Math.floor(Math.random() * this.words.length);
    while (
      this.words[index].selectedLetters ||
      this.words[index].collidedLetters
    ) {
      index = Math.floor(Math.random() * this.words.length);
    }

    this.words[index].collidedLetters = "⭐";
    this.words[index].notSelectedLettersColor = "gold";
  }

  checkBonus(word) {
    return word.collidedLetters.startsWith("⭐");
  }

  handleCollisionWithWord() {
    this.words.forEach((word, i) => {
      if (i === this.words.length - 1) return;
      word.checkCollitiondWithWord(this.words[i]);
    });
  }
}

export { Word, Words };
