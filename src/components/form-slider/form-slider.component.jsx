import "./form-slider.styles.css";

// eslint-disable-next-line react/prop-types
function FormSliderInput({ id, label, ...otherProps }) {
  return (
    <div className="slider">
      <input id={id} {...otherProps} />
      <label className="slider-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

export default FormSliderInput;
