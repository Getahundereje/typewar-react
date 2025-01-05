import { useEffect, useState } from "react";

import GameCustomButton from "../../../components/game-custom-button/game-custom-button.component";
import { useButtonRef } from "../../../hooks/useButtonRef";

import "./homepage.styles.css";

function GameHomepage() {
  const buttonsRef = useButtonRef();
  const [focusedButtonId, setFocusedButtonId] = useState(0);
  const [firstTime, setFirstTime] = useState(true);

  useEffect(() => {
    function handleClick() {
      setFocusedButtonId((currentButtonId) => (currentButtonId + 1) % 4);
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
      document.addEventListener("click", handleClick);

      setFirstTime(false);
    }
  }, [focusedButtonId, buttonsRef, firstTime]);

  return (
    <div className="homepage-container">
      <div className="menu-list">
        <GameCustomButton ref={buttonsRef[0]}>New Game</GameCustomButton>
        <GameCustomButton ref={buttonsRef[1]}>Settings</GameCustomButton>
        <GameCustomButton ref={buttonsRef[2]}>Stats</GameCustomButton>
        <GameCustomButton ref={buttonsRef[3]}>Quit Game</GameCustomButton>
      </div>
    </div>
  );
}

export default GameHomepage;
