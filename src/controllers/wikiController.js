const wikiQueries = require("../db/queries.wikis"),
      Authorizer  = require("../policies/wiki"),
      markdown    = require("markdown").markdown;

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
        userId: req.user.id,
        private: req.body.private
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
    wikiQueries.getWiki(req.params.id, (err, result) => {
      if (err || result.wiki == null) {
        res.redirect(500, `/wikis/${req.params.id}`);
      } else {
        const body = markdown.toHTML(result.wiki.body);
        
        res.render("wikis/show", {user: result.user, wiki: result.wiki, body: body});
      }
    })
  },

  destroy(req, res, next) {
    wikiQueries.deleteWiki(req, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(500, `/wikis/${req.params.id}`)
      } else {
        if(req.headers.referer === `${process.env.NODE_ENV === "production" ? "https" : "http"}://${req.headers.host}/users/${req.user.id}/my_wikis`) {
          req.flash("notice", `<strong>${wiki.title}</strong> is deleted`)
          res.redirect(req.headers.referer);
        } else {
          req.flash("notice", `<strong>${wiki.title}</strong> is deleted`)
          res.redirect("/wikis");
        }
      }
    })
  },

  edit(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, result) => {
      if (err || result.wiki == null) {
        res.redirect(500, `/wikis/${req.params.id}`);
      } else {
        const authorized = new Authorizer(req.user, result.wiki).edit();

        if (authorized) {
          res.render("wikis/edit", {...result});
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
      body: req.body.body,
      private: req.body.private
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