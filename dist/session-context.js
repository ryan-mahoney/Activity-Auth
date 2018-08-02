"use strict";

var uuidv4 = require("uuid/v4");

var _session = require("./session");

var encryptSession = _session.encryptSession;


const trackingParams = ["affiliate", "utm_source", "utm_medium", "utm_term", "utm_content", "utm_campaign"];

const setReferringUrl = exports.setReferringUrl = ({ req }) => ({
  referringUrl: req.get("Referrer") || null
});

const setOriginalUrl = exports.setOriginalUrl = ({ req: { originalUrl } }) => ({
  path: originalUrl
});

const checkForSession = exports.checkForSession = ({ req: { session } }) => ({
  hasSession: session ? true : false,
  session: session
});

const createSession = exports.createSession = ({ session, hasSession }) => ({
  session: hasSession ? session : {}
});

const checkForSessionId = exports.checkForSessionId = ({ session: { id } }) => ({
  hasSessionId: id ? true : false
});

const createSessionId = exports.createSessionId = ({ hasSessionId, session }) => ({
  session: hasSessionId ? session : Object.assign({}, session, { id: uuidv4() })
});

const checkForMarketingTracking = exports.checkForMarketingTracking = ({ req }) => ({
  marketing: trackingParams.reduce((accumulator, key) => req.query ? req.query[key] && req.query[key].trim() != "" ? Object.assign({}, accumulator, { [key]: req.query[key].trim() }) : accumulator : accumulator, [])
});

const sendCookie = exports.sendCookie = ({
  res,
  session,
  hasSession,
  hasSessionId,
  signingKey,
  sessionExpiration
}) => {
  const sentCookie = hasSession === false || hasSessionId === false ? true : false;

  const expiration = sessionExpiration || new Date(253402300000000);
  const token = encryptSession(session, expiration, signingKey);

  if (sentCookie) {
    res.cookie("token", token, {
      expires: expiration,
      httpOnly: true,
      path: "/"
    });
  }
  return { sentCookie };
};