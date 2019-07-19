import React, { Component } from 'react';
import './input_select.css';
import {Input, Label} from 'reactstrap';
//import { Button, ButtonGroup, Form, FormGroup, Label, Input, FormText  } from 'reactstrap';

class InputSelect extends Component{

    constructor(props){
      super(props);
      this.state ={
        value: this.props.myValue,
        type: 'sinus',
        duration: 1
      }
    }

    render(){
      //console.log(this.props.myValue);
      let range =[];
      //console.log(this.props.myValue);
      if(typeof this.props.range === 'number'){
        for (let i = this.props.step[0]; i <= this.props.range; i+=this.props.step[1]){
          let n;
          if(i%1!==0){
            n = i.toFixed(1);
          }else{
            n = parseInt(i);
          }
          if(!this.props.step[2]){
            range.push(<option key={i}>{n}</option>);
          }else{
            range.push(n)
          }
        }

        //console.log('step3',this.props.step[2]);

        if(this.props.step[2]){
          range.push(this.props.step[2].toFixed(2));

          if(this.props.range>this.props.step[2]){
                range.sort();
          }
          for(let i = 0; i < range.length; i++){
              range[i] = <option key={i}>{range[i]}</option>
          }
        }
      }else{
        for (let i = 0; i < this.props.range.length; i++){

            range.push(<option key={i+1}>{this.props.range[i]}</option>)
        }
      }

      if(this.props.name==='leftTopD'){
        //console.log('input: ',this.props.myValue);
      }

      return(
        <div className='myInput'>
          <Label for={this.props.name}>{this.props.label}</Label>
          <Input size="1" bsSize="lg" type="select" name={this.props.name} ref={this.props.name}  value={this.props.myValue} onChange={this.props.onchange} id={this.props.id}>
              {range}
          </Input>
        </div>
      )
    }

}


export default InputSelect;
