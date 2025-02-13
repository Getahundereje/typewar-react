import { useContext, useEffect, useRef, useState } from "react";

import FormSliderInput from "../../../components/form-slider/form-slider.component";
import RadioButton from "../../../components/custom-radio-button/custom-radio-button.component";
import { UserContext } from "../../../contexts/user/user.context";
import useSessionStorage from "../../../hooks/useSessionStorage";

import "./settings.styles.css";
import axios from "axios";

function SettingsPage() {
  const userContext = useContext(UserContext);
  const [sound, setSound] = useState("0");
  const [gameSound, setGameSound] = useState("0");
  const [gameMode, setGameMode] = useState("staged");
  const [diffculty, setDiffculty] = useState("easy");
  const stateUpdated = useRef(false);

  const [gameState, setGameState] = useSessionStorage(
    "gameState",
    userContext.user?.gameState || ""
  );

  const gameStateCopy = useRef(gameState);

  function handleChange(e) {
    const { name, value } = e.target;
    console.log(name, value);

    setGameState((prevState) => ({
      ...prevState,
      setting: {
        ...prevState.setting,
        [name]: value,
      },
    }));
    stateUpdated.current = true;

    gameStateCopy.current = {
      ...gameState,
      setting: {
        ...gameState.setting,
        [name]: value,
      },
    };
  }

  useEffect(() => {
    setSound(gameState.setting.soundVolume);
    setGameSound(gameState.setting.gameSoundVolume);
    setGameMode(gameState.setting.gameMode);
    setDiffculty(gameState.setting.difficulty);
  }, [gameState]);

  async function updateSetting() {
    try {
      const response = await axios.post(
        "http://localhost:8000/states",
        gameStateCopy.current,
        {
          withCredentials: true,
        }
      );
      const { data } = response;
      console.log(data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    return () => {
      if (stateUpdated.current) {
        updateSetting();
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
              />
              <RadioButton
                label="Timer"
                id="Timer"
                type="radio"
                name="gameMode"
                value="timer"
                checked={gameMode === "timer"}
                onChange={handleChange}
              />
              <RadioButton
                label="Practice"
                id="Practice"
                type="radio"
                name="gameMode"
                value="practice"
                checked={gameMode === "practice"}
                onChange={handleChange}
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
              />
              <RadioButton
                label="Normal"
                type="radio"
                id="normal"
                name="difficulty"
                value="normal"
                checked={diffculty === "normal"}
                onChange={handleChange}
              />
              <RadioButton
                label="Hard"
                type="radio"
                id="hard"
                name="difficulty"
                value="hard"
                checked={diffculty === "hard"}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
