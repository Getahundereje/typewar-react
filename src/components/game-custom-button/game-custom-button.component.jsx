import { forwardRef } from "react";

import "./game-custom-button.styles.css";

// eslint-disable-next-line react/prop-types
const GameCustomButton = forwardRef(({ children, ...otherProps }, ref) => {
  return (
    <button className="menu-button" ref={ref} {...otherProps}>
      {children}
    </button>
  );
});

GameCustomButton.displayName = "GameCustomButton";

export default GameCustomButton;
