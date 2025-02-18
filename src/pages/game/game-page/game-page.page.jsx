import { useContext, useRef, useEffect } from "react";
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
import GameOver from "../../../components/game-over/game-over.component.jsx";
import PauseMenu from "../../../components/pause-menu/pause-menu.component.jsx";
import StatsBoard from "../../../components/stats-board/stats-board.component.jsx";
import useGameState from "../../../hooks/useGameStates.jsx";
import updatePlayerSetting from "../../../utilis/functions/updatePlayerState.js";

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

  const [playerState, setPlayerState] = useSessionStorage(
    "playerState",
    userContext.user?.playerState || ""
  );

  const {
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
    setContinueGame,

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

    resetGameStates,
  } = useGameState();

  const canvasRef = useRef();
  let { current: styles } = useRef([]);

  const maxNumberOfWordsOnScreen = 7;

  const gameSounds = {
    menu: new Howl({
      src: ["/assets/game-assets/sound/menu.mp3"],
      volume: Number.parseFloat(playerState.setting.soundVolume),
    }),
    wordCompletion: new Howl({
      src: ["/assets/game-assets/sound/yay.mp3"],
      volume: Number.parseFloat(playerState.setting.gameSoundVolume),
    }),
    bulletShoot: new Howl({
      src: ["/assets/game-assets/sound/shoot.mp3"],
      volume: Number.parseFloat(playerState.setting.gameSoundVolume),
    }),
    collision: new Howl({
      src: ["/assets/game-assets/sound/collision.mp3"],
      volume: Number.parseFloat(playerState.setting.gameSoundVolume),
    }),
    vanishing: new Howl({
      src: ["/assets/game-assets/sound/vanishing.mp3"],
      volume: Number.parseFloat(playerState.setting.gameSoundVolume),
    }),
    error: new Howl({
      src: ["/assets/game-assets/sound/error.mp3"],
      volume: Number.parseFloat(playerState.setting.gameSoundVolume),
    }),
    gameover: new Howl({
      src: ["/assets/game-assets/sound/gameOver.mp3"],
      volume: Number.parseFloat(playerState.setting.gameSoundVolume),
    }),
  };

  function handleCharactreClick(e, wordsContext) {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      wordsContext.currentSelectedCharacter = e.key;
    }

    if (e.code === "Escape") {
      setContinueGame(true);
      setPauseGame(true);
      clearInterval(currenTimeStoper.current);
    }
  }

  function resetGame() {
    wordsContext.reset();
    resetGameStates();
    styles = [];
  }

  function handleGameoverButton(e) {
    e.preventDefault();

    resetGame();
    if (e.target.name === "menu") {
      navigate("/game/homepage");
    }
  }

  function handlePauseGameButton(e) {
    if (e.target.name === "resume") {
      setContinueGame(false);
      setPauseGame(false);
    } else if (e.target.name === "restart") {
      resetGame();
    } else if (e.target.name === "options") {
      navigate("/game/settings", {
        state: { disabled: true },
      });
    } else if (e.target.name === "menu") {
      setPauseGame(false);
      navigate("/game/homepage");
    } else if (e.target.name === "quit") {
      resetGame();
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

    if (entryStage) {
      gameSounds.menu.play();
    }

    return () => {
      gameSounds.menu.stop();
      resetGameStates();
    };
  }, []);

  useEffect(() => {
    if (
      playerState.highscore.singlePlayer[playerState.setting.gameMode][
        playerState.setting.difficulty
      ] < score
    ) {
      updatePlayerSetting({
        ...playerState,
        highscore: {
          ...playerState.highscore,
          singlePlayer: {
            ...playerState.highscore.singlePlayer,
            [playerState.setting.gameMode]: {
              [playerState.setting.difficulty]: score,
            },
          },
        },
      });

      setPlayerState({
        ...playerState,
        highscore: {
          ...playerState.highscore,
          singlePlayer: {
            ...playerState.highscore.singlePlayer,
            [playerState.setting.gameMode]: {
              ...playerState.highscore.singlePlayer[
                playerState.setting.gameMode
              ],
              [playerState.setting.difficulty]: score,
            },
          },
        },
      });
    }
  }, [pauseGame, gameover]);

  useEffect(() => {
    if (wordsContext.wordsCollection.length && !pauseGame) {
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
          ctx.clearRect(0, 0, canvasWidth, canvasHeight);

          new Gun(ctx, canvasWidth / 2 - 20, canvasHeight - 20).draw();

          if (firstTime.current) {
            currentStageNotRenderedWords.current =
              currentStageNumberOfWords.current < maxNumberOfWordsOnScreen
                ? 0
                : currentStageNumberOfWords.current - maxNumberOfWordsOnScreen;

            spawnWords(
              playerState.setting.gameMode === "timer"
                ? maxNumberOfWordsOnScreen
                : currentStageNumberOfWords.current < maxNumberOfWordsOnScreen
                ? currentStageNumberOfWords.current
                : maxNumberOfWordsOnScreen,
              gameSettingsProperty[playerState.setting.gameMode][
                playerState.setting.difficulty
              ],
              ctx,
              canvasHeight,
              wordsContext.currentSelectedWords,
              wordsContext.notSelectedWords
            );
            firstTime.current = false;
            if (playerState.setting.gameMode === "timer") {
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

          wordsContext.currentSelectedWords.update(ctx);

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
              if (playerState.setting.gameMode === "staged") {
                setChanceLeft((chanceLeft) =>
                  chanceLeft ? chanceLeft - 1 : 0
                );
              } else if (playerState.setting.gameMode === "timer") {
                if (
                  Number.parseInt(currentTime.sec) > 10 ||
                  currentTime.min > 0
                ) {
                  clearInterval(currenTimeStoper.current);
                  timer(5, currentTime, 10);
                } else setGameover(true);
              }

              if (playerState.setting.gameMode !== "practice") {
                gameSounds.error.play();
                successiveWordAnswers.current = 0;
                styles.push({
                  type: "deduction",
                  value: playerState.setting.gameMode === "timer" ? 10 : 1,
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
                  gameSettingsProperty[playerState.setting.gameMode][
                    playerState.setting.difficulty
                  ],
                  ctx,
                  canvasHeight,
                  wordsContext.currentSelectedWords,
                  wordsContext.notSelectedWords,
                  true
                );
              }

              if (
                (playerState.setting.gameMode === "timer" &&
                  wordsContext.currentSelectedWords.getLength() <
                    maxNumberOfWordsOnScreen) ||
                (currentStageNumberOfWords.current > maxNumberOfWordsOnScreen &&
                  wordsContext.currentSelectedWords.getLength() <
                    maxNumberOfWordsOnScreen &&
                  currentStageNotRenderedWords.current)
              ) {
                console.log(
                  "spawn-words",
                  currentStageNotRenderedWords.current
                );
                currentStageNotRenderedWords.current--;
                spawnWords(
                  1,
                  gameSettingsProperty[playerState.setting.gameMode][
                    playerState.setting.difficulty
                  ],
                  ctx,
                  canvasHeight,
                  wordsContext.currentSelectedWords,
                  wordsContext.notSelectedWords
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
              playerState.setting.gameMode === "staged" &&
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
            vanishedWords.forEach((word) => {
              if (playerState.setting.gameMode === "staged") {
                setChanceLeft((chanceLeft) => chanceLeft - 1);
              } else if (playerState.setting.gameMode === "timer") {
                clearInterval(currenTimeStoper.current);
                timer(5, currentTime, 10);
              }

              if (
                wordsContext.currentSelectedWord &&
                word.isEqual(wordsContext.currentSelectedWord)
              ) {
                word.reset();
                wordsContext.currentSelectedWord = undefined;
                wordsContext.currentSelectedCharacter = undefined;
              }

              styles.push({
                type: "deduction",
                value: playerState.setting.gameMode === "timer" ? 10 : 1,
                style: {
                  top: `${50}px`,
                  left: `${canvasWidth - 100}px`,
                },
              });
            });
          }

          if (chanceLeft === 0) {
            setGameover(true);
            gameSounds.gameover.play();
          }
          bullets.update();
          animationFrameId = requestAnimationFrame(animate);
        }

        animate();
        return () => {
          cancelAnimationFrame(animationFrameId);
          document.removeEventListener("keydown", handleCharactreClickWrapper);
        };
      }
    }
  }, [
    wordsContext,
    currentTime,
    entryStage,
    gameover,
    chanceLeft,
    playerState,
    pauseGame,
  ]);

  return (
    <div className="game-page-container">
      {wordsContext.wordsCollection.length ? (
        entryStage ? (
          <div className="entry-page">
            <p>
              {playerState.setting.gameMode === "staged"
                ? `STAGE ${stageNumber.current}`
                : "READY"}
            </p>
          </div>
        ) : pauseGame ? (
          <PauseMenu handlePauseGameButton={handlePauseGameButton} />
        ) : gameover ? (
          <GameOver
            gameMode={playerState.setting.gameMode}
            score={score}
            highscore={
              playerState.highscore.singlePlayer[playerState.setting.gameMode][
                playerState.setting.difficulty
              ]
            }
            handleGameoverButton={handleGameoverButton}
            accuracy={
              (
                Math.fround(
                  trueShoot.current / (trueShoot.current + falseShoot.current)
                ) * 100
              ).toFixed(1) + "%"
            }
          />
        ) : (
          <>
            {playerState.setting.gameMode === "practice" ? (
              ""
            ) : (
              <StatsBoard
                score={score}
                gameMode={playerState.setting.gameMode}
                chanceLeft={chanceLeft}
                currentTime={currentTime}
              />
            )}
          </>
        )
      ) : (
        <LoadingSpinner />
      )}
      <canvas ref={canvasRef} className="game-canvas" />
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
