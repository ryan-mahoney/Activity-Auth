import { v4 as uuidv4 } from "uuid";
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
  referringUrl: req.get("referrer") || req.get("referer") || null
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

export const checkForMarketingTracking = ({ req, trackingFieldAlias }) => ({
  marketing: trackingParams.reduce(
    (accumulator, key) =>
      req.query
        ? req.query[trackingKey(key, trackingFieldAlias)] &&
          req.query[trackingKey(key, trackingFieldAlias)].trim() != ""
          ? Object.assign({}, accumulator, {
              [key]: req.query[trackingKey(key, trackingFieldAlias)].trim()
            })
          : accumulator
        : accumulator,
    []
  )
});

const trackingKey = (key, aliases) => (aliases[key] ? aliases[key] : key);

export const sendCookie = ({
  req,
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
  req.session = session;

  if (sentCookie) {
    res.cookie("token", token, {
      expires: expiration,
      httpOnly: true,
      path: "/"
    });
  }
  return { sentCookie };
};
