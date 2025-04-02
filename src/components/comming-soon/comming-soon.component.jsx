import "./comming-soon.styles.css";

const ComingSoon = () => {
  return (
    <div className="tactical-container">
      <div className="header-strip">
        <div className="stripe-left"></div>
        <div className="stripe-center">Thanks for your patience.</div>
        <div className="stripe-right"></div>
      </div>

      <div className="comming-soon-container">
        <div className="radar-sweep"></div>
        <h1 className="comming-soon-title">OPERATION IN PROGRESS</h1>
      </div>
    </div>
  );
};

export default ComingSoon;
