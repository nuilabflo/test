import React, { Component } from "react";
import "./container.css";
import MasterElement from "./master-element";

import { getFromStorage, setInStorage } from "../utils/storage";
import axios from "axios";
const API_URL = "http://localhost:9000/";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      editorMode: false,
      isLoading: true,
      token: "",
      signUpError: "",
      signUpFirstName: "",
      signUpLastName: "",
      signUpEmail: "",
      signUpPassWord: "",
      signInError: "",
      signInEmail: "",
      signInPassWord: "",
      userName: "",
      userId: "",
      howto: undefined
    };
    this.showPass = this.showPass.bind(this);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
    this.InputChange = this.InputChange.bind(this);
    this.changeLoginMode = this.changeLoginMode.bind(this);
  }

  componentDidMount() {
    let token = getFromStorage("the_main_app");

    if (token) {
      fetch("verify?token=" + token)
        .then(res => {
          res.json();
        })
        .then(json => {
          if (json.success) {
            this.setState({
              token,
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false
            });
          }
        });
    } else {
      this.setState({
        isLoading: false
      });
    }
  }

  showPass(e) {
    let c = e.target.parentElement.children;
    c = c[c.length - 2];
    let ct = c.type;
    if (ct === "password") {
      c.type = "text";
    } else {
      c.type = "password";
    }

    //console.log(c, ct);
  }

  logIn(e) {
    let valuesToCheck = document.getElementById(e.target.id).children;

    const {
      signInEmail,
      signInPassWord,
      howto,
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassWord,
      token
    } = this.state;
    let body = {};
    if (e.target.id === "signin") {
      body = {
        email: signInEmail,
        password: signInPassWord,
        token: token,
        signin: true
      };
    } else {
      body = {
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassWord,
        token: token,
        signin: false
      };

      //body = JSON.stringify(body);
    }

    axios
      .post(API_URL + e.target.id, body)
      .then(response => {
        if (!response.data.success) {
          alert(response.data.message);
        } else {
          if (body.signin) {
            axios
              .get(API_URL + "verify?token=" + response.data.token)
              .then(response => {
                this.setState({
                  userName: response.data.name,
                  token: response.data.token,
                  userId: response.data.userId,
                  howto: response.data.howto
                });
              })
              .catch(err => {
                console.log("Fehler: ", err);
              });
          } else {
            this.setState({
              howto: true,
              userName: response.data.name,
              userId: response.data.userId
            });
          }

          this.setState({ editorMode: true });
          // document.getElementById("masterElement").style.opacity = 1;
        }
      })
      .catch(err => {
        console.log("Error: ", err);
      });
  }

  logOut(e) {
    axios
      .get(API_URL + "logout?token=" + this.state.token)
      .then(response => {
        document.getElementById("masterElement").style.opacity = 0;
        this.setState({ editorMode: false, token: false, howto: undefined });
      })
      .catch(err => {
        console.log("Fehler: ", err);
      });

    this.refs["masterElement"].mylogout();
  }

  InputChange(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  changeLoginMode(e) {
    let inForm = document.getElementById("signin");
    let inButton = document.getElementsByName("signinButton")[0];
    let inHint = document.getElementById("inHint");
    let upForm = document.getElementById("signup");
    let upButton = document.getElementsByName("signupButton")[0];
    let upHint = document.getElementById("upHint");

    if (e.target.id === "inHint" || e.target.id === "outHint") {
      inForm.style.display = inButton.style.display = inHint.style.display =
        "none";

      upForm.style.display = upButton.style.display = upHint.style.display =
        "flex";
    } else {
      inForm.style.display = inButton.style.display = inHint.style.display =
        "flex";

      upForm.style.display = upButton.style.display = upHint.style.display =
        "none";
    }
  }

  render() {
    const {
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassWord,
      howto,
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassWord
    } = this.state;

    if (isLoading) {
      return (
        <div>
          <p>Loading</p>
        </div>
      );
    }
    if (!token && !this.state.editorMode) {
      return (
        <div className="login">
          <div className="mainHeader">
            <h1 className="signInHeader">
              — <br />
              nuilab
              <br />
              pulse <br />
              designer
              <br />
            </h1>
            <div className="introText">
              <p>
                Design your own haptic feedbacks for the nuilab pulse core
                devkit. Just sign in if you still have an account. Otherwise
                please <a href="#">create an account.</a>
                <br />
                <br />
                You can use the nuilab pulse core designer at its best with
                google’s chrome-browser. If you prefer to work with an other
                browser please select the pulse core dev kit as your computer’s
                audio-output device at the system preferences before running the
                pulse designer. <br />
                <br /> For detailed use information click <a href="#">here</a>
              </p>
            </div>
          </div>
          <div className="loginForm" id="signin">
            {signInError ? <p>{signInError}</p> : null}
            <input
              className="logInInput"
              type="email"
              placeholder="eMail"
              value={signInEmail}
              id="signInEmail"
              onChange={this.InputChange}
            />
            <input
              className="logInInput"
              type="password"
              placeholder="Password"
              value={signInPassWord}
              id="signInPassWord"
              onChange={this.InputChange}
            />
            <input
              className="passButton"
              type="button"
              value=""
              onClick={this.showPass}
            />
          </div>
          <input
            className="submitLogin"
            type="button"
            value="sign in"
            name="signinButton"
            id="signin"
            onClick={this.logIn}
          />
          <a
            className="hint"
            id="inHint"
            href="#"
            onClick={this.changeLoginMode}
          >
            The first time? Create an account here.
          </a>

          <div className="loginForm" id="signup">
            <input
              className="logInInput"
              type="text"
              placeholder="First Name"
              value={signUpFirstName}
              id="signUpFirstName"
              onChange={this.InputChange}
            />
            <input
              className="logInInput"
              type="text"
              placeholder="Last Name"
              value={signUpLastName}
              id="signUpLastName"
              onChange={this.InputChange}
            />
            <input
              className="logInInput"
              type="email"
              placeholder="eMail"
              value={signUpEmail}
              id="signUpEmail"
              onChange={this.InputChange}
            />
            <input
              className="logInInput"
              type="password"
              placeholder="Password"
              value={signUpPassWord}
              id="signUpPassWord"
              onChange={this.InputChange}
            />
            <input
              className="passButton"
              type="button"
              value=""
              onClick={this.showPass}
            />
          </div>
          <input
            className="submitLogin"
            type="button"
            value="Sign Up"
            name="signupButton"
            id="signup"
            onClick={this.logIn}
          />
          <a
            className="hint"
            id="upHint"
            href="#"
            onClick={this.changeLoginMode}
          >
            You have already an account? Sign in!
          </a>
          <br />
          <br />
          <br />

          <a
            className="hint"
            id="inHint"
            href="#"
            onClick={this.changeLoginMode}
          >
            Terms of Use
          </a>
          <br />
          <a
            className="hint"
            id="inHint"
            href="#"
            onClick={this.changeLoginMode}
          >
            Disclaimer
          </a>
        </div>
      );
    }
    if (this.state.editorMode) {
      if (this.state.howto === undefined) {
        return <div>…loading</div>;
      } else {
        return (
          <div
            id="masterElement"
            style={{ opacity: 1 }}
            className="masterElement"
          >
            <MasterElement
              usr={this.state.userId}
              howto={this.state.howto}
              ref="masterElement"
            />
            <div className="profile" style={{ display: "inline" }}>
              <p>
                Hello, <br />
                {this.state.userName}
                <br />
                <a href="#" id="outHint" onClick={this.logOut}>
                  Log Out
                </a>
              </p>
            </div>
          </div>
        );
      }
    }
  }
}

export default Container;

//
