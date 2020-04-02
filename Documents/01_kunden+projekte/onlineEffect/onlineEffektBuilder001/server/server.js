let express = require("express");
let bodyParser = require("body-parser");

const { ObjectId } = require("mongodb");

let { mongoose } = require("./db/mongoose");

const User = require("./models/user");
const UserSession = require("./models/userSession");
const Effect = require("./models/effect");
//const EffectData = require("./models/effectData");

let app = express();
let myShemas = {};
let myModels = {};
//let collectionNames = [];

const port = process.env.PORT || 9000;

console.log("in");
app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/saveEffect", (req, res, next) => {
  let { body } = req;
  let {
    userId,
    type,
    file,
    fileBuffer,
    curveType,
    curveFrequency,
    curve,
    duration,
    envBase,
    envPoints,
    envCurve,
    drawerCurve,
    timestamp,
    effectName,
    effectTags
  } = body;
  if (!effectName) {
    return res.send({
      success: false,
      message: "Error: no valid Name"
    });
  }

  // verify
  Effect.find(
    {
      effectName: effectName
    },
    (err, docs) => {
      if (err) {
        return res.send({ success: false, message: "Error: Server error" });
      } else if (docs.length > 0) {
        return res.send({
          success: false,
          message: "Error: Effectname already exists"
        });
      }

      let newEffect = new Effect();

      newEffect.userId = userId;
      newEffect.type = type;
      newEffect.file = file;
      //newEffect.fileBuffer = fileBuffer;
      newEffect.curveType = curveType;
      newEffect.curveFrequency = curveFrequency;
      //  newEffect.curve = curve;
      newEffect.duration = duration;
      newEffect.envBase = envBase;
      newEffect.envPoints = envPoints;
      //  newEffect.envCurve = envCurve;
      newEffect.drawerCurve = drawerCurve;
      newEffect.timestamp = timestamp;
      newEffect.effectName = effectName;
      newEffect.effectTags = effectTags;
      //

      let EffectSchema = mongoose.Schema({
        effectName: String,
        curve: Array,
        fileBuffer: Array,
        envCurve: Array
      });

      // compile schema to model

      var Myeffect = mongoose.model(
        "_effects_" + effectName,
        EffectSchema,
        "_effects_" + effectName
      );

      // a document instance
      var myeffect = new Myeffect({
        effectName: effectName,
        curve: curve,
        fileBuffer: fileBuffer,
        envCurve: envCurve
      });

      // save model to database

      newEffect.save((err, effects) => {
        if (err) {
          return res.send({
            success: false,
            message: "Error: Server error" + err.message
          });
        }
        // return res.send({
        //   success: true,
        //   message: "Effect successfully saved"
        // });
      });

      myeffect.save(function(err, effect) {
        if (err) {
          return res.send({
            success: false,
            message: "Error: Server error" + err.message
          });
        }
        return res.send({
          success: true,
          message: "Effect successfully saved"
        });
        po;
      });
    }
  );
});

app.get("/getEffects", (req, res, next) => {
  Effect.find()
    .exec()
    .then(effects => {
      res.json(effects);
    })
    .catch(err => next(err));
});

app.get("/getEmbeddedSound", (req, res, next) => {
  const { query } = req;
  const { value, key } = query;

  EmbeddedSound.find({ [key]: value })
    .exec()
    .then(sound => {
      res.json(sound);
    })
    .catch(err => next(err));
});

//////user/login-management////

app.post("/signup", (req, res, next) => {
  let { body } = req;
  let { firstName, lastName, email, password } = body;

  if (!firstName) {
    return res.send({
      success: false,
      message: "Error: First Name can not be blank"
    });
  }

  if (!lastName) {
    return res.send({
      success: false,
      message: "Error: Last Name can not be blank"
    });
  }

  if (!email) {
    return res.send({
      success: false,
      message: "Error: email can not be blank"
    });
  }

  if (!password) {
    return res.send({
      success: false,
      message: "Error: password can not be blank"
    });
  }

  email = email.toLowerCase();

  // verify
  User.find(
    {
      email: email
    },
    (err, previousUser) => {
      if (err) {
        return res.send({ success: false, message: "Error: Server error" });
      } else if (previousUser.length > 0) {
        return res.send({
          success: false,
          message: "Error: Account already exists"
        });
      }
      let newUser = new User();

      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.email = email;
      newUser.password = newUser.generateHash(password);
      newUser.howto = true;

      newUser.save((err, user) => {
        if (err) {
          return res.send({ success: false, message: "Error: Server error" });
        }
        return res.send({
          name: newUser.firstName + " " + newUser.lastName,
          success: true,
          userId: newUser._id,
          message: "Signed Up"
        });
      });
    }
  );
});

app.post("/signin", (req, res, next) => {
  let { body } = req;
  let { email, password } = body;

  if (!email) {
    return res.send({
      success: false,
      message: "Error: email can not be blank"
    });
  }

  if (!password) {
    return res.send({
      success: false,
      message: "Error: password can not be blank"
    });
  }

  email = email.toLowerCase();

  // verify
  User.find(
    {
      email: email
    },
    (err, users) => {
      if (err) {
        return res.send({ success: false, message: "Error: Server error" });
      }

      if (users.length != 1) {
        return res.send({
          success: false,
          message: "Error: Invalid"
        });
      }

      const user = users[0];

      if (!user.valdiPassword(password)) {
        return res.send({
          success: false,
          message: "Error: Invalid password"
        });
      }

      const usersession = new UserSession();
      usersession.userId = user._id;
      usersession.userName = user.firstName + " " + user.lastName;
      usersession.timestamp = Date.now();
      usersession.howto = user.howto;
      //       //
      usersession.save((err, doc) => {
        if (err) {
          return res.send({
            success: false,
            message: "Error: Server error"
          });
        }
        return res.send({
          success: true,
          message: "Valid sign in",
          token: doc._id
        });
      });
    }
  );
});

app.get("/verify", (req, res, next) => {
  let { query } = req;
  let { token } = query;
  UserSession.find(
    {
      _id: token,
      isDeleted: false
    },
    (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: Server error"
        });
      }

      if (sessions.length != 1) {
        return res.send({
          success: false,
          message: "Error: Server invalid"
        });
      } else {
        return res.send({
          success: true,
          message: "valid Session",
          name: sessions[0].userName,
          token: sessions[0].id,
          userId: sessions[0].userId,
          howto: sessions[0].howto
        });
      }
    }
  );
});

app.get("/logout", (req, res, next) => {
  let { query } = req;
  let { token } = query;

  UserSession.findOneAndUpdate(
    {
      _id: token,
      isDeleted: false
    },
    { $set: { isDeleted: true } },
    null,
    (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: Server error"
        });
      }

      return res.send({
        success: true,
        message: "logout successfully"
      });
    }
  );
});

app.get("/updateHowTo", (req, res, next) => {
  let { query } = req;
  let { uid, myhowto } = query;

  User.findOneAndUpdate(
    {
      _id: uid
    },
    { $set: { howto: myhowto } },
    null,
    (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: Server error"
        });
      }

      return res.send({
        success: true,
        message: "howto saved successfully"
      });
    }
  );
});

app.get("/updateUnloaded", (req, res, next) => {
  let { query } = req;
  let { toload, saved } = query;
  let toloadArray = [];
  if (toload.length > 0) {
    toloadArray = toload.split(",");
  }

  let responseArray = [];

  let existingModels = Object.keys(mongoose.connection.models);

  //if (saved === "false") {
  for (let i = 0; i < toloadArray.length; i++) {
    if (!existingModels.includes("_effects_" + toloadArray[i])) {
      new mongoose.model(
        "_effects_" + toloadArray[i],
        new mongoose.Schema({
          effectName: String,
          fileBuffer: Array,
          curve: Array,
          envCurve: Array
        }),
        "_effects_" + toloadArray[i]
      );
    }
  }

  console.log(
    "models: ",
    existingModels.length,
    existingModels,
    "toload: ",
    toloadArray
  );
  //}
  if (toloadArray && toloadArray.length > 0) {
    for (let i = 0; i < toloadArray.length; i++) {
      mongoose.connection.models["_effects_" + toloadArray[i]].find(
        {},
        (err, sessions) => {
          if (err) {
            console.log(err);
            return res.send({
              success: false,
              message: "Error: Server error"
            });
          } else {
            responseArray.push({
              effectName: sessions[0].effectName,
              fileBuffer: sessions[0].fileBuffer,
              curve: sessions[0].curve,
              envCurve: sessions[0].envCurve
            });
            console.log(responseArray.length, toloadArray.length);
            if (responseArray.length === toloadArray.length) {
              return res.send({
                success: true,
                data: responseArray
              });
            }
          }
        }
      );
    }
  }
});

app.listen(9000, () => {
  console.log(`server startet on p ${port}`);
});
