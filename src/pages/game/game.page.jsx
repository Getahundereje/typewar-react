import { useState, useRef, useEffect } from "react";
import { Words } from "../../utilis/class/word";
import spawnWords from "../../utilis/functions/spawn-words";

import "./game.styles.css";

function GamePage() {
  const canvasWidth= 600;
  const canvasHeight = 500;
  const canvasRef = useRef()

  
  useEffect(() => {
    let animationFrameId = null;
    let firstTime = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const currentSelectedWords = new Words();

    const image = new Image();
    image.src = 'assets/game-assets/images/War.png'

    image.onload = () => {
    function animate() {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);     
      ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
      if(firstTime){
        spawnWords(10, 1000, ctx, canvas, currentSelectedWords);
        firstTime = false;
      }

      currentSelectedWords.update();
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    console.log(currentSelectedWords)
  }
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [])
  return (
    <canvas ref={canvasRef} className="game-canvas" width={canvasWidth} height={canvasHeight} />
  );
}

export default GamePage;
