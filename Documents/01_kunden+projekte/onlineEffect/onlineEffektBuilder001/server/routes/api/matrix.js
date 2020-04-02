const Matrix = require('../../models/matrix');

module.exports = (app) => {
  app.post('/api/newMatrix', (req, res, next) =>{
    let { body } = req;
    let {
      topLeft,
      topRight,
      envelopTopLeft,
      envelopTopRight,
      matrixName
    } = body;

    if(!topLeft){
      return res.send({
        success:false,
        message:'Error: no top left values',
      })
    }

    if(!topRight){
      return res.send({
        success:false,
        message:'Error: no top right values'
      })
    }

    if(!envelopTopLeft){
      return res.send({
        success:false,
        message:'Error: no top left envelop values'
      })
    }

    if(!envelopTopRight){
      return res.send({
        success:false,
        message:'Error: no top right envelop values'
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
    },(err,previousMatrices)=>{
      if(err){
        return res.send({success:false, message: 'Error: Server error'})
      }else if(previousMatrices.length >0){
        return res.send({success:false, message:'Error: Matrix already exists'})
      }
      let newMatrix = new Matrix();

      newMatrix.topLeft = topLeft;
      newMatrix.topRight = topRight;
      newMatrix.envelopTopLeft = envelopTopLeft;
      newMatrix.envelopTopRight = envelopTopRight;
      newMatrix.matrixName = JSON.parse( JSON.stringify( matrixName ) ) //newUser.generateHash(password);
      newMatrix.save((err,matrices)=>{
        if(err){
          return res.send({success:false, message: 'Error: Server error'})
        }
          return res.send({success:true, message:'Saved matrix successful'})

      });
    });
  });

  app.get('/api/getMatrices', (req, res, next) => {
    Matrix.find()
        .exec()
         .then((matrices) =>{console.log('get Matrices');res.json(matrices)})
         .catch((err) => next(err));
  });


  app.get('/api/getMatrix', (req, res, next) => {
      const { query } = req
      const { value, key } = query
      console.log(next);

      Matrix.find({ [key]: value })
      .exec()
      .then((matrix) =>{res.json(matrix)})
      .catch((err)=>next(err));
    });

}
