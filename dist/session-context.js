(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "babel-runtime/helpers/defineProperty", "babel-runtime/core-js/object/assign", "uuid/v4", "./session"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("babel-runtime/helpers/defineProperty"), require("babel-runtime/core-js/object/assign"), require("uuid/v4"), require("./session"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.defineProperty, global.assign, global.v4, global.session);
    global.sessionContext = mod.exports;
  }
})(this, function (exports, _defineProperty2, _assign, _v, _session) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.sendCookie = exports.checkForMarketingTracking = exports.createSessionId = exports.checkForSessionId = exports.createSession = exports.checkForSession = exports.setOriginalUrl = exports.setReferringUrl = undefined;

  var _defineProperty3 = _interopRequireDefault(_defineProperty2);

  var _assign2 = _interopRequireDefault(_assign);

  var _v2 = _interopRequireDefault(_v);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var trackingParams = ["affiliate", "utm_source", "utm_medium", "utm_term", "utm_content", "utm_campaign"];

  var setReferringUrl = exports.setReferringUrl = function setReferringUrl(_ref) {
    var req = _ref.req;
    return {
      referringUrl: req.get("Referrer") || null
    };
  };

  var setOriginalUrl = exports.setOriginalUrl = function setOriginalUrl(_ref2) {
    var originalUrl = _ref2.req.originalUrl;
    return {
      path: originalUrl
    };
  };

  var checkForSession = exports.checkForSession = function checkForSession(_ref3) {
    var session = _ref3.req.session;
    return {
      hasSession: session ? true : false,
      session: session
    };
  };

  var createSession = exports.createSession = function createSession(_ref4) {
    var session = _ref4.session,
        hasSession = _ref4.hasSession;
    return {
      session: hasSession ? session : {}
    };
  };

  var checkForSessionId = exports.checkForSessionId = function checkForSessionId(_ref5) {
    var id = _ref5.session.id;
    return {
      hasSessionId: id ? true : false
    };
  };

  var createSessionId = exports.createSessionId = function createSessionId(_ref6) {
    var hasSessionId = _ref6.hasSessionId,
        session = _ref6.session;
    return {
      session: hasSessionId ? session : (0, _assign2.default)({}, session, { id: (0, _v2.default)() })
    };
  };

  var checkForMarketingTracking = exports.checkForMarketingTracking = function checkForMarketingTracking(_ref7) {
    var req = _ref7.req;
    return {
      marketing: trackingParams.reduce(function (accumulator, key) {
        return req.query ? req.query[key] && req.query[key].trim() != "" ? accumulator.concat((0, _defineProperty3.default)({}, key, req.query[key].trim())) : accumulator : accumulator;
      }, [])
    };
  };

  var sendCookie = exports.sendCookie = function sendCookie(_ref8) {
    var res = _ref8.res,
        session = _ref8.session,
        hasSession = _ref8.hasSession,
        hasSessionId = _ref8.hasSessionId,
        signingKey = _ref8.signingKey,
        sessionExpiration = _ref8.sessionExpiration;

    var sentCookie = hasSession === false || hasSessionId === false ? true : false;

    var expiration = sessionExpiration || new Date(253402300000000);
    var token = (0, _session.encryptSession)(session, expiration, signingKey);

    if (sentCookie) {
      res.cookie("token", token, { expires: expiration, httpOnly: true, path: "/" });
    }
    return { sentCookie: sentCookie };
  };
});