import { Word } from "../class/word";

function generateWordIndex(wordsCollection) {
  return Math.floor(Math.random() * wordsCollection.length);
}

function spawnWords(
  numberOfWords,
  timeInterval,
  canvasContext,
  canvasWidth,
  canvasHeight,
  currentSelectedWords,
  wordsCollection
) {
  let i = 0;

  const stopTimer = setInterval(() => {
    const index = generateWordIndex(wordsCollection);
    const word = wordsCollection[index];

    if (word) {
      wordsCollection.splice(index, 1);

      const wordLength = canvasContext.measureText(word).width;
      const xRand = Math.random() * canvasWidth;
      const x =
        xRand > canvasWidth - wordLength
          ? canvasWidth - wordLength - 10
          : xRand < wordLength
          ? wordLength + 10
          : xRand;
      const y = 20;

      const dx = Math.random() - 0.5;
      currentSelectedWords.add(
        new Word(word, canvasContext, canvasHeight, x, y, dx, 0.5)
      );
    }

    i++;

    if (i === numberOfWords) {
      clearInterval(stopTimer);
      return;
    }
  }, timeInterval);
}

export default spawnWords;
