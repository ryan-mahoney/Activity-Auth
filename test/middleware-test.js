import assert from "assert";
import { middlewareFactory } from "./../src/middleware";
import { authorizerFactory } from "./../src/activity-auth";
import { decryptSession, encryptSession } from "./../src/session";

function response() {
  this.code = 200;
  this.location = "";
  this.headers = {};
  this.status = value => (this.code = value);
  this.redirect = value => (this.location = value);
  this.set = (key, value) => (this.headers[key] = value);
}

function request(cookies, headers) {
  this.headers = {};
  this.cookies = cookies;
  this.headers = headers || {};
  this.header = key => this.headers[key] || null;
}

describe("authentication and authorization middleware", () => {
  const activitiesByRole = {
    role: ["activity1", "activity2"],
    role2: ["activity0", "activity3"],
    role3: ["activity1", "activity3"]
  };

  const entitiesByActivity = {
    activity1: ["books", "trees"],
    activity2: ["trees", "cars"],
    activity3: ["books", "frogs"]
  };

  const components = [];
  const apps = [];

  const activityAuth = authorizerFactory(
    activitiesByRole,
    entitiesByActivity,
    components,
    apps
  );

  const signingKey = "XXX";

  const expiration = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours from now

  it("redirects unauthorized request, no cookies", () => {
    let req = new request();
    let res = new response();
    const next = () => {};
    const middleware = middlewareFactory(activityAuth, signingKey);
    middleware("activity1")(req, res, next);
    assert.equal(res.code, 403);
    assert.equal(res.headers["x-error"], 1);
  });

  it("redirects unauthorized request, no token in cookies", () => {
    let req = new request({});
    let res = new response();
    const next = () => {};
    const middleware = middlewareFactory(activityAuth, signingKey);
    middleware("activity1")(req, res, next);
    assert.equal(res.code, 403);
    assert.equal(res.headers["x-error"], 1);
  });

  it("redirects unauthorized request, bad token in cookies", () => {
    let req = new request({ token: "XXX" });
    let res = new response();
    const next = () => {};
    const middleware = middlewareFactory(activityAuth, signingKey);
    middleware("activity1")(req, res, next);
    assert.equal(res.code, 403);
    assert.equal(res.headers["x-error"], 2);
  });

  it("redirects unauthorized request, no roles in session", () => {
    const token = encryptSession({}, expiration, signingKey);
    let req = new request({ token: token });
    let res = new response();
    const next = () => {};
    const middleware = middlewareFactory(activityAuth, signingKey);
    middleware("activity1")(req, res, next);
    assert.equal(res.code, 403);
    assert.equal(res.headers["x-error"], 3);
  });

  it("redirects unauthorized request, restricted role in session", () => {
    const token = encryptSession({ roles: ["role10"] }, expiration, signingKey);
    let req = new request({ token: token });
    let res = new response();
    const next = () => {};
    const middleware = middlewareFactory(activityAuth, signingKey);
    middleware("activity1")(req, res, next);
    assert.equal(res.code, 403);
    assert.equal(res.headers["x-error"], 4);
  });

  it("allows request, authorized role in session", () => {
    const token = encryptSession({ roles: ["role3"] }, expiration, signingKey);
    let req = new request({ token: token });
    let res = new response();
    let nextCalled = false;
    const next = () => (nextCalled = true);
    const middleware = middlewareFactory(activityAuth, signingKey);
    middleware("activity1")(req, res, next);
    assert.equal(res.code, 200);
    assert.equal(nextCalled, true);
  });

  it("allows request, authorized role in header", () => {
    const token = encryptSession({ roles: ["role3"] }, expiration, signingKey);
    let req = new request({}, { Authorization: `Bearer ${token}` });
    let res = new response();
    let nextCalled = false;
    const next = () => (nextCalled = true);
    const middleware = middlewareFactory(activityAuth, signingKey);
    middleware("activity1")(req, res, next);
    assert.equal(res.code, 200);
    assert.equal(nextCalled, true);
  });
});
