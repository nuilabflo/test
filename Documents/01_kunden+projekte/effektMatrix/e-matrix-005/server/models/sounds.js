const mongoose = require('mongoose');

const EmbeddeSoundSchema = new mongoose.Schema({

    soundName:{
      type: String,
      default: ''
    },
     fileBuffer:{
       type:Array,
       default:[]
     },
     duration:{
       type:Number,
       default:0.1
     },
     envBase:{
       type:Number,
       default: 1,
     }
});

module.exports = mongoose.model('embeddedSound', EmbeddeSoundSchema);
