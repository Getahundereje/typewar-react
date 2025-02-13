import { useContext, useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Howl } from "howler";
import axios from "axios";

import { Bullet } from "../../../utilis/class/bullet";
import Gun from "../../../utilis/class/gun";
import { WordsContext } from "../../../contexts/words/words.context";
import { BulletsContext } from "../../../contexts/bullets/bullets.context";
import { UserContext } from "../../../contexts/user/user.context";

import spawnWords from "../../../utilis/functions/spawn-words.jsx";
import calculateIntercept from "../../../utilis/functions/calculate-intercept";
import useSessionStorage from "../../../hooks/useSessionStorage.jsx";

import LoadingSpinner from "../../../components/loading-spinner/loading-spinner.component";

import "./game-page.styles.css";

const gameSettingsProperty = {
  staged: {
    easy: 4000,
    normal: 3000,
    hard: 2300,
  },
  timer: {
    easy: 4000,
    normal: 3000,
    hard: 2000,
  },
};

function GamePage() {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const wordsContext = useContext(WordsContext);
  const { bullets } = useContext(BulletsContext);

  const [gameState] = useSessionStorage(
    "gameState",
    userContext.user?.gameState || ""
  );

  const [score, setScore] = useState(0);
  const [chanceLeft, setChanceLeft] = useState(10);
  const [currentTime, setCurrentTime] = useState({});
  const [entryStage, setEntryStage] = useState(true);
  const [gameover, setGameover] = useState(false);

  const canvasRef = useRef();
  const successiveWordAnswers = useRef(0);
  const currenTimeStoper = useRef(undefined);
  const stageNumber = useRef(1);
  const currentStageNumberOfWords = useRef(5);
  const currentStageRemainingWords = useRef(currentStageNumberOfWords.current);
  const falseShoot = useRef(0);
  const trueShoot = useRef(0);
  let firstTime = useRef(true);
  let { current: styles } = useRef([]);

  const maxNumberOfWordsOnScreen = 7;

  const gameSounds = {
    menu: new Howl({
      src: ["/assets/game-assets/sound/menu.mp3"],
      volume: Number.parseFloat(gameState.setting.soundVolume),
    }),
    wordCompletion: new Howl({
      src: ["/assets/game-assets/sound/yay.mp3"],
      volume: Number.parseFloat(gameState.setting.gameSoundVolume),
    }),
    bulletShoot: new Howl({
      src: ["/assets/game-assets/sound/shoot.mp3"],
      volume: Number.parseFloat(gameState.setting.gameSoundVolume),
    }),
    collision: new Howl({
      src: ["/assets/game-assets/sound/collision.mp3"],
      volume: Number.parseFloat(gameState.setting.gameSoundVolume),
    }),
    vanishing: new Howl({
      src: ["/assets/game-assets/sound/vanishing.mp3"],
      volume: Number.parseFloat(gameState.setting.gameSoundVolume),
    }),
    error: new Howl({
      src: ["/assets/game-assets/sound/error.mp3"],
      volume: Number.parseFloat(gameState.setting.gameSoundVolume),
    }),
  };

  function handleCharactreClick(e, wordsContext) {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      wordsContext.currentSelectedCharacter = e.key;
    }
  }

  function handleGameoverButton(e) {
    e.preventDefault();

    firstTime.current = true;
    stageNumber.current = 1;
    successiveWordAnswers.current = 0;
    currentStageNumberOfWords.current = 5;
    currentStageRemainingWords.current = currentStageNumberOfWords.current;
    falseShoot.current = 0;
    trueShoot.current = 0;
    styles = [];

    wordsContext.currentSelectedCharacter = "";
    wordsContext.currentSelectedWord = undefined;
    wordsContext.selectedWordInfo = {};
    wordsContext.currentSelectedWords.clear();
    wordsContext.notSelectedWords = [...wordsContext.wordsCollection];
    setGameover(false);
    setEntryStage(true);
    setChanceLeft(10);
    setScore(0);
    clearInterval(currenTimeStoper.current);

    if (e.target.name === "menu") {
      navigate("/game/homepage");
    }
  }

  function timer(minute, currentTime, dedactedTime) {
    let time =
      currentTime.sec || currentTime.min
        ? currentTime.min * 60 + Number.parseInt(currentTime.sec)
        : 60 * minute;
    time -= dedactedTime;

    let min = Math.floor(time / 60);
    let sec = time % 60;

    if (time <= 0) {
      setGameover(true);
    }

    if (sec < 10) sec = sec.toString().padStart(2, 0);
    setCurrentTime({
      min,
      sec,
    });

    currenTimeStoper.current = setInterval(() => {
      time--;

      min = Math.floor(time / 60);
      sec = time % 60;

      if (sec < 10) sec = sec.toString().padStart(2, "0");

      setCurrentTime({
        min,
        sec,
      });

      if (time <= 0) {
        setGameover(true);
        clearInterval(currenTimeStoper.current);
      }
    }, 1000);
  }

  function removeStyle(index) {
    styles = styles.filter((_, i) => i !== index);
  }

  async function getWords() {
    try {
      const response = await axios.get("http://localhost:8000/words", {
        withCredentials: true,
      });
      const { data } = response;
      wordsContext.setWordsCollection(data.data.words);
      console.log(data.data.words);
    } catch (error) {
      console.log(error);
    }
  }

  function renderIntroPage() {
    setTimeout(() => {
      setEntryStage(false);
    }, 3000);
  }

  useEffect(() => {
    if (!wordsContext.wordsCollection.length) {
      getWords();
    }
  }, []);

  useEffect(() => {
    if (wordsContext.wordsCollection.length) {
      gameSounds.menu.play();
      window.onpopstate = handleGameoverButton;
    }

    return () => {
      gameSounds.menu.stop();
      window.onpopstate = null;
      wordsContext.setWordsCollection([]);
    };
  }, []);

  useEffect(() => {
    if (wordsContext.wordsCollection.length) {
      if (entryStage) {
        renderIntroPage();
      } else if (!entryStage && !gameover) {
        let animationFrameId = null;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const style = getComputedStyle(canvas);
        const canvasWidth = Number.parseInt(style.width);
        const canvasHeight = Number.parseInt(style.height);

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        function handleCharactreClickWrapper(e) {
          handleCharactreClick(e, wordsContext);
        }

        document.body.addEventListener("keydown", handleCharactreClickWrapper);

        function animate() {
          animationFrameId = requestAnimationFrame(animate);
          ctx.clearRect(0, 0, canvasWidth, canvasHeight);

          new Gun(ctx, canvasWidth / 2 - 20, canvasHeight - 20).draw();

          if (firstTime.current) {
            spawnWords(
              gameState.setting.gameMode === "timer"
                ? maxNumberOfWordsOnScreen
                : currentStageNumberOfWords.current < maxNumberOfWordsOnScreen
                ? currentStageNumberOfWords.current
                : maxNumberOfWordsOnScreen,
              gameSettingsProperty[gameState.setting.gameMode][
                gameState.setting.difficulty
              ],
              ctx,
              canvasHeight,
              wordsContext.currentSelectedWords,
              wordsContext.notSelectedWords
            );
            firstTime.current = false;
            if (gameState.setting.gameMode === "timer") {
              timer(
                5,
                {
                  min: 0,
                  sec: 0,
                },
                0
              );
            }
          }

          if (
            (gameState.setting.gameMode === "timer" &&
              wordsContext.currentSelectedWords.length <
                maxNumberOfWordsOnScreen) ||
            (currentStageNumberOfWords > maxNumberOfWordsOnScreen &&
              wordsContext.currentSelectedWords.length <
                maxNumberOfWordsOnScreen)
          ) {
            spawnWords(
              1,
              gameSettingsProperty[gameState.setting.gameMode][
                gameState.setting.difficulty
              ],
              ctx,
              canvasHeight,
              wordsContext.currentSelectedWords,
              wordsContext.notSelectedWords
            );
          }

          if (wordsContext.currentSelectedCharacter) {
            if (!wordsContext.currentSelectedWord) {
              wordsContext.currentSelectedWord =
                wordsContext.currentSelectedWords.getWord(
                  wordsContext.currentSelectedCharacter
                );
            }
            if (
              wordsContext.currentSelectedWord?.notSelectedLetters.startsWith(
                wordsContext.currentSelectedCharacter.toUpperCase()
              )
            ) {
              const { velocity } = calculateIntercept(
                {
                  ...wordsContext.currentSelectedWord,
                  x:
                    wordsContext.currentSelectedWord.x +
                    wordsContext.currentSelectedWord.width / 2,
                },
                {
                  x: canvasWidth / 2,
                  y: canvasHeight - 20,
                },
                8
              );

              wordsContext.selectedWordInfo = {
                rect: wordsContext.currentSelectedWord.getWordRect(),
              };

              wordsContext.currentSelectedWord.setSelectedLetters(
                wordsContext.currentSelectedCharacter
              );

              gameSounds.bulletShoot.play();
              bullets.shootBullets(
                new Bullet(
                  ctx,
                  canvasWidth,
                  canvasWidth / 2 - 10,
                  canvasHeight - 20,
                  { x: velocity.vx, y: Math.abs(velocity.vy) },
                  3
                )
              );

              trueShoot.current += 1;
            } else {
              if (gameState.setting.gameMode === "staged") {
                setChanceLeft((chanceLeft) =>
                  chanceLeft ? chanceLeft - 1 : 0
                );
              } else if (gameState.setting.gameMode === "timer") {
                if (
                  Number.parseInt(currentTime.sec) > 10 ||
                  currentTime.min > 0
                ) {
                  clearInterval(currenTimeStoper.current);
                  timer(5, currentTime, 10);
                } else setGameover(true);
              }

              if (gameState.setting.gameMode !== "practice") {
                gameSounds.error.play();
                successiveWordAnswers.current = 0;
                styles.push({
                  type: "deduction",
                  value: gameState.setting.gameMode === "timer" ? 10 : 1,
                  style: {
                    top: `${50}px`,
                    left: `${canvasWidth - 100}px`,
                  },
                });
              }

              falseShoot.current += 1;
            }
            wordsContext.currentSelectedCharacter = undefined;
          }

          wordsContext.currentSelectedWords.update();

          if (
            bullets
              ?.head()
              ?.isCollidedWithWord(wordsContext.selectedWordInfo.rect)
          ) {
            gameSounds.collision.play();
            wordsContext.currentSelectedWord.setCollidedLetter();
            wordsContext.currentSelectedWord.collisionEffect();

            bullets?.remove();

            if (wordsContext.currentSelectedWord?.wordIsCompleted()) {
              wordsContext.currentSelectedWords.remove(
                wordsContext.currentSelectedWord
              );
              if (
                wordsContext.currentSelectedWords.isBonus(
                  wordsContext.currentSelectedWord
                )
              ) {
                styles.push({
                  type: "bonus",
                  value: 3,
                  style: {
                    top: `${wordsContext.selectedWordInfo.rect.y}px`,
                    left: `${wordsContext.selectedWordInfo.rect.x}px`,
                  },
                });
                setScore((score) => score + 3);
              } else {
                successiveWordAnswers.current += 1;
                setScore((score) => score + 1);
              }

              gameSounds.wordCompletion.play();
              wordsContext.currentSelectedWord = undefined;
              currentStageRemainingWords.current--;

              if (successiveWordAnswers.current === 3) {
                successiveWordAnswers.current = 0;
                currentStageRemainingWords.current++;
                spawnWords(
                  1,
                  gameSettingsProperty[gameState.setting.gameMode][
                    gameState.setting.difficulty
                  ],
                  ctx,
                  canvasHeight,
                  wordsContext.currentSelectedWords,
                  wordsContext.notSelectedWords,
                  true
                );
              }
            } else {
              styles.push({
                type: "bonus",
                value: 1,
                style: {
                  top: `${wordsContext.selectedWordInfo.rect.y}px`,
                  left: `${wordsContext.selectedWordInfo.rect.x}px`,
                },
              });
              setScore((score) => score + 1);
            }

            // check if a stage is completed
            if (
              gameState.setting.gameMode === "staged" &&
              currentStageRemainingWords.current === 0
            ) {
              firstTime.current = true;
              stageNumber.current += 1;

              currentStageNumberOfWords.current +=
                currentStageNumberOfWords.current < 20
                  ? Math.floor(currentStageNumberOfWords.current / 3)
                  : 0;
              currentStageRemainingWords.current =
                currentStageNumberOfWords.current;

              setEntryStage(true);
            }
          }

          const vanishedWords =
            wordsContext.currentSelectedWords.wordIsBellowWall();

          if (vanishedWords.length) {
            gameSounds.vanishing.play();
            successiveWordAnswers.current = 0;
            vanishedWords.forEach(() => {
              if (gameState.setting.gameMode === "staged") {
                setChanceLeft((chanceLeft) => chanceLeft - 1);
              } else if (gameState.setting.gameMode === "timer") {
                clearInterval(currenTimeStoper.current);
                timer(5, currentTime, 10);
              }

              styles.push({
                type: "deduction",
                value: gameState.setting.gameMode === "timer" ? 10 : 1,
                style: {
                  top: `${50}px`,
                  left: `${canvasWidth - 100}px`,
                },
              });
            });
          }

          if (chanceLeft === 0) setGameover(true);
          bullets.update();
        }

        animate();
        return () => {
          cancelAnimationFrame(animationFrameId);
          document.removeEventListener("keydown", handleCharactreClickWrapper);
        };
      }
    }
  }, [
    bullets,
    wordsContext,
    wordsContext.wordsCollection,
    currentTime,
    entryStage,
    gameover,
    chanceLeft,
    successiveWordAnswers,
    gameState,
  ]);

  return (
    <div className="game-page-container">
      {wordsContext.wordsCollection.length ? (
        entryStage ? (
          <div className="entry-page">
            <p>
              {gameState.setting.gameMode === "staged"
                ? `STAGE ${stageNumber.current}`
                : "READY"}
            </p>
          </div>
        ) : gameover ? (
          <div className="game-over-screen">
            <p className="game-over-screen-title">
              {gameState.setting.gameMode === "staged"
                ? "GAME OVER"
                : "TIME OUT"}
            </p>
            <div className="game-over-screen-stats">
              <div>
                <span className="type">Score</span>
                <span className="value">{score}</span>
              </div>
              <div>
                <span className="type">Highscore</span>
                <span className="value">
                  {
                    gameState.highscore.singlePlayer[
                      gameState.setting.gameMode
                    ][gameState.setting.difficulty]
                  }
                </span>
              </div>
              <div>
                <span className="type">Accuracy</span>
                <span className="value">
                  {(
                    Math.fround(
                      trueShoot.current /
                        (trueShoot.current + falseShoot.current)
                    ) * 100
                  ).toFixed(1) + "%"}
                </span>
              </div>
            </div>
            <div className="game-over-screen-buttons">
              <a
                href="#"
                className="game-over-screen-button"
                name="try-again"
                onClick={handleGameoverButton}
              >
                Try again
              </a>
              <a
                href="#"
                className="game-over-screen-button"
                name="menu"
                onClick={handleGameoverButton}
              >
                Go to menu
              </a>
            </div>
          </div>
        ) : (
          <>
            {gameState.setting.gameMode === "practice" ? (
              ""
            ) : (
              <div className="game-page-states-board">
                <p className="stats">SCORE {score}</p>
                {gameState.setting.gameMode === "staged" ? (
                  <p className="stats">CHANCE LEFT {chanceLeft}</p>
                ) : (
                  <p className="stats">
                    TIME LEFT {`${currentTime.min}:${currentTime.sec}`}
                  </p>
                )}
              </div>
            )}
            <canvas ref={canvasRef} className="game-canvas" />
          </>
        )
      ) : (
        <LoadingSpinner />
      )}
      {styles.length
        ? styles.map((style, i) => {
            return (
              <p
                className="bonus"
                key={i}
                onAnimationEnd={() => removeStyle(i)}
                style={{
                  ...style.style,
                  width: "fit-content",
                  height: "fit-content",
                  fontSize: "24px",
                  position: "absolute",
                  color: `${style.type === "deduction" ? "red" : "gold"}`,
                  animation: `${
                    style.type === "deduction"
                      ? "moveDown 3s forwards ease-in-out"
                      : "moveUp 3s forwards ease-in-out"
                  }`,
                }}
              >
                {style.type === "deduction" ? "-" : "+"}
                {style.value}
              </p>
            );
          })
        : ""}
    </div>
  );
}

export default GamePage;
