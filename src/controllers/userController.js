const userQueries = require("../db/queries.users"),
      passport    = require('passport'),
      User        = require("../db/models").User,
      sgMail           = require('@sendgrid/mail');
      

module.exports = {
  signUp(req, res, next) {
    res.render("users/sign_up");
  },

  create(req, res, next) {
    let newUser = {
      email: req.body.email,
      password: req.body.password,
    };

    userQueries.createUser(newUser, (err, user) => {
      if (err) {
        req.flash("error", err);
        res.redirect("/users/sign_up");
      } else {
        passport.authenticate("local")(req, res, () => {
          const helper = require('sendgrid').mail,
          var from_email = new helper.Email('blocipedia@wiki.com');
          var to_email = new helper.Email(newUser.email);
          var subject = 'Welcome to Blocipedia! Confirm your email.';
          var content = new helper.Content('text/plain', 'Hello, Please Confirm You Email!');
          var mail = new helper.Mail(from_email, subject, to_email, content);

          var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
          var request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON(),
          });

          sg.API(request, function(error, response) {
            console.log(response.statusCode);
            console.log(response.body);
            console.log(response.headers);
          });
          req.flash("notice", "Welcome to Blocipedia!");
          res.redirect("/");
        })
      }
    })
  },

  signInForm(req, res, next) {
    res.render("users/sign_in");
  },

  signIn(req, res, next) {
    passport.authenticate("local")(req, res, function () {
      if (!req.user) {
        req.flash("notice", "Invalid email or password");
        res.redirect("/users/sign_in");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    })
  },

  signOut(req, res, next) {
    req.logout();
    req.flash("notice", "You've successfully signed out!")
    res.redirect("/");
  }
}