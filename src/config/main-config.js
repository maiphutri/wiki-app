require("dotenv").config();
const path       = require("path"),
      viewFolder = path.join(__dirname, "..", "views"),
      logger     = require("morgan");

module.exports = {
  init(app, express) {
    app.set("views", viewFolder);
    app.set("view engine", "ejs");
    app.use(express.static(path.join(__dirname, "..", "assets")));
    app.use(logger('dev'));
  }
}