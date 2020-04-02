let mongoose = require("mongoose");

Object.keys(mongoose.connection.models).forEach(key => {
  delete mongoose.connection.models[key];
});

mongoose.Promise = global.Promise;
mongoose.set("useFindAndModify", false);
mongoose.connect("mongodb://localhost:27017/effectTool", {
  useNewUrlParser: true
});

module.exports = { mongoose };
