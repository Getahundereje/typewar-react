import { Link } from "react-router-dom";

import FormInput from "../../../components/form-input/form-input.componet";
import FormCustomButton from "../../../components/form-custom-button/form-custom-button.component";

import "../sign-in-up.styles.css";

function SignUp() {
  return (
    <>
      <section className="container">
        <p className="title">
          Sign Up <span>Sign up to continue</span>
        </p>
        <form action="#" method="post">
          <FormInput
            type="text"
            name="fullname"
            id="fullname"
            placeholder=""
            label="Full Name"
          />
          <FormInput
            type="email"
            name="email"
            id="email"
            placeholder=""
            label="Email"
          />
          <FormInput
            type="password"
            name="password"
            id="password"
            placeholder=""
            label="Password"
          />
          <FormCustomButton type="submit" className="form-button">
            Sign up
          </FormCustomButton>
          <FormInput
            type="checkbox"
            name="remember-me"
            id="remember-me"
            className="checkbox"
            label="Remember me"
          />
        </form>
        <div className="alternative-options">
          <FormCustomButton className="alternative-options-button">
            <img src="/assets/images/google-logo.png" alt="google-logo" />
          </FormCustomButton>
          <FormCustomButton className="alternative-options-button">
            <img src="/assets/images/facebook-logo.png" alt="facebook-logo" />
          </FormCustomButton>
          <FormCustomButton className="alternative-options-button">
            <img
              src="/assets/images/twitter-logo.png"
              alt="twitter-logo"
              style={{ transform: "scale(0.9)" }}
            />
          </FormCustomButton>
        </div>
      </section>
      <p className="have-account">
        Already have an account{" "}
        <span>
          <Link to="/signin">Sign in</Link>
        </span>
      </p>
    </>
  );
}

export default SignUp;
