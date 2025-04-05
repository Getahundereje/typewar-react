import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FormSliderInput from "../../../components/form-slider/form-slider.component";
import RadioButton from "../../../components/custom-radio-button/custom-radio-button.component";
import useSessionStorage from "../../../hooks/useSessionStorage";
import updatePlayerSetting from "../../../utilis/functions/updatePlayerState";

import "./settings.styles.css";
import Message from "../../../components/message/message.component";

function SettingsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { disabled } = location.state || false;

  const [sound, setSound] = useState("0");
  const [gameSound, setGameSound] = useState("0");
  const [gameMode, setGameMode] = useState("staged");
  const [diffculty, setDiffculty] = useState("easy");
  const stateUpdated = useRef(false);

  const [showMessage, setShowMessage] = useState(false);
  const message = useRef({});

  const [playerState, setPlayerState] = useSessionStorage("playerState", "");

  const [playerStateCopy, setPlayerStateCopy] = useState({ ...playerState });
  const previousPlayerState = useRef({});

  function handleChange(e) {
    const { name, value } = e.target;

    stateUpdated.current = true;
    previousPlayerState.current = previousPlayerState.current ?? {
      ...playerStateCopy,
    };
    setPlayerStateCopy({
      ...playerStateCopy,
      setting: {
        ...playerStateCopy.setting,
        [name]: value,
      },
    });
  }

  async function handleSave() {
    if (stateUpdated.current) {
      const status = await updatePlayerSetting(playerStateCopy);

      if (status === 401) {
        message.current = {
          message: "Session expired.\nPlease sign in to continue",
          type: "error",
          onClose: () => {
            navigate("/signin", {
              replace: true,
            });
          },
        };
        setPlayerStateCopy(previousPlayerState.current);
        setShowMessage(true);
      } else if (status === 201) {
        message.current = {
          message: "Settings changed succussfully",
          type: "success",
          onClose: () => {
            setShowMessage(false);
          },
        };
        setShowMessage(true);
        setPlayerState(playerStateCopy);
        previousPlayerState.current = { ...playerStateCopy };
      }
    }
  }

  useEffect(() => {
    return () => {
      setPlayerState(previousPlayerState.current);
    };
  }, []);

  useEffect(() => {
    setSound(playerStateCopy.setting.soundVolume);
    setGameSound(playerStateCopy.setting.gameSoundVolume);
    setGameMode(playerStateCopy.setting.gameMode);
    setDiffculty(playerStateCopy.setting.difficulty);
  }, [playerStateCopy]);

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
            max="0.5"
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
            max="0.5"
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
                disabled={true}
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
        <button className="save-button" onClick={handleSave}>
          Save
        </button>
      </div>
      {showMessage && <Message {...message.current} />}
    </div>
  );
}

export default SettingsPage;
