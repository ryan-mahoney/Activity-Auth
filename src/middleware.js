import { every } from "every-fn";
import sessionHandler from "./session-handler";
import {
  getTokenFromCookie,
  getTokenFromHeader,
  sendTokenRejection,
  handleError,
  getSessionFromToken,
  sendSessionRejection,
  sendRoleRejection,
  sendActivityRejection
} from "./middleware-context";

export const middlewareFactory = (
  activityAuth,
  signingKey,
  logHandler,
  trackingFieldAlias = {}
) => (activity, redirect = "/access-denied") => async (req, res, next) => {
  const data = await every(
    [
      getTokenFromCookie,
      getTokenFromHeader,
      sendTokenRejection,
      handleError,
      getSessionFromToken,
      sendSessionRejection,
      handleError,
      sendRoleRejection,
      handleError,
      sendActivityRejection,
      handleError
    ],
    { activity, req, signingKey, activityAuth }
  );
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
    await sessionHandler(
      req,
      res,
      signingKey,
      null,
      logHandler,
      trackingFieldAlias
    );
    next();
  }
};
