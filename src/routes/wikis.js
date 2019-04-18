const express        = require("express"),
      router         = express.Router(),
      wikiController = require("../controllers/wikiController"),
      validation     = require("./validation");

router.get("/wikis", wikiController.index);    
router.get("/wikis/new", wikiController.new);
router.post("/wikis/create", validation.validateWikis(), validation.Result, wikiController.create);
router.get("/wikis/:id", wikiController.show);
router.post("/wikis/:id/destroy", wikiController.destroy);
router.get("/wikis/:id/edit", wikiController.edit);
router.post("/wikis/:id/update", validation.validateWikis(), validation.Result, wikiController.update);

module.exports = router;