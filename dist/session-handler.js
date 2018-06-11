(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "babel-runtime/regenerator", "babel-runtime/helpers/asyncToGenerator", "every-fn", "./session-context"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("babel-runtime/regenerator"), require("babel-runtime/helpers/asyncToGenerator"), require("every-fn"), require("./session-context"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.regenerator, global.asyncToGenerator, global.everyFn, global.sessionContext);
    global.sessionHandler = mod.exports;
  }
})(this, function (exports, _regenerator, _asyncToGenerator2, _everyFn, _sessionContext) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _regenerator2 = _interopRequireDefault(_regenerator);

  var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

  var _everyFn2 = _interopRequireDefault(_everyFn);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res, signingKey, sessionExpiration, eventLogHandler) {
      var data;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _everyFn2.default)([_sessionContext.setReferringUrl, _sessionContext.setOriginalUrl, _sessionContext.checkForSession, _sessionContext.createSession, _sessionContext.checkForSessionId, _sessionContext.createSessionId, _sessionContext.checkForMarketingTracking, _sessionContext.sendCookie], { req: req, res: res, signingKey: signingKey, sessionExpiration: sessionExpiration });

            case 2:
              data = _context.sent;

              if (eventLogHandler) {
                eventLogHandler(data);
              }

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2, _x3, _x4, _x5) {
      return _ref.apply(this, arguments);
    };
  }();
});