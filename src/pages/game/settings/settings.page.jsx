import { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import FormSliderInput from "../../../components/form-slider/form-slider.component";
import RadioButton from "../../../components/custom-radio-button/custom-radio-button.component";
import { UserContext } from "../../../contexts/user/user.context";
import useSessionStorage from "../../../hooks/useSessionStorage";
import useGameState from "../../../hooks/useGameStates";
import { WordsContext } from "../../../contexts/words/words.context";
import updatePlayerSetting from "../../../utilis/functions/updatePlayerState";

import "./settings.styles.css";

function SettingsPage() {
  const location = useLocation();
  const { disabled } = location.state || false;

  const userContext = useContext(UserContext);
  const [sound, setSound] = useState("0");
  const [gameSound, setGameSound] = useState("0");
  const [gameMode, setGameMode] = useState("staged");
  const [diffculty, setDiffculty] = useState("easy");
  const stateUpdated = useRef(false);

  const [playerState, setPlayerState] = useSessionStorage(
    "playerState",
    userContext.user?.playerState || ""
  );

  const wordsContext = useContext(WordsContext);

  const { setContinueGame, resetGameStates } = useGameState();

  const playerStateCopy = useRef({});

  function handleChange(e) {
    const { name, value } = e.target;

    stateUpdated.current = true;
    playerStateCopy.current = {
      ...playerState,
      setting: {
        ...playerState.setting,
        [name]: value,
      },
    };

    if (Object.keys(playerState.setting).includes(name)) {
      setContinueGame(false);
      wordsContext.reset();
      resetGameStates();
    }

    setPlayerState(playerStateCopy.current);
  }

  useEffect(() => {
    setSound(playerState.setting.soundVolume);
    setGameSound(playerState.setting.gameSoundVolume);
    setGameMode(playerState.setting.gameMode);
    setDiffculty(playerState.setting.difficulty);
  }, [playerState]);

  useEffect(() => {
    return () => {
      if (stateUpdated.current) {
        updatePlayerSetting(playerStateCopy.current);
      }
    };
  }, []);

  return (
    <div className="settings-container">
      <div className="card">
        <p className="card-header">Settings</p>
        <div className="card-body">
          <FormSliderInput
            label="sound"
            type="range"
            id="soundVolume"
            name="soundVolume"
            min="0"
            max="1"
            step="0.1"
            value={sound}
            onChange={handleChange}
            key={1}
          />
          <FormSliderInput
            label="Game sound"
            id="gameSoundVolume"
            type="range"
            name="gameSoundVolume"
            min="0"
            max="1"
            step="0.1"
            value={gameSound}
            onChange={handleChange}
            key={2}
          />
          <div className="game-mode">
            <p className="settings-label">Game Mode</p>
            <div className="radio-buttons">
              <RadioButton
                label="Staged"
                id="Staged"
                type="radio"
                name="gameMode"
                value="staged"
                checked={gameMode === "staged"}
                onChange={handleChange}
                disabled={disabled}
              />
              <RadioButton
                label="Timer"
                id="Timer"
                type="radio"
                name="gameMode"
                value="timer"
                checked={gameMode === "timer"}
                onChange={handleChange}
                disabled={disabled}
              />
              <RadioButton
                label="Practice"
                id="Practice"
                type="radio"
                name="gameMode"
                value="practice"
                checked={gameMode === "practice"}
                onChange={handleChange}
                disabled={disabled}
              />
            </div>
          </div>
          <div className="diffculty">
            <p className="settings-label">Difficulty</p>
            <div className="radio-buttons">
              <RadioButton
                label="Easy"
                type="radio"
                id="easy"
                name="difficulty"
                value="easy"
                checked={diffculty === "easy"}
                onChange={handleChange}
                disabled={disabled}
              />
              <RadioButton
                label="Normal"
                type="radio"
                id="normal"
                name="difficulty"
                value="normal"
                checked={diffculty === "normal"}
                onChange={handleChange}
                disabled={disabled}
              />
              <RadioButton
                label="Hard"
                type="radio"
                id="hard"
                name="difficulty"
                value="hard"
                checked={diffculty === "hard"}
                onChange={handleChange}
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
