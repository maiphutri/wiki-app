const express     = require("express"),
      app         = express(),
      routeConfig = require("./config/route-config"),
      appConfig  = require("./config/main-config");

routeConfig.init(app);
appConfig.init();

module.exports = app;