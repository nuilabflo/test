

export function getFileBuffer(file){

if(file === undefined) {

  // Stop the process and tell user they need to upload a file.
  return false;
}



var audioCtx = new (AudioContext)();
var reader1 = new FileReader();
var nowBuffering;
reader1.onload = function(ev) {

    // Decode audio
    audioCtx.decodeAudioData(ev.target.result).then(function(buffer) {
        nowBuffering = interpolateArray(buffer.getChannelData(0),1000);

    });

      return audioCtx
  };
  reader1.readAsArrayBuffer(file);


  }



  export function interpolateArray(data, fitCount){
    let linearInterpolate = function (before, after, atPoint) {
      return before + (after - before) * atPoint;
    };

    let newData = [];
    let springFactor =  Number((data.length - 1) / (fitCount - 1));
    newData[0] = data[0]; // for new allocation
    for ( var i = 1; i < fitCount - 1; i++) {
      let tmp = i * springFactor;
      let before =  Number(Math.floor(tmp)).toFixed();
      let after =  Number(Math.ceil(tmp)).toFixed();
      let atPoint = tmp - before;
      newData[i] = linearInterpolate(data[before], data[after], atPoint);
    }
    newData[fitCount - 1] = data[data.length - 1]; // for new allocation

    return newData;
  }


  // module.exports = {
  //   getFileBuffer
  // }
