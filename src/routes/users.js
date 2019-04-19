const express          = require("express"),
      router           = express.Router(),
      userController   = require("../controllers/userController"),
      validation       = require("./validation");

router.get("/users/sign_up", userController.signUp);
router.post("/users/sign_up", validation.validateUsersSignUp(), validation.Result, userController.create);
router.get("/users/sign_in", userController.signInForm);
router.post("/users/sign_in", userController.signIn);
router.get("/users/sign_out", userController.signOut);
router.get("/users/:id/my_wikis", userController.show);

module.exports = router;