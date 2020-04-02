import React, { Component } from "react";
import "./master-element.css";
import Filecontainer from "./file_container";
import InputSelect from "./input_select";
import GridElement from "./grid_element";
import Drawer from "./drawer";
import UserArea from "./userArea";
import Saveconsole from "./saveConsole";
import Howto from "./howTo";
import { Button } from "reactstrap";

import _ from "lodash";
import { interpolateArray } from "../req/filebuffer";
import axios from "axios";
const API_URL = "http://localhost:9000/";

const keyArrays = require("../req/keyarrays");
const calcArrays = require("../req/calculateArray");
let player = require("../req/playSound");
let typeArray = ["sinus", "rect", "saw", "triangle"];
let mousePos = [];

const resetContent = {
  file: { leftTopT: undefined, rightTopT: undefined },
  fileBuffer: { leftTopT: undefined, rightTopT: undefined },
  filetime: [undefined, undefined],
  columns: 1,
  transformation: "Frameperframe",
  rows: 3,
  leftTopHz: 50,
  rightTopHz: 70,
  leftTopT: "sinus",
  rightTopT: "rect",
  leftTopD: 0.1,
  rightTopD: 0.1,
  durations: { leftTopT: 0.1, rightTopT: 0.1 },
  envelopLeft: [
    { left: -4, top: -4 },
    { left: 96, top: -4 },
    { left: 196, top: -4 },
    { left: 296, top: -4 },
    { left: 396, top: -4 },
    { left: 496, top: -4 },
    "left"
  ],
  envelopRight: [
    { left: -4, top: -4 },
    { left: 21, top: -4 },
    { left: 46, top: -4 },
    { left: 71, top: -4 },
    { left: 96, top: -4 },
    "right"
  ],
  envelopBases: { envelopLeft: 0, envelopRight: 0 },
  envelopArrays: { left: undefined, right: undefined }
};

class MasterElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 1,
      drawerCurve: [],
      content: {
        file: { leftTopT: undefined, rightTopT: undefined },
        fileBuffer: { leftTopT: undefined, rightTopT: undefined },
        filetime: [undefined, undefined],
        columns: 1,
        transformation: "Frameperframe",
        rows: 3,
        leftTopHz: 50,
        rightTopHz: 70,
        leftTopT: "sinus",
        rightTopT: "rect",
        leftTopD: 0.1,
        rightTopD: 0.1,
        durations: { leftTopT: 0.1, rightTopT: 0.1 },
        envelopLeft: [
          { left: -4, top: -4 },
          { left: 96, top: -4 },
          { left: 196, top: -4 },
          { left: 296, top: -4 },
          { left: 396, top: -4 },
          { left: 496, top: -4 },
          "left"
        ],
        envelopRight: [
          { left: -4, top: -4 },
          { left: 21, top: -4 },
          { left: 46, top: -4 },
          { left: 71, top: -4 },
          { left: 96, top: -4 },
          "right"
        ],
        envelopBases: { envelopLeft: 0, envelopRight: 0 },
        envelopArrays: { left: undefined, right: undefined },
        tempValues: {
          primitives: {
            d: 0.1,
            t: "sinus",
            f: 50,
            e: [
              { left: -4, top: -4 },
              { left: 96, top: -4 },
              { left: 196, top: -4 },
              { left: 296, top: -4 },
              { left: 396, top: -4 },
              { left: 496, top: -4 },
              "left"
            ],
            eb: 0,
            ea: undefined,
            sf: ""
          },
          files: {
            d: 0.1,
            file: undefined,
            fileBuffer: undefined,
            e: [
              { left: -4, top: -4 },
              { left: 96, top: -4 },
              { left: 196, top: -4 },
              { left: 296, top: -4 },
              { left: 396, top: -4 },
              { left: 496, top: -4 },
              "left"
            ],
            eb: 0,
            ea: undefined,
            sf: ""
          },
          draws: {
            d: 0.1,
            sf: ""
          }
        }
      },
      database: [],
      databaseSound: [],
      saveValue: "",
      embeddedSound: [],
      saveMode: false,
      dataToSave: {},
      updateContent: false
      //embeddedSounds:{l:undefined,}
    };
    this.change = this.change.bind(this);
    this.getFileInfo = this.getFileInfo.bind(this);
    this.startDragHandler = this.startDragHandler.bind(this);
    this.dragDragHandler = this.dragDragHandler.bind(this);
    this.stopDragHandler = this.stopDragHandler.bind(this);
    this.handleConsoleChange = this.handleConsoleChange.bind(this);
    this.handleConsoleSubmit = this.handleConsoleSubmit.bind(this);
    this.embedSound = this.embedSound.bind(this);
    this.fileButtonClick = this.fileButtonClick.bind(this);
    this.inputClick = this.inputClick.bind(this);
    this.rangeChange = this.rangeChange.bind(this);
    this.getSound = this.getSound.bind(this);
    this.getDrawerData = this.getDrawerData.bind(this);
    this.saveSound = this.saveSound.bind(this);
    this.closeSaveConsole = this.closeSaveConsole.bind(this);
    this.loadEffect = this.loadEffect.bind(this);
    this.switchToDownloadButton = this.switchToDownloadButton.bind(this);
    this.mylogout = this.mylogout.bind(this);
  }

  componentDidMount() {}

  mylogout() {
    this.refs["fileContainer"].mylogout();
  }

  currentInput;

  change(e) {
    this.refs["fileContainer"].deselect("");
    this.currentInput = e.target.name;
    let newContent = this.state.content;
    let newValue;

    if (Number(e.target.value)) {
      newValue = Number(e.target.value);
    } else if (typeArray.includes(e.target.value)) {
      newValue = e.target.value;

      if (newContent.file.leftTopT !== undefined) {
        newContent.leftTopD = 0.1;
      }
    }

    newContent[e.target.name] = newValue;
    // newContent.file.leftTopT = undefined;
    // newContent.fileBuffer.leftTopT = undefined;

    if (e.target.name === "leftTopT") {
      newContent.filetime[0] = undefined;

      //  ;
      newContent.envelopBases.envelopLeft = 0;

      let embedded = this.state.databaseSound.find(myset => {
        return myset.soundName === e.target.value;
      });
      if (embedded) {
        //setAttribute("disabled", "disabled")
        newContent.envelopBases.envelopLeft = embedded.envBase;
        newContent.leftTopD = embedded.duration;
        newContent.filetime[0] = embedded.duration;
        newContent.file.leftTopT = newValue;
      }
    }
    switch (parseInt(this.state.type)) {
      case 1:
        newContent.tempValues.primitives.d = newContent.leftTopD;
        newContent.tempValues.primitives.t = newContent.leftTopT;
        newContent.tempValues.primitives.f = newContent.leftTopHz;
        newContent.tempValues.primitives.e = newContent.envelopLeft;
        newContent.tempValues.primitives.ea = newContent.envelopArrays.left;
        newContent.tempValues.primitives.eb =
          newContent.envelopBases.envelopLeft;
        newContent.tempValues.primitives.sf = "";
        break;
      case 2:
        newContent.tempValues.files.d = newContent.leftTopD;
        newContent.tempValues.files.file = newContent.file.leftTopT;
        newContent.tempValues.files.fileBuffer = newContent.fileBuffer.leftTopT;
        newContent.tempValues.files.e = newContent.envelopLeft;
        newContent.tempValues.files.ea = newContent.envelopArrays.left;
        newContent.tempValues.files.eb = newContent.envelopBases.envelopLeft;
        newContent.tempValues.files.sf = "";
        break;
      case 3:
        newContent.tempValues.draws.d = newContent.leftTopD;
        newContent.tempValues.primitives.file = "";
        break;
    }

    this.setState(
      {
        content: newContent
      },
      () => {
        this.callback();
      }
    );

    if (newValue === "file") {
      document.getElementById("myFileInput").click();
    }
  }

  rangeChange(e) {
    let t;
    t = this.refs["ranger"].value;
    let mc = this.state.content;

    this.setState({ type: t }, () => {
      this.callback();
    });

    document.getElementById("rangeCurve").classList.remove("rangeActive");
    document.getElementById("rangeFile").classList.remove("rangeActive");
    document.getElementById("rangeShape").classList.remove("rangeActive");
    document.getElementById("curveSub").classList.remove("activeSub");
    document.getElementById("fileSub").classList.remove("activeSub");
    document.getElementById("shapeSub").classList.remove("activeSub");

    switch (t) {
      case "1":
        document.getElementById("rangeCurve").classList.add("rangeActive");
        document.getElementById("curveSub").style.marginLeft = "0px";
        document.getElementById("curveSub").classList.add("activeSub");

        document.getElementById("drawerBox").style.display = "none";
        document.getElementById("gridelements").style.display = "inline";

        mc.leftTopD = mc.tempValues.primitives.d;
        mc.leftTopT = mc.tempValues.primitives.t;
        mc.leftTopHz = mc.tempValues.primitives.f;
        mc.envelopLeft = mc.tempValues.primitives.e;
        mc.envelopBases.envelopLeft = mc.tempValues.primitives.eb;
        //  mc.envelopArrays.left = mc.tempValues.primitives.ea;

        mc.envelopArrays.left = keyArrays.envArray(
          mc.tempValues.primitives.e.slice(0, 6)
        );

        this.setState({ content: mc }, () => {
          this.callback();
        });
        this.refs["drawer"].posTools(36.25);
        this.refs["fileContainer"].deselect(mc.tempValues.primitives.sf);
        break;
      case "2":
        document.getElementById("rangeFile").classList.add("rangeActive");
        document.getElementById("curveSub").style.marginLeft = "-21.75rem";
        document.getElementById("fileSub").classList.add("activeSub");

        document.getElementById("drawerBox").style.display = "none";
        document.getElementById("gridelements").style.display = "inline";
        mc.leftTopT = "file";
        mc.leftTopD = mc.tempValues.files.d;
        mc.file.leftTopT = mc.tempValues.files.file;
        mc.fileBuffer.leftTopT = mc.tempValues.files.fileBuffer;
        mc.envelopLeft = mc.tempValues.files.e;
        mc.envelopBases.envelopLeft = mc.tempValues.files.eb;
        //  mc.envelopArrays.left = mc.tempValues.files.ea;

        mc.envelopArrays.left = keyArrays.envArray(
          mc.tempValues.files.e.slice(0, 6)
        );

        this.setState({ content: mc }, () => {
          this.callback();
        });

        if (e && !this.state.content.fileBuffer.leftTopT) {
          this.fileButtonClick();
        }
        this.refs["drawer"].posTools(14.5);
        this.refs["fileContainer"].deselect(mc.tempValues.files.sf);
        break;
      case "3":
        document.getElementById("rangeShape").classList.add("rangeActive");
        document.getElementById("curveSub").style.marginLeft = "-36.25rem";
        document.getElementById("shapeSub").classList.add("activeSub");

        document.getElementById("drawerBox").style.display = "inline";
        document.getElementById("gridelements").style.display = "none";

        this.refs["drawer"].posTools(0);

        mc.leftTopD = mc.tempValues.draws.d;

        this.setState({ content: mc }, () => {
          this.callback();
        });
        this.refs["fileContainer"].deselect(mc.tempValues.files.sf);
        break;
      default:

      ///
    }
  }

  fileButtonClick(e) {
    //leftTopT
    this.currentInput = "leftTopT";
    let mc = this.state.content;
    mc["leftTopT"] = "file";

    document.getElementById("myFileInput").click();
    this.setState({ content: mc }, () => {
      this.callback();
    });
  }

  callback() {
    let myValue = this.state.content.leftTopD;

    if (myValue.toString().length > 3) {
      myValue = myValue.toFixed(2);
    } else {
      myValue = myValue.toFixed(1);
    }
    myValue.toString();

    for (let i = 1; i <= this.state.content.columns; i++) {
      this.refs["GridElement" + i].getCurve();
    }
  }

  getFileInfo(e) {
    if (e.target.files[0]) {
      let myFiles = this.state.content;
      myFiles.file.leftTopT = undefined;
      myFiles.file.rightTopT = undefined;
      myFiles.file[this.currentInput] = e.target.files[0];
      myFiles.tempValues.files.file = e.target.files[0];

      this.setState({ content: myFiles });
      let file = e.target.files[0];
      let reader = new FileReader();
      let that = this;
      reader.onload = function(event) {
        let audioCtx = new AudioContext();

        audioCtx.decodeAudioData(event.target.result).then(function(buffer) {
          let dd = buffer.length / audioCtx.sampleRate;
          let finalBuffer = interpolateArray(buffer.getChannelData(0), 50000);

          let cc = _.zipWith(finalBuffer, finalBuffer => {
            return finalBuffer * -1;
          });

          let newContent = that.state.content;
          newContent.fileBuffer[that.currentInput] = cc;
          newContent.tempValues.files.fileBuffer = cc;
          let envBorder = Math.max(
            Math.abs(Math.min(...newContent.fileBuffer[that.currentInput])),
            Math.max(...newContent.fileBuffer[that.currentInput])
          );

          envBorder = 250 - envBorder * 250;

          console.log(envBorder);
          //let envBorder = 1;
          let envDirection;
          if (that.currentInput === "leftTopT") {
            newContent.leftTopD = dd;
            newContent.filetime[0] = dd;
            newContent.tempValues.files.d = dd;
            envDirection = "envelopLeft";
          } else {
            newContent.rightTopD = dd;
            newContent.filetime[1] = dd;
            newContent.tempValues.files.d = dd;
            envDirection = "envelopRight";
          }
          for (let i = 0; i <= newContent[envDirection].length - 1; i++) {
            let xx = newContent[envDirection][i].left;
            newContent[envDirection][i] = { left: xx, top: envBorder - 4 };

            newContent.envelopBases[envDirection] = envBorder - 4;
          }
          newContent.envelopArrays.left = keyArrays.envArray(
            newContent.envelopLeft.slice(0, 6)
          );

          newContent.tempValues.files.eb = newContent.envelopBases.envelopLeft;

          that.setState({ content: newContent }, () => {
            that.callback();
          });
          //that.embedSound(that.currentInput, soundName, dd);
        });
      };

      reader.readAsArrayBuffer(file);
    }
    let soundName = "test";
    //prompt("Please enter a name for the embedded sound", "my sound");
    //  this.embedSound(this.currentInput,soundName);
  }

  embedSound(side, name, duration) {
    let body = {};
    body.soundName = name;
    body.fileBuffer = this.state.content.fileBuffer[side];
    body.duration = duration;
    if (side === "leftTopT") {
      body.envBase = this.state.content.envelopBases.envelopLeft;
    } else {
      body.envBase = this.state.content.envelopBases.envelopRight;
    }
  }

  getDrawerData(myCurve) {
    this.setState({ drawerCurve: myCurve }, () => {
      this.callback();
    });
  }

  getSound() {
    let mc;
    if (parseInt(this.state.type) < 3) {
      mc = this.refs["GridElement1"].props.myCurve;
    } else {
      mc = this.state.drawerCurve.bufferCurve;
    }

    player.playSound(mc, this.state.content.leftTopD);
  }

  saveSound(e) {
    document.getElementById("saveConsoleWrapper").style.display = "inline";
    let mc;
    if (parseInt(this.state.type) < 3) {
      mc = this.refs["GridElement1"].props.myCurve;
    } else {
      mc = this.state.drawerCurve;
    }

    let mycontent = this.state.dataToSave;

    mycontent = {
      userId: this.props.usr,
      type: this.state.type,
      file: this.state.content.file.leftTopT,
      fileBuffer: this.state.content.fileBuffer.leftTopT,
      curveType: this.state.content.leftTopT,
      curveFrequency: this.state.content.leftTopHz,
      curve: mc,
      duration: this.state.content.leftTopD,
      envBase: this.state.content.envelopBases.envelopLeft,
      envPoints: this.state.content.envelopLeft,
      envCurve: keyArrays.envArray(this.state.content.envelopLeft.slice(0, 6)),
      drawerCurve: this.state.drawerCurve
    };

    this.setState({ dataToSave: mycontent }, () => {
      this.callback();
    });
  }

  closeSaveConsole(e) {
    this.refs["fileContainer"].createContent(e);
    document.getElementById("saveConsoleWrapper").style.display = "none";
  }

  activHandler = undefined;
  activBounding = undefined;
  mouseOffset = [];

  startDragHandler(e) {
    let myBound = e.target.getBoundingClientRect();
    this.mouseOffset = [e.clientX - myBound.x, e.clientY - myBound.y];
    this.activHandler = e.target;
    this.activBounding = e.target.parentElement;
  }

  dragDragHandler(e) {
    mousePos = [e.clientX, e.clientY];

    if (this.activHandler) {
      this.refs["fileContainer"].deselect("");
      let id = this.activHandler.id;
      let index = Number(id.substring(id.length - 2, id.length));
      let parent = this.activBounding;
      let parentIndex = Number(
        parent.id.substring(parent.id.length - 2, parent.id.length)
      );
      let bounds = parent.getBoundingClientRect();

      let myContent = this.state.content;
      let myEnvelop;

      if (parentIndex === 1) {
        myEnvelop = myContent.envelopLeft;
      } else {
        myEnvelop = myContent.envelopRight;
      }

      //////////

      let xx;
      if (index !== 1 && index !== 6) {
        if (
          e.clientX - bounds.x - this.mouseOffset[0] >=
            myEnvelop[index - 2].left &&
          e.clientX - bounds.x - this.mouseOffset[0] <= myEnvelop[index].left
        ) {
          xx = e.clientX - bounds.x - this.mouseOffset[0];
        } else if (
          e.clientX - bounds.x - this.mouseOffset[0] <
          myEnvelop[index - 2].left + 8
        ) {
          xx = myEnvelop[index - 2].left;
        } else {
          xx = myEnvelop[index].left;
        }
      } else {
        xx = myEnvelop[index - 1].left;
      }

      let yy;

      if (
        e.clientY - bounds.y - this.mouseOffset[1] >= -4 &&
        e.clientY - bounds.y - this.mouseOffset[1] <= 246
      ) {
        yy = e.clientY - bounds.y - this.mouseOffset[1];
      } else if (e.clientY - bounds.y - this.mouseOffset[1] < -4) {
        yy = -4;
      } else {
        yy = 246;
      }

      /////////

      let envCurve;

      if (parentIndex === 1) {
        myContent.envelopLeft[index - 1] = { left: xx, top: yy };
        myContent.envelopArrays.left = keyArrays.envArray(
          myContent.envelopLeft.slice(0, 6)
        );
        myContent.envelopArrays.right = keyArrays.envArray(
          myContent.envelopRight.slice(0, 6)
        );
      } else {
        myContent.envelopRight[index - 1] = { left: xx, top: yy };
        myContent.envelopArrays.right = keyArrays.envArray(
          myContent.envelopRight.slice(0, 5)
        );
        myContent.envelopArrays.left = keyArrays.envArray(
          myContent.envelopLeft.slice(0, 5)
        );
      }

      switch (parseInt(this.state.type)) {
        case 1:
          myContent.tempValues.primitives.sf = "";
          break;
        case 2:
          myContent.tempValues.files.sf = "";
          break;
        case 3:
          myContent.tempValues.primitives.file = "";
          break;
      }

      this.setState({ content: myContent }, () => {
        this.callback();
      });
    }
  }

  stopDragHandler(e) {
    this.activHandler = undefined;
  }

  handleConsoleChange(event) {
    this.setState({ saveValue: event.target.value });
  }

  handleConsoleSubmit(event) {
    event.preventDefault();
    let body = {};
    let matrixContent = Object.assign({}, this.state.content);
    let fileBufferContent = Object.assign({}, this.state.content.fileBuffer);
    delete matrixContent.fileBuffer;
    delete matrixContent.envelopArrays;

    matrixContent.envelopArrays = { left: undefined, right: undefined };
    matrixContent.fileBuffer = { left: undefined, right: undefined };
    body.matrixContent = JSON.stringify(matrixContent);

    body.fileBufferLeft = fileBufferContent.leftTopT;

    body.matrixName = this.state.saveValue;
    axios
      .post(API_URL + "newMatrix", body)
      .then(response => {
        alert(response.data.message);
      })
      .catch(err => {
        console.log("Fehler: ", err);
      });

    this.refs["fileConsoleContent"].style.width = "0";
    this.refs["fileConsoleButton"].style.display = "block";
    this.refs["fileSaveButton"].style.display = "block";
  }

  inputClick(e) {}

  switchToDownloadButton(download) {
    if (download) {
      document.getElementById("saveButton").style.display = "none";
      document.getElementById("downloadButton").style.display = "flex";
    } else {
      document.getElementById("saveButton").style.display = "flex";
      document.getElementById("downloadButton").style.display = "none";
    }
  }

  loadEffect(data, selected) {
    document.getElementById("saveButton").style.display = "none";
    document.getElementById("downloadButton").style.display = "flex";

    let myStatesContent = this.state.content;

    myStatesContent.file.leftTopT = data.file;
    myStatesContent.fileBuffer.leftTopT = data.fileBuffer;
    myStatesContent.leftTopT = data.curveType;
    myStatesContent.leftTopHz = data.curveFrequency;
    myStatesContent.leftTopD = data.duration;
    myStatesContent.envelopArrays.left = keyArrays.envArray(
      data.envPoints.slice(0, 6)
    );
    myStatesContent.envelopBases.envelopLeft = data.envBase;
    myStatesContent.envelopLeft = data.envPoints;

    //myStates.drawerCurve = data.drawerCurve;

    //this.refs["ranger"].value = data.Type;

    switch (data.type) {
      case 1:
        myStatesContent.tempValues.primitives.d = data.duration;
        myStatesContent.tempValues.primitives.t = data.curveType;
        myStatesContent.tempValues.primitives.f = data.curveFrequency;
        myStatesContent.tempValues.primitives.e = data.envPoints;
        myStatesContent.tempValues.primitives.eb = data.envBase;
        myStatesContent.tempValues.primitives.ea = keyArrays.envArray(
          data.envPoints.slice(0, 6)
        );
        myStatesContent.tempValues.primitives.sf = selected;
        break;
      case 2:
        myStatesContent.tempValues.files.d = data.duration;
        myStatesContent.tempValues.files.file = data.file;
        myStatesContent.tempValues.files.fileBuffer = data.fileBuffer;
        myStatesContent.tempValues.files.e = data.envPoints;
        myStatesContent.tempValues.files.eb = data.envBase;
        myStatesContent.tempValues.files.ea = keyArrays.envArray(
          data.envPoints.slice(0, 6)
        );
        myStatesContent.tempValues.files.sf = selected;
        break;

      case 3:
        myStatesContent.tempValues.draws.d = data.duration;
        this.refs["drawer"].loadCurve(data.drawerCurve);
        myStatesContent.tempValues.draws.sf = selected;
        break;
    }

    // type:data.type,
    // drawerCurve:data.drawerCurve
    this.setState(
      {
        type: data.type,
        drawerCurve: data.drawerCurve,
        content: myStatesContent
      },
      () => {
        this.callback();
      }
    );

    //console.log("check2: ", data.envPoints, this.state.content.envelopLeft);
    this.refs["ranger"].value = data.type;
    this.rangeChange();
  }

  render() {
    //console.log("check3: ", this.state.content.envelopLeft);

    let myCurves = [];
    let ltt = this.state.content.leftTopT;
    let lthz = this.state.content.leftTopHz * this.state.content.leftTopD;
    let ltfb = this.state.content.fileBuffer.leftTopT;
    let ltd = this.state.content.leftTopD;
    let mcl = keyArrays.getKeyArray(ltt, lthz, [1, 1], ltfb);
    let newMcl = [];
    let envBL = 0;

    let mySoundData = this.state.databaseSound;
    let mySoundDataDurations = [];

    mySoundData.map(data => {
      mySoundDataDurations.push(data.duration);
      if (typeof mcl[0] === "string" && data.soundName === mcl[0]) {
        mcl = data.fileBuffer;
      }
    });

    let maxDuration = Math.floor(Math.max(...mySoundDataDurations)) + 1.0;

    if (this.state.content.envelopArrays.left) {
      for (let i = 0; i < mcl.length; i++) {
        let er = this.state.content.envelopArrays.left[0];
        let f =
          (250 - er[i]) / (250 - this.state.content.envelopBases.envelopLeft);

        newMcl[i] = mcl[i] * f;
      }
    }

    let grid = [];
    grid.length = this.state.content.columns;

    let env = "";
    let ec = undefined;
    for (let i = 1; i <= this.state.content.columns; i++) {
      let cc, tt, envelopValues;
      if (i === 1 && mcl.length >= 50000) {
        if (newMcl.length > 0) {
          cc = newMcl;
        } else {
          cc = mcl;
        }
        tt = ltd;
        envelopValues = this.state.content.envelopLeft;
        // onClick={this.click}
        env = (
          <div className="envelopCanvas" id="envelopCanvas01">
            <canvas
              className="eCanvas"
              ref="myECanvas"
              width={500}
              height={501}
            />
            <div
              className="handle"
              id="handle01"
              style={this.state.content.envelopLeft[0]}
              onMouseDown={this.startDragHandler}
            ></div>
            <div
              className="handle"
              id="handle02"
              style={this.state.content.envelopLeft[1]}
              onMouseDown={this.startDragHandler}
            ></div>
            <div
              className="handle"
              id="handle03"
              style={this.state.content.envelopLeft[2]}
              onMouseDown={this.startDragHandler}
            ></div>
            <div
              className="handle"
              id="handle04"
              style={this.state.content.envelopLeft[3]}
              onMouseDown={this.startDragHandler}
            ></div>
            <div
              className="handle"
              id="handle05"
              style={this.state.content.envelopLeft[4]}
              onMouseDown={this.startDragHandler}
            ></div>
            <div
              className="handle"
              id="handle06"
              style={this.state.content.envelopLeft[5]}
              onMouseDown={this.startDragHandler}
            ></div>
          </div>
        );
      }

      let myc = (
        <div className="gridElement" key={i}>
          <GridElement
            key={i}
            ref={"GridElement" + i}
            myCurve={cc}
            time={tt}
            envelop={envelopValues}
          />
          {env}
        </div>
      );

      grid[i] = myc;
    }

    let { database } = this.state;
    let consoleContent = [];

    // console.log(this.props.howto);
    //
    // if (this.props.howto) {
    //   console.log(this.refs["howToWrapper"]);
    //
    //   this.refs["howToWrapper"].style.display = "flex";
    // }

    return (
      <div
        className="wrapper"
        id="wrapper"
        ref="wrapper"
        onMouseMove={this.dragDragHandler}
        onMouseUp={this.stopDragHandler}
      >
        <div className="fileConsole">
          <Filecontainer
            ref="fileContainer"
            id="fileContainer"
            updateContent={this.state.updateContent}
            switchToDownloadButton={this.switchToDownloadButton}
            loadEffect={this.loadEffect}
            usr={this.props.usr}
          />
        </div>
        <div className="grid">
          <div className="typeSelect">
            <div className="rangeLabels">
              <input
                className="ranger"
                id="ranger"
                ref="ranger"
                type="range"
                min="1"
                max="3"
                value={this.state.type}
                onChange={this.rangeChange}
              ></input>
              <div className="rangeButton curve rangeActive" id="rangeCurve">
                Curve
              </div>
              <div className="rangeButton file" id="rangeFile">
                File
              </div>
              <div className="rangeButton shape" id="rangeShape">
                Draw
              </div>
            </div>
          </div>
          <div className="editorTools">
            <div className="inputWrapper">
              <div className="topInput">
                <div id="curveSub" className="subElement activeSub">
                  <InputSelect
                    name="leftTopD"
                    range={3.0}
                    step={[0.1, 0.1, this.state.content.filetime[0]]}
                    label="sec"
                    onchange={this.change}
                    myValue={this.state.content.leftTopD}
                    id="leftTopD"
                  />
                  <InputSelect
                    name="leftTopHz"
                    range={300}
                    step={[5, 5]}
                    label="Hz"
                    onchange={this.change}
                    myValue={this.state.content.leftTopHz}
                  />
                  <InputSelect
                    name="leftTopT"
                    range={typeArray}
                    label="type"
                    onchange={this.change}
                    onclick={this.inputClick}
                    myValue={this.state.content.leftTopT}
                  />
                </div>
                <div id="fileSub" className="subElement">
                  <InputSelect
                    name="leftTopD"
                    range={3.0}
                    step={[0.1, 0.1, this.state.content.filetime[0]]}
                    label="sec"
                    onchange={this.change}
                    myValue={this.state.content.leftTopD}
                    id="leftTopD"
                  />
                  <button name="leftTopT" onClick={this.fileButtonClick}>
                    load File
                  </button>
                </div>
                <div id="shapeSub" className="subElement">
                  <InputSelect
                    name="leftTopD"
                    range={3.0}
                    step={[0.1, 0.1, this.state.content.filetime[0]]}
                    label="sec"
                    onchange={this.change}
                    myValue={this.state.content.leftTopD}
                    id="leftTopD"
                  />
                </div>
              </div>
            </div>
            <div
              className="effectConsoleButton"
              id="saveButton"
              onClick={this.saveSound}
            >
              save
            </div>
            <div
              className="effectConsoleButton"
              id="downloadButton"
              onClick={this.saveSound}
            >
              download
            </div>
          </div>
          <div className="yAxis">
            <small>1</small>
            <small>0</small>
            <small>-1</small>
          </div>
          <div className="gridelements" id="gridelements">
            {grid}
          </div>
          <div className="drawerBox" id="drawerBox">
            <Drawer
              ref="drawer"
              preset=""
              myCurve={this.getDrawerData}
              mousePos={mousePos}
            />
          </div>

          <input
            className="myFileInput"
            type="file"
            id="myFileInput"
            name="avatar"
            accept="audio/mpeg, audio/wav, audio/m4a"
            onInput={this.getFileInfo}
          />
        </div>
        <div className="effectConsole">
          <div className="playConsole" id="playConsole">
            <div
              className="effectConsoleButton"
              id="playButton"
              onClick={this.getSound}
            ></div>
          </div>
        </div>
        <div className="saveConsoleWrapper" id="saveConsoleWrapper">
          <Saveconsole
            saveData={this.state.dataToSave}
            closeSaveConsole={this.closeSaveConsole}
          />
        </div>
        <div className="howToWrapper" ref="howToWrapper">
          <Howto showagain={this.props.howto} usr={this.props.usr} />
        </div>
      </div>
    );
  }
}

export default MasterElement;
