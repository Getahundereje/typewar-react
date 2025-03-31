import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import GameCustomButton from "../../../components/game-custom-button/game-custom-button.component";
import useGameState from "../../../hooks/useGameStates";
import { WordsContext } from "../../../contexts/words/words.context";

import "./homepage.styles.css";

function GameHomepage() {
  const navigate = useNavigate();
  const wordsContext = useContext(WordsContext);
  const { continueGame, resetGameStates } = useGameState();

  function handleMenuButtonsClick(e) {
    const { name } = e.target;

    if (name === "continue") {
      navigate("/game/gamePage", { replace: true });
    } else if (name === "newgame") {
      wordsContext.reset();
      resetGameStates();
      navigate("/game/gamePage", { replace: true });
    } else if (name === "settings") {
      navigate("/game/settings");
    } else if (name === "stats") {
      navigate("/game/stats");
    } else if (name === "help") {
      navigate("/game/help");
    }
  }

  return (
    <div className="container">
      <div className="menu-list">
        {continueGame ? (
          <GameCustomButton onClick={handleMenuButtonsClick} name="continue">
            Continue
          </GameCustomButton>
        ) : (
          ""
        )}
        <GameCustomButton onClick={handleMenuButtonsClick} name="newgame">
          New Game
        </GameCustomButton>
        <GameCustomButton onClick={handleMenuButtonsClick} name="settings">
          Settings
        </GameCustomButton>
        <GameCustomButton onClick={handleMenuButtonsClick} name="stats">
          Stats
        </GameCustomButton>
        <GameCustomButton onClick={handleMenuButtonsClick} name="help">
          Help
        </GameCustomButton>
      </div>
    </div>
  );
}

export default GameHomepage;
