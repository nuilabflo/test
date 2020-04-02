import React, { Component } from "react";
import "./reset.css";
import "./App.css";
import Container from "./components/container";
import axios from "axios";
const API_URL = "http://localhost:9000/";
// http://localhost:9000/newMatrix

class App extends Component {
  //
  //   constructor(props) {
  //     super(props);
  //     this.state = {
  //       tasks: [],
  //       nweMatrix: {topLeft: [1,2,3,4,5],
  //       topRight: [1,2,3,4,5],
  //       envelopTopLeft: [1,2,3,4,5],
  //       envelopTopRight: [1,2,3,4,5],
  //       matrixName: "hellodude"},
  //       matrices:[],
  //
  //     };
  //     // this.updateText = this.updateText.bind(this);
  //     // this.postTask = this.postTask.bind(this);
  //     // this.deleteTask = this.deleteTask.bind(this);
  //     // this.addTask = this.addTask.bind(this);
  //     // this.removeTask = this.removeTask.bind(this);
  //     this.myMatrix = this.myMatrix.bind(this);
  //     this.newMatrix = this.newMatrix.bind(this);
  //   }
  //
  //   componentDidMount(){
  //   // axios.get('http://localhost:9000/getMatrices')
  //       axios.get('http://localhost:9000/getMatrices')
  //       .then(response =>{
  //       //console.log(response);
  //       })
  //       .catch(err=>{
  //         console.log('Fehler: ' ,err);
  //       });
  //   }
  //
  //
  //   myMatrix(e) {
  //
  //     e.preventDefault();
  //     axios.get('http://localhost:9000/getMatrix?key=matrixName&value=finalone')
  //     .then(response =>{
  //       console.log(response);
  //     })
  //     .catch(err=>{
  //       console.log('Fehler: ' ,err);
  //     });
  // }
  //
  // newMatrix(e) {
  //
  //
  //   axios.post('http://localhost:9000/newMatrix',{topLeft: [1,2,3,4,5],
  //    topRight: [1,2,3,4,5],
  //    envelopTopLeft: [1,2,3,4,5],
  //  envelopTopRight: [1,2,3,4,5],
  //  matrixName: 'Rüdigäer ß'})
  //   .then(response =>{
  //     console.log(response);
  //   })
  //   .catch(err=>{
  //     console.log('Fehler: ' ,err);
  //   });
  // }
  //
  // saveMatrix(e) {
  //
  //
  //   axios.get('http://localhost:9000/saveMatrix?key=matrixName&value=fourthOne&newValue=fifthhOne')
  //   .then(response =>{
  //     console.log(response);
  //   })
  //   .catch(err=>{
  //     console.log('Fehler: ' ,err);
  //   });
  // }

  render() {
    return <Container />;
  }
}

export default App;
