(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "babel-runtime/core-js/set", "babel-runtime/helpers/toConsumableArray", "babel-runtime/helpers/defineProperty", "babel-runtime/core-js/object/assign", "babel-runtime/core-js/object/keys"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("babel-runtime/core-js/set"), require("babel-runtime/helpers/toConsumableArray"), require("babel-runtime/helpers/defineProperty"), require("babel-runtime/core-js/object/assign"), require("babel-runtime/core-js/object/keys"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.set, global.toConsumableArray, global.defineProperty, global.assign, global.keys);
    global.activityAuth = mod.exports;
  }
})(this, function (exports, _set, _toConsumableArray2, _defineProperty2, _assign, _keys) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.factory = exports.getAppsByComponents = exports.getComponentsByEntities = exports.getEntitiesByActivities = exports.getActivitiesByRoles = exports.invertActivitiesByRole = undefined;

  var _set2 = _interopRequireDefault(_set);

  var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

  var _defineProperty3 = _interopRequireDefault(_defineProperty2);

  var _assign2 = _interopRequireDefault(_assign);

  var _keys2 = _interopRequireDefault(_keys);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var invertActivitiesByRole = exports.invertActivitiesByRole = function invertActivitiesByRole(roleActivities) {
    return (0, _keys2.default)(roleActivities).reduce(function (output, role) {
      return roleActivities[role].reduce(function (newOutput, activity) {
        return (0, _assign2.default)({}, newOutput, (0, _defineProperty3.default)({}, activity, (newOutput[activity] || []).concat(role)));
      }, output);
    }, {});
  };

  var getActivitiesByRoles = exports.getActivitiesByRoles = function getActivitiesByRoles(roleActivities, roles) {
    return [].concat((0, _toConsumableArray3.default)(new _set2.default((0, _keys2.default)(roleActivities).reduce(function (output, role) {
      return roles.indexOf(role) > -1 ? output.concat(roleActivities[role]) : output;
    }, []))));
  };

  var getEntitiesByActivities = exports.getEntitiesByActivities = function getEntitiesByActivities(entitiesByActivity, userActivities) {
    return [].concat((0, _toConsumableArray3.default)(new _set2.default((0, _keys2.default)(entitiesByActivity).reduce(function (output, activity) {
      return userActivities.indexOf(activity) > -1 ? output.concat(entitiesByActivity[activity]) : output;
    }, []))));
  };

  var getComponentsByEntities = exports.getComponentsByEntities = function getComponentsByEntities(components, userEntities) {
    return components.filter(function (component) {
      return userEntities.indexOf(component.entity) > -1;
    });
  };

  var getAppsByComponents = exports.getAppsByComponents = function getAppsByComponents(components, apps) {
    var appIds = [].concat((0, _toConsumableArray3.default)(new _set2.default(components.map(function (component) {
      return component.app_id;
    }))));
    return apps.filter(function (app) {
      return appIds.indexOf(app.id) > -1;
    });
  };

  var factory = exports.factory = function factory(activitiesByRole) {
    var entitiesByActivity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var components = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var apps = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

    var rolesByActivity = invertActivitiesByRole(activitiesByRole);

    return {
      check: function check(activity, userRoles) {
        return userRoles.indexOf("superadmin") > -1 ? true : !(activity in rolesByActivity) ? false : rolesByActivity[activity].reduce(function (matched, activityRole) {
          return matched ? matched : userRoles.indexOf(activityRole) > -1;
        }, false);
      },

      getAccessData: function getAccessData(userRoles) {
        var userActivities = getActivitiesByRoles(activitiesByRole, userRoles);
        var userEntities = getEntitiesByActivities(entitiesByActivity, userActivities);
        var userComponents = getComponentsByEntities(components, userEntities);
        var userApps = getAppsByComponents(userComponents, apps);

        return {
          activities: userActivities,
          entities: userEntities,
          components: userComponents,
          apps: userApps
        };
      }
    };
  };
});