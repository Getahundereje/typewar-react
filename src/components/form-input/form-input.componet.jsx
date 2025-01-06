import "./form-input.styles.css";

// eslint-disable-next-line react/prop-types
function FormInput({ id, label, isValid, ...otherProps }) {
  return (
    <div className="input-group">
      <input
        className={`form-input ${isValid ? "valid-input" : ""}`}
        id={id}
        {...otherProps}
      />
      <label className="form-input-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

export default FormInput;
