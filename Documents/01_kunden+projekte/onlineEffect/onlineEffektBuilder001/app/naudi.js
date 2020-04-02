
//var portAudio = require('naudiodon');
//import {portAudio} from 'node-portaudio';
var portAudio = require( 'node-portaudio');
const fs = require('fs');
const path = require('path');
//console.log(portAudio.getDevices());

// // Create an instance of AudioIO with outOptions (defaults are as below), which will return a WritableStream
// var ao = new portAudio.AudioOutput({
//   outOptions: {
//     channelCount: 1,
//     sampleFormat: portAudio.SampleFormat16Bit,
//     sampleRate: 48000,
//     deviceId: 3, // Use -1 or omit the deviceId to select the default device
//     closeOnError: true // Close the stream if an audio error is detected, if set false then just log the error
//   }
// });

const ao = new portAudio.AudioOutput({
  channelCount: 2,
  sampleFormat: portAudio.SampleFormat16Bit,
  sampleRate: 48000,
  deviceId : -1 // Use -1 or omit the deviceId to select the default device
});

ao.on('error', err => console.error);

//console.log(ao);
//
// // Create a stream to pipe into the AudioOutput
// // Note that this does not strip the WAV header so a click will be heard at the beginning
// let coolPath = path.join(__dirname, 'cool.txt');
// // let coolPath = path.join(__dirname, 'mixdown.wav');
//
// var rs = fs.createReadStream(coolPath);
const rs = fs.createReadStream('mixdown88.wav');

rs.on('end', () => ao.end());

// Start piping data and start streaming
rs.pipe(ao);
ao.start();

// console.log(rs);
//
// //
// // // Start piping data and start streaming
// rs.pipe(ao);
//ao.start();
// var arr = new Uint32Array(1);
// //set first value to 1
// arr[0] = 1;
// //output contents
// console.log(arr);
// //substract to "negative"
// arr[0] = -0,5;
// //output contents
// console.log(arr[0]);

// var toWav = require('audiobuffer-to-wav')
// var xhr = require('xhr')
// var context = new (window.AudioContext)();//new AudioContext()
//
// // request the MP3 as binary
// xhr({
//   uri: '../testsounds/click003.mp3',
//   responseType: 'arraybuffer'
// }, function (err, body, resp) {
//   if (err) throw err
//   // decode the MP3 into an AudioBuffer
//   audioContext.decodeAudioData(resp, function (buffer) {
//     // encode AudioBuffer to WAV
//     var wav = toWav(buffer)
//     console.log(wav);
//
//     // do something with the WAV ArrayBuffer ...
//   })
// })
