const mongoose = require("mongoose");

const EffectSchema = new mongoose.Schema({
  effectName: {
    type: String,
    default: ""
  },
  userId: {
    type: String,
    default: ""
  },
  type: {
    type: Number,
    default: -1
  },
  file: {
    type: Object,
    default: {}
  },
  fileBuffer: {
    type: Array,
    default: []
  },
  curveType: {
    type: String,
    default: ""
  },
  curveFrequency: {
    type: Number,
    default: -1
  },
  curve: {
    type: Array,
    default: []
  },
  duration: {
    type: Number,
    default: -1
  },
  envBase: {
    type: Number,
    default: -1
  },
  envPoints: {
    type: Array,
    default: []
  },
  envCurve: {
    type: Array,
    default: []
  },
  drawerCurve: {
    type: Object,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now()
  },
  effectTags: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model("effect", EffectSchema);
