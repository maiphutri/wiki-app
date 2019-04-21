const userQueries = require("../db/queries.users"),
      passport    = require('passport'),
      User        = require("../db/models").User;

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
          const helper     = require('sendgrid').mail,
                from_email = new helper.Email('blocipedia@wiki.com'),
                to_email = new helper.Email(newUser.email),
                subject = 'Welcome to Blocipedia! Confirm your email.',
                content = new helper.Content('text/plain', 'Hello, Please Confirm You Email!'),
                mail = new helper.Mail(from_email, subject, to_email, content),
                sg = require('sendgrid')(process.env.SENDGRID_API_KEY),
                request = sg.emptyRequest({
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
  },

  myWikis(req, res, next) {
    userQueries.getUser(req.params.id, (err, result) => {
      if (err || result.user === undefined) {
        req.flash("notice", "User not found");
        res.redirect("/");
      } else {
        res.render("users/profiles/my_wikis", {...result});
      }
    })
  },

  premiumPlan(req, res, next) {
    let http = "http";
    if (process.env.NODE_ENV === "production") {http = "https"};
    res.render("users/profiles/plan", {http: http, host: req.headers.host});
  },

  charge(req, res, next) {
    if (req.user.role === "premium") {
      req.flash("notice", "You're already a premium member");
      res.redirect(req.headers.referer);
    } else {
      userQueries.upgradeUser(req.params.id, (err, user) => {
        if (err || user == null) {
          req.flash("notice", "User not found");
          res.redirect("/");
        } else {
          res.redirect(`/users/${req.params.id}/charge/thank_you`)
        }
      })
    }
  },

  thanks(req, res, next) {
    res.render("users/profiles/thank_you");
  },

  changePlan(req, res, next) {
    res.render("users/profiles/change_plan")
  },

  downgrade(req, res, next) {
    userQueries.downgradeUser(req.params.id, (err, user) => {
      if (err || user == null) {
        req.flash("notice", "User not found");
        res.redirect("/");
      } else {
        req.flash("notice", "You've has been successfully downgraded to standard member")
        res.redirect("/wikis")
      }
    })
  }
}