const passport      = require("passport"),
      LocalStrategy = require("passport-local").Strategy,
      User          = require("../db/models").User,
      authHelper    = require("../auth/helpers");

module.exports = {
  init(app) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy({
      usernameField: "email"
    }, (email, password, done) => {
      User.findOne({where:{email: email}}).then(user => {
        if (!user || !authHelper.comparePass(password, user.password)) {
          return done(null, false, req.flash("notice", "Invalid email or password"));
        }
        return done(null, user);
      })
      .catch(err => {
        if (err) { return done(err); }
      })
    }));

    passport.serializeUser((user, callback) => {
      callback(null, user.id);
    });

    passport.deserializeUser((id, callback) => {
      User.findByPk(id)
      .then((user) => {
        callback(null, user);
      })
      .catch((err =>{
        callback(err, user);
      }))
    });
  }
}
