import { Word } from "../class/word";

const wordsEntrancePoints = [100, 220, 340, 460];
const wordsEntrancePointsAccessOrder = [0, 2, 1, 3];
let currentEntrancePoint = 0;

function generateWordIndex(wordsCollection) {
  return Math.floor(Math.random() * wordsCollection.length);
}

function spawnWords(
  numberOfWordsToSpawn,
  timeInterval,
  canvasContext,
  canvasHeight,
  selectedWords,
  wordsCollection,
  isBonus = false
) {
  let currentItration = 1;
  let numberOfWordsToSpawnOnce = Math.ceil(numberOfWordsToSpawn * 0.25);
  const totalItration = Math.ceil(
    numberOfWordsToSpawn / numberOfWordsToSpawnOnce
  );

  function spawnWord() {
    for (let i = 0; i < numberOfWordsToSpawnOnce; i++) {
      const index = generateWordIndex(wordsCollection);

      const word = wordsCollection[index];

      if (word) {
        wordsCollection.splice(index, 1);

        const x =
          wordsEntrancePoints[
            wordsEntrancePointsAccessOrder[currentEntrancePoint]
          ];
        const y = 80;
        currentEntrancePoint++;
        currentEntrancePoint =
          currentEntrancePoint % wordsEntrancePoints.length;

        const dx = Math.random() - 0.5;
        selectedWords.add(
          new Word(word, canvasContext, canvasHeight, x, y, dx, 0.5)
        );
        isBonus && selectedWords.createBonus();
      }
    }
  }

  spawnWord();

  if (numberOfWordsToSpawn > 1) {
    const stopTimer = setInterval(() => {
      if (currentItration === totalItration) {
        clearInterval(stopTimer);
        return;
      }

      if (currentItration === totalItration - 1)
        numberOfWordsToSpawnOnce =
          numberOfWordsToSpawn % numberOfWordsToSpawnOnce ||
          numberOfWordsToSpawnOnce;

      spawnWord();

      currentItration++;
    }, timeInterval);
  }
}

export default spawnWords;
