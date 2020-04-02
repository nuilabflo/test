import React, { Component } from "react";
import "./saveConsole.css";
import axios from "axios";
const API_URL = "http://localhost:9000/";

class Saveconsole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      effectName: "",
      effectTags: []
    };

    this.InputChange = this.InputChange.bind(this);
    this.SaveEffect = this.SaveEffect.bind(this);
    this.cancelSaveEffect = this.cancelSaveEffect.bind(this);
  }

  componentDidMount() {}

  InputChange(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  SaveEffect() {
    let dataToSave = this.props.saveData;
    dataToSave.effectName = this.state.effectName;
    dataToSave.effectTags = this.state.effectTags;
    // let time = new Date();
    // let offT = time.getTimezoneOffset();
    //console.log(offT);
    dataToSave.timestamp = Date.now();
    axios
      .post(API_URL + "saveEffect", dataToSave)
      .then(response => {
        if (!response.data.success) {
          alert(response.data.message);
        } else {
          this.props.closeSaveConsole(true);
        }
      })
      .catch(err => {
        console.log("Error: ", err);
      });
  }

  cancelSaveEffect() {
    this.props.closeSaveConsole(false);
  }

  render() {
    // const effectTags = "";
    // this.state.effectTags.map(tag => {
    //   console.log(tag);
    // });
    return (
      <div className="saveConsole">
        <div className="saveForm" id="saveEffect">
          <h2 className="saveHead">Save Effect as</h2>
          <input
            className="nameInput logInInput"
            type="text"
            placeholder="Effect Name"
            value={this.state.effectName}
            id="effectName"
            onChange={this.InputChange}
          />
          <input
            className="tagInput logInInput"
            type="text"
            placeholder="Tags (comma seperated)"
            value={this.state.effectTags}
            id="effectTags"
            onChange={this.InputChange}
          />
          <div className="buttonBar">
            <input
              className="submitSave submitLogin"
              type="button"
              value="Cancel"
              name="saveButton"
              id="signin"
              onClick={this.cancelSaveEffect}
            />
            <input
              className="submitSave submitLogin"
              type="button"
              value="Save Effect"
              name="saveButton"
              id="signin"
              onClick={this.SaveEffect}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Saveconsole;
