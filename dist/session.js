(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "njwt"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("njwt"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.njwt);
    global.session = mod.exports;
  }
})(this, function (exports, _njwt) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.encryptSession = exports.decryptSession = undefined;

  var _njwt2 = _interopRequireDefault(_njwt);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var decryptSession = exports.decryptSession = function decryptSession(token, signingKey) {
    try {
      return _njwt2.default.verify(token, signingKey).body;
    } catch (e) {
      return false;
    }
  };

  var encryptSession = exports.encryptSession = function encryptSession(data, expiration, signingKey) {
    return _njwt2.default.create(data, signingKey).setExpiration(expiration).compact();
  };
});