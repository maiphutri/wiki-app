const Wiki       = require("./models").Wiki,
      User       = require("./models").User,
      Authorizer = require("../policies/wiki");

module.exports = {
  getAllWikis(callback) {
    return Wiki.findAll().then(wikis => {
      callback(null, wikis);
    })
    .catch(err => {
      callback(err);
    })
  },
  
  addWiki(newWiki, callback) {
    Wiki.findOne({where: {title: newWiki.title}}).then(wiki => {
      if(wiki) {
        let err = [];
        err.push({param: "Title", msg: "is already being used. Please try another title."})
        return callback(err);
      } else {
        return Wiki.create(newWiki).then(wiki => {
          callback(null, wiki);
        })
        .catch(err => {
          callback(err);
        })
      }
    })
  },

  getWiki(id, callback) {
    return Wiki.findByPk(id).then(wiki => {
      callback(null, wiki);
    })
    .catch(err => {
      callback(err);
    })
  },

  deleteWiki(req, callback) {
    return Wiki.findByPk(req.params.id).then(wiki => {
      const authorized = new Authorizer(req.user, wiki).destroy();
      
      if (authorized) {
        wiki.destroy().then(res => {
          callback(null, wiki);
        })
      } else {
        callback(null);
      }
    })
    .catch(err => {
      callback(err);
    })
  },

  updateWiki(req, updatedWiki, callback) {
    return Wiki.findByPk(req.params.id).then(wiki => {
      if(!wiki) return callback("Wiki not found");

      const authorized = new Authorizer(req.user, wiki).update();

      if (authorized) {
        wiki.update(updatedWiki, {
          fields: Object.keys(updatedWiki)
        })
        .then(() => {
          callback(null, wiki);
        })
        .catch(err => {
          callback(err);
        })
      } else {
        callback(null);
      }
    })
    .catch(err => {
      callback(err);
    })
  }
}