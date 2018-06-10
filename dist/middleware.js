(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "babel-runtime/regenerator", "babel-runtime/helpers/asyncToGenerator", "every-fn", "./context"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("babel-runtime/regenerator"), require("babel-runtime/helpers/asyncToGenerator"), require("every-fn"), require("./context"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.regenerator, global.asyncToGenerator, global.everyFn, global.context);
    global.middleware = mod.exports;
  }
})(this, function (exports, _regenerator, _asyncToGenerator2, _everyFn, _context2) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.middlewareFactory = undefined;

  var _regenerator2 = _interopRequireDefault(_regenerator);

  var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

  var _everyFn2 = _interopRequireDefault(_everyFn);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var middlewareFactory = exports.middlewareFactory = function middlewareFactory(activityAuth, signingKey, sessionHandler) {
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
                  return (0, _everyFn2.default)([_context2.getTokenFromCookie, _context2.getTokenFromHeader, _context2.sendTokenRejection, _context2.handleError, _context2.getSessionFromToken, _context2.sendSessionRejection, _context2.handleError, _context2.sendRoleRejection, _context2.handleError, _context2.sendActivityRejection, _context2.handleError], { activity: activity, req: req, signingKey: signingKey, activityAuth: activityAuth });

                case 2:
                  data = _context.sent;

                  if (data.activity != "public" && data.errorCode) {
                    res.set("x-error", data.errorCode);
                    res.redirect(redirect);
                    res.status(403);
                  } else {
                    if (data.session) {
                      req.session = data.session;
                    }
                    if (data.session && data.session.roles) {
                      req.access = activityAuth.getAccessData(data.session.roles);
                    }
                    if (sessionHandler) {
                      sessionHandler(req, res);
                    }
                    next();
                  }

                case 4:
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