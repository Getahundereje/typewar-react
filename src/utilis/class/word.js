class Word {
  constructor(word, context, canvasHeight, x, y, dx, dy) {
    this.word = word.toUpperCase();
    this.ctx = context;
    this.canvasHeight = canvasHeight;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.selectedLetters = "";
    this.notSelectedLetters = this.word;
    this.collidedLetters = "";
    this.collidedLettersColor = "#D6CFB4";
    this.notSelectedLettersColor = "#FFF574";
    this.fontSize = 18;
    this.initialPosition = { x, y };
  }

  toJSON() {
    return {
      word: this.word,
      canvasHeight: this.canvasHeight,
      x: this.x,
      y: this.y,
      dx: this.dx,
      dy: this.dy,
      selectedLetters: this.selectedLetters,
      notSelectedLetters: this.notSelectedLetters,
      collidedLetters: this.collidedLetters,
    };
  }

  static fromJSON(jsonData) {
    if (jsonData) {
      const newWord = new Word(
        jsonData.word,
        jsonData.x,
        jsonData.y,
        jsonData.dx,
        jsonData.dy
      );
      newWord.canvasHeight = jsonData.canvasHeight;
      newWord.selectedLetters = jsonData.selectedLetters;
      newWord.notSelectedLetters = jsonData.notSelectedLetters;
      newWord.collidedLetters = jsonData.collidedLetters;

      return newWord;
    }
    return null;
  }

  update(context) {
    this.lifeCounter++;
    this.draw(context);

    if (
      this.x >= this.initialPosition.x + 60 ||
      this.x <= this.initialPosition.x - 60
    ) {
      this.dx = -this.dx;
    }

    this.x += this.dx;
    this.y += this.dy;
  }

  draw(context) {
    context.beginPath();
    context.shadowColor = "gray";
    context.shadowBlur = 3;
    context.shadowOffsetX = 5;
    context.shadowOffsetY = 5;
    context.font = `bold ${this.fontSize}px courier`;

    context.fillStyle = this.collidedLettersColor;
    context.fillText(this.collidedLetters, this.x, this.y);

    context.strokeStyle = "red";
    context.lineWidth = 3;
    context.strokeText(
      this.selectedLetters,
      this.x + context.measureText(this.collidedLetters).width,
      this.y
    );
    context.fillStyle = this.notSelectedLettersColor;
    context.fillText(
      this.selectedLetters,
      this.x + context.measureText(this.collidedLetters).width,
      this.y
    );

    const selectedLettersWidth =
      context.measureText(this.collidedLetters).width +
      context.measureText(this.selectedLetters).width;

    context.fillStyle = this.notSelectedLettersColor;
    context.strokeText(
      this.notSelectedLetters,
      this.x + selectedLettersWidth,
      this.y
    );
    context.fillText(
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

  reset() {
    this.selectedLetters = "";
    this.notSelectedLetters = this.word;
    this.collidedLetters = "";
  }

  wordIsCompleted() {
    return this.collidedLetters.includes(this.word);
  }

  isVanished() {
    return this.y >= this.canvasHeight;
  }

  collisionEffect() {
    if (this.dy > 0) {
      this.dy = -this.dy;
      setTimeout(() => {
        this.dy = -this.dy;
      }, 100);
    } else {
      const dy = this.dy;
      setTimeout(() => {
        this.dy = dy;
      }, 50);
    }
  }

  getWordRect() {
    const canvas = document.createElement("canvas");
    if (canvas) {
      const ctx = canvas.getContext("2d");

      return {
        x: this.x,
        y: this.y - this.fontSize,
        width: ctx.measureText(this.word).width,
        height: this.fontSize,
      };
    }
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

  update(context) {
    this.words.forEach((word) => {
      word.update(context);
    });
  }

  getWord(startsWith) {
    return this.words.filter((w) => {
      return w.word.startsWith(startsWith.toUpperCase());
    })[0];
  }

  getWords() {
    return this.words;
  }

  isEmpty() {
    return this.words.length === 0;
  }

  getLength() {
    return this.words.length;
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
        if (!word.collidedLetters || !word.selectedLetters) {
          word.y = word.initialPosition.y;
          word.x = word.initialPosition.x;
          this.dy += this.dy / 3;
        }
      }
    });
    return vanishedWords;
  }

  includes(word) {
    return this.words.some((w) => {
      return w.word.startsWith(word[0].toUpperCase());
    });
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

  toArray() {
    return this.words.map((w) => {
      return w.toJSON();
    });
  }

  static fromArray(sourceArray) {
    if (sourceArray) {
      const newWords = new Words();

      sourceArray.forEach((word) => {
        newWords.add(Word.fromJSON(word));
      });

      return newWords;
    }

    return null;
  }
}

export { Word, Words };
