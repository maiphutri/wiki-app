module.exports = {
  init(app) {
    const staticRoutes = require("../routes/static");
          userRoutes   = require("../routes/users");

    app.use(staticRoutes);
    app.use(userRoutes);
  }
}