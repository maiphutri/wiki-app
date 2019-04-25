const bcrypt = require("bcryptjs"),
      User   = require("./models").User,
      Wiki   = require("./models").Wiki;
      Op     = require("sequelize").Op;

module.exports = {
  getUsers(req, collaboratorList, callback) {
    return User.findAll({
      where: {
        email: {
          [Op.notIn]: collaboratorList,
          [Op.ne]: req.user.email
        }
      }
    }).then(users => {
      callback(null, users);
    })
    .catch(err => {
      callback(err);
    })
  },

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
  
  getUser(id, callback) {
    let result = {};
    
    User.findByPk(id).then(user => {
      if(!user) {
        callback(404);
      } else {
        result.user = user;

        Wiki.scope({method: ["myWikis", id]}).findAll().then(wikis => {
          result.wikis = wikis;
          callback(null, result);
        })
        .catch(err => {
          callback(err);
        })
      }
    })
  },

  upgradeUser(id, callback) {
    User.findByPk(id).then(user => {
      if(!user) { 
        callback(404); 
      } else {
        user.role = 'premium';
        user.save().then(user => {
          callback(null, user);
        })
        .catch(err => {
          callback(err);
        })
      }
    })
    .catch(err => {
      callback(err);
    })
  },

  downgradeUser(id, callback) {
    User.findByPk(id).then(user => {
      if (!user) {
        callback(404);
      } else {
        user.role = 'member';
        user.save().then(user => {
          Wiki.findAll({where: {userId: user.id}}).then(wikis => {
            wikis.forEach(wiki => {
              wiki.private = false;
              wiki.save();
            })
            callback(null, user);
          })
        })
        .catch(err => {
          callback(err);
        })
      }
    })
    .catch(err => {
      callback(err);
    })
  }
}