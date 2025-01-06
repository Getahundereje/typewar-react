import "./form-slider.styles.css";

// eslint-disable-next-line react/prop-types
function FormSliderInput({ label, ...otherProps }) {
  return (
    <div className="slider">
      <label className="slider-label">{label}</label>
      <input {...otherProps} />
    </div>
  );
}

export default FormSliderInput;
