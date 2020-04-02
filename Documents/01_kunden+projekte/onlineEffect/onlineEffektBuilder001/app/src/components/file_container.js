import React, { Component } from "react";
import "./file_container.css";
import axios from "axios";
const API_URL = "http://localhost:9000/";

let player = require("../req/playSound");
let _ = require("lodash");
let beforeClasses = ["beforePrimitive", "beforeFile", "beforeDraw"];
let loadedData = [];
let loadCounter = 0;
class Filecontainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saved: false,
      curves: {},
      content: []
    };
    this.createContent = this.createContent.bind(this);
    this.playEffect = this.playEffect.bind(this);
    this.loadEffect = this.loadEffect.bind(this);
    this.collapseList = this.collapseList.bind(this);
    this.deselect = this.deselect.bind(this);
    this.callback = this.callback.bind(this);
    this.callback2 = this.callback2.bind(this);
    this.mylogout = this.mylogout.bind(this);
  }

  mylogout() {
    console.log("filecontainer says logout");
    loadedData = [];
  }

  createContent(e) {
    axios
      .get(API_URL + "getEffects")
      .then(response => {
        this.setState({ saved: e, content: response }, () => {
          loadCounter = 0;
          this.callback();
        });
      })
      .catch(err => {
        console.log("Fehler: ", err);
      });

    //console.log(this.state.content);

    if (e) {
    }
  }

  callback() {
    let checkLoad = [];
    let loadTotal = [];

    for (let i = 0; i < this.state.content.data.length; i++) {
      checkLoad.push(this.state.content.data[i].effectName);
    }

    loadTotal = _.difference(checkLoad, loadedData);

    //console.log(loadTotal);

    axios
      .get(
        API_URL +
          "updateUnloaded?toload=" +
          loadTotal +
          "&saved=" +
          this.state.saved
      )
      .then(response => {
        let myContent = this.state.content;

        for (let i = 0; i < loadTotal.length; i++) {
          let d = response.data.data[i];
          for (let ii = 0; ii < this.state.content.data.length; ii++) {
            if (this.state.content.data[ii].effectName === d.effectName) {
              //console.log(this.state.content.data[ii].effectName);
              this.state.content.data[ii].fileBuffer = d.fileBuffer;
              this.state.content.data[ii].curve = d.curve;
              this.state.content.data[ii].envCurve = d.envCurve;
            }
          }

          //  myCurves[d.effectName] = d;
        }

        this.setState({ content: myContent }, () => {
          this.callback2();
        });
      })
      .catch(err => {
        console.log("Fehler: ", err);
      });

    //console.log(this.state.content);

    loadedData = checkLoad;
  }

  callback2() {
    console.log(this.state.content);
  }
  componentDidMount() {
    this.createContent(false);
  }

  playEffect(e) {
    let i = parseInt(e.target.parentElement.getAttribute("index"));
    let mc = this.state.content.data[i];
    player.playSound(mc.curve, mc.duration);
  }

  deselect(e) {
    let listitems = document.getElementsByClassName("effectListItem");

    for (let o = 0; o < listitems.length; o++) {
      listitems[o].children[0].style.display = "inline";
      listitems[o].children[2].style.display = "inline";
      if (listitems[o].classList.length > 1) {
        if (listitems[o].classList[1] === "activeEffectListItem") {
          listitems[o].classList.remove("activeEffectListItem");
        } else {
          listitems[o].classList.remove("aboveActiveEffectListItem");
        }
      }
      if (e != "") {
        if (e.parentElement.previousSibling) {
          e.parentElement.previousSibling.classList.add(
            "aboveActiveEffectListItem"
          );
        }

        e.parentElement.children[0].style.display = "none";
        e.parentElement.children[2].style.display = "none";
        e.parentElement.style.justifyContent = "space-around";
        e.parentElement.classList.add("activeEffectListItem");

        this.props.switchToDownloadButton(true);
      } else {
        this.props.switchToDownloadButton(false);
      }
    }
  }

  loadEffect(e) {
    this.createContent(false);
    let i = parseInt(e.target.parentElement.getAttribute("index"));
    this.props.loadEffect(this.state.content.data[i], e.target);

    let listitems = document.getElementsByClassName("effectListItem");
    for (let o = 0; o < listitems.length; o++) {
      listitems[o].children[0].style.display = "inline";
      listitems[o].children[2].style.display = "inline";
      if (listitems[o].classList.length > 1) {
        if (listitems[o].classList[1] === "activeEffectListItem") {
          listitems[o].classList.remove("activeEffectListItem");
        } else {
          listitems[o].classList.remove("aboveActiveEffectListItem");
        }
      }
    }
    if (e.target.parentElement.previousSibling) {
      e.target.parentElement.previousSibling.classList.add(
        "aboveActiveEffectListItem"
      );
    }

    e.target.parentElement.children[0].style.display = "none";
    e.target.parentElement.children[2].style.display = "none";
    e.target.parentElement.style.justifyContent = "space-around";
    e.target.parentElement.classList.add("activeEffectListItem");
  }

  collapseList(e) {
    //console.log(e.target.parentElement.parentElement);
    let myList = document.getElementById(e.target.id + "List");
    let myListDisplay = myList.style.display;

    if (myListDisplay === "flex") {
      document.getElementById(e.target.id + "List").style.display = "none";
      e.target.classList.add("listExpand");
    } else {
      document.getElementById(e.target.id + "List").style.display = "flex";
      e.target.classList.remove("listExpand");
    }
  }

  render() {
    let sampleEffects = [];
    let allEffects = [];
    let myEffects = [];
    let topTenEffects = [];
    let topTenEffectsTitle = "Last Ten Effects";
    let content = this.state.content.data;
    if (content) {
      content.map((effect, index) => {
        let myDate = effect.timestamp.split("T");
        myDate[0] = myDate[0].split("-");
        myDate[0] = myDate[0][2] + "." + myDate[0][1] + "." + myDate[0][0];
        myDate[1] = myDate[1].substring(0, myDate[1].length - 5);
        myDate = myDate[0] + " | " + myDate[1];
        allEffects.unshift([
          effect.effectName,
          index,
          myDate,
          effect.userId,
          effect.type
        ]);
      });

      myEffects = allEffects.filter(effect => effect[3] === this.props.usr);
      if (allEffects.length < 10) {
        topTenEffectsTitle = "All Effects";
        topTenEffects = allEffects;
      } else {
        topTenEffects = allEffects.slice(
          allEffects.length - 11,
          allEffects.length
        );
      }
      let sampleMaskshaderMargin,
        myEffectMaskshaderMargin,
        topTenMaskshaderMargin;
      if (sampleEffects.length > 4) {
        sampleMaskshaderMargin = "17.9375rem";
      } else {
        sampleMaskshaderMargin = sampleEffects.length * 4 + "rem";
      }
      if (myEffects.length > 4) {
        myEffectMaskshaderMargin = "17.9375rem";
      } else {
        myEffectMaskshaderMargin = myEffects.length * 4 + "rem";
      }
      if (topTenEffects.length > 4) {
        topTenMaskshaderMargin = "17.9375rem";
      } else {
        topTenMaskshaderMargin = topTenEffects.length * 4 + "rem";
      }

      let myFirstElement;

      return (
        <div className="fileContainer">
          <div className="selectedEffects">
            <div className="effectListHeader">
              <h2>Sample Effects</h2>
              <div
                className="listCollapse"
                id="sampleEffect"
                onClick={this.collapseList}
              ></div>
            </div>
            <div
              className="effectList sampleEffects"
              style={{ display: "flex" }}
              id="sampleEffectList"
            >
              <div className="maskShader"></div>
            </div>
            <div className="effectListHeader">
              <h2>Your Effects</h2>
              <div
                className="listCollapse"
                id="userEffect"
                onClick={this.collapseList}
              ></div>
            </div>
            <div
              className="effectList userEffects"
              style={{ display: "flex" }}
              id="userEffectList"
            >
              {myEffects.map((myEffect, index) => {
                if (index === 0 && this.state.saved) {
                  console.log("gotIt");
                  return (
                    <div
                      className="effectListItem activeEffectListItem"
                      key={index}
                      style={{ justifyContent: "space-around" }}
                      index={myEffect[1]}
                      id={"myEffect_" + myEffect[1]}
                    >
                      <div
                        className="effectListItemTool effectListItemToolPlay"
                        style={{ display: "none" }}
                        onMouseDown={this.playEffect}
                      />
                      <div className="effectListItemLabel">
                        <p
                          className={
                            "effectTitle " +
                            beforeClasses[myEffect[myEffect.length - 1] - 1]
                          }
                        >
                          {myEffect[0]}
                        </p>
                        <small className="effectDate">{myEffect[2]}</small>
                      </div>
                      <div
                        className=" effectListItemTool effectListItemToolEdit"
                        style={{ display: "none" }}
                        onMouseDown={this.loadEffect}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div
                      className="effectListItem"
                      key={index}
                      index={myEffect[1]}
                      id={"myEffect_" + myEffect[1]}
                    >
                      <div
                        className="effectListItemTool effectListItemToolPlay"
                        onMouseDown={this.playEffect}
                      />
                      <div className="effectListItemLabel">
                        <p
                          className={
                            "effectTitle " +
                            beforeClasses[myEffect[myEffect.length - 1] - 1]
                          }
                        >
                          {myEffect[0]}
                        </p>
                        <small className="effectDate">{myEffect[2]}</small>
                      </div>
                      <div
                        className=" effectListItemTool effectListItemToolEdit"
                        onMouseDown={this.loadEffect}
                      />
                    </div>
                  );
                }
              })}
              <div
                className="maskShader"
                style={{ marginTop: myEffectMaskshaderMargin }}
              ></div>
            </div>
            <div className="effectListHeader">
              <h2> {topTenEffectsTitle}</h2>
              <div
                className="listCollapse"
                id="lastEffect"
                onClick={this.collapseList}
              ></div>
            </div>
            <div className="effectList lastEffects" id="lastEffectList">
              {topTenEffects.map((myEffect, index) => {
                return (
                  <div
                    className="effectListItem"
                    key={index}
                    index={myEffect[1]}
                    id={"topTenEffects_" + myEffect[1]}
                  >
                    <div
                      className="effectListItemTool effectListItemToolPlay"
                      onMouseDown={this.playEffect}
                    />
                    <div className="effectListItemLabel">
                      <p
                        className={
                          "effectTitle " +
                          beforeClasses[myEffect[myEffect.length - 1] - 1]
                        }
                      >
                        {myEffect[0]}
                      </p>
                      <small className="effectDate">{myEffect[2]}</small>
                    </div>

                    <div
                      className=" effectListItemTool effectListItemToolEdit"
                      onMouseDown={this.loadEffect}
                    />
                  </div>
                );
              })}
              <div
                className="maskShader"
                style={{ marginTop: topTenMaskshaderMargin }}
              ></div>
            </div>
          </div>
          <div className="allEffects">
            <h2>All Effects</h2>
          </div>
        </div>
      );
    } else {
      return <div>Content loading……</div>;
    }
  }
}

export default Filecontainer;
