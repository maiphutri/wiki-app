const wikiQueries = require("../db/queries.wikis"),
      Authorizer  = require("../policies/wiki");

module.exports = {
  index(req, res, next) {
    wikiQueries.getAllWikis((err, wikis) => {
      if(err) {
        res.redirect(500, "/");
      } else {
        res.render("wikis/index", {wikis});
      }
    })
  },

  new(req, res, next) {

    const authorized = new Authorizer(req.user).new();

    if (authorized) {
      res.render("wikis/new");
    } else {
      req.flash("notice", "You must be a member to create a new wiki.");
      res.redirect("/wikis");
    }
  },

  create(req, res, next) {
    const authorized = new Authorizer(req.user).create();

    if (authorized) {
      let newWiki = {
        title: req.body.title,
        body: req.body.body,
        userId: req.user.id
      };
  
      wikiQueries.addWiki(newWiki, (err, wiki) => {
        if (err) {
          req.flash("error", err);
          res.redirect("/wikis/new");
        } else {
          res.redirect(`/wikis/${wiki.id}`)
        }
      })
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/topics");
    }
  },

  show(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(500, `/wikis/${req.params.id}`);
      } else {
        res.render("wikis/show", {wiki})
      }
    })
  },

  destroy(req, res, next) {
    wikiQueries.deleteWiki(req, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(500, `/wikis/${req.params.id}`)
      } else {
        res.redirect("/wikis");
      }
    })
  },

  edit(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(500, `/wikis/${req.params.id}`);
      } else {
        const authorized = new Authorizer(req.user, wiki).edit();

        if (authorized) {
          res.render("wikis/edit", {wiki});
        } else {
          req.flash("notice", "You are not authorized to do that.");
          res.redirect(`/wikis/${req.params.id}`)
        }
      }
    })
  },

  update(req, res, next) {
    let updatedWiki = {
      title: req.body.title,
      body: req.body.body
    }
    wikiQueries.updateWiki(req, updatedWiki, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(500, `/wikis/${req.params.id}`);
      } else {
        res.redirect(`/wikis/${req.params.id}`);
      }
    })
  }
}