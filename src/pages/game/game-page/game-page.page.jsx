import { useContext, useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Bullet } from "../../../utilis/class/bullet";
import Gun from "../../../utilis/class/gun";
import { WordsContext } from "../../../contexts/words/words.context";
import { BulletsContext } from "../../../contexts/bullets/bullets.context";
import { UserContext } from "../../../contexts/user/user.context";

import spawnWords from "../../../utilis/functions/spawn-words.jsx";
import calculateIntercept from "../../../utilis/functions/calculate-intercept";

import "./game-page.styles.css";
import useSessionStorage from "../../../hooks/useSessionStorage.jsx";

function GamePage() {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const wordsContext = useContext(WordsContext);
  const { bullets } = useContext(BulletsContext);

  const [gameState] = useSessionStorage(
    "gameState",
    userContext.user?.gameState || ""
  );

  const [styles, setStyles] = useState([]);

  const [score, setScore] = useState(0);
  const [chanceLeft, setChanceLeft] = useState(10);
  const [currentTime, setCurrentTime] = useState({});
  const [entryStage, setEntryStage] = useState(true);
  const [gameover, setGameover] = useState(false);
  const [successiveWordAnswers, setSuccessiveWordAnswers] = useState(0);

  const canvasRef = useRef();
  let firstTime = useRef(true);
  const currenTimeStoper = useRef(undefined);
  const stageNumber = useRef(1);

  function handleCharactreClick(e, wordsContext) {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      wordsContext.currentSelectedCharacter = e.key;
    }
  }

  function handleGameoverButton(e) {
    e.preventDefault();

    firstTime.current = true;
    stageNumber.current = 1;
    setGameover(false);
    setEntryStage(true);
    setChanceLeft(10);
    setScore(0);

    if (e.target.name === "menu") {
      navigate("/game/homepage");
    }
  }

  function timer(minute, currentTime, dedactedTime) {
    let time = currentTime.sec
      ? currentTime.min * 60 + Number.parseInt(currentTime.sec)
      : 60 * minute;
    time -= dedactedTime;

    let min = Math.floor(time / 60);
    let sec = time % 60;

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

      if (time === 0) {
        setGameover(true);
        clearInterval(currenTimeStoper.current);
      }
    }, 1000);
  }

  function renderIntroPage() {
    setTimeout(() => {
      setEntryStage(false);
    }, 3000);
  }
  useEffect(() => {
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
        if (firstTime.current) {
          spawnWords(
            5,
            1000,
            ctx,
            canvasWidth,
            canvasHeight,
            wordsContext.currentSelectedWords,
            wordsContext.wordsCollection
          );
          firstTime.current = false;
          if (gameState.setting.gameMode === "timer") {
            timer(5, currentTime, 0);
          }
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
            const { velocity, position } = calculateIntercept(
              {
                ...wordsContext.currentSelectedWord,
                x:
                  wordsContext.currentSelectedWord.x +
                  ctx.measureText(wordsContext.currentSelectedWord.word).width /
                    2,
              },
              {
                x: canvasWidth / 2,
                y: canvasHeight - 20,
              },
              8
            );

            wordsContext.selectedWordInfo = {
              selectedWord: wordsContext.currentSelectedWord,
              rect: {
                ...position,
                width: ctx.measureText(wordsContext.currentSelectedWord.word)
                  .width,
                height: ctx.measureText(wordsContext.currentSelectedWord.word)
                  .fontBoundingBoxAscent,
              },
              letter: wordsContext.currentSelectedCharacter,
            };

            wordsContext.currentSelectedWord.setSelectedLetters(
              wordsContext.currentSelectedCharacter
            );

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
          } else {
            if (gameState.setting.gameMode === "staged") {
              setChanceLeft((chanceLeft) => (chanceLeft ? chanceLeft - 1 : 0));
            } else if (gameState.setting.gameMode === "timer") {
              if (
                Number.parseInt(currentTime.sec) > 10 ||
                currentTime.min > 0
              ) {
                clearInterval(currenTimeStoper.current);
                timer(5, currentTime, 10);
              }
            }

            if (gameState.setting.gameMode !== "practice") {
              setSuccessiveWordAnswers(0);
              setStyles((styles) => [
                ...styles,
                {
                  type: "deduction",
                  value: 1,
                  style: {
                    top: `${50}px`,
                    left: `${canvasWidth - 100}px`,
                  },
                },
              ]);
            }
          }
          wordsContext.currentSelectedCharacter = undefined;
        }

        wordsContext.currentSelectedWords.update();
        new Gun(ctx, canvasWidth / 2 - 20, canvasHeight - 20).draw();

        if (
          bullets
            ?.head()
            ?.isCollidedWithWord(wordsContext.selectedWordInfo?.rect)
        ) {
          setStyles((styles) => [
            ...styles,
            {
              type: "bonus",
              value: 1,
              style: {
                top: `${wordsContext.selectedWordInfo.rect.y}px`,
                left: `${wordsContext.selectedWordInfo.rect.x}px`,
              },
            },
          ]);

          setScore((score) => score + 1);
          wordsContext.currentSelectedWord.setCollidedLetter();
          wordsContext.currentSelectedWord.collisionEffect();

          bullets?.remove();

          if (wordsContext.currentSelectedWord?.wordIsCompleted()) {
            wordsContext.currentSelectedWords.remove(
              wordsContext.currentSelectedWord
            );
            if (
              wordsContext.currentSelectedWords.checkBonus(
                wordsContext.currentSelectedWord
              )
            ) {
              setScore((score) => score + 3);
              setStyles((styles) => [
                ...styles,
                {
                  type: "bonus",
                  value: 3,
                  style: {
                    top: `${wordsContext.selectedWordInfo.rect.y}px`,
                    left: `${wordsContext.selectedWordInfo.rect.x}px`,
                  },
                },
              ]);
            }
            wordsContext.currentSelectedWord = undefined;

            if (wordsContext.currentSelectedWords.isEmpty()) {
              firstTime.current = true;
              stageNumber.current += 1;
              setEntryStage(true);
            }
            setSuccessiveWordAnswers(
              (successiveWordAnswers) => successiveWordAnswers + 1
            );
          }
        }

        if (wordsContext.currentSelectedWords.wordIsBellowWall()) {
          setChanceLeft((chanceLeft) => chanceLeft - 1);
          setSuccessiveWordAnswers(0);
          setStyles((styles) => [
            ...styles,
            {
              type: "deduction",
              value: 1,
              style: {
                top: `${20}px`,
                left: `${canvasWidth - 100}px`,
              },
            },
          ]);
        }

        if (chanceLeft === 0) setGameover(true);
        bullets.update();

        if (successiveWordAnswers === 3) {
          setSuccessiveWordAnswers(0);
          wordsContext.currentSelectedWords.createBonus();
        }
      }

      animate();
      return () => {
        cancelAnimationFrame(animationFrameId);
        document.removeEventListener("keydown", handleCharactreClickWrapper);
      };
    }
  }, [
    bullets,
    wordsContext,
    currentTime,
    entryStage,
    gameover,
    chanceLeft,
    successiveWordAnswers,
    gameState,
  ]);

  return (
    <div className="game-page-container">
      {entryStage ? (
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
            {gameState.setting.gameMode === "staged" ? "GAME OVER" : "TIME OUT"}
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
                  gameState.highscore.singlePlayer[gameState.setting.gameMode][
                    gameState.setting.difficulty
                  ]
                }
              </span>
            </div>
            <div>
              <span className="type">Accuracy</span>
              <span className="value">
                {gameState.highscore.multiPlayer.timer.easy}
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
      )}
      {styles.length &&
        styles.map((style, i) => {
          return (
            <p
              className="bonus"
              key={i}
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
        })}
    </div>
  );
}

export default GamePage;
