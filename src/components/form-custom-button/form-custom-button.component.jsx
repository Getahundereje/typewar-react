import "./form-custom-button.styles.css";

// eslint-disable-next-line react/prop-types
function FormCustomButton({ children, ...otherProps }) {
  return <a {...otherProps}>{children}</a>;
}

export default FormCustomButton;
