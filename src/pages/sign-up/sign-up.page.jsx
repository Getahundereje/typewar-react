import FormInput from '../../components/form-input/form-input.componet'
import CustomButton from '../../components/custom-button/custom-button.component';

import './sign-up.styles.css'

function SignUp() {
    return (
    <section className="container">
      <p className="title">Sign Up <span>Sign up to continue</span></p>
      <form action="#" method="post">
        <FormInput
          type="text"
          name="fullname"
          id="fullname"
          placeholder=""
          label='Full Name'
        />
        <FormInput
          type="email"
          name="email"
          id="email"
          placeholder=""
          label='Email'
        />
        <FormInput
          type="password"
          name="password"
          id="password"
          placeholder=""
          label='Password'
        />
        <CustomButton type="submit" className="form-button">Sign up</CustomButton>
        <FormInput
          type="checkbox"
          name="remember-me"
          id="remember-me"
          className="checkbox"
          label='Remember me'
        />
      </form>
      <div className="alternative-options">   
        <CustomButton  className='alternative-options-button'>
          <img src="/assets/images/google-logo.png" alt="google-logo" />
        </CustomButton>
        <CustomButton  className='alternative-options-button'>
          <img src="/assets/images/facebook-logo.png" alt="facebook-logo" />
        </CustomButton>
        <CustomButton  className='alternative-options-button'>
          <img src="/assets/images/twitter-logo.png" alt="twitter-logo" style={{transform: 'scale(0.9)'}}/>
        </CustomButton>
      </div>
    </section>
    )
}

export default SignUp;