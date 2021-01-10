import assert from "assert";
import {
  invertActivitiesByRole,
  getActivitiesByRoles,
  getEntitiesByActivities,
  getComponentsByEntities,
  getAppsByComponents,
  authorizerFactory
} from "./../src/activity-auth";

describe("data manipulation", () => {
  it("inverts role activities", () => {
    const activitiesByRole = {
      role: ["activity1", "activity2"],
      role2: ["activity1", "activity3"]
    };
    const actual = invertActivitiesByRole(activitiesByRole);
    const expected = {
      activity1: ["role", "role2"],
      activity2: ["role"],
      activity3: ["role2"]
    };
    assert.deepEqual(actual, expected);
  });

  it("gets activities by roles", () => {
    const activitiesByRole = {
      role: ["activity1", "activity2"],
      role2: ["activity0", "activity3"],
      role3: ["activity1", "activity3"]
    };
    const actual = getActivitiesByRoles(activitiesByRole, ["role", "role3"]);
    const expected = ["activity1", "activity2", "activity3"];
    assert.deepEqual(actual, expected);
  });

  it("gets entities by activities", () => {
    const activityEntities = {
      activity1: ["books", "trees"],
      activity2: ["trees", "cars"],
      activity3: ["books", "frogs"]
    };
    const activities = ["activity1", "activity3"];
    const actual = getEntitiesByActivities(activityEntities, activities);
    const expected = ["books", "trees", "frogs"];
    assert.deepEqual(actual, expected);
  });

  it("gets components by entities", () => {
    const components = [
      { id: "a", entity: "frogs" },
      { id: "b", entity: "books" }
    ];
    const entities = ["frogs", "trees"];
    const actual = getComponentsByEntities(components, entities);
    const expected = [{ id: "a", entity: "frogs" }];
    assert.deepEqual(actual, expected);
  });

  it("gets apps by components", () => {
    const components = [
      { id: "a", entity: "frogs", appId: "xapp" },
      { id: "b", entity: "books", appId: "yapp" }
    ];
    const apps = [{ id: "xapp" }, { id: "zapp" }];
    const actual = getAppsByComponents(components, apps);
    const expected = [{ id: "xapp" }];
    assert.deepEqual(actual, expected);
  });
});

describe("user authorizations", () => {
  const activitiesByRole = {
    role: ["activity1", "activity2"],
    role2: ["activity0", "activity3"],
    role3: ["activity1", "activity3"]
  };

  const activityEntities = {
    activity1: ["books", "trees"],
    activity2: ["trees", "cars"],
    activity3: ["books", "frogs"]
  };

  const components = [
    { id: "a", entity: "frogs", appId: "xapp" },
    { id: "b", entity: "cars", appId: "xapp" }
  ];

  const apps = [{ id: "xapp" }, { id: "zapp" }];

  const activityAuth = authorizerFactory(activitiesByRole, activityEntities, components, apps);

  it("accepts authorized user", () => {
    const userRoles = ["role3"];
    const activity = "activity1";
    assert.equal(activityAuth.check(activity, userRoles), true);
  });

  it("rejects un authorized user by role", () => {
    const userRoles = ["role9"];
    const activity = "activity1";
    assert.equal(activityAuth.check(activity, userRoles), false);
  });

  it("rejects un authorized user with no roles", () => {
    const userRoles = [];
    const activity = "activity1";
    assert.equal(activityAuth.check(activity, userRoles), false);
  });

  it("accepts superuser", () => {
    const userRoles = ["superadmin"];
    const activity = "activity8";
    assert.equal(activityAuth.check(activity, userRoles), true);
  });

  it("appends values to req object", () => {
    const userRoles = ["role3"];
    const actual = activityAuth.getAccessData(userRoles);
    const expected = {
      activities: ["activity1", "activity3"],
      entities: ["books", "trees", "frogs"],
      components: [{ id: "a", entity: "frogs", appId: "xapp" }],
      apps: [{ id: "xapp" }]
    };
    assert.deepEqual(actual, expected);
  });
});
