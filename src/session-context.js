import uuidv4 from "uuid/v4";
import { encryptSession } from "./session";

const trackingParams = [
  "affiliate",
  "utm_source",
  "utm_medium",
  "utm_term",
  "utm_content",
  "utm_campaign"
];

export const setReferringUrl = ({ req }) => ({
  referringUrl: req.get("Referrer") || null
});

export const setOriginalUrl = ({ req: { originalUrl } }) => ({
  path: originalUrl
});

export const checkForSession = ({ req: { session } }) => ({
  hasSession: session ? true : false,
  session: session
});

export const createSession = ({ session, hasSession }) => ({
  session: hasSession ? session : {}
});

export const checkForSessionId = ({ session: { id } }) => ({
  hasSessionId: id ? true : false
});

export const createSessionId = ({ hasSessionId, session }) => ({
  session: hasSessionId ? session : Object.assign({}, session, { id: uuidv4() })
});

export const checkForMarketingTracking = ({ req }) => ({
  marketing: trackingParams.reduce(
    (accumulator, key) =>
      req.query
        ? req.query[key] && req.query[key].trim() != ""
          ? accumulator.concat({ [key]: req.query[key].trim() })
          : accumulator
        : accumulator,
    []
  )
});

export const sendCookie = ({
  res,
  session,
  hasSession,
  hasSessionId,
  signingKey,
  sessionExpiration
}) => {
  const sentCookie =
    hasSession === false || hasSessionId === false ? true : false;

  const expiration = sessionExpiration || new Date(253402300000000);
  const token = encryptSession(session, expiration, signingKey);

  if (sentCookie) {
    res.cookie("token", token, { expires: expiration, httpOnly: true, path: "/" });
  }
  return { sentCookie };
};
