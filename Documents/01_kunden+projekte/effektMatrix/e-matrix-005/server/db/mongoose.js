let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/testUserDB2', { useNewUrlParser: true });

module.exports ={mongoose}
