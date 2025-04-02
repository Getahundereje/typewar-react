/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Howl } from "howler";
import { io } from "socket.io-client";
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
import GameCustomButton from "../../../components/game-custom-button/game-custom-button.component.jsx";

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

  const [reloadHandled, setReloadHandled] = useSessionStorage(
    "reloadHandled",
    false
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
    gameType,
    setGameType,
    gameTypeSelectionStage,
    setGameTypeSelectionStage,
    waitingOpponent,
    setWaitingOpponent,
    continueGame,

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
  const socket = useRef(null);
  const shooter = useRef("");
  const canvasWidth = useRef(0);
  const canvasHeight = useRef(0);
  const canvasCtx = useRef({});

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
      wordsContext.save();
      navigate("/game/homepage");
    } else if (e.target.name === "quit") {
      resetGame();
      navigate("/game/homepage");
    }
  }

  function handleGameTypeSelectionButton(e) {
    e.preventDefault();

    if (e.target.name === "multiplayer") {
      navigate("/game/comingSoon");
    }

    setGameType(e.target.name);
    setGameTypeSelectionStage(false);
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

  function shootSelectedWord(wordsContext) {
    if (wordsContext.currentSelectedCharacter.current) {
      if (!wordsContext.currentSelectedWord.current[shooter.current]) {
        wordsContext.currentSelectedWord.current = {
          ...wordsContext.currentSelectedWord.current,
          [shooter.current]: wordsContext.currentSelectedWords.current.getWord(
            wordsContext.currentSelectedCharacter.current
          ),
        };
      }

      const selectedCharacter =
        wordsContext.currentSelectedCharacter.current.toUpperCase();

      if (
        wordsContext.currentSelectedWord.current[
          shooter.current
        ]?.notSelectedLetters.startsWith(selectedCharacter)
      ) {
        const { velocity } = calculateIntercept(
          wordsContext.currentSelectedWord.current[shooter.current],
          {
            x: canvasWidth.current / 2 - 10,
            y: canvasHeight.current - 23,
          },
          10
        );

        gameSounds.bulletShoot.play();

        bullets.shootBullets(
          new Bullet(
            canvasCtx.current,
            canvasWidth.current,
            canvasWidth.current / 2 - 10,
            canvasHeight.current - 23,
            { x: velocity.vx, y: Math.abs(velocity.vy) },
            3
          )
        );

        wordsContext.selectedWordInfo.current = {
          [shooter.current]: {
            rect: wordsContext.currentSelectedWord.current[
              shooter.current
            ].getWordRect(),
          },
        };

        wordsContext.currentSelectedWord.current[
          shooter.current
        ].setSelectedLetters(wordsContext.currentSelectedCharacter.current);

        trueShoot.current++;
      } else {
        if (gameType === "singlePlayer") {
          if (playerState.setting.gameMode === "staged") {
            setChanceLeft((chanceLeft) => (chanceLeft ? chanceLeft - 1 : 0));
          } else if (playerState.setting.gameMode === "timer") {
            if (Number.parseInt(currentTime.sec) > 10 || currentTime.min > 0) {
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
                left: `${canvasWidth.current - 100}px`,
              },
            });
          }
        } else if (gameType === "multiplayer") {
          wordsContext.currentSelectedWord.current[shooter.current].reset();
          wordsContext.currentSelectedWord.current[shooter.current] = undefined;
          wordsContext.currentSelectedCharacter.current = undefined;
        }

        falseShoot.current += 1;
      }
      wordsContext.currentSelectedCharacter.current = "";
    }
  }

  function handleBulletHit(wordsContext) {
    if (
      bullets
        ?.head()
        ?.isCollidedWithWord(
          wordsContext.selectedWordInfo.current[shooter.current].rect
        )
    ) {
      gameSounds.collision.play();
      wordsContext.currentSelectedWord.current[
        shooter.current
      ].setCollidedLetter();
      wordsContext.currentSelectedWord.current[
        shooter.current
      ].collisionEffect();

      bullets?.remove();

      if (
        wordsContext.currentSelectedWord.current[
          shooter.current
        ].wordIsCompleted()
      ) {
        wordsContext.currentSelectedWords.current.remove(
          wordsContext.currentSelectedWord.current[shooter.current]
        );

        if (
          (playerState.setting.gameMode === "timer" &&
            wordsContext.currentSelectedWords.current.getLength() <
              maxNumberOfWordsOnScreen) ||
          (currentStageNumberOfWords.current > maxNumberOfWordsOnScreen &&
            wordsContext.currentSelectedWords.current.getLength() <
              maxNumberOfWordsOnScreen &&
            currentStageNotRenderedWords.current)
        ) {
          currentStageNotRenderedWords.current--;
          spawnWords(
            1,
            gameSettingsProperty[playerState.setting.gameMode][
              playerState.setting.difficulty
            ],
            canvasCtx.current,
            canvasHeight.current,
            wordsContext,
            gameType
          );
        }

        if (gameType === "singlePlayer") {
          if (
            wordsContext.currentSelectedWords.current.isBonus(
              wordsContext.currentSelectedWord.current[shooter.current]
            )
          ) {
            styles.push({
              type: "bonus",
              value: 3,
              style: {
                top: `${
                  wordsContext.selectedWordInfo.current[shooter.current].rect.y
                }px`,
                left: `${
                  wordsContext.selectedWordInfo.current[shooter.current].rect.x
                }px`,
              },
            });
            setScore((score) => score + 3);
          } else {
            successiveWordAnswers.current += 1;
            setScore((score) => score + 1);
          }
          currentStageRemainingWords.current--;

          if (successiveWordAnswers.current === 3) {
            successiveWordAnswers.current = 0;
            currentStageRemainingWords.current++;
            spawnWords(
              1,
              gameSettingsProperty[playerState.setting.gameMode][
                playerState.setting.difficulty
              ],
              canvasCtx.current,
              canvasHeight.current,
              wordsContext,
              gameType,
              true
            );
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
        } else if (gameType === "multiplayer") {
          socket.current.emit("updateScore");
        }

        gameSounds.wordCompletion.play();
        wordsContext.currentSelectedWord.current[shooter.current] = undefined;
      } else if (gameType === "singlePlayer") {
        styles.push({
          type: "bonus",
          value: 1,
          style: {
            top: `${
              wordsContext.selectedWordInfo.current[shooter.current].rect.y
            }px`,
            left: `${
              wordsContext.selectedWordInfo.current[shooter.current].rect.x
            }px`,
          },
        });
        setScore((score) => score + 1);
      }
    }
  }

  async function getWords() {
    try {
      const response = await axios.get("http://localhost:8000/words", {
        withCredentials: true,
      });
      const { data } = response;
      wordsContext.setWordsCollection(data.data.words);
    } catch (error) {
      if (error.status === 401) {
        navigate("/signin", {
          replace: true,
        });
      }
    }
  }

  useEffect(() => {
    const [navigation] = performance.getEntriesByType("navigation");
    if (navigation.type === "reload" && !reloadHandled) {
      resetGame();
      setReloadHandled(true);
      navigate("/game/homepage", { replace: true });
    } else if (navigation.type === "back_forward") {
      resetGame();
    }

    window.addEventListener("beforeunload", () => {
      setReloadHandled(false);
    });

    return () => {
      resetGameStates();
    };
  }, []);

  useEffect(() => {
    if (!wordsContext.wordsCollection.length && gameType === "singlePlayer") {
      getWords();
      shooter.current = "single";
    } else if (gameType === "multiplayer" && !socket.current) {
      socket.current = io("http://localhost:8000", {
        withCredentials: true,
      });

      socket.current.on("gameStart", (data) => {
        wordsContext.wordsPosition.current = data.data.wordsPosition;
        wordsContext.setWordsCollection(data.data.wordsCollection);
        setWaitingOpponent(false);
      });

      socket.current.on("select", ({ selectedCharacter, shooterId }) => {
        wordsContext.currentSelectedCharacter.current = selectedCharacter;
        shooter.current = shooterId;
      });

      socket.current.on("playerDisconnected", () => {
        setWaitingOpponent(true);
      });

      socket.current.on("score", (score) => {
        setScore(score);
      });

      socket.current.on("timeout", () => {
        setGameover(true);
      });

      socket.current.on("error", (message) => {
        console.log(message);
      });

      socket.current.emit("ready", userContext.user._id);
    }

    return () => {
      if (socket.current) {
        socket.current.off("waiting");
        socket.current.off("gameStart");
        socket.current.off("select");
        socket.current.off("ready");
      }
    };
  }, [gameTypeSelectionStage]);

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
    if (!gameTypeSelectionStage) {
      if (wordsContext.wordsCollection.length && !pauseGame) {
        if (entryStage) {
          setTimeout(() => {
            setEntryStage(false);
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
            currentStageNotRenderedWords.current =
              currentStageNumberOfWords.current < maxNumberOfWordsOnScreen
                ? 0
                : currentStageNumberOfWords.current - maxNumberOfWordsOnScreen;
          }, 3000);
        } else if (!gameover) {
          let animationFrameId = null;
          const canvas = canvasRef.current;
          canvasCtx.current = canvas.getContext("2d");

          const style = getComputedStyle(canvas);
          canvasWidth.current = canvas.width = Number.parseInt(style.width);
          canvasHeight.current = canvas.height = Number.parseInt(style.height);

          function handleCharactreClick(e) {
            if (e.keyCode >= 65 && e.keyCode <= 90) {
              if (gameType === "singlePlayer") {
                wordsContext.currentSelectedCharacter.current = e.key;
              } else if (gameType === "multiplayer") {
                socket.current.emit("selectCharacter", e.key);
              }
              shootSelectedWord(wordsContext);
            }

            if (e.code === "Escape") {
              setContinueGame(true);
              setPauseGame(true);
              clearInterval(currenTimeStoper.current);
            }
          }

          document.addEventListener("keydown", handleCharactreClick);

          if (firstTime.current) {
            spawnWords(
              playerState.setting.gameMode === "timer"
                ? maxNumberOfWordsOnScreen
                : currentStageNumberOfWords.current < maxNumberOfWordsOnScreen
                ? currentStageNumberOfWords.current
                : maxNumberOfWordsOnScreen,
              gameSettingsProperty[playerState.setting.gameMode][
                playerState.setting.difficulty
              ],
              canvasCtx.current,
              canvasHeight.current,
              wordsContext,
              gameType
            );
            firstTime.current = false;
          }

          function animate() {
            canvasCtx.current.clearRect(
              0,
              0,
              canvasWidth.current,
              canvasHeight.current
            );

            new Gun(
              canvasCtx.current,
              canvasWidth.current / 2 - 20,
              canvasHeight.current - 20
            ).draw();

            handleBulletHit(wordsContext);
            wordsContext.currentSelectedWords.current.update(canvasCtx.current);

            const vanishedWords =
              wordsContext.currentSelectedWords.current.wordIsBellowWall();

            if (vanishedWords.length) {
              gameSounds.vanishing.play();
              successiveWordAnswers.current = 0;
              vanishedWords.forEach((vanishedWord) => {
                if (
                  wordsContext.currentSelectedWord.current[shooter.current] &&
                  vanishedWord.isEqual(
                    wordsContext.currentSelectedWord.current[shooter.current]
                  )
                ) {
                  vanishedWord.reset();
                  wordsContext.currentSelectedWord.current[shooter.current] =
                    undefined;
                  wordsContext.currentSelectedCharacter.current = undefined;
                }

                if (gameType === "singlePlayer") {
                  if (playerState.setting.gameMode === "staged") {
                    setChanceLeft((chanceLeft) => chanceLeft - 1);
                  } else if (playerState.setting.gameMode === "timer") {
                    clearInterval(currenTimeStoper.current);
                    timer(5, currentTime, 10);
                  }

                  if (
                    wordsContext.currentSelectedWords.current.isBonus(
                      vanishedWord
                    )
                  ) {
                    wordsContext.notSelectedWords.current = [
                      ...wordsContext.notSelectedWords.current,
                      vanishedWord.word,
                    ];
                    wordsContext.currentSelectedWords.current.remove(
                      vanishedWord
                    );
                    currentStageRemainingWords.current--;
                  }

                  styles.push({
                    type: "deduction",
                    value: playerState.setting.gameMode === "timer" ? 10 : 1,
                    style: {
                      top: `${50}px`,
                      left: `${canvasWidth.current - 100}px`,
                    },
                  });
                }
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
            document.removeEventListener("keydown", handleCharactreClick);
          };
        }
        console.log("hello");
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
    gameTypeSelectionStage,
    waitingOpponent,
    continueGame,
  ]);

  return (
    <div className="game-page-container">
      {gameTypeSelectionStage ? (
        <div className="gameType-selection-container">
          <GameCustomButton
            name="singlePlayer"
            onClick={handleGameTypeSelectionButton}
          >
            Single Player
          </GameCustomButton>
          <GameCustomButton
            name="multiplayer"
            onClick={handleGameTypeSelectionButton}
          >
            Multiplayer
          </GameCustomButton>
        </div>
      ) : (
          gameType === "singlePlayer"
            ? wordsContext.wordsCollection.length
            : !waitingOpponent
        ) ? (
        entryStage ? (
          <div className="entry-page">
            <p>
              {playerState.setting.gameMode === "staged"
                ? `Stage ${stageNumber.current}`
                : "Ready"}
            </p>
          </div>
        ) : pauseGame ? (
          <PauseMenu handlePauseGameButton={handlePauseGameButton} />
        ) : (
          gameover && (
            <GameOver
              gameMode={playerState.setting.gameMode}
              score={score}
              highscore={
                playerState.highscore.singlePlayer[
                  playerState.setting.gameMode
                ][playerState.setting.difficulty]
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
          )
        )
      ) : (
        !continueGame && (
          <LoadingSpinner
            message={
              gameType === "multiplayer" ? "Waiting for opponent..." : "Loading"
            }
          />
        )
      )}
      {!pauseGame && !gameover && !gameTypeSelectionStage && (
        <StatsBoard
          score={score}
          gameMode={playerState.setting.gameMode}
          chanceLeft={chanceLeft}
          currentTime={currentTime}
        />
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
                  color: `${
                    style.type === "deduction" ? "#FF4444" : "#ffd700"
                  }`,
                  animation: `${
                    style.type === "deduction"
                      ? "moveDown 2s forwards ease-in-out"
                      : "moveUp 2s forwards ease-in-out"
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
