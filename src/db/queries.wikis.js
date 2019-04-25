const Wiki         = require("./models").Wiki,
      User         = require("./models").User,
      Collaborator = require("./models").Collaborator,
      Authorizer   = require("../policies/wiki");

module.exports = {
  getAllWikis(callback) {
    return Wiki.findAll().then(wikis => {
      Collaborator.findAll().then(collaborators => {
        callback(null, wikis, collaborators);
      })
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

  getWiki(req, callback) {
    let result = {};
    return Wiki.findByPk(req.params.id).then(wiki => {
      result.wiki = wiki;
      //show creator info
      User.scope({method: ["user", wiki.userId]}).findOne().then(user => {
        result.user = user;
        //Check if wiki is public or private
        if (wiki.private === false) { return callback(null, result)};

        const email = req.user.email;

        Collaborator.findOne({
          where: {
            email: email,
            wikiId: req.params.id
          }
        }).then(collaborator => {
          //Check if current User is the wiki's owner
          if (wiki.userId === req.user.id) { return callback(null, result)};

          //Check if currentUser is collaborator for selected wiki
          if (collaborator != null) {
            result.collaborator = collaborator
            callback(null, result);
          } else {
            callback(null);
          }
        })
        
      })
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
      Collaborator.findOne({
        where: {
          email: req.user.email,
          wikiId: req.params.id
        }
      }).then(collaborator => {
        const authorized = new Authorizer(req.user, wiki, collaborator).update();
  
        if (authorized) {
          wiki.update(updatedWiki, {
            fields: Object.keys(updatedWiki)
          })
          .then(() => {
            if (updatedWiki.private === "false") {
              Collaborator.destroy({where: {wikiId: req.params.id}}).then((collaborators => {
                callback(null, wiki);
              }))
            } else {
              callback(null, wiki);
            }
          })
          .catch(err => {
            callback(err);
          })
        } else {
          callback(null);
        }
      })
    })
    .catch(err => {
      callback(err);
    })
  }
}