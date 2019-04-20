const express          = require("express"),
      router           = express.Router(),
      userController   = require("../controllers/userController"),
      validation       = require("./validation");

router.get("/users/sign_up", userController.signUp);
router.post("/users/sign_up", validation.validateUsersSignUp(), validation.Result, userController.create);
router.get("/users/sign_in", userController.signInForm);
router.post("/users/sign_in", userController.signIn);
router.get("/users/sign_out", userController.signOut);
router.get("/users/:id/my_wikis", userController.myWikis);
router.get("/users/:id/premium_plan", userController.premiumPlan);
router.post("/users/:id/charge", userController.charge);
router.get("/users/:id/charge/thank_you", userController.thanks);
router.get("/users/:id/change_plan", userController.changePlan);
router.post("/users/:id/downgrade", userController.downgrade);

module.exports = router;