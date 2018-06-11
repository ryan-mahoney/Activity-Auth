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
    global.middlewareContext = mod.exports;
  }
})(this, function (exports, _session) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.sendActivityRejection = exports.sendRoleRejection = exports.sendSessionRejection = exports.getSessionFromToken = exports.sendTokenRejection = exports.getTokenFromHeader = exports.getTokenFromCookie = exports.handleError = undefined;
  var handleError = exports.handleError = function handleError(_ref) {
    var errorCode = _ref.errorCode;
    return errorCode ? false : {};
  };

  var getTokenFromCookie = exports.getTokenFromCookie = function getTokenFromCookie(_ref2) {
    var req = _ref2.req;
    return {
      token: req.cookies && req.cookies.token ? req.cookies.token : false
    };
  };

  var getTokenFromHeader = exports.getTokenFromHeader = function getTokenFromHeader(_ref3) {
    var token = _ref3.token,
        req = _ref3.req;
    return {
      token: token ? token : req.header("Authorization") ? req.header("Authorization").replace(/^Bearer /, "") : false
    };
  };

  var sendTokenRejection = exports.sendTokenRejection = function sendTokenRejection(_ref4) {
    var token = _ref4.token,
        activity = _ref4.activity;
    return token ? {} : activity == "public" ? false : { errorCode: 1 };
  };

  var getSessionFromToken = exports.getSessionFromToken = function getSessionFromToken(_ref5) {
    var token = _ref5.token,
        signingKey = _ref5.signingKey;
    return {
      session: (0, _session.decryptSession)(token, signingKey)
    };
  };

  var sendSessionRejection = exports.sendSessionRejection = function sendSessionRejection(_ref6) {
    var session = _ref6.session,
        activity = _ref6.activity;
    return session ? activity == "public" ? false : {} : activity == "public" ? false : { errorCode: 2 };
  };

  var sendRoleRejection = exports.sendRoleRejection = function sendRoleRejection(_ref7) {
    var session = _ref7.session;
    return session.roles ? {} : { errorCode: 3 };
  };

  var sendActivityRejection = exports.sendActivityRejection = function sendActivityRejection(_ref8) {
    var roles = _ref8.session.roles,
        activity = _ref8.activity,
        activityAuth = _ref8.activityAuth;
    return activityAuth.check(activity, roles) ? false : { errorCode: 4 };
  };
});