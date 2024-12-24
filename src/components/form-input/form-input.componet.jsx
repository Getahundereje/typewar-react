import './form-input.styles.css'

function FormInput({ handleChange, label, ...otherProps}) {
    console.log(label)
    return (
    <div className="input-group">
        <input className="form-input" onChange={handleChange} {...otherProps}/>
        { label ?
            (
            <label > {label} </label>
            ) : null
        }
    </div>
 );
}

export default FormInput;