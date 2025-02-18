/* eslint-disable react/prop-types */
import "./stats-board.styles.css";

function StatsBoard({ score, chanceLeft, currentTime, gameMode }) {
  return (
    <div className="game-page-states-board">
      <p className="stats">SCORE {score}</p>
      {gameMode === "staged" ? (
        <p className="stats">CHANCE LEFT {chanceLeft}</p>
      ) : (
        <p className="stats">
          TIME LEFT {`${currentTime.min}:${currentTime.sec}`}
        </p>
      )}
    </div>
  );
}

export default StatsBoard;
