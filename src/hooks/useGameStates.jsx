import { useState, useRef, useEffect } from "react";
import useSessionStorage from "./useSessionStorage";

const useGameState = () => {
  const [gameState, setGameState] = useSessionStorage("savedGameState", "");

  // State
  const [score, setScore] = useState(gameState.score ?? 0);
  const [chanceLeft, setChanceLeft] = useState(gameState.chanceLeft ?? 10);
  const [currentTime, setCurrentTime] = useState(
    gameState.currentTime ?? { min: 0, sec: 0 }
  );
  const [gameTypeSelectionStage, setGameTypeSelectionStage] = useState(true);
  const [gameType, setGameType] = useState(gameState.gameType ?? "");
  const [entryStage, setEntryStage] = useState(gameState.entryStage ?? true);
  const [pauseGame, setPauseGame] = useState(gameState.pauseGame ?? false);
  const [gameover, setGameover] = useState(false);
  const [focusedButtonId, setFocusedButtonId] = useState(
    (!gameState.continueGame
      ? gameState.focusedButtonId
        ? gameState.focusedButtonId
        : 1
      : gameState.focusedButtonId) ?? 1
  );
  const [continueGame, setContinueGame] = useState(
    gameState.continueGame ?? false
  );
  const [waitingOpponent, setWaitingOpponent] = useState(true);

  // Refs
  const firstTime = useRef(gameState.continueGame ? false : true);
  const currenTimeStoper = useRef(gameState.currenTimeStoper ?? undefined);
  const successiveWordAnswers = useRef(gameState.successiveWordAnswers ?? 0);
  const stageNumber = useRef(gameState.stageNumber ?? 1);
  const currentStageNumberOfWords = useRef(
    gameState.currentStageNumberOfWords ?? 5
  );
  const currentStageNotRenderedWords = useRef(
    gameState.currentStageNotRenderedWords ?? 0
  );
  const currentStageRemainingWords = useRef(
    gameState.currentStageRemainingWords ?? currentStageNumberOfWords.current
  );
  const falseShoot = useRef(gameState.falseShoot ?? 0);
  const trueShoot = useRef(gameState.trueShoot ?? 0);

  function resetGameStates() {
    setScore(0);
    setChanceLeft(10);
    setCurrentTime({ min: 0, sec: 0 });
    setEntryStage(true);
    setPauseGame(false);
    setGameover(false);
    setContinueGame(false);
    setGameTypeSelectionStage(true);
    setGameType("");
    setWaitingOpponent(true);

    clearInterval(currenTimeStoper.current);
    currenTimeStoper.current = undefined;
    successiveWordAnswers.current = 0;
    stageNumber.current = 1;
    currentStageNumberOfWords.current = 5;
    currentStageNotRenderedWords.current = 0;
    currentStageRemainingWords.current = currentStageNumberOfWords.current;
    falseShoot.current = 0;
    trueShoot.current = 0;
    firstTime.current = true;
  }

  useEffect(() => {
    setGameState({
      score,
      chanceLeft,
      currentTime,
      focusedButtonId,
      pauseGame,
      entryStage,
      continueGame,
      currenTimeStoper: currenTimeStoper.current,
      successiveWordAnswers: successiveWordAnswers.current,
      stageNumber: stageNumber.current,
      currentStageNumberOfWords: currentStageNumberOfWords.current,
      currentStageNotRenderedWords: currentStageNotRenderedWords.current,
      currentStageRemainingWords: currentStageRemainingWords.current,
      falseShoot: falseShoot.current,
      trueShoot: trueShoot.current,
    });
  }, [pauseGame, focusedButtonId, continueGame]);

  return {
    // States
    score,
    setScore,
    chanceLeft,
    setChanceLeft,
    currentTime,
    setCurrentTime,
    entryStage,
    setEntryStage,
    pauseGame,
    setPauseGame,
    gameover,
    setGameover,
    focusedButtonId,
    setFocusedButtonId,
    continueGame,
    setContinueGame,
    gameType,
    setGameType,
    gameTypeSelectionStage,
    setGameTypeSelectionStage,
    waitingOpponent,
    setWaitingOpponent,

    // Refs
    firstTime,
    currenTimeStoper,
    successiveWordAnswers,
    stageNumber,
    currentStageNumberOfWords,
    currentStageNotRenderedWords,
    currentStageRemainingWords,
    falseShoot,
    trueShoot,

    //function
    resetGameStates,
  };
};

export default useGameState;
