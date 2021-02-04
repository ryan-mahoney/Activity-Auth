import { decryptSession } from "./session";

export const handleError = ({ errorCode }) => (errorCode ? false : {});

export const getTokenFromCookie = ({ req }) => ({
  token: req.cookies && req.cookies.token ? req.cookies.token : false,
  refresh: req.cookies && req.cookies.refresh ? req.cookies.refresh : false
});

export const getTokenFromHeader = ({ token, refresh, req }) => ({
  token: token ? token : req.header("Authorization") ? req.header("Authorization").replace(/^Bearer /, "") : false,
  refresh: refresh ? refresh : req.header("Refresh") ? req.header("Refresh").replace(/^Refresh /, "") : false
});

export const sendTokenRejection = ({ token, activity }) =>
  token ? {} : activity == "public" ? false : { errorCode: 1 };

export const getSessionFromToken = async ({
  res,
  userModel,
  clientId,
  token,
  refresh,
  signingKey,
  sessionExpiration
}) => {
  return {
    session: await decryptSession(res, userModel, clientId, token, refresh, signingKey, sessionExpiration)
  };
};

export const sendSessionRejection = ({ session, activity }) =>
  session ? (activity == "public" ? false : {}) : activity == "public" ? false : { errorCode: 2 };

export const sendRoleRejection = ({ session }) => (session.roles ? {} : { errorCode: 3 });

export const sendActivityRejection = ({ session: { roles }, activity, activityAuth }) =>
  activityAuth.check(activity, roles) ? false : { errorCode: 4 };
