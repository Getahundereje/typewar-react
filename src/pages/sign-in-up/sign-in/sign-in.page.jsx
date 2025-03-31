import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

import FormInput from "../../../components/form-input/form-input.componet";
import FormCustomButton from "../../../components/form-custom-button/form-custom-button.component";
import { UserContext } from "../../../contexts/user/user.context";

import "../sign-in-up.styles.css";
import SuccessMessage from "../../../components/success-message/success-message.component";

function SignIn() {
  const [email, setEamil] = useState("");
  const [password, setPassword] = useState("");

  const [emailIsValid, setEmailIsValid] = useState(false);
  const [passwordIsValid, setPasswordIsValid] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  function handleChanges(e) {
    e.preventDefault();

    setErrorMessage("");
    const { name, value } = e.target;
    if (name === "email") {
      setEamil(value);
    } else if (name === "password") {
      setPassword(value);
    }
  }

  function checkInputValidity() {
    if (!email || !password) {
      setErrorMessage("Please fill all input areas!");
      return false;
    }

    if (!emailIsValid) {
      setErrorMessage("Please put appropriate email address!");
      return false;
    }

    if (!passwordIsValid) {
      setErrorMessage("Please put password of length of 8 or more!");
      return false;
    }
    return true;
  }

  async function handleLogin(e) {
    e.preventDefault();

    if (!checkInputValidity()) return;

    try {
      const response = await axios.post(
        "http://localhost:8000/auth/email/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      const { data } = response;
      userContext.updateUser(data.data);
      console.log(data.data);

      if (data.status === "succuss") {
        setShowSuccess(true);
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  }

  useEffect(() => {
    function validateInput() {
      const emailRegex =
        // eslint-disable-next-line no-control-regex
        /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;

      if (emailRegex.test(email)) {
        setEmailIsValid(true);
      } else setEmailIsValid(false);

      if (password.length >= 8) {
        setPasswordIsValid(true);
      } else setPasswordIsValid(false);
    }

    validateInput();
  }, [email, password]);

  return (
    <>
      <section className="sign-in-up-container">
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
            value={email}
            isValid={emailIsValid}
            onChange={handleChanges}
          />
          <FormInput
            type="password"
            name="password"
            id="password"
            placeholder=""
            label="Password"
            value={password}
            isValid={passwordIsValid}
            onChange={handleChanges}
          />
          <FormCustomButton
            type="submit"
            className="form-button"
            onClick={handleLogin}
          >
            Sign In
          </FormCustomButton>
          {errorMessage ? <p className="error-message">{errorMessage}</p> : ""}
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
        Doesn&apos;t have an account{" "}
        <span>
          <Link
            to="/signup"
            style={{
              pointerEvents: !showSuccess ? "auto" : "none",
              opacity: !showSuccess ? 1 : 0.5,
              cursor: !showSuccess ? "pointer" : "not-allowed",
            }}
          >
            Sign up
          </Link>
        </span>
      </p>
      {showSuccess && (
        <SuccessMessage
          message="Loged in successfully."
          onClose={() => {
            setShowSuccess(false);
            navigate("/game/homepage", { replace: true });
          }}
        />
      )}
    </>
  );
}

export default SignIn;
