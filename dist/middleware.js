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


  var forbidden = function forbidden(res, redirect) {
    res.redirect(redirect);
    res.status(403);
  };

  var addSessionToRequestContext = function addSessionToRequestContext(req, token, signingKey) {
    req.session = (0, _session.decryptSession)(token, signingKey);
    return req.session === false ? false : true;
  };

  var addAccessToRequestContext = function addAccessToRequestContext(req, access) {
    return req.access = access;
  };

  var getTokenFromCookieOrHeader = function getTokenFromCookieOrHeader(req) {
    return req.token = req.cookies && req.cookies.token ? req.cookies.token : req.header("Authorization") ? req.header("Authorization").replace(/^Bearer /, "") : false;
  };

  var middlewareFactory = exports.middlewareFactory = function middlewareFactory(activityAuth, signingKey) {
    return function (activity) {
      var redirect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "/access-denied";
      return function (req, res, next) {
        return [
        // check for token
        function (req, res) {
          return !getTokenFromCookieOrHeader(req) ? res.set("x-error", 1) : true;
        },

        // check for session
        function (req, res) {
          return !addSessionToRequestContext(req, req.token, signingKey) ? res.set("x-error", 2) : true;
        },

        // check for roles in session
        function (req, res) {
          return !req.session.roles ? res.set("x-error", 3) : true;
        },

        // check for role access to activity
        function (req, res) {
          return !activityAuth.check(activity, req.session.roles) ? res.set("x-error", 4) : true;
        }].reduce(function (doNext, fn) {
          return doNext === true ? fn(req, res) : false;
        }, true) === true ? addAccessToRequestContext(req, activityAuth.getAccessData(req.session.roles)) && next() : forbidden(res, redirect);
      };
    };
  };
});