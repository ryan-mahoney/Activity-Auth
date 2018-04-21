(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./session"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./session"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.session);
    global.middleware = mod.exports;
  }
})(this, function (exports, _session) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.middlewareFactory = undefined;


  var forbidden = function forbidden(res, redirect, code) {
    res.set("x-error", code);
    res.redirect(redirect);
    res.status(403);
  };

  var addSessionToRequestContext = function addSessionToRequestContext(req, token, signingKey) {
    req.session = (0, _session.decryptSession)(token, signingKey);
    return req.session === false ? false : true;
  };

  var addAccessToRequestContext = function addAccessToRequestContext(req, access) {
    req.access = access;
    return true;
  };

  var middlewareFactory = exports.middlewareFactory = function middlewareFactory(activityAuth, signingKey) {
    return function (activity) {
      var redirect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "/access-denied";
      return function (req, res, next) {
        return !req.cookies || !req.cookies.token ? forbidden(res, redirect, 1) : !addSessionToRequestContext(req, req.cookies.token, signingKey) ? forbidden(res, redirect, 2) : !req.session.roles ? forbidden(res, redirect, 3) : !activityAuth.check(activity, req.session.roles) ? forbidden(res, redirect, 4) : addAccessToRequestContext(req, activityAuth.getAccessData(req.session.roles)) && next();
      };
    };
  };
});