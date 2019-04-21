const express          = require("express"),
      router           = express.Router(),
      staticController = require("../controllers/staticController"),
      path             = require("path");

router.get("/", staticController.index);

module.exports = router;