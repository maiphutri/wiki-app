const bcrypt = require("bcryptjs"),
      User   = require("./models").User;

module.exports = {
  createUser(newUser, callback) {
    User.findOne({where: {email: newUser.email}}).then(user => {
      if(user) {
        let err = [];
        err.push({param: "Email", msg: "is already in use"})
        return callback(err);
      } else {
        const salt           = bcrypt.genSaltSync(),
              hashedPassword = bcrypt.hashSync(newUser.password, salt);
        
        return User.create({
          email: newUser.email,
          password: hashedPassword
        }).then(user => {
          callback(null, user);
        })
        .catch(err => {
          callback(err);
        })
      }
    })
  },
  
}