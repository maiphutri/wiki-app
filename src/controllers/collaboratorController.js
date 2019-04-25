const collaboratorQueries = require("../db/queries.collaborators.js"),
      userQueries         = require("../db/queries.users"),
      Authorizer          = require("../policies/collaborator"),
      Wiki                = require("../db/models").Wiki;

module.exports = {
  index(req, res, next) {
    Wiki.findByPk(req.params.id).then(wiki => {
      const authorized = new Authorizer(req.user, wiki).new();

      if (authorized) {
        collaboratorQueries.getCollaborators(req, (err, collaborators) => {
          if (err) {
            res.redirect(500, "/");
          } else {
            const collaboratorList = collaborators.map(colla => colla.email)
    
            userQueries.getUsers(req, collaboratorList, (err, users) => {
              if (err) {
                res.redirect(500, "/");
              } else {
                res.render("collaborators/index", {collaborators: collaborators, users: users, wikiId: req.params.id});
              }
            })
          }
        })
      } else {
        req.flash("notice", "You are not authorized to do that");
        res.redirect("/wikis");
      }
    })
    .catch(err => {
      console.log(err);
    })
  },

  update(req, res, next) {
    Wiki.findByPk(req.params.id).then(wiki => {
      const authorized = new Authorizer(req.user, wiki).new();
      if (authorized) {
        collaboratorQueries.updateCollaborator(req, (err, collaborator) => {
          if (err) {
            res.redirect(500, "/");
          } else {
            res.redirect(`/wikis/${req.params.id}`);
          }
        })
      } else {
        req.flash("notice", "You must be a premium member to add collaborator.");
        res.redirect("/wikis");
      }
    })
    .catch(err => {
      console.log(err);
    })
  }
}