const Collaborator = require("./models").Collaborator,
      User         = require("./models").User,
      Op           = require("sequelize").Op;

module.exports = {
  getCollaborators(req, callback) {
    return Collaborator.findAll({
      where: {
        wikiId: req.params.id
      }
    }).then(collaborators => {
      callback(null, collaborators);
    })
    .catch(err => {
      callback(err);
    })
  },

  updateCollaborator(req, callback) {
    const emails = req.body.emails,
          wikiId = req.params.id;

    Collaborator.findAll({
      where: {
        wikiId: wikiId,
      }
    }).then(collaborators => {
      collaborators.forEach(collaborator => {
        collaborator.destroy();
      });

      if (emails == null) { callback(null)}

      if (Array.isArray(emails)) {
        let newCollaborators = emails.map(email => ({email: email, wikiId: wikiId}));
        
        Collaborator.bulkCreate(newCollaborators).then(collaborators => {
          callback(null, collaborators);
        })
        .catch(err => {
          callback(err);
        })
      } else {
        Collaborator.create({email: emails, wikiId: wikiId}).then(collaborator => {
          callback(null, collaborator);
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