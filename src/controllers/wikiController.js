const wikiQueries = require("../db/queries.wikis");

module.exports = {
  index(req, res, next) {
    wikiQueries.getAllWikis((err, wikis) => {
      if(err) {
        res.redirect("500", "static/index");
      } else {
        res.render("wikis/index", {wikis});
      }
    })
  },

  new(req, res, next) {
    res.render("wikis/new");
  },

  create(req, res, next) {
    let newWiki = {
      title: req.body.title,
      body: req.body.body,
    };

    wikiQueries.addWiki(newWiki, (err, wiki) => {
      if (err) {
        req.flash("error", err);
        res.redirect("/wikis/new");
      } else {
        res.redirect(`/wikis/${wiki.id}`)
      }
    })
  },

  show(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(404, "/");
      } else {
        res.render("wikis/show", {wiki})
      }
    })
  },

  destroy(req, res, next) {
    wikiQueries.deleteWiki(req.params.id, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(err, `/wikis/${req.params.id}`);
      } else {
        res.redirect("/wikis");
      }
    })
  },

  edit(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(404, "/");
      } else {
        res.render("wikis/edit", {wiki});
      }
    })
  },

  update(req, res, next) {
    let updatedWiki = {
      title: req.body.title,
      body: req.body.body
    }
    wikiQueries.updateWiki(req.params.id, updatedWiki, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(404, `/wikis/${req.params.id}/edit`);
      } else {
        res.redirect(`/wikis/${req.params.id}`);
      }
    })
  }
}