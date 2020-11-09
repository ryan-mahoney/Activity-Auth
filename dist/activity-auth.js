"use strict";

const invertActivitiesByRole = exports.invertActivitiesByRole = roleActivities => Object.keys(roleActivities).reduce((output, role) => roleActivities[role].reduce((newOutput, activity) => Object.assign({}, newOutput, {
  [activity]: (newOutput[activity] || []).concat(role)
}), output), {});

const getActivitiesByRoles = exports.getActivitiesByRoles = (roleActivities, roles) => [...new Set(Object.keys(roleActivities).reduce((output, role) => {
  return roles.indexOf(role) > -1 ? output.concat(roleActivities[role]) : output;
}, []))];

const getEntitiesByActivities = exports.getEntitiesByActivities = (entitiesByActivity, userActivities) => [...new Set(Object.keys(entitiesByActivity).reduce((output, activity) => userActivities.indexOf(activity) > -1 ? output.concat(entitiesByActivity[activity]) : output, []))];

const getComponentsByEntities = exports.getComponentsByEntities = (components, userEntities) => components.filter(component => userEntities.indexOf(component.entity) > -1);

const getAppsByComponents = exports.getAppsByComponents = (components, apps) => {
  const appIds = [...new Set(components.map(component => component.app_id))];
  return apps.filter(app => appIds.indexOf(app.id) > -1);
};

const authorizerFactory = exports.authorizerFactory = (activitiesByRole, entitiesByActivity = {}, components = [], apps = []) => {
  const rolesByActivity = invertActivitiesByRole(activitiesByRole);
  return {
    check: (activity, userRoles) => userRoles.indexOf("superadmin") > -1 ? true : !(activity in rolesByActivity) ? false : rolesByActivity[activity].reduce((matched, activityRole) => matched ? matched : userRoles.indexOf(activityRole) > -1, false),
    getAccessData: userRoles => {
      const userActivities = getActivitiesByRoles(activitiesByRole, userRoles);
      const userEntities = getEntitiesByActivities(entitiesByActivity, userActivities);
      const userComponents = getComponentsByEntities(components, userEntities);
      const userApps = getAppsByComponents(userComponents, apps);
      return {
        activities: userActivities,
        entities: userEntities,
        components: userComponents,
        apps: userApps
      };
    }
  };
};