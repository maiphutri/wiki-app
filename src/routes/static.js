const express = require("express"),
      router  = express.Router();

router.get("/", (req, res, next) => {
  res.send("Welcome to Blocipedia");
})

module.exports = router;