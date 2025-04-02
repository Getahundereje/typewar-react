import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

import FormInput from "../../../components/form-input/form-input.componet";
import FormCustomButton from "../../../components/form-custom-button/form-custom-button.component";
import { UserContext } from "../../../contexts/user/user.context";

import "./sign-in-up.styles.css";
import SuccessMessage from "../../../components/success-message/success-message.component";
import LoadingSpinner from "../../../components/loading-spinner/loading-spinner.component";
import useLocalStorage from "../../../hooks/useLocalStorage";

const CLIENT_ID =
  "1076570278208-jsolrl5isf0f7qsr9gnubtd95109hm3u.apps.googleusercontent.com";

// eslint-disable-next-line react/prop-types
function SignInSignUp({ signIn = true }) {
  const showSignIn = signIn;
  const [usingOAuth, setUsingOAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useLocalStorage("remember_me", false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [emailIsValid, setEmailIsValid] = useState(false);
  const [passwordIsValid, setPasswordIsValid] = useState(false);
  const [fullNameIsValid, setFullNameIsValid] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  function handleChanges(e) {
    setErrorMessage("");
    const { name, value } = e.target;

    if (name === "remember-me") {
      setRememberMe(e.target.checked);
    }

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "fullname") {
      setFullName(value);
    }
  }

  function checkInputValidity() {
    if (!email || !password || (!showSignIn && !fullName)) {
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

  async function handleGoogleOauhtLogin(response) {
    const token = response.credential;

    try {
      const response = await axios.post(
        "http://localhost:8000/auth/google/login/spa",
        {
          token,
        },
        {
          withCredentials: true,
        }
      );
      const { data } = response;
      userContext.updateUser(data.data);

      if (data.status === "succuss") {
        setShowSuccess(true);
        setUsingOAuth(true);
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
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
          rememberMe,
        },
        {
          withCredentials: true,
        }
      );
      const { data } = response;
      userContext.updateUser(data.data);

      if (data.status === "succuss") {
        setShowSuccess(true);
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  }

  async function handleSignUpWithEmail(e) {
    e.preventDefault();

    if (!checkInputValidity()) return;

    try {
      const response = await axios.post(
        "http://localhost:8000/auth/email/signup",
        {
          fullname: fullName,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      const { data } = response;
      userContext.updateUser(data.data);

      if (data.status === "succuss") {
        setRememberMe(false);
        setShowSuccess(true);
        setFullName("");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  }

  async function handleRememberMe() {
    if (rememberMe) {
      try {
        const response = await axios.get(
          "http://localhost:8000/auth/rememberMe",
          {
            withCredentials: true,
          }
        );
        const { data } = response;

        if (data.status === "succuss") {
          userContext.updateUser(data.data);
          navigate("/game/homepage");
        }
      } catch (error) {
        setLoading(false);
        console.log(error.response.data.message);
      }
    }
  }

  function handlePageChange() {
    setErrorMessage("");
    if (showSignIn) {
      navigate("/signup");
    } else navigate("/signin");
  }

  useEffect(() => {
    function validateInput() {
      const emailRegex =
        // eslint-disable-next-line no-control-regex
        /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;

      if (!showSignIn) {
        if (fullName.length) {
          setFullNameIsValid(true);
        } else setFullNameIsValid(false);
      }

      if (emailRegex.test(email)) {
        setEmailIsValid(true);
      } else setEmailIsValid(false);

      if (password.length >= 8) {
        setPasswordIsValid(true);
      } else setPasswordIsValid(false);
    }

    validateInput();
  }, [fullName, email, password]);

  useEffect(() => {
    if (rememberMe) {
      handleRememberMe();
    }
  }, []);

  return showSignIn && loading ? (
    <LoadingSpinner />
  ) : (
    <>
      <section className="sign-in-up-container">
        {showSignIn ? (
          <p className="title">
            Welcome Back <span>Sign in to continue</span>
          </p>
        ) : (
          <p className="title">
            Welcome <span>Sign up to continue</span>
          </p>
        )}
        <form action="#" method="post">
          {!showSignIn && (
            <FormInput
              type="text"
              name="fullname"
              id="fullname"
              placeholder=""
              label="Full Name"
              value={fullName}
              isValid={fullNameIsValid}
              onChange={handleChanges}
            />
          )}
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
            onClick={showSignIn ? handleLogin : handleSignUpWithEmail}
          >
            {showSignIn ? "Sign In" : "Sign up"}
          </FormCustomButton>
          {errorMessage ? <p className="error-message">{errorMessage}</p> : ""}
          {showSignIn && (
            <FormInput
              type="checkbox"
              name="remember-me"
              id="remember-me"
              className="checkbox"
              label="Remember me"
              checked={rememberMe}
              onChange={handleChanges}
            />
          )}
        </form>
        <div className="alternative-options">
          <GoogleOAuthProvider clientId={CLIENT_ID}>
            <GoogleLogin onSuccess={handleGoogleOauhtLogin} />
          </GoogleOAuthProvider>
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
        {showSignIn ? "Doesn't have an account " : "Already have an account"}
        <span
          onClick={handlePageChange}
          style={{
            pointerEvents: !showSuccess ? "auto" : "none",
            opacity: !showSuccess ? 1 : 0.5,
            cursor: !showSuccess ? "pointer" : "not-allowed",
          }}
        >
          {showSignIn ? "Sign up" : "Sign In"}
        </span>
      </p>
      {showSuccess && (
        <SuccessMessage
          message={
            showSignIn || usingOAuth
              ? "Loged in successfully."
              : "Sign up successfully"
          }
          onClose={() => {
            setShowSuccess(false);
            if (showSignIn || usingOAuth) {
              navigate("/game/homepage", { replace: true });
            } else {
              navigate("/signin");
            }
          }}
        />
      )}
    </>
  );
}

export default SignInSignUp;
