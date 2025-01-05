import "./game-custom-button.styles.css";

// eslint-disable-next-line react/prop-types
function GameCustomButton({ children, ...otherProps }) {
  return (
    <button className="menu-button" {...otherProps}>
      {children}
    </button>
  );
}

export default GameCustomButton;
