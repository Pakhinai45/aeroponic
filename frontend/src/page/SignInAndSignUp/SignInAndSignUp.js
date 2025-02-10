import React, { useState } from "react";
import "./styles.css";
// import logo from "./logo2.png";

import SignUpForm from "./SingUp";
import SignInForm from "./SingIn";

export default function SignInAndSignUp() {
  const [type, setType] = useState("signIn");
  const handleOnClick = text => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");
  return (
    <div className="SignInAndSignUp">
      <h2>Sign in/up Form</h2>
      <div className={containerClass} id="containerLogin">
        <SignUpForm />
        <SignInForm />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="texth1-InUpDetail">Sign In</h1>       
              <button
                className={`ghost btn-InUp`}
                id="signIn"
                onClick={() => handleOnClick("signIn")}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
            {/* <img src={logo} alt="Company logo" width={400} /> */}
              <h1 className="texth1-InUpDetail">Create an account</h1>    
              <button 
                className={`ghost btn-InUp`}
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
