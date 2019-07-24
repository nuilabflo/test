import React, { Component } from 'react';
import './master-element.css';
import InputSelect from './input_select'
import GridElement from './grid_element'
import _ from 'lodash';
import {interpolateArray} from '../req/filebuffer';
import axios from 'axios';
const API_URL = 'http://localhost:9000/';

const keyArrays = require('../req/keyarrays');
const calcArrays = require('../req/calculateArray');
let typeArray =['sinus','rect','saw','triangle','file'];

class MasterElement extends Component{

    constructor(props){
      super(props);
      this.state ={
        content:{
          file:{leftTopT:undefined,rightTopT:undefined},
          fileBuffer:{leftTopT:undefined,rightTopT:undefined},
          filetime:[undefined,undefined],
          columns:3,
          transformation:'Frameperframe',
          rows:3,
          leftTopHz:50,
          rightTopHz:70,
          leftTopT:'sinus',
          rightTopT:'rect',
          leftTopD: 0.1,
          rightTopD:0.1,
          durations:{leftTopT:0.1,rightTopT:0.1},
          envelopLeft: [{left:-4,top:-4},{left:21,top:-4},{left:46,top:-4},{left:71,top:-4},{left:96,top:-4},'left'],
          envelopRight: [{left:-4,top:-4},{left:21,top:-4},{left:46,top:-4},{left:71,top:-4},{left:96,top:-4},'right'],
          envelopBases:{envelopLeft:0,envelopRight:0},
          envelopArrays: {left: undefined, right: undefined},

        },
        database: [],
        databaseSound:[],
        consoleSwitch:'',
        saveValue:'',
        embeddedSound:[]
        //embeddedSounds:{l:undefined,}
      }
      this.change = this.change.bind(this);
      this.getFileInfo = this.getFileInfo.bind(this);
      this.startDragHandler= this.startDragHandler.bind(this);
      this.dragDragHandler = this.dragDragHandler.bind(this);
      this.stopDragHandler = this.stopDragHandler.bind(this);
      this.openFileConsole = this.openFileConsole.bind(this);
      this.closeFileConsole = this.closeFileConsole.bind(this);
      this.getData=this.getData.bind(this);
      this.handleConsoleChange =this.handleConsoleChange.bind(this);
      this.handleConsoleSubmit = this.handleConsoleSubmit.bind(this);
      this.getDataBaseContent = this.getDataBaseContent.bind(this);
      this.embedSound = this.embedSound.bind(this);
    }

    componentDidMount(){
      this.getDataBaseContent();
    }

    getDataBaseContent(){
      axios.get(API_URL+'getMatrices')
      .then(response =>{
        this.setState({database:response.data});
      })
      .catch(err=>{
        console.log('Fehler: ' ,err);
      });

      axios.get(API_URL+'getEmbeddedSounds')
      .then(response =>{
        response.data.map(soundname=>typeArray.push(soundname.soundName));
        this.setState({databaseSound:response.data});
      })
      .catch(err=>{
        console.log('Fehler: ' ,err);
      });
    }


    currentInput;
    change(e){
      this.currentInput = e.target.name;
      let newContent = this.state.content;
      let newValue;

      if(Number(e.target.value)){
        newValue = Number(e.target.value);
      }else if(typeArray.includes(e.target.value)){
        newValue = e.target.value;
      }

      newContent[e.target.name] = newValue;
      if(e.target.name === 'leftTopT'){
        newContent.file.leftTopT = undefined;
        newContent.fileBuffer.leftTopT = undefined;
        newContent.filetime[0] = undefined;
        newContent.leftTopD = 0.1;
        newContent.envelopBases.envelopLeft=0;
        let embedded = this.state.databaseSound.find(myset=>{return myset.soundName == e.target.value})
        if(embedded){
         newContent.envelopBases.envelopLeft=embedded.envBase;
        }
      }
      if(e.target.name === 'rightTopT'){
        newContent.file.rightTopT = undefined;
        newContent.fileBuffer.rightTopT = undefined
        newContent.filetime[1] = undefined;
        newContent.rightTopD = 0.1;
        newContent.envelopBases.envelopRight=0;
      }

      //console.log(this.state.databaseSound.find(myset=>{return myset.soundName == e.target.value}));

      this.setState({
        content: newContent
      }, () => {this.callback();})
      console.log('env: ',this.state.content.envelopBases,"arrays:", this.state.content.envelopArrays);

      if(newValue ==='file'){
        document.getElementById('myFileInput').click();
      }

    }

    callback(){
      let myValue = this.state.content.leftTopD

      if(myValue.toString().length>3){
          myValue = myValue.toFixed(2);
      }else{
          myValue = myValue.toFixed(1)
      }
      myValue.toString();

      document.getElementById('leftTopD').value = myValue
      for(let i =1;i<= this.state.content.columns;i++){
        this.refs['GridElement' + i].getCurve()
      }
    }


    getFileInfo(e){



      if(e.target.files[0]){
        let myFiles = this.state.content;
        myFiles.file.leftTopT = undefined;
        myFiles.file.rightTopT = undefined
        myFiles.file[this.currentInput] = e.target.files[0]


        this.setState({content: myFiles});
        let file = e.target.files[0];
        let reader = new FileReader();
        let that = this;
        reader.onload = function(event) {

          let audioCtx = new (AudioContext)();

          audioCtx.decodeAudioData(event.target.result).then(function(buffer) {
            let dd = buffer.length/audioCtx.sampleRate;
            let finalBuffer = interpolateArray(buffer.getChannelData(0),10000);
            let newContent = that.state.content;
            newContent.fileBuffer[that.currentInput] = finalBuffer;
            let envBorder = Math.max(Math.abs(Math.min(...newContent.fileBuffer[that.currentInput])),Math.max(...newContent.fileBuffer[that.currentInput]));
            envBorder = 50-(envBorder*50);
            let envDirection;
            if(that.currentInput==='leftTopT'){
              newContent.leftTopD = dd;
              newContent.filetime[0] = dd;
              envDirection = 'envelopLeft';
            }else{
              newContent.rightTopD = dd;
              newContent.filetime[1] = dd;
              envDirection = 'envelopRight';
            };
            for(let i = 0; i<=newContent[envDirection].length-1;i++){

               let xx = newContent[envDirection][i].left;
               newContent[envDirection][i]= {left: xx, top: envBorder-4}

               newContent.envelopBases[envDirection] = envBorder-4;

            }

            that.setState({content: newContent}, () => {that.callback();});
            that.embedSound(that.currentInput,soundName,dd);
          })
        };

        reader.readAsArrayBuffer(file);
      }
      let soundName = prompt("Please enter a name for the embedded sound", "my sound");
    //  this.embedSound(this.currentInput,soundName);

    }


    embedSound(side,name,duration){
      let body = {}
      body.soundName = name;
      body.fileBuffer = this.state.content.fileBuffer[side];
      body.duration = duration
      if(side === 'leftTopT'){
        body.envBase = this.state.content.envelopBases.envelopLeft;
      }else{
        body.envBase = this.state.content.envelopBases.envelopRight;
      }

      // axios.post('http://localhost:9000/newEmbeddedSound',)
      axios.post(API_URL+'newEmbeddedSound',body).then(response =>{

        alert(response.data.message)
      })
      .catch(err=>{
        console.log('Fehler: ' ,err);
      })
    }


    activHandler=undefined;
    activBounding=undefined;
    mouseOffset=[]


    startDragHandler(e){
      let myBound = e.target.getBoundingClientRect();
      this.mouseOffset = [e.clientX-myBound.x, e.clientY-myBound.y]
      this.activHandler = e.target;
      this.activBounding = e.target.parentElement
    }

    dragDragHandler(e){

        if(this.activHandler){
          let id = this.activHandler.id;
          let index = Number(id.substring(id.length-2,id.length));
          let parent = this.activBounding;
          let parentIndex = Number(parent.id.substring(parent.id.length-2,parent.id.length));
          let bounds = parent.getBoundingClientRect()

          let myContent = this.state.content;
          let myEnvelop

          if(parentIndex ===1){
            myEnvelop = myContent.envelopLeft
          } else{
            myEnvelop = myContent.envelopRight
          }

          //////////

          let xx
          if(index !== 1 && index !==5){
            if(e.clientX - bounds.x-this.mouseOffset[0]>= myEnvelop[index-2].left && e.clientX - bounds.x-this.mouseOffset[0]<=myEnvelop[index].left){
              xx = e.clientX - bounds.x-this.mouseOffset[0];
            }else if(e.clientX - bounds.x-this.mouseOffset[0] < myEnvelop[index-2].left+8 ){
              xx = myEnvelop[index-2].left;
            }else{
              xx = myEnvelop[index].left;
            }
          }else{
            xx = myEnvelop[index-1].left;
          }

          let yy

          if(e.clientY - bounds.y-this.mouseOffset[1]>= -4 && e.clientY - bounds.y-this.mouseOffset[1]<=46){
            yy = e.clientY - bounds.y-this.mouseOffset[1];
          }else if(e.clientY - bounds.y-this.mouseOffset[1] < -4 ){
            yy = -4;
          }else{
            yy = 46;
          }

          /////////

          let envCurve;
          if(parentIndex ===1){
            myContent.envelopLeft[index-1] = {left:xx, top:yy};
            myContent.envelopArrays.left = keyArrays.envArray(myContent.envelopLeft.slice(0,5));
            myContent.envelopArrays.right = keyArrays.envArray(myContent.envelopRight.slice(0,5));
          } else{
            myContent.envelopRight[index-1] = {left:xx, top:yy};
            myContent.envelopArrays.right = keyArrays.envArray(myContent.envelopRight.slice(0,5));
            myContent.envelopArrays.left = keyArrays.envArray(myContent.envelopLeft.slice(0,5));
          }

          this.setState({content:myContent}, () => {this.callback();})

        }
    }

    stopDragHandler(e){
        this.activHandler=undefined;
    }

    openFileConsole(e){
      this.refs['fileConsoleContent'].style.width='20%';
      this.refs['fileConsoleButton'].style.display='none';
      this.refs['fileSaveButton'].style.display='none';
      this.refs['fileConsoleCloseButton'].style.display='block';
      if(e.target.id === 'open'){
        this.getDataBaseContent();
        this.setState({consoleSwitch: "open"})
      }else{
        this.setState({consoleSwitch: "save"})
      }
    }

    closeFileConsole(e){
      this.refs['fileConsoleContent'].style.width='0';
      this.refs['fileConsoleButton'].style.display='block';
      this.refs['fileSaveButton'].style.display='block';
    }

    getData(e){
      axios.get(API_URL+'getMatrix?key=matrixName&value='+e.target.id)
      .then(response =>{
        let myContent = JSON.parse(response.data[0].matrixContent);

        myContent.envelopArrays.left = keyArrays.envArray(myContent.envelopLeft.slice(0,5));
        myContent.envelopArrays.right = keyArrays.envArray(myContent.envelopRight.slice(0,5));

        myContent.fileBuffer.leftTopT = response.data[0].fileBufferLeft;
        myContent.fileBuffer.rightTopT = response.data[0].fileBufferRight;
        this.setState({content:myContent},() => {this.callback();})
      })
      .catch(err=>{
        console.log('Fehler: ', err);
      });
    }


    handleConsoleChange(event) {
      this.setState({saveValue: event.target.value});
    }

    handleConsoleSubmit(event) {
      event.preventDefault();
      let body = {};
      let matrixContent = Object.assign({}, this.state.content);
      let fileBufferContent = Object.assign({}, this.state.content.fileBuffer);
      delete matrixContent.fileBuffer;
      delete matrixContent.envelopArrays;

      matrixContent.envelopArrays = {left:undefined,right:undefined};
      matrixContent.fileBuffer = {left:undefined,right:undefined};
      body.matrixContent = JSON.stringify(matrixContent);

      body.fileBufferLeft = fileBufferContent.leftTopT;

      body.matrixName = this.state.saveValue;
      axios.post(API_URL+'newMatrix',body).then(response =>{
        alert(response.data.message)
      })
      .catch(err=>{
        console.log('Fehler: ' ,err);
      })

      this.refs['fileConsoleContent'].style.width='0';
      this.refs['fileConsoleButton'].style.display='block';
      this.refs['fileSaveButton'].style.display='block';
    }



    render(){
      let myCurves =[]
      let ltt = this.state.content.leftTopT;
      let lthz= this.state.content.leftTopHz*this.state.content.leftTopD;
      let ltfb = this.state.content.fileBuffer.leftTopT;
      let ltd = this.state.content.leftTopD;
      let mcl = keyArrays.getKeyArray(ltt,lthz,[1,1],ltfb);
      let newMcl=[];
      let envBL = 0;

      let rtt = this.state.content.rightTopT;
      let rthz= this.state.content.rightTopHz*this.state.content.rightTopD;
      let rtfb = this.state.content.fileBuffer.rightTopT;
      let rtd = this.state.content.rightTopD;
      let mcr = keyArrays.getKeyArray(rtt,rthz,[1,1],rtfb);
      let newMcr=[];


      if(typeof mcl[0] === 'string'){

          let mySoundData = this.state.databaseSound;

          mySoundData.map(data=>{
            if(data.soundName === mcl[0]){
              ltd = data.duration;

              return mcl = data.fileBuffer;
            }
          })

      }

      if(this.state.content.envelopArrays.left){
            for(let i=0; i <mcl.length;i++){
               let er = this.state.content.envelopArrays.left[0];
               let f = (50-er[i])/(50-this.state.content.envelopBases.envelopLeft);
               newMcl[i] = mcl[i]*f;
            }
      }
      if(this.state.content.envelopArrays.right){
          for(let i=0; i <mcr.length;i++){
            let er = this.state.content.envelopArrays.right[0];
            let f = (50-er[i])/(50-this.state.content.envelopBases.envelopRight);
            newMcr[i] = mcr[i]*f;
          }
      }


      let grid = [];
      grid.length = this.state.content.columns;

      let env = '';
      let ec = undefined;
      for(let i =1; i<= this.state.content.columns; i++){
        let cc,tt,envelopValues;
        if(i ===1 && mcl.length >= 10000){
          if(newMcl.length>0){
          cc = newMcl;
        }else{
          cc = mcl
        }
          tt = ltd;
          envelopValues =this.state.content.envelopLeft;
          // onClick={this.click}
          env = <div className='envelopCanvas' id='envelopCanvas01' >
            <canvas className='eCanvas' ref='myECanvas' width={100} height={101}/>
            <div className='handle' id='handle01' style={this.state.content.envelopLeft[0]} onMouseDown={this.startDragHandler} ></div>
            <div className='handle' id='handle02' style={this.state.content.envelopLeft[1]} onMouseDown={this.startDragHandler} ></div>
            <div className='handle' id='handle03' style={this.state.content.envelopLeft[2]} onMouseDown={this.startDragHandler} ></div>
            <div className='handle' id='handle04' style={this.state.content.envelopLeft[3]} onMouseDown={this.startDragHandler} ></div>
            <div className='handle' id='handle05' style={this.state.content.envelopLeft[4]} onMouseDown={this.startDragHandler} ></div>
          </div>
        }else if (i ===this.state.content.columns && mcr.length >= 10000){
          if(newMcr.length>0){
          cc = newMcr;
        }else{
          cc = mcr
        }
          tt = rtd;
          envelopValues =this.state.content.envelopRight;
          env = <div className='envelopCanvas' id='envelopCanvas02' >
            <canvas className='eCanvas' ref='myECanvas' width={100} height={101}/>
            <div className='handle' id='handle01' style={this.state.content.envelopRight[0]} onMouseDown={this.startDragHandler} ></div>
            <div className='handle' id='handle02' style={this.state.content.envelopRight[1]} onMouseDown={this.startDragHandler} ></div>
            <div className='handle' id='handle03' style={this.state.content.envelopRight[2]} onMouseDown={this.startDragHandler} ></div>
            <div className='handle' id='handle04' style={this.state.content.envelopRight[3]} onMouseDown={this.startDragHandler} ></div>
            <div className='handle' id='handle05' style={this.state.content.envelopRight[4]} onMouseDown={this.startDragHandler} ></div>
          </div>
          envelopValues =this.state.content.envelopRight;
        }
        else{
          env = ''
          if(newMcl.length>0){
            mcl = newMcl;
          }
          if(newMcr.length>0){
            mcr = newMcr;
          }
          cc = calcArrays.getSingleLine(mcl,mcr,this.state.content.columns,i-1)
          tt = calcArrays.getSingleTime(ltd,rtd,this.state.content.columns,i-1);
          envelopValues = undefined;
        }


        let myc = <div className='gridElement' key={i}>
                  <GridElement key={i} ref={'GridElement' + i} myCurve={cc} time={tt} envelop={envelopValues}/>
                  {env}
                </div>

        grid[i] = myc
      }



      let { database } = this.state;
      let consoleContent = [];


      if(this.state.consoleSwitch==='open'){
          consoleContent.push(<p key =' 0'>Effektset öffnen</p>);
          database.map((data,index)=>{consoleContent.push(<div className="dataList" id={data.matrixName} key={index +1} onClick={this.getData}>{data.matrixName}</div>)})
      }else{
        consoleContent = <div className="dataList">
                            <p>Effekte sichern</p>
                            <form onSubmit={this.handleConsoleSubmit}>
                              <label>
                                Name:
                                <input type="text" value={this.state.saveValue} onChange={this.handleConsoleChange} />
                              </label>
                              <input type="submit" value="Submit" />
                            </form>
                          </div>
      }

      return(
           <div className='wrapper' id='wrapper' ref='wrapper' onMouseMove={this.dragDragHandler} onMouseUp={this.stopDragHandler}>
            <div className='rowselector'>
              <InputSelect name='columns' range={8} step={[3,1]} label='Columns' onchange={this.change} myValue={this.state.content.columns}/>
              <InputSelect name='transformation' range={['Frameperframe','FTT']} label='Transformation' onchange={this.change} myValue={this.state.content.transformation}/>
            </div>
            <div className="grid">
              <div className="topInput">
              <div className='subElement'>
                <InputSelect name='leftTopHz' range={300} step={[5,5]} label='Herz leftTop' onchange={this.change} myValue={this.state.content.leftTopHz}/>
                <InputSelect name='leftTopT'range={typeArray} label='Type leftTop' onchange={this.change} myValue={this.state.content.leftTopT}/>
                <InputSelect name='leftTopD'range={3.1} step={[0.1,0.1,this.state.content.filetime[0]]} label='Duration leftTop' onchange={this.change} myValue={this.state.content.leftTopD} id='leftTopD'/>
              </div>
              <div className='subElement'>
                <InputSelect name='rightTopHz' range={300} step={[5,5]} label='Herz rightTop' onchange={this.change} myValue={this.state.content.rightTopHz}/>
                <InputSelect name='rightTopT'range={typeArray} label='Type rightTop' onchange={this.change} myValue={this.state.content.rightTopT}/>
                <InputSelect name='rightTopD'range={3.1} step={[0.1,0.1,this.state.content.filetime[1]]} label='Duration rightTop' onchange={this.change} myValue={this.state.content.rightTopD} id='rightTopD'/>
              </div>
              </div>
              <div className='gridelements'>
                  {grid}
              </div>
              <input className="myFileInput" type="file" id="myFileInput" name="avatar" accept="audio/mpeg, audio/wav, audio/m4a" onInput={this.getFileInfo}/>
            </div>
            <div className="fileConsole">
              <div className="consoleButtonBar">
                <div className="fileConsoleButton open" id="open" ref="fileConsoleButton" onClick={this.openFileConsole}></div>
                <div className="fileConsoleButton save" id="save" ref="fileSaveButton" onClick={this.openFileConsole}></div>
              </div>
              <div className="fileConsoleContent" ref="fileConsoleContent">
                <div className='fileConsoleHeader'>
                  <div className="fileConsoleCloseButton" ref="fileConsoleCloseButton" onClick={this.closeFileConsole}></div>
                </div>
                <div>
                    {
                      consoleContent
                    }
                </div>
              </div>
            </div>
          </div>
      )
    }

}

export default MasterElement;
