module.exports = {
  init(app) {
    const staticRoutes = require("../routes/static"),
          userRoutes   = require("../routes/users"),
          wikiRoutes   = require("../routes/wikis");

    app.use(staticRoutes);
    app.use(userRoutes);
    app.use(wikiRoutes);
  }
}