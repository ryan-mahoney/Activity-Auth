import { decryptSession, encryptSession } from "./session";
import everyFn from "every-fn";

export const middlewareFactory = (activityAuth, signingKey) => (
  activity,
  redirect = "/access-denied"
) => async (req, res, next) => {
  let errorCode = false;
  let doNext = false;

  const setErrorCode = code => {
    errorCode = code;
    return false;
  };

  const haltThenDoNext = () => {
    doNext = true;
    return false;
  };

  const getTokenFromCookie = () => ({
    token: req.cookies && req.cookies.token ? req.cookies.token : false
  });

  const getTokenFromHeader = ({ token }) => ({
    token: token
      ? token
      : req.header("Authorization")
        ? req.header("Authorization").replace(/^Bearer /, "")
        : false
  });

  const sendTokenRejection = ({ token }) =>
    token ? {} : activity == "public" ? haltThenDoNext() : setErrorCode(1);

  const getSessionFromToken = ({ token }) => {
    let session = decryptSession(token, signingKey);
    if (session) {
      session = Object.assign({}, session);
    }
    return {
      session: session
    };
  };

  const sendSessionRejection = ({ session }) =>
    session
      ? activity == "public"
        ? haltThenDoNext()
        : {}
      : activity == "public"
        ? haltThenDoNext()
        : setErrorCode(2);

  const sendRoleRejection = ({ session }) =>
    session.roles ? {} : setErrorCode(3);

  const sendActivityRejection = ({ session: { roles } }) =>
    activityAuth.check(activity, roles) ? haltThenDoNext() : setErrorCode(4);

  const data = await everyFn([
    getTokenFromCookie,
    getTokenFromHeader,
    sendTokenRejection,
    getSessionFromToken,
    sendSessionRejection,
    sendRoleRejection,
    sendActivityRejection
  ]);
  if (!doNext) {
    res.set("x-error", errorCode);
    res.redirect(redirect);
    res.status(403);
  } else {
    if (data.session) {
      req.session = data.session;
    }
    if (data.session && data.session.roles) {
      req.access = activityAuth.getAccessData(data.session.roles);
    }
    next();
  }
};
