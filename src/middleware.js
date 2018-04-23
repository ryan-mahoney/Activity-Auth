import { decryptSession, encryptSession } from "./session";

const forbidden = (res, redirect) => {
  res.redirect(redirect);
  res.status(403);
};

const addSessionToRequestContext = (req, token, signingKey) => {
  req.session = decryptSession(token, signingKey);
  return req.session === false ? false : true;
};

const addAccessToRequestContext = (req, access) => {
  req.access = access;
};

export const middlewareFactory = (activityAuth, signingKey) => (
  activity,
  redirect = "/access-denied"
) => (req, res, next) =>
  [
    // check for token
    (req, res) =>
      !req.cookies || !req.cookies.token ? res.set("x-error", 1) : true,

    // check for session
    (req, res) =>
      !addSessionToRequestContext(req, req.cookies.token, signingKey)
        ? res.set("x-error", 2)
        : true,

    // check for roles in session
    (req, res) => (!req.session.roles ? res.set("x-error", 3) : true),

    // check for role access to activity
    (req, res) =>
      !activityAuth.check(activity, req.session.roles)
        ? res.set("x-error", 4)
        : true
  ].reduce((doNext, fn) => (doNext === true ? fn(req, res) : false), true) ===
  true
    ? addAccessToRequestContext(
        req,
        activityAuth.getAccessData(req.session.roles)
      ) && next()
    : forbidden(res, redirect);
