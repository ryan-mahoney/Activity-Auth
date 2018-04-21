(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./../src/middleware", "./../src/activity-auth"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./../src/middleware"), require("./../src/activity-auth"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.middleware, global.activityAuth);
    global.index = mod.exports;
  }
})(this, function (exports, _middleware, _activityAuth) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = { authorizerFactory: _activityAuth.factory, middlewareFactory: _middleware.factory };
});