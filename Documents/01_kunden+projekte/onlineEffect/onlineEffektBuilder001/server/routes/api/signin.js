const User = require("../../models/user");

module.exports = app => {
  app.post("/api/signup", (req, res, next) => {
    let { body } = req;
    let { firstName, lastName, email, password } = body;

    if (!firstName) {
      return res.send({
        success: false,
        message: "Error: First Name cann not be blank"
      });
    }

    if (!lastName) {
      return res.send({
        success: false,
        message: "Error: Last Name cann not be blank"
      });
    }

    if (!email) {
      return res.send({
        success: false,
        message: "Error: no top left envelop values"
      });
    }

    if (!password) {
      return res.send({
        success: false,
        message: "Error: no top right envelop values"
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

        newUser.save((err, user) => {
          if (err) {
            return res.send({ success: false, message: "Error: Server error" });
          }
          return res.send({
            success: true,
            message: "Signed Up"
          });
        });
      }
    );
  });

  // app.get("/api/getMatrices", (req, res, next) => {
  //   Matrix.find()
  //     .exec()
  //     .then(matrices => {
  //       console.log("get Matrices");
  //       res.json(matrices);
  //     })
  //     .catch(err => next(err));
  // });
  //
  // app.get("/api/getMatrix", (req, res, next) => {
  //   const { query } = req;
  //   const { value, key } = query;
  //   console.log(next);
  //
  //   Matrix.find({ [key]: value })
  //     .exec()
  //     .then(matrix => {
  //       res.json(matrix);
  //     })
  //     .catch(err => next(err));
  // });
};
