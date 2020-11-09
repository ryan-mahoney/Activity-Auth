"use strict";

var _uuid = require("uuid");

var uuidv4 = _uuid.v4;

var _session = require("./session");

var encryptSession = _session.encryptSession;
const trackingParams = ["affiliate", "utm_source", "utm_medium", "utm_term", "utm_content", "utm_campaign"];

const setReferringUrl = exports.setReferringUrl = ({
  req
}) => ({
  referringUrl: req.get("referrer") || req.get("referer") || null
});

const setOriginalUrl = exports.setOriginalUrl = ({
  req: {
    originalUrl
  }
}) => ({
  path: originalUrl
});

const checkForSession = exports.checkForSession = ({
  req: {
    session
  }
}) => ({
  hasSession: session ? true : false,
  session: session
});

const createSession = exports.createSession = ({
  session,
  hasSession
}) => ({
  session: hasSession ? session : {}
});

const checkForSessionId = exports.checkForSessionId = ({
  session: {
    id
  }
}) => ({
  hasSessionId: id ? true : false
});

const createSessionId = exports.createSessionId = ({
  hasSessionId,
  session
}) => ({
  session: hasSessionId ? session : Object.assign({}, session, {
    id: uuidv4()
  })
});

const checkForMarketingTracking = exports.checkForMarketingTracking = ({
  req,
  trackingFieldAlias
}) => ({
  marketing: trackingParams.reduce((accumulator, key) => req.query ? req.query[trackingKey(key, trackingFieldAlias)] && req.query[trackingKey(key, trackingFieldAlias)].trim() != "" ? Object.assign({}, accumulator, {
    [key]: req.query[trackingKey(key, trackingFieldAlias)].trim()
  }) : accumulator : accumulator, [])
});

const trackingKey = (key, aliases) => aliases[key] ? aliases[key] : key;

const sendCookie = exports.sendCookie = ({
  req,
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
  req.session = session;

  if (sentCookie) {
    res.cookie("token", token, {
      expires: expiration,
      httpOnly: true,
      path: "/"
    });
  }

  return {
    sentCookie
  };
};