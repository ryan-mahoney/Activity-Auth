import { every } from "every-fn";
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

export const middlewareFactory = (userModel, clientId, activityAuth, signingKey, sessionExpiration) => (
  activity,
  redirect = "/access-denied"
) => async (req, res, nextFn) => {
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
    { userModel, clientId, activity, req, res, signingKey, activityAuth, sessionExpiration }
  );
  if (data.activity != "public" && data.errorCode) {
    res.set("x-error", data.errorCode);
    res.redirect(redirect);
    res.status(403);
    return;
  }
  if (data.session) {
    req.session = data.session;
  }
  if (data.session && data.session.roles) {
    req.access = activityAuth.getAccessData(data.session.roles);
  }
  nextFn();
};
