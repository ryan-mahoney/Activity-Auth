(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "babel-runtime/regenerator", "babel-runtime/helpers/asyncToGenerator", "every-fn", "./session-handler", "./middleware-context"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("babel-runtime/regenerator"), require("babel-runtime/helpers/asyncToGenerator"), require("every-fn"), require("./session-handler"), require("./middleware-context"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.regenerator, global.asyncToGenerator, global.everyFn, global.sessionHandler, global.middlewareContext);
    global.middleware = mod.exports;
  }
})(this, function (exports, _regenerator, _asyncToGenerator2, _everyFn, _sessionHandler, _middlewareContext) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.middlewareFactory = undefined;

  var _regenerator2 = _interopRequireDefault(_regenerator);

  var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

  var _everyFn2 = _interopRequireDefault(_everyFn);

  var _sessionHandler2 = _interopRequireDefault(_sessionHandler);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var middlewareFactory = exports.middlewareFactory = function middlewareFactory(activityAuth, signingKey, logHandler) {
    return function (activity) {
      var redirect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "/access-denied";
      return function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res, next) {
          var data;
          return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return (0, _everyFn2.default)([_middlewareContext.getTokenFromCookie, _middlewareContext.getTokenFromHeader, _middlewareContext.sendTokenRejection, _middlewareContext.handleError, _middlewareContext.getSessionFromToken, _middlewareContext.sendSessionRejection, _middlewareContext.handleError, _middlewareContext.sendRoleRejection, _middlewareContext.handleError, _middlewareContext.sendActivityRejection, _middlewareContext.handleError], { activity: activity, req: req, signingKey: signingKey, activityAuth: activityAuth });

                case 2:
                  data = _context.sent;

                  if (!(data.activity != "public" && data.errorCode)) {
                    _context.next = 9;
                    break;
                  }

                  res.set("x-error", data.errorCode);
                  res.redirect(redirect);
                  res.status(403);
                  _context.next = 14;
                  break;

                case 9:
                  if (data.session) {
                    req.session = data.session;
                  }
                  if (data.session && data.session.roles) {
                    req.access = activityAuth.getAccessData(data.session.roles);
                  }
                  _context.next = 13;
                  return (0, _sessionHandler2.default)(req, res, signingKey, null, logHandler);

                case 13:
                  next();

                case 14:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, undefined);
        }));

        return function (_x2, _x3, _x4) {
          return _ref.apply(this, arguments);
        };
      }();
    };
  };
});