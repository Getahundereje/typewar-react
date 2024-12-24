import './custom-button.styles.css'

function CustomButton({ children, ...otherProps }) {
    return (
        <a {...otherProps}>
            { children }
        </a>
    )
}

export default CustomButton;