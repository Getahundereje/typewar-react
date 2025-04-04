import { useEffect, useState } from "react";

import "./message.styles.css";

// eslint-disable-next-line react/prop-types
const Message = ({ message, onClose, duration = 2000, type = "error" }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      setProgress((remaining / duration) * 100);

      if (remaining <= 0) {
        clearInterval(interval);
        onClose();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onClose]);

  return (
    <div className="message-container">
      <div className="message">
        <div className="content">
          <div
            className="icon"
            style={{
              color: `${type === "error" && "#f44336"}`,
              textShadow: `${
                type === "error" && "0 0 8px rgba(244, 67, 54, 0.6)"
              }`,
            }}
          >
            {type === "error" ? "X" : "✓"}
          </div>
          <p>{message}</p>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{
              width: `${progress}%`,
              background: `${type === "error" && "#f44336"}`,
              boxShadow: `${
                type === "error" && "0 0 8px rgba(244, 67, 54, 0.6)"
              }`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Message;
