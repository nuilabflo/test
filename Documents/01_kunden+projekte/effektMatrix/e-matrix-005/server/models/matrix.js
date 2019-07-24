const mongoose = require('mongoose');

const MatrixSchema = new mongoose.Schema({

    matrixName:{
      type: String,
      default: ''
     },
     matrixContent:{
       type: String,
       default: ''
     },
    fileBufferLeft:{
      type:Array,
      default:[]
    },
    fileBufferRight:{
      type:Array,
      default:[]
    },
  
});

module.exports = mongoose.model('Matrix', MatrixSchema);
