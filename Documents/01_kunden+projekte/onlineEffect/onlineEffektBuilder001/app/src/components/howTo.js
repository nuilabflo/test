import React, { Component } from "react";
import "./howTo.css";
import axios from "axios";
import { Button, FormGroup, Label, Input } from "reactstrap";

const API_URL = "http://localhost:9000/";

class Howto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shower: this.props.showagain,
      showagain: this.props.showagain
    };

    this.hideMe = this.hideMe.bind(this);
    this.showMe = this.showMe.bind(this);
    this.changeHowTo = this.changeHowTo.bind(this);
  }

  componentDidMount() {
    // console.log(this.refs["checkHowTo"]);
    // this.refs["checkHowTo"].checked = true;
  }

  hideMe() {
    this.setState({ shower: false });
  }
  showMe() {
    this.setState({ shower: true });
  }

  changeHowTo(e) {
    console.log(e.target.checked);
    let checker = e.target.checked;
    axios
      .get(
        API_URL +
          "updateHowTo?uid=" +
          this.props.usr +
          "&myhowto=" +
          e.target.checked
      )
      .then(response => {
        console.log(response.data);
        //document.getElementById("masterElement").style.opacity = 0;
        this.setState({ showagain: checker });
      })
      .catch(err => {
        console.log("Fehler: ", err);
      });
  }

  render() {
    if (this.state.shower) {
      //document.getElementById("checkHowTo").checked = this.props.showagain;
      return (
        <div className="howTo" id="howTo" ref="howTo">
          <div className="billBoard">
            <h2 className="howtoHeader">How to use the pulse designer</h2>
            <div className="step">
              <div className="explainer">
                <p>1. Connect Devkit via usb with to your computer</p>
              </div>
              <div className="connectImage"></div>
            </div>
            <div className="step">
              <div className="browserSwitch"></div>
              <div className="explainer">
                <p>
                  2. If you don’t use google chrome open your audio system
                  preferences and select the pulse core dev kit as audio-output
                  device
                </p>
              </div>
            </div>
            <div className="buttonBar">
              <button onClick={this.hideMe}>Ok, got it</button>

              <label className="container">
                Show me when starting pulse designer
                <input
                  type="checkbox"
                  checked={this.state.showagain}
                  dafaultchecked={this.state.showagain.toString()}
                  id="checkHowTo"
                  ref="checkHowTo"
                  onChange={this.changeHowTo}
                ></input>
                <span className="checkmark"></span>
              </label>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="showButton" onClick={this.showMe}>
          <small>?</small>
        </div>
      );
    }
  }
}

export default Howto;
