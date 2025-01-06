import "./form-input.styles.css";

// eslint-disable-next-line react/prop-types
function FormInput({ id, label, ...otherProps }) {
  console.log(label);
  return (
    <div className="input-group">
      <input className="form-input" id={id} {...otherProps} />
      <label className="form-input-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

export default FormInput;
