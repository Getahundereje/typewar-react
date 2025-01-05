import { Link } from "react-router-dom";

import FormInput from "../../components/form-input/form-input.componet";
import CustomButton from "../../components/custom-button/custom-button.component";

import "../sign-in-up.styles.css";

function SignIn() {
  return (
    <>
      <section className="container">
        <p className="title">
          Sign In <span>Sign in to continue</span>
        </p>
        <form action="#" method="post">
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
          <CustomButton type="submit" className="form-button">
            Sign In
          </CustomButton>
          <FormInput
            type="checkbox"
            name="remember-me"
            id="remember-me"
            className="checkbox"
            label="Remember me"
          />
        </form>
        <div className="alternative-options">
          <CustomButton className="alternative-options-button">
            <img src="/assets/images/google-logo.png" alt="google-logo" />
          </CustomButton>
          <CustomButton className="alternative-options-button">
            <img src="/assets/images/facebook-logo.png" alt="facebook-logo" />
          </CustomButton>
          <CustomButton className="alternative-options-button">
            <img
              src="/assets/images/twitter-logo.png"
              alt="twitter-logo"
              style={{ transform: "scale(0.9)" }}
            />
          </CustomButton>
        </div>
      </section>
      <p className="have-account">
        Doesn&apos;t have an account{" "}
        <span>
          <Link to="/signup">Sign up</Link>
        </span>
      </p>
    </>
  );
}

export default SignIn;
