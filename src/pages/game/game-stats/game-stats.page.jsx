import { useContext } from "react";
import { UserContext } from "../../../contexts/user/user.context";

import "./game-stats.styles.css";
import useSessionStorage from "../../../hooks/useSessionStorage";

function StatsPage() {
  const userContext = useContext(UserContext);

  const [state] = useSessionStorage(
    "gameState",
    userContext.user?.gameState || ""
  );

  return (
    <div className="highscore-menu">
      <div className="card">
        <p className="card-header">Highscore</p>
        <div className="card-body">
          <div className="sub-card">
            <p className="sub-card-header">Single Player</p>
            <div className="sub-card-body">
              <div className="highscore-type">Staged</div>
              <div className="highscore-value">
                <div>
                  <span className="type">Easy</span>
                  <span className="value easy">
                    {state.highscore.singlePlayer.staged.easy}
                  </span>
                </div>
                <div>
                  <span className="type">Normal</span>
                  <span className="value normal">
                    {state.highscore.singlePlayer.staged.normal}
                  </span>
                </div>
                <div>
                  <span className="type">Hard</span>
                  <span className="value difficult">
                    {state.highscore.singlePlayer.staged.hard}
                  </span>
                </div>
              </div>
              <div className="highscore-type">Timer</div>
              <div className="highscore-value">
                <div>
                  <span className="type">Easy</span>
                  <span className="value easy">
                    {state.highscore.singlePlayer.timer.easy}
                  </span>
                </div>
                <div>
                  <span className="type">Normal</span>
                  <span className="value normal">
                    {state.highscore.singlePlayer.timer.normal}
                  </span>
                </div>
                <div>
                  <span className="type">Hard</span>
                  <span className="value difficult">
                    {state.highscore.singlePlayer.timer.hard}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="sub-card">
            <p className="sub-card-header">Multiplyer</p>
            <div className="sub-card-body">
              <div className="highscore-type">Timer</div>
              <div className="highscore-value">
                <div>
                  <span className="type">Easy</span>
                  <span className="value">
                    {state.highscore.multiPlayer.timer.easy}
                  </span>
                </div>
                <div>
                  <span className="type">Normal</span>
                  <span className="value">
                    {state.highscore.multiPlayer.timer.normal}
                  </span>
                </div>
                <div>
                  <span className="type">Hard</span>
                  <span className="value">
                    {state.highscore.multiPlayer.timer.hard}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsPage;
