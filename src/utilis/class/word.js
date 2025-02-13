class Word {
  constructor(word, context, canvasHeight, x, y, dx, dy) {
    this.word = word.toUpperCase();
    this.ctx = context;
    this.canvasHeight = canvasHeight;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.width = this.ctx.measureText(this.word).width;
    this.height = this.ctx.measureText(this.word).actualBoundingBoxAscent;
    this.selectedLetters = "";
    this.notSelectedLetters = this.word;
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
    if (this.height >= this.canvasHeight) {
      this.height + 3;
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
    this.ctx.strokeStyle = "red";
    this.ctx.lineWidth = 5;
    this.ctx.strokeText(
      this.notSelectedLetters,
      this.x + selectedLettersWidth,
      this.y
    );
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
      y: this.y - this.height,
      width: this.width,
      height: this.height,
    };
  }

  checkCollitiondWithWords(words) {
    words.forEach((word) => {
      if (this.isEqual(word)) {
        return;
      }

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
        this.dx = -this.dx;
        // if (y < otherY) {
        //   this.y += 3;
        //   this.dx += this.dx * 0.1;

        //   word.dx -= word.dx * 0.1;
        //   word.y -= 3;
        // } else {
        //   this.y -= 3;
        //   this.dx -= this.dx * 0.1;

        //   word.dx += word.dx * 0.1;
        //   word.y += 3;
        // }
      }
    });
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
      word.checkCollitiondWithWords(this.words);
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
    let vanishedWords = [];
    this.words.forEach((word) => {
      if (word.isVanished()) {
        if (word.collidedLetters.includes("⭐")) {
          word.collidedLetters = word.collidedLetters.substring(1);
          word.notSelectedLettersColor = "#FFF574";
        }
        vanishedWords.push(word);
        if (!word.collidedLetters || !word.selectedLetters) word.y = 20;
      }
    });
    return vanishedWords;
  }

  createBonus() {
    this.words[this.words.length - 1].collidedLetters = "⭐";
    this.words[this.words.length - 1].notSelectedLettersColor = "gold";
  }

  isBonus(word) {
    return word.collidedLetters.startsWith("⭐");
  }

  clear() {
    this.words.splice(0);
  }

  handleCollisionWithWords() {
    this.words.forEach((word) => {
      word.checkCollitiondWithWord(this.words);
    });
  }
}

export { Word, Words };
