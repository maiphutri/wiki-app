const express     = require("express"),
      app         = express(),
      appConfig   = require("./config/main-config");
      routeConfig = require("./config/route-config"),

appConfig.init(app, express); // always put appConfig first
routeConfig.init(app);

module.exports = app;