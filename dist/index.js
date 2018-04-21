(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module", "./middleware", "./activity-auth", "./session"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require("./middleware"), require("./activity-auth"), require("./session"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.middleware, global.activityAuth, global.session);
    global.index = mod.exports;
  }
})(this, function (module, _middleware, _activityAuth, _session) {
  "use strict";

  module.exports = {
    authorizerFactory: _activityAuth.authorizerFactory,
    middlewareFactory: _middleware.middlewareFactory,
    decryptSession: _session.decryptSession,
    encryptSession: _session.encryptSession
  };
});