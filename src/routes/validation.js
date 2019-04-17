const {body, validationResult} = require("express-validator/check");

module.exports = {
  Result(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array());
      return res.redirect(req.headers.referer);
    } else {
      return next();
    }
  },

  validateUsersSignUp(req, res, next) {
    return [
      body('email', 'must be valid').isEmail(),
      body('password', 'must be at least 6 characters in length').isLength({min: 6}),
      body('passwordConfirmation').custom((value, {req}) => {
        if (value !== req.body.password) {
          throw new Error('does not match password');
        } else {
          return value;
        }
      })
    ]
  },

  validateWikis(req, res, next) {
    return [
      body("title", "must be at least 2 characters in length").isLength({min: 2}),
      body("body", "must be at least 10 chacacters in length").isLength({min: 10})
    ]
  }
}