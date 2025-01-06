import "./custom-radio-button.styles.css";

// eslint-disable-next-line react/prop-types
function RadioButton({ id, label, ...otherProps }) {
  return (
    <div>
      <input className="custom-radio-button" id={id} {...otherProps} />
      <label className="custom-radio-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

export default RadioButton;
