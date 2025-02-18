/* eslint-disable react/prop-types */
import "./pause-menu.styles.css";

function PauseMenu({ handlePauseGameButton }) {
  return (
    <div className="pause-continer">
      <div className="pause-menu">
        <p className="title">Paused</p>
        <button name="resume" onClick={handlePauseGameButton}>
          Resume
        </button>
        <button name="restart" onClick={handlePauseGameButton}>
          Restart
        </button>
        <button name="options" onClick={handlePauseGameButton}>
          Options
        </button>
        <button name="menu" onClick={handlePauseGameButton}>
          Go to menu
        </button>
        <button name="quit" onClick={handlePauseGameButton}>
          Quit
        </button>
      </div>
    </div>
  );
}

export default PauseMenu;
