(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "babel-runtime/regenerator", "babel-runtime/core-js/object/assign", "babel-runtime/helpers/asyncToGenerator", "./session", "every-fn"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("babel-runtime/regenerator"), require("babel-runtime/core-js/object/assign"), require("babel-runtime/helpers/asyncToGenerator"), require("./session"), require("every-fn"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.regenerator, global.assign, global.asyncToGenerator, global.session, global.everyFn);
    global.middleware = mod.exports;
  }
})(this, function (exports, _regenerator, _assign, _asyncToGenerator2, _session, _everyFn) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.middlewareFactory = undefined;

  var _regenerator2 = _interopRequireDefault(_regenerator);

  var _assign2 = _interopRequireDefault(_assign);

  var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

  var _everyFn2 = _interopRequireDefault(_everyFn);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var middlewareFactory = exports.middlewareFactory = function middlewareFactory(activityAuth, signingKey) {
    return function (activity) {
      var redirect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "/access-denied";
      return function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res, next) {
          var errorCode, doNext, setErrorCode, haltThenDoNext, getTokenFromCookie, getTokenFromHeader, sendTokenRejection, getSessionFromToken, sendSessionRejection, sendRoleRejection, sendActivityRejection, data;
          return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  errorCode = false;
                  doNext = false;

                  setErrorCode = function setErrorCode(code) {
                    errorCode = code;
                    return false;
                  };

                  haltThenDoNext = function haltThenDoNext() {
                    doNext = true;
                    return false;
                  };

                  getTokenFromCookie = function getTokenFromCookie() {
                    return {
                      token: req.cookies && req.cookies.token ? req.cookies.token : false
                    };
                  };

                  getTokenFromHeader = function getTokenFromHeader(_ref2) {
                    var token = _ref2.token;
                    return {
                      token: token ? token : req.header("Authorization") ? req.header("Authorization").replace(/^Bearer /, "") : false
                    };
                  };

                  sendTokenRejection = function sendTokenRejection(_ref3) {
                    var token = _ref3.token;
                    return token ? {} : activity == "public" ? haltThenDoNext() : setErrorCode(1);
                  };

                  getSessionFromToken = function getSessionFromToken(_ref4) {
                    var token = _ref4.token;

                    var session = (0, _session.decryptSession)(token, signingKey);
                    if (session) {
                      session = (0, _assign2.default)({}, session);
                    }
                    return {
                      session: session
                    };
                  };

                  sendSessionRejection = function sendSessionRejection(_ref5) {
                    var session = _ref5.session;
                    return session ? activity == "public" ? haltThenDoNext() : {} : activity == "public" ? haltThenDoNext() : setErrorCode(2);
                  };

                  sendRoleRejection = function sendRoleRejection(_ref6) {
                    var session = _ref6.session;
                    return session.roles ? {} : setErrorCode(3);
                  };

                  sendActivityRejection = function sendActivityRejection(_ref7) {
                    var roles = _ref7.session.roles;
                    return activityAuth.check(activity, roles) ? haltThenDoNext() : setErrorCode(4);
                  };

                  _context.next = 13;
                  return (0, _everyFn2.default)([getTokenFromCookie, getTokenFromHeader, sendTokenRejection, getSessionFromToken, sendSessionRejection, sendRoleRejection, sendActivityRejection]);

                case 13:
                  data = _context.sent;

                  if (!doNext) {
                    res.set("x-error", errorCode);
                    res.redirect(redirect);
                    res.status(403);
                  } else {
                    if (data.session) {
                      req.session = data.session;
                    }
                    if (data.session && data.session.roles) {
                      req.access = activityAuth.getAccessData(data.session.roles);
                    }
                    next();
                  }

                case 15:
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