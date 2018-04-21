(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./middleware", "./activity-auth", "./session"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./middleware"), require("./activity-auth"), require("./session"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.middleware, global.activityAuth, global.session);
    global.index = mod.exports;
  }
})(this, function (exports, _middleware, _activityAuth, _session) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    authorizerFactory: _activityAuth.factory,
    middlewareFactory: _middleware.factory,
    decryptSession: _session.decryptSession,
    encryptSession: _session.encryptSession
  };
});