const express = require("express"),
      router  = express.Router(),
      collaboratorController = require("../controllers/collaboratorController");

router.get("/wikis/:id/collaborators", collaboratorController.index);
router.post("/wikis/:id/collaborators/create", collaboratorController.update);

module.exports = router;