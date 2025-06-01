import React, { useState } from "react";
import style from "./signInAndSignUp.module.css";

import SignUpForm from "./SingUp";
import SignInForm from "./SingIn";
import classNames from "classnames";

export default function SignInAndSignUp() {
  const [type, setType] = useState("signIn");

  const handleOnClick = (text) => {
    if (text !== type) {
      setType(text);
    }
  };

  const containerClass = classNames(style.container, {
    [style["right-panel-active"]]: type === "signUp",
  });

  return (
    <div className={style.SignInAndSignUp}>
      <h2>Sign in/up Form</h2>
      <div className={containerClass} id="containerLogin">
        <SignUpForm />
        <SignInForm />
        <div className={style.overlayContainer}>
          <div className={style.overlay}>
            <div className={classNames(style.overlayPanel, style.overlayLeft)}>
              <h1 className={style.texth1InUpDetail}>Sign In</h1>
              <button
                className={classNames(style.ghostBtnInUp)}
                id="signIn"
                onClick={() => handleOnClick("signIn")}
              >
                Sign In
              </button>
            </div>
            <div className={classNames(style.overlayPanel, style.overlayRight)}>
              <h1 className={style.texth1InUpDetail}>Create an account</h1>
              <button
                className={classNames(style.ghostBtnInUp)}
                id="signUp"
                onClick={() => handleOnClick("signUp")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
