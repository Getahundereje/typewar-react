/* eslint-disable react/prop-types */
import "./game-over.styles.css";

function GameOver({
  gameMode,
  score,
  highscore,
  accuracy,
  handleGameoverButton,
}) {
  return (
    <div className="game-over-screen">
      <h2 className="game-over-screen-title">
        {gameMode === "timer" ? "Timeout" : "Game Over"}
      </h2>

      <div className="stats">
        <div>
          <span className="type">Score</span>
          <span className="value">{score}</span>
        </div>
        <div>
          <span className="type">Highscore</span>
          <span className="value">{highscore}</span>
        </div>
        <div>
          <span className="type">Accuracy</span>
          <span className="value">{accuracy}</span>
        </div>
      </div>

      <div className="buttons">
        <button className="try-again" onClick={handleGameoverButton}>
          Try Again
        </button>
        <button className="menu-btn" name="menu" onClick={handleGameoverButton}>
          Go to Menu
        </button>
      </div>
    </div>
  );
}

export default GameOver;
