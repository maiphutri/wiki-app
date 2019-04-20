require("dotenv").config();
const path             = require("path"),
      viewFolder       = path.join(__dirname, "..", "views"),
      bodyParser       = require("body-parser"),
      session          = require("express-session"),
      flash            = require("express-flash"),
      passportConfig   = require("./passport-config"),
      logger           = require('morgan');
      
module.exports = {
  init(app, express) {
    app.set("views", viewFolder);
    app.set("view engine", "ejs");
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.static(path.join(__dirname, "..", "assets")));
    app.use(logger('dev'));
    app.use(session({
      secret: process.env.cookieSecret,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1.21e+9 }
    }));
    app.use(flash());
    passportConfig.init(app);
    app.use((req, res, next) => {
      res.locals.currentUser = req.user;
      next();
    });
  }
}