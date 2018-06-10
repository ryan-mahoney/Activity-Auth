import everyFn from "every-fn";
import {
  getTokenFromCookie,
  getTokenFromHeader,
  sendTokenRejection,
  handleError,
  getSessionFromToken,
  sendSessionRejection,
  sendRoleRejection,
  sendActivityRejection
} from "./context";

export const middlewareFactory = (activityAuth, signingKey, sessionHandler) => (
  activity,
  redirect = "/access-denied"
) => async (req, res, next) => {
  const data = await everyFn(
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
    if (sessionHandler) {
      sessionHandler(req, res);
    }
    next();
  }
};
