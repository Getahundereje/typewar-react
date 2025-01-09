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
  wordsCollection,
  reset
) {
  let i = 0;

  const stopTimer = setInterval(() => {
    console.log(wordsCollection);
    const index = generateWordIndex(wordsCollection);
    const word = wordsCollection[index];

    if (word) {
      wordsCollection.splice(index, 1);

      const wordLength = canvasContext.measureText(word).width;
      const xRand = Math.random() * canvasWidth;
      const x =
        xRand > canvasWidth - wordLength
          ? canvasWidth - wordLength - 50
          : xRand < wordLength
          ? wordLength + 50
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
      if (wordsCollection.length < numberOfWords) {
        reset();
      }
      return;
    }
  }, timeInterval);
}

export default spawnWords;
