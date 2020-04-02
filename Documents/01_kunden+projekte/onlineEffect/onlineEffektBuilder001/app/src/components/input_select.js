import React, { Component } from "react";
import "./input_select.css";
import { Input, Label } from "reactstrap";
//import { Button, ButtonGroup, Form, FormGroup, Label, Input, FormText  } from 'reactstrap';

class InputSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.myValue,
      type: "sinus",
      duration: 1
    };
  }

  render() {
    //console.log(this.props.myValue);
    let range = [];

    if (typeof this.props.range === "number") {
      for (
        let i = this.props.step[0];
        i <= this.props.range;
        i += this.props.step[1]
      ) {
        let n;
        if (i % 1 !== 0) {
          n = i.toFixed(1);
        } else {
          //n = parseFloat(i);
          n = i;
        }
        if (!this.props.step[2]) {
          range.push(<option key={i}>{n}</option>);
          // + " " + this.props.label
        } else {
          range.push(n);
        }
      }

      //console.log('step3',this.props.step[2]);

      if (this.props.step[2]) {
        range.push(this.props.step[2].toFixed(2));

        if (this.props.range > this.props.step[2]) {
          range.sort();
        }
        for (let i = 0; i < range.length; i++) {
          range[i] = <option key={i}>{range[i]}</option>;
        }
      }
    } else {
      for (let i = 0; i < this.props.range.length; i++) {
        range.push(<option key={i + 1}>{this.props.range[i]}</option>);
      }
    }

    // let valueWithoutLabel;

    // if (splitter.length > 0) {
    //   valueWithoutLabel = e.target.value + " " + splitter;
    //   valueWithoutLabel = valueWithoutLabel.slice(
    //     0,
    //     valueWithoutLabel.length - splitter.length
    //   );
    //   //console.log(testValue, splitter.length);
    // } else {
    //   valueWithoutLabel = e.target.value;
    // }

    // let splitter = e.target.getAttribute("label");
    let v = this.props.myValue;
    if (this.props.name === "leftTopD" || this.props.name === "rightTopD") {
      v = v.toFixed(1);
    }

    let myInput;
    if (this.props.disabled) {
      myInput = (
        <Input
          size="1"
          bsSize="lg"
          type="select"
          name={this.props.name}
          ref={this.props.name}
          label={this.props.label}
          value={v}
          onChange={this.props.onchange}
          onClick={this.props.onclick}
          id={this.props.id}
          disabled
        >
          {range}
        </Input>
      );
    } else {
      myInput = (
        <Input
          size="1"
          bsSize="lg"
          type="select"
          name={this.props.name}
          ref={this.props.name}
          label={this.props.label}
          value={v}
          onChange={this.props.onchange}
          onClick={this.props.onclick}
          id={this.props.id}
        >
          {range}
        </Input>
      );
    }

    return (
      <div className="myInput">
        {myInput}
        <Label className="inputLabel" for={this.props.name}>
          {this.props.label}
        </Label>
      </div>
    );
  }
}

export default InputSelect;
// <Label for={this.props.name}>{this.props.label}</Label>
