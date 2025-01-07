import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import GameCustomButton from "../../../components/game-custom-button/game-custom-button.component";
import { useButtonRef } from "../../../hooks/useButtonRef";

import "./homepage.styles.css";

function GameHomepage() {
  const navigate = useNavigate();
  const buttonsRef = useButtonRef();
  const [focusedButtonId, setFocusedButtonId] = useState(0);
  const [firstTime, setFirstTime] = useState(true);

  function handleMenuButtonsClick(e) {
    if (e.code === "Enter") {
      if (document.activeElement === buttonsRef[0].current) {
        navigate("/game/gamePage");
      } else if (document.activeElement === buttonsRef[1].current) {
        navigate("/game/settings");
      } else if (document.activeElement === buttonsRef[2].current) {
        navigate("/game/stats");
      }
    }
  }

  useEffect(() => {
    function handleClick(e) {
      e.preventDefault();

      // setFocusedButtonId((currentButtonId) => (currentButtonId + 1) % 4);
    }

    function handleArrowClick(e) {
      e.preventDefault();

      if (e.code === "ArrowDown") {
        setFocusedButtonId((currentButtonId) => (currentButtonId + 1) % 4);
      }

      if (e.code === "ArrowUp") {
        setFocusedButtonId((currentButtonId) =>
          currentButtonId ? (currentButtonId - 1) % 4 : buttonsRef.length - 1
        );
      }
    }

    buttonsRef[focusedButtonId].current.focus();
    if (firstTime) {
      document.addEventListener("keydown", handleArrowClick);
      document.addEventListener("mousedown", handleClick);

      setFirstTime(false);
    }
  }, [focusedButtonId, buttonsRef, firstTime]);

  return (
    <div className="homepage-container">
      <div className="menu-list">
        <GameCustomButton
          ref={buttonsRef[0]}
          onKeyDown={handleMenuButtonsClick}
        >
          New Game
        </GameCustomButton>
        <GameCustomButton
          ref={buttonsRef[1]}
          onKeyDown={handleMenuButtonsClick}
        >
          Settings
        </GameCustomButton>
        <GameCustomButton
          ref={buttonsRef[2]}
          onKeyDown={handleMenuButtonsClick}
        >
          Stats
        </GameCustomButton>
        <GameCustomButton ref={buttonsRef[3]}>Quit Game</GameCustomButton>
      </div>
    </div>
  );
}

export default GameHomepage;
