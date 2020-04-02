const mongoose = require("mongoose");

const EffectDataSchema = new mongoose.Schema({
  effectName: {
    type: String,
    default: ""
  },
  fileBuffer: {
    type: Array,
    default: []
  },
  curve: {
    type: Array,
    default: []
  },
  envCurve: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model("effectData", EffectDataSchema);
