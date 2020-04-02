import React, { Component } from "react";
import "./grid_element.css";
import { interpolateArray } from "../req/filebuffer";
import { envelopFunction } from "../req/calcEnvelopFunction";
import { envArray } from "../req/keyarrays";

import _ from "lodash";

class GridElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myCurve: this.props.myCurve,
      envelop: this.props.envelop,
      envelopCurve: this.props.envleopCurve,
      c: this.refs["myCanvas"]
    };
    this.getCurve = this.getCurve.bind(this);
    this.click = this.click.bind(this);
    this.playSound = this.playSound.bind(this);
  }

  componentDidMount() {
    this.getCurve();
  }

  getCurve() {
    let xx;
    let yy;
    let envCurve;
    let c = this.refs["myCanvas"];
    let ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);

    if (this.props.envelop) {
      envCurve = envArray(this.props.envelop.slice(0, 6))[0];
      let border = 500; //this.state.envelop[1].left;//envArray(this.state.envelop.slice(0,5))[1]

      ctx.strokeStyle = "rgb(47, 20, 255)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(this.props.envelop[0].left, this.props.envelop[0].top);

      xx = this.props.envelop[0].left;
      yy = this.props.envelop[0].top;

      for (let i = 0; i < envCurve.length; i++) {
        yy = envCurve[i];
        ctx.lineTo(xx + 4, yy);
        xx += border / envCurve.length;
      }

      ctx.stroke();
    }

    xx = 0;
    yy = 250;

    ctx.strokeStyle = "darkgrey";
    ctx.lineWidth = 2;
    ctx.beginPath();

    ctx.moveTo(0, 250);
    ctx.lineTo(500, 250);
    ctx.stroke();
    if (this.props.myCurve) {
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1.125;
      ctx.beginPath();
      ctx.moveTo(0, 250);
      let myCurve = this.props.myCurve;

      for (let i = 0; i < myCurve.length; i++) {
        yy = 250 + myCurve[i] * 250;
        ctx.lineTo(xx, yy);
        xx += 500 / myCurve.length;
      }
      ctx.stroke();
    }
  }

  audioCtx = new window.AudioContext();

  playSound(mc, t) {
    let newBuffer = interpolateArray(mc, this.audioCtx.sampleRate * t);

    let myArrayBuffer = this.audioCtx.createBuffer(
      2,
      this.audioCtx.sampleRate * t,
      this.audioCtx.sampleRate
    );
    for (var channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
      var nowBuffering = myArrayBuffer.getChannelData(channel);
      for (var i = 0; i < myArrayBuffer.length; i++) {
        nowBuffering[i] = newBuffer[i]; //Math.random() * 2 - 1;
      }
    }
    var source = this.audioCtx.createBufferSource();
    source.buffer = myArrayBuffer;
    source.connect(this.audioCtx.destination);
    source.start();
  }

  click(e) {
    //console.log(this.props.time);
    //this.playSound(this.props.myCurve,this.props.time)
  }

  activeHandler = undefined;
  mouseOffset = [0, 0];

  c = this.props;

  render() {
    let envelopCanvas;

    // if(this.props.envelop){

    envelopCanvas = (
      <div className="envelopelement">
        <canvas className="eCanvas" ref="myECanvas" width={500} height={501} />
      </div>
    );

    return (
      <div className="curveCanvas" ref="curveCanvas" onClick={this.click}>
        <canvas className="canvas" ref="myCanvas" width={500} height={501} />
        {envelopCanvas}
      </div>
    );
  }
}

export default GridElement;
