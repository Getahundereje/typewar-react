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
  wordsContext,
  gameType,
  isBonus = false
) {
  let currentItration = 1;
  let numberOfWordsToSpawnOnce = Math.ceil(numberOfWordsToSpawn * 0.25);
  const totalItration = Math.ceil(
    numberOfWordsToSpawn / numberOfWordsToSpawnOnce
  );

  function spawnWord() {
    for (let i = 0; i < numberOfWordsToSpawnOnce; i++) {
      let index =
        gameType === "singlePlayer"
          ? generateWordIndex(wordsContext.notSelectedWords.current)
          : wordsContext.wordsPosition.current[i].index;

      let word = wordsContext.notSelectedWords.current[index];

      while (wordsContext.currentSelectedWords.current.includes(word)) {
        console.log("includes");
        index =
          gameType === "singlePlayer"
            ? generateWordIndex(wordsContext.notSelectedWords.current)
            : wordsContext.wordsPosition.current[i].index;

        word = wordsContext.notSelectedWords.current[index];
      }

      if (word) {
        const x =
          gameType === "singlePlayer"
            ? wordsEntrancePoints[
                wordsEntrancePointsAccessOrder[currentEntrancePoint]
              ]
            : wordsContext.wordsPosition.current[index].x;
        const y = 80;
        currentEntrancePoint++;
        currentEntrancePoint =
          currentEntrancePoint % wordsEntrancePoints.length;

        const dx =
          gameType === "singlePlayer"
            ? Math.random() - 0.5
            : wordsContext.wordsPosition.current[index].dx;

        wordsContext.currentSelectedWords.current.add(
          new Word(word, canvasContext, canvasHeight, x, y, dx, 0.5)
        );

        isBonus && wordsContext.currentSelectedWords.current.createBonus();

        wordsContext.notSelectedWords.current.splice(index, 1);
        wordsContext.wordsPosition.current.splice(index, 1);
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
