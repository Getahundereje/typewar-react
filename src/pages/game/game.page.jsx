import { useContext, useRef, useEffect } from "react";

import { Bullet } from "../../utilis/class/bullet";
import Gun from "../../utilis/class/gun";
import { WordsContext } from "../../contexts/words/words.context";
import { BulletsContext } from "../../contexts/bullets/bullets.context";

import spawnWords from "../../utilis/functions/spawn-words";
import calculateIntercept from "../../utilis/functions/calculate-intercept";

import "./game.styles.css";

function handleCharactreClick(canvasContext, canvas, wordsContext, bullets, e) {
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    if (!wordsContext.currentSelectedWord) {
      console.log(wordsContext.currentSelectedWord);
      wordsContext.updateCurrentSelectedWord(
        wordsContext.currentSelectedWords.getWord(e.key)
      );
    }

    // if (!wordsContext.currentSelectedWord) {
    //   playGameSound(sounds.error.sound, sounds.error.duration);

    //   updateGameScore({
    //     ...gameScore,
    //     successiveWordAnswres: 0,
    //     chanceLeft: gameScore.chanceLeft - 1,
    //     error: true,
    //   });
    //   return;
    // }

    if (
      wordsContext.currentSelectedWord?.notSelectedLetters.startsWith(
        e.key.toUpperCase()
      )
    ) {
      const { velocity, position } = calculateIntercept(
        {
          ...wordsContext.currentSelectedWord,
          x:
            wordsContext.currentSelectedWord.x +
            canvasContext.measureText(wordsContext.currentSelectedWord.word)
              .width /
              2,
        },
        {
          x: canvas.width / 2,
          y: canvas.height - 20,
        },
        8
      );

      wordsContext.updateSelectedWordInfo({
        selectedWord: wordsContext.currentSelectedWord,
        rect: {
          ...position,
          width: canvasContext.measureText(wordsContext.selectedWord.word)
            .width,
          height: canvasContext.measureText(wordsContext.selectedWord.word)
            .fontBoundingBoxAscent,
        },
        letter: e.key,
      });

      wordsContext.currentSelectedWord.setSelectedLetters(e.key);

      bullets.shootBullets(
        new Bullet(
          canvas.width / 2 - 10,
          canvas.height - 20,
          { x: velocity.vx, y: Math.abs(velocity.vy) },
          3
        )
      );

      // updateGameScore({
      //   ...gameScore,
      //   successiveLetterAnswers: gameScore.successiveLetterAnswers + 1,
      // });
    } else {
      // updateGameScore({
      //   ...gameScore,
      //   successiveLetterAnswers: 0,
      //   successiveWordAnswres: 0,
      //   chanceLeft: gameScore.chanceLeft - 1,
      //   error: true,
      // });
      // playGameSound(sounds.error.sound, sounds.error.duration);
    }
  } else {
    // updateGameScore({
    //   ...gameScore,
    //   successiveLetterAnswers: 0,
    //   successiveWordAnswres: 0,
    //   chanceLeft: gameScore.chanceLeft - 1,
    //   error: true,
    // })
  }
  // console.log(
  //   wordsContext.currentSelectedWord,
  //   wordsContext.currentSelectedWordInfo
  // );
}

function GamePage() {
  const wordsContext = useContext(WordsContext);
  const {
    wordsCollection,
    currentSelectedWords,
    currentSelectedWord,
    updateCurrentSelectedWord,
    selectedWordInfo,
  } = wordsContext;

  const { bullets } = useContext(BulletsContext);

  const canvasWidth = 600;
  const canvasHeight = 500;
  const canvasRef = useRef();

  useEffect(() => {
    let animationFrameId = null;
    let firstTime = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.src = "assets/game-assets/images/War.png";

    image.onload = () => {
      function animate() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
        if (firstTime) {
          document.body.addEventListener(
            "keydown",
            handleCharactreClick.bind(null, ctx, canvas, wordsContext)
          );

          spawnWords(
            10,
            1000,
            ctx,
            canvas,
            currentSelectedWords,
            wordsCollection
          );
          firstTime = false;
        }

        currentSelectedWords.update();
        new Gun(ctx, canvas.width / 2 - 20, canvas.height - 20).draw();
        currentSelectedWords.update();

        if (bullets?.head()?.isCollidedWithWord(selectedWordInfo.rect)) {
          currentSelectedWord.setCollidedLetter();
          currentSelectedWord.collisionEffect();

          bullets?.remove();

          if (currentSelectedWord?.wordIsCompleted()) {
            currentSelectedWords.remove(currentSelectedWord);
            updateCurrentSelectedWord(undefined);
          }

          bullets.update();
        }
        animationFrameId = requestAnimationFrame(animate);
      }

      animate();
    };

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    wordsCollection,
    currentSelectedWord,
    currentSelectedWords,
    selectedWordInfo,
  ]);
  return (
    <canvas
      ref={canvasRef}
      className="game-canvas"
      width={canvasWidth}
      height={canvasHeight}
    />
  );
}

export default GamePage;
