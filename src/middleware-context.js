import { decryptSession } from "./session";

export const handleError = ({ errorCode }) => (errorCode ? false : {});

export const getTokenFromCookie = ({ req }) => ({
  token: req.cookies && req.cookies.token ? req.cookies.token : false
});

export const getTokenFromHeader = ({ token, req }) => ({
  token: token
    ? token
    : req.header("Authorization")
      ? req.header("Authorization").replace(/^Bearer /, "")
      : false
});

export const sendTokenRejection = ({ token, activity }) =>
  token ? {} : activity == "public" ? false : { errorCode: 1 };

export const getSessionFromToken = ({ token, signingKey }) => ({
  session: decryptSession(token, signingKey)
});

export const sendSessionRejection = ({ session, activity }) =>
  session
    ? activity == "public"
      ? false
      : {}
    : activity == "public"
      ? false
      : { errorCode: 2 };

export const sendRoleRejection = ({ session }) =>
  session.roles ? {} : { errorCode: 3 };

export const sendActivityRejection = ({
  session: { roles },
  activity,
  activityAuth
}) => (activityAuth.check(activity, roles) ? false : { errorCode: 4 });
