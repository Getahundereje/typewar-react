import GameCustomButton from "../../../components/game-custom-button/game-custom-button.component";

import "./homepage.styles.css";

function GameHomepage() {
  return (
    <div className="homepage-container">
      <div className="menu-list">
        <GameCustomButton>New Game</GameCustomButton>
        <GameCustomButton>Settings</GameCustomButton>
        <GameCustomButton>Stats</GameCustomButton>
        <GameCustomButton>Quit Game</GameCustomButton>
      </div>
    </div>
  );
}

export default GameHomepage;
