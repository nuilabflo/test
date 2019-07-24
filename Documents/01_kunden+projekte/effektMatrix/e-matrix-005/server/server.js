let express = require('express');
let bodyParser = require('body-parser');

const {ObjectId} = require('mongodb');

let {mongoose} = require('./db/mongoose');
let Matrix = require('./models/matrix');
let EmbeddedSound = require('./models/sounds');

let app = express();

const port = process.env.PORT || 9000;


app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



app.post('/newMatrix', (req, res, next) =>{
    let { body } = req;
    let {
      fileBufferLeft,
      matrixContent,
      matrixName
    } = body;

    if(!matrixContent){
      return res.send({
        success:false,
        message:'Error: no matrixContent'
      })
    }

    if(!matrixName){
      return res.send({
        success:false,
        message:'Error: no valid Name'
      })
    }

    // verify
    Matrix.find({
      matrixName:matrixName
    },(err,docs)=>{
      if(err){
        return res.send({success:false, message: 'Error: Server error'})
      }else if(docs.length >0){
        return res.send({success:false, message:'Error: Matrix already exists'})
      }

      let newMatrix = new Matrix();
       newMatrix.matrixName = matrixName;
       newMatrix.matrixContent = matrixContent;
       newMatrix.fileBufferLeft = fileBufferLeft;
       newMatrix.save((err,matrices)=>{
        if(err){
          return res.send({success:false, message: 'Error: Server error'})
        }
          return res.send({success:true, message:'Saved matrix successful'})
      });
    });
});

app.get('/getMatrices', (req, res, next) => {
      Matrix.find()
          .exec()
           .then((matrices) =>{res.json(matrices)})
           .catch((err) => next(err));
});

app.get('/getMatrix', (req, res, next) => {
        const { query } = req
        const { value, key } = query


        Matrix.find({ [key]: value })
        .exec()
        .then((matrix) =>{res.json(matrix)})
        .catch((err)=>next(err));
});

app.get('/saveMatrix', (req, res, next) => {
          const { query } = req
          const { value, key, newValue } = query

          //console.log(query.newValue);
          Matrix.findOneAndUpdate(
            {[query.key]: query.value},
            {$set:{[query.key]: query.newValue}
          },
          {returnOriginal:false}
        ).then(res=>{console.log(res);})
        .catch((err)=>next(err));

          Matrix.find({ [key]: value })
          .exec()
          .then((matrix) =>{res.json(matrix)})
          .catch((err)=>next(err));
});


////////////

app.post('/newEmbeddedSound', (req, res, next) =>{
    let { body } = req;
    let {
      soundName,
      fileBuffer,
      duration,
      envBase
    } = body;
    if(!soundName){
      return res.send({
        success:false,
        message:'Error: no valid Name'
      })
    }

    // verify
    EmbeddedSound.find({
      soundName:soundName
    },(err,docs)=>{
      if(err){
        return res.send({success:false, message: 'Error: Server error'})
      }else if(docs.length >0){
        return res.send({success:false, message:'Error: soundName already exists'})
      }

      let newEmbeddedSound = new EmbeddedSound();
       newEmbeddedSound.soundName = soundName;
       newEmbeddedSound.fileBuffer = fileBuffer;
       newEmbeddedSound.duration = duration;
       newEmbeddedSound.envBase = envBase;
       newEmbeddedSound.save((err,sounds)=>{
        if(err){
          return res.send({success:false, message: 'Error: Server error'})
        }
          return res.send({success:true, message:'Sound embedded successful'})
      });
    });
});


app.get('/getEmbeddedSounds', (req, res, next) => {
      EmbeddedSound.find()
          .exec()
           .then((sounds) =>{res.json(sounds)})
           .catch((err) => next(err));
});


app.get('/getEmbeddedSound', (req, res, next) => {
        const { query } = req
        const { value, key } = query


        EmbeddedSound.find({ [key]: value })
        .exec()
        .then((sound) =>{res.json(sound)})
        .catch((err)=>next(err));
});



app.listen(9000,()=>{
    console.log(`server startet on p ${port}`);
})
