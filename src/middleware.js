import { decryptSession, encryptSession } from "./session";

const forbidden = (res, redirect, code) => {
  res.redirect(redirect);
  res.status(403);
  res.set("x-error", code);
};

const addSessionToRequestContext = (req, token, signingKey) => {
  req.session = decryptSession(token, signingKey);
  return (req.session === false) ? false : true;
};

const addAccessToRequestContext = (req, access) => {
  req.access = access;
  return true;
};

export const factory = (activityAuth, signingKey) => (
  activity,
  redirect = "/access-denied"
) => (req, res, next) =>
    !req.cookies || !req.cookies.token
      ? forbidden(res, redirect, 1)
      : !addSessionToRequestContext(req, req.cookies.token, signingKey)
        ? forbidden(res, redirect, 2)
        : !req.session.roles
          ? forbidden(res, redirect, 3)
          : !activityAuth.check(activity, req.session.roles)
            ? forbidden(res, redirect, 4)
            : addAccessToRequestContext(req, activityAuth.getAccessData(req.session.roles)) && next();

