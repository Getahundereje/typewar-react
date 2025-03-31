import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import GameCustomButton from "../../../components/game-custom-button/game-custom-button.component";
import { useButtonRef } from "../../../hooks/useButtonRef";
import useGameState from "../../../hooks/useGameStates";
import { WordsContext } from "../../../contexts/words/words.context";

import "./homepage.styles.css";

function GameHomepage() {
  const navigate = useNavigate();
  const buttonsRef = useButtonRef();
  const [firstTime, setFirstTime] = useState(true);
  const wordsContext = useContext(WordsContext);

  const { continueGame, focusedButtonId, setFocusedButtonId, resetGameStates } =
    useGameState();

  function handleMenuButtonsClick(e) {
    if (e.code === "Enter" || e.code === "click") {
      if (document.activeElement === buttonsRef[0].current) {
        navigate("/game/gamePage", { replace: true });
      } else if (document.activeElement === buttonsRef[1].current) {
        wordsContext.reset();
        resetGameStates();
        navigate("/game/gamePage", { replace: true });
      } else if (document.activeElement === buttonsRef[2].current) {
        navigate("/game/settings");
      } else if (document.activeElement === buttonsRef[3].current) {
        navigate("/game/stats");
      } else if (document.activeElement === buttonsRef[4].current) {
        navigate("/game/help");
      }
    }
  }

  useEffect(() => {
    function handleArrowClick(e) {
      e.preventDefault();

      if (e.code === "ArrowDown") {
        setFocusedButtonId((currentButtonId) => {
          const tempId = (currentButtonId + 1) % buttonsRef.length;
          return continueGame ? tempId : tempId ? tempId : tempId + 1;
        });
      }

      if (e.code === "ArrowUp") {
        setFocusedButtonId((currentButtonId) => {
          const tempId = currentButtonId
            ? (currentButtonId - 1) % buttonsRef.length
            : buttonsRef.length - 1;
          return continueGame
            ? tempId
            : tempId
            ? tempId
            : buttonsRef.length - 1;
        });
      }
    }

    buttonsRef[focusedButtonId]?.current.focus();

    if (firstTime) {
      document.addEventListener("keydown", handleArrowClick);

      setFirstTime(false);
    }
  }, [focusedButtonId, firstTime]);

  return (
    <div className="container">
      <div className="menu-list">
        {continueGame ? (
          <GameCustomButton
            ref={buttonsRef[0]}
            onKeyDown={handleMenuButtonsClick}
          >
            Continue
          </GameCustomButton>
        ) : (
          ""
        )}
        <GameCustomButton
          ref={buttonsRef[1]}
          onKeyDown={handleMenuButtonsClick}
        >
          New Game
        </GameCustomButton>
        <GameCustomButton
          ref={buttonsRef[2]}
          onKeyDown={handleMenuButtonsClick}
        >
          Settings
        </GameCustomButton>
        <GameCustomButton
          ref={buttonsRef[3]}
          onKeyDown={handleMenuButtonsClick}
        >
          Stats
        </GameCustomButton>
        <GameCustomButton
          ref={buttonsRef[4]}
          onKeyDown={handleMenuButtonsClick}
        >
          Help
        </GameCustomButton>
      </div>
    </div>
  );
}

export default GameHomepage;
