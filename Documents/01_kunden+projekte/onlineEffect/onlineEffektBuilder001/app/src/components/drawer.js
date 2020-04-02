import React, { Component } from "react";
import "./drawer.css";
import { interpolateArray } from "../req/filebuffer";
import { envelopFunction } from "../req/calcEnvelopFunction";
import { envArray } from "../req/keyarrays";
import paper from "paper";
import _ from "lodash";

let path;
let handlePath;
let cleanedPath;
let coordinatePath;
let mousPos;
let currentTool = "drawer";
let handlerToDrag = false;
let mouseOffset;
let activeHandler;
let activeHandlebar = false;
let myKey = false;
let analyzerGroup = [];
let drawDirection;

let hitOptions = {
  segments: true,
  stroke: true,
  fill: true,
  tolerance: 5
};

class Drawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pathDrawer: false,
      handlers: [],
      myCurve: []
    };
    this.pathStart = this.pathStart.bind(this);
    this.pathDraw = this.pathDraw.bind(this);
    this.pathStop = this.pathStop.bind(this);
    this.selectTool = this.selectTool.bind(this);
    this.enterCanvas = this.enterCanvas.bind(this);
    this.leaveCanvas = this.leaveCanvas.bind(this);
    this.showHandlers = this.showHandlers.bind(this);
    this.enterHandler = this.enterHandler.bind(this);
    this.leaveHandler = this.leaveHandler.bind(this);
    this.startDragHandler = this.startDragHandler.bind(this);
    this.stopDragHandler = this.stopDragHandler.bind(this);
    this.showHandleBars = this.showHandleBars.bind(this);
    this.startDragHandleBar = this.startDragHandleBar.bind(this);
    this.stopDragHandleBar = this.stopDragHandleBar.bind(this);
    this.getKeyCode = this.getKeyCode.bind(this);
    this.forgetKeyCode = this.forgetKeyCode.bind(this);
    this.deselectHandler = this.deselectHandler.bind(this);
    this.hideHandlebars = this.hideHandlebars.bind(this);
    this.analyzePath = this.analyzePath.bind(this);
    this.showCleanedPath = this.showCleanedPath.bind(this);
    this.loadCurve = this.loadCurve.bind(this);
    this.myTimeout = this.myTimeout.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.getKeyCode);
    document.addEventListener("keyup", this.forgetKeyCode);
    paper.setup(this.refs["drawCanvas"]);

    for (let i = 0; i < 500; i++) {
      let newLine = new paper.Path();
      if (i % 2 === 0) {
        newLine.strokeColor = new paper.Color(1, 0, 0.5, 0);
      } else {
        newLine.strokeColor = new paper.Color(1, 0, 0.5, 0);
      }
      newLine.add(i + 0.5, 0);
      newLine.add(i + 0.5, 500);
      analyzerGroup.push(newLine);
    }

    cleanedPath = new paper.Path({
      segments: [],

      fillColor: "lightgrey",
      strokeWidth: 1,
      fullySelected: false
    });
    cleanedPath.fillColor.alpha = 0.5;

    coordinatePath = new paper.Path({
      segments: [],
      strokeColor: "darkgrey",
      strokeWidth: 2,
      fullySelected: false
    });
    coordinatePath.add([0, 250]);
    coordinatePath.add([500, 250]);

    path = new paper.Path({
      segments: [],
      strokeColor: "black",
      strokeWidth: 1.5,
      fullySelected: false
    });

    handlePath = new paper.Path({
      segments: [],
      strokeColor: "rgb(25, 15, 140)",
      strokeWidth: 1,
      fullySelected: false
    });
  }

  posTools(x) {
    setTimeout(
      function() {
        document.getElementById("toolBar").style.marginLeft = 1 + x + "rem";
      }.bind(this),
      100
    );
    // setTimeout(this.myTimeout(x), 50000);
  }

  myTimeout(x) {
    console.log("timeout", document.getElementById("toolBar").style.marginLeft);
    document.getElementById("toolBar").style.marginLeft = 8 + x + "rem";
  }

  pathStart(e) {
    let boundTop = e.target.getBoundingClientRect();
    let hitPoint = [e.clientX - boundTop.x, e.clientY - boundTop.y];

    let hitResult = paper.project.hitTest(hitPoint, hitOptions);

    if (currentTool === "drawer") {
      cleanedPath.segments = [];
      document.getElementById("pointer").style.display = "none";
      document.getElementById("editors").style.display = "none";
      path.segments = [[e.clientX - boundTop.x, 250]];
      this.setState({ pathDrawer: true });
      if (path) {
        path.selected = false;
      }
    } else if (currentTool === "pointer") {
      let allHandlers = document.getElementsByClassName("pathHandler");
      for (let i = 0; i < allHandlers.length; i++) {
        allHandlers[i].classList.remove("pathHandlerActive");
        handlePath.removeSegments(0, 2);
        document.getElementById("handleBarGroup").style.display = "none";
      }
    } else if (currentTool === "deleter") {
      if (path) {
        if (hitResult) {
          path.insert(hitResult.location.index + 1, hitPoint);
        }
      }
      this.showCleanedPath();
    } else if (currentTool === "curver") {
    }

    this.showHandlers();
  }

  pathDraw(e) {
    let bound = e.target.getBoundingClientRect();
    if (this.state.pathDrawer) {
      path.add([e.clientX - bound.x, e.clientY - bound.y]);
    }

    if (handlerToDrag && currentTool === "pointer") {
      handlerToDrag.style.top = e.clientY - mouseOffset[1] - bound.y + "px";
      handlerToDrag.style.left = e.clientX - mouseOffset[0] - bound.x + "px";
      let handlerId = parseInt(handlerToDrag.id);
      path.segments[handlerId].point.x =
        e.clientX - mouseOffset[0] - bound.x + 5;
      path.segments[handlerId].point.y =
        e.clientY - mouseOffset[0] - bound.y + 5;

      this.handleBarPos(e, handlerId, bound);
      this.showCleanedPath();
    }

    if (activeHandlebar) {
      activeHandlebar.style.top = e.clientY - mouseOffset[1] - bound.y + "px";
      activeHandlebar.style.left = e.clientX - mouseOffset[0] - bound.x + "px";

      let xx =
        activeHandlebar.getBoundingClientRect().left -
        activeHandler.getBoundingClientRect().left;
      let yy =
        activeHandlebar.getBoundingClientRect().top -
        activeHandler.getBoundingClientRect().top;

      let id = parseInt(activeHandler.id);
      path.segments[id][activeHandlebar.id].x = xx;
      path.segments[id][activeHandlebar.id].y = yy;
      this.handleBarPos(activeHandler, parseInt(activeHandler.id), bound);
    }
  }

  handleBarPos(e, handlerId, bound) {
    document.getElementById("handleIn").style.top =
      e.clientY +
      path.segments[handlerId].handleIn.y -
      mouseOffset[1] -
      bound.y +
      "px";
    document.getElementById("handleIn").style.left =
      e.clientX +
      path.segments[handlerId].handleIn.x -
      mouseOffset[0] -
      bound.x +
      "px";
    document.getElementById("handleOut").style.top =
      e.clientY +
      path.segments[handlerId].handleOut.y -
      mouseOffset[1] -
      bound.y +
      "px";
    document.getElementById("handleOut").style.left =
      e.clientX +
      path.segments[handlerId].handleOut.x -
      mouseOffset[0] -
      bound.x +
      "px";

    if (handlePath.segments.length === 0) {
      // handlePath.add(e.clientX +  path.segments[handlerId].handleIn.x - mouseOffset[0]-bound.x,e.clientY +  path.segments[handlerId].handleIn.y - mouseOffset[1]-bound.y);
      //handlePath.add(0,0);
      handlePath.add(
        e.clientX +
          path.segments[handlerId].handleIn.x -
          mouseOffset[0] -
          bound.x +
          5,
        e.clientY +
          path.segments[handlerId].handleIn.y -
          mouseOffset[1] -
          bound.y +
          5
      );
      handlePath.add(
        path.segments[handlerId].point.x,
        path.segments[handlerId].point.y
      );
      handlePath.add(
        e.clientX +
          path.segments[handlerId].handleOut.x -
          mouseOffset[0] -
          bound.x +
          5,
        e.clientY +
          path.segments[handlerId].handleOut.y -
          mouseOffset[1] -
          bound.y +
          5
      );
    } else {
      //console.log(handlePath);

      handlePath.segments[0].point.x =
        document.getElementById("handleIn").getBoundingClientRect().left -
        bound.x +
        5;
      handlePath.segments[0].point.y =
        document.getElementById("handleIn").getBoundingClientRect().top -
        bound.y +
        5;

      handlePath.segments[1].point.x =
        activeHandler.getBoundingClientRect().left - bound.x + 5;
      handlePath.segments[1].point.y =
        activeHandler.getBoundingClientRect().top - bound.y + 5;

      handlePath.segments[2].point.x =
        document.getElementById("handleOut").getBoundingClientRect().left -
        bound.x +
        5;
      handlePath.segments[2].point.y =
        document.getElementById("handleOut").getBoundingClientRect().top -
        bound.y +
        5;
    }
    this.showCleanedPath();
  }

  pathStop() {
    if (currentTool === "drawer") {
      this.setState({ pathDrawer: false });
      this.analyzePath();
      path.simplify(100);
      this.showCleanedPath();
      handlerToDrag = false;
      let segmentsLength = path.segments.length;
      let lastX = path.segments[segmentsLength - 1].point.x;
      if (path.segments[0].point.x <= lastX) {
        drawDirection = "right";
        path.insert(0, new paper.Point(0, 250));
        path.insert(segmentsLength + 1, new paper.Point(lastX, 250));
        path.insert(segmentsLength + 2, new paper.Point(500, 250));
      } else {
        drawDirection = "left";
        path.insert(segmentsLength + 1, new paper.Point(lastX, 250));
        path.insert(segmentsLength + 2, new paper.Point(0, 250));
        // path.insert(0,new paper.Point(lastX,250));
        path.insert(0, new paper.Point(500, 250));
      }
      document.getElementById("pointer").style.display = "inline";
      document.getElementById("editors").style.display = "flex";
    } else {
      document.getElementById("handleIn").classList.remove("pathHandlerActive");
      document
        .getElementById("handleOut")
        .classList.remove("pathHandlerActive");
      document.getElementById("handleBarGroup").style.display = "none";
    }
  }

  analyzePath() {
    // let falsePoints = [];
    // cleanedPath.segments = [];
    let mc = 1;
    while (mc < path.segments.length) {
      if (drawDirection === "right") {
        if (path.segments[mc].point._x - path.segments[mc - 1].point._x >= 0) {
          mc++;
        } else {
          path.removeSegment(mc);
        }
      } else {
        if (path.segments[mc].point._x - path.segments[mc - 1].point._x <= 0) {
          mc++;
        } else {
          path.removeSegment(mc);
        }
      }
    }
  }

  showCleanedPath() {
    cleanedPath.segments = [];
    // 	cleanedPath.segments = path.segments;
    // console.log(cleanedPath);
    let cleanedPathPoints = [0];
    cleanedPath.add(0, 250);
    for (let i = 0; i < analyzerGroup.length; i++) {
      let secondPath = analyzerGroup[i];
      let intersect = secondPath.getIntersections(path);
      if (intersect.length === 0) {
        cleanedPathPoints.push(0);
        cleanedPath.add(i, 250);
      } else {
        // 		cleanedPath.add(intersect)
        let myPx = intersect[0]._point.x;
        let myPy = intersect[0]._point.y;

        cleanedPathPoints.push((250 - myPy) / 250);
        //console.log(intersect[0]._point);
        cleanedPath.add(myPx, myPy);
      }
    }
    cleanedPathPoints.push(0);

    //this.setState({myCurve:cleanedPathPoints});
    this.props.myCurve({
      bufferCurve: cleanedPathPoints,
      drawPath: path
    });
    cleanedPath.add(500, 250);
  }

  deselectHandler() {
    this.refs["pathHandlers"].style.display = "none";

    this.hideHandlebars();
  }

  hideHandlebars() {
    if (handlePath.segments.length !== 0) {
      let allHandlers = document.getElementsByClassName("pathHandler");
      for (let i = 0; i < allHandlers.length; i++) {
        allHandlers[i].classList.remove("pathHandlerActive");
      }
      //handlePath.removeSegments(0,2);

      handlePath.segments[0].point = handlePath.segments[1].point = handlePath.segments[2].point = {
        _x: 0,
        _y: 0
      };
      //console.log(handlePath.segments[0].point, handlePath.segments[1].point, handlePath.segments[2].point);
      document.getElementById("handleBarGroup").style.display = "none";
    }
  }

  selectTool(e) {
    let cl = e.target.classList;
    let tdivs = document.getElementsByClassName("tool");
    let canv = document.getElementById("drawCanvas");
    //	console.log(canv.style.cursor);
    canv.classList.remove(canv.classList[1]);

    if (!_.includes(cl, "activeTool")) {
      for (let i = 0; i < tdivs.length; i++) {
        tdivs[i].classList.remove("activeTool");
      }
      e.target.classList.add("activeTool");
      currentTool = e.target.id;
      switch (currentTool) {
        case "drawer":
          canv.classList.add("cursorPencil");
          this.deselectHandler();
          //console.log(canv.classList);

          //canv.style.cursor = "url('../assets/icons_pencilCursor.cur'),auto"
          break;
        case "pointer":
          this.hideHandlebars();
          canv.classList.add("cursorPointer");
          if (path) {
            this.showHandlers();
          }
          this.refs["pathHandlers"].style.display = "inline";

          //canv.style.cursor = "url('../assets/icons_pointerCursor.cur'),auto"
          break;
        case "deleter":
          canv.classList.add("cursorAdder");
          this.hideHandlebars();
          if (path) {
            this.showHandlers();
          }
          this.refs["pathHandlers"].style.display = "inline";
          break;
        case "curver":
          canv.classList.add("cursorCurver");
          this.hideHandlebars();
          if (path) {
            this.showHandlers();
          }
          this.refs["pathHandlers"].style.display = "inline";
          break;
      }
    }
  }

  showHandlers() {
    let cursorClass = "pathHandler ";
    if (currentTool !== "deleter") {
      cursorClass += document.getElementById("drawCanvas").classList[1];
    } else {
      cursorClass += "cursorDeleter";
    }
    //console.log(cursorClass);

    if (path) {
      let segments = path.segments;
      let handlers = [];
      segments.map((segment, index) => {
        if (index > 0 && index < path.segments.length - 1) {
          handlers.push(
            <div
              className={cursorClass}
              key={index}
              id={index}
              style={{
                top: segment._point._y - 5 + "px",
                left: segment._point._x - 5 + "px"
              }}
              onMouseEnter={this.enterHandler}
              onMouseOut={this.leaveHandler}
              onMouseDown={this.startDragHandler}
              onMouseUp={this.stopDragHandler}
            ></div>
          );
        }
      });
      this.setState({ handlers: handlers });
    }
  }

  showHandleBars(e) {
    if (
      path.segments[e.target.id]._handleIn._x !== 0 ||
      path.segments[e.target.id]._handleOut._x !== 0 ||
      path.segments[e.target.id]._handleIn._y !== 0 ||
      path.segments[e.target.id]._handleOut._y !== 0
    ) {
      path.segments[e.target.id]._handleIn._x = 0;
      path.segments[e.target.id]._handleOut._x = 0;
      path.segments[e.target.id]._handleIn._y = 0;
      path.segments[e.target.id]._handleOut._y = 0;
    } else {
      path.segments[e.target.id]._handleIn._x = -30;
      path.segments[e.target.id]._handleOut._x = 30;
      document.getElementById("handleBarGroup").style.display = "inline";
    }
    this.handleBarPos(
      e,
      e.target.id,
      document.getElementById("drawCanvas").getBoundingClientRect()
    );

    this.showHandlers();
  }

  getKeyCode(e) {
    myKey = e.keyCode;
  }

  forgetKeyCode() {
    myKey = false;
  }

  startDragHandler(e) {
    let handlerId = parseInt(e.target.id);
    let bound = e.target.getBoundingClientRect();
    mouseOffset = [e.clientX - bound.x, e.clientY - bound.y];
    handlerToDrag = e.target;
    if (activeHandler !== e.target) {
      activeHandler = e.target;
    }
    let allHandlers = document.getElementsByClassName("pathHandler");
    for (let i = 0; i < allHandlers.length; i++) {
      allHandlers[i].classList.remove("pathHandlerActive");
    }
    handlerToDrag.classList.add("pathHandlerActive");

    if (currentTool === "pointer") {
      document.getElementById("handleBarGroup").style.display = "inline";
      handlePath.segments = [];
      this.handleBarPos(
        e,
        handlerId,
        document.getElementById("drawCanvas").getBoundingClientRect()
      );
    } else if (currentTool === "curver") {
      this.showHandleBars(e);
      this.handleBarPos(
        e,
        handlerId,
        document.getElementById("drawCanvas").getBoundingClientRect()
      );
    } else if (currentTool === "deleter") {
      //console.log(e.target.id);
      path.removeSegment(parseInt(e.target.id));
      handlerToDrag.classList.remove("pathHandlerActive");
      activeHandler = false;
      handlerToDrag = false;
      this.showHandlers();
    }
    this.showCleanedPath();
  }

  stopDragHandler() {
    handlerToDrag = false;
  }

  enterHandler(e) {}

  leaveHandler(e) {}

  startDragHandleBar(e) {
    let bound = e.target.getBoundingClientRect();
    mouseOffset = [e.clientX - bound.x, e.clientY - bound.y];
    e.target.classList.add("pathHandlerActive");
    activeHandlebar = e.target;
  }

  stopDragHandleBar(e) {
    e.target.classList.remove("pathHandlerActive");
    activeHandlebar = false;
  }

  enterCanvas() {
    //console.log('enter');
  }

  leaveCanvas() {
    this.setState({ pathDrawer: false });
  }

  loadCurve(data) {
    // path;
    // path = new paper.Path(data.drawPath[1]);
    cleanedPath.segments = path.segments = [];
    document.getElementById("pointer").style.display = "inline";
    document.getElementById("editors").style.display = "inline";

    for (let i = 0; i < data.drawPath[1].segments.length; i++) {
      let ii = data.drawPath[1].segments[i];
      if (ii.length === 2) {
        path.add(ii[0], ii[1]);
      } else {
        let p = new paper.Point(ii[0][0], ii[0][1]);
        let hI = new paper.Point(ii[1][0], ii[1][1]);
        let hO = new paper.Point(ii[2][0], ii[2][1]);
        path.add(new paper.Segment(p, hI, hO));
      }
    }
    this.showCleanedPath();
    this.deselectHandler();

    let tdivs = document.getElementsByClassName("tool");
    let canv = document.getElementById("drawCanvas");
    canv.classList.remove(canv.classList[1]);
    canv.classList.add("cursorPencil");

    for (let i = 0; i < tdivs.length; i++) {
      tdivs[i].classList.remove("activeTool");
    }
    document.getElementById("drawer").classList.add("activeTool");
    currentTool = "drawer";
  }

  render() {
    let myHandlers = this.state.handlers; //showHandlers();
    let myHandleBars = (
      <div>
        <div
          className="pathHandler handleBar"
          id="handleOut"
          onMouseDown={this.startDragHandleBar}
          onMouseUp={this.stopDragHandleBar}
        ></div>
        <div
          className="pathHandler handleBar"
          id="handleIn"
          onMouseDown={this.startDragHandleBar}
          onMouseUp={this.stopDragHandleBar}
        ></div>
      </div>
    );

    return (
      <div className="drawer">
        <canvas
          className="drawCanvas cursorPencil"
          id="drawCanvas"
          ref="drawCanvas"
          onMouseDown={this.pathStart}
          onMouseMove={this.pathDraw}
          onMouseUp={this.pathStop}
          onMouseEnter={this.enterCanvas}
          onMouseOut={this.leaveCanvas}
          width="500"
          height="500"
        ></canvas>
        <div className="pathHandlers" ref="pathHandlers">
          <div className="handleBarGroup" id="handleBarGroup">
            {myHandleBars}
          </div>
          {myHandlers}
        </div>
        <div className="toolBarWrapper">
          <div className="toolBar" id="toolBar">
            <div
              className="tool pencil activeTool"
              id="drawer"
              onMouseDown={this.selectTool}
            ></div>
            <div
              className="tool pointer"
              id="pointer"
              onMouseDown={this.selectTool}
            ></div>
            <div className="editors" id="editors">
              <div
                className="tool curver"
                id="curver"
                onMouseDown={this.selectTool}
              ></div>
              <div
                className="tool deleter"
                id="deleter"
                onMouseDown={this.selectTool}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Drawer;
