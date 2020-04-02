import { interpolateArray } from "./filebuffer";

let selectedDevice;
let audioCtx = new window.AudioContext();
let toWav = require("audiobuffer-to-wav");
let xhr = require("xhr");

navigator.mediaDevices
  .enumerateDevices()
  .then(newMediaCheck)
  .catch(handleError);

function handleError(error) {
  console.log(
    "navigator.MediaDevices.getUserMedia error: ",
    error.message,
    error.name
  );
}

function newMediaCheck(deviceList) {
  let device = deviceList.filter(
    device =>
      device.label.slice(0, 12) === "PulseCoreDev" &&
      device.kind === "audiooutput"
    //device.deviceId === "default" && device.kind === "audiooutput"
  );
  if (device.length === 0) {
    selectedDevice = false;
  } else {
    selectedDevice = device;
  }
}

export function playSound(mc, t) {
  navigator.mediaDevices
    .enumerateDevices()
    .then(newMediaCheck)
    .catch(handleError);

  let newBuffer = interpolateArray(mc, audioCtx.sampleRate * t);
  let myArrayBuffer = audioCtx.createBuffer(
    2,
    audioCtx.sampleRate * t,
    audioCtx.sampleRate
  );
  for (var channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
    var nowBuffering = myArrayBuffer.getChannelData(channel);
    for (var i = 0; i < myArrayBuffer.length; i++) {
      nowBuffering[i] = newBuffer[i]; //Math.random() * 2 - 1;
    }
  }
  var source = audioCtx.createBufferSource();
  source.buffer = myArrayBuffer;
  var wav = toWav(myArrayBuffer);

  let anchor = document.createElement("a");
  document.body.appendChild(anchor);
  anchor.style = "display: none";
  let newAudio = new window.Blob([new DataView(wav)], {
    type: "audio/wav"
  });
  let url = URL.createObjectURL(newAudio);

  let audio = new Audio(); //document.createElement('audio');
  const mSource = document.createElement("source");
  audio.src = url; //audio.appendChild(mSource);

  mSource.src = url;
  mSource.type = "audio/wav";

  if (selectedDevice) {
    audio.setSinkId(selectedDevice[0].deviceId);
  } else {
    alert("Please connect pulsoCore Samplebox");
  }

  //audio.src=url;
  audio.play();

  // let url = window.URL.createObjectURL(newAudio)
  // anchor.href = url
  // anchor.download = 'audio.wav'
  // anchor.click()
  // window.URL.revokeObjectURL(url)
}
