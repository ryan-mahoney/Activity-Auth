"use strict";

var _everyFn = require("every-fn");

var every = _everyFn.every;

var _sessionContext = require("./session-context");

var setReferringUrl = _sessionContext.setReferringUrl;
var setOriginalUrl = _sessionContext.setOriginalUrl;
var checkForSession = _sessionContext.checkForSession;
var createSession = _sessionContext.createSession;
var checkForSessionId = _sessionContext.checkForSessionId;
var createSessionId = _sessionContext.createSessionId;
var checkForMarketingTracking = _sessionContext.checkForMarketingTracking;
var sendCookie = _sessionContext.sendCookie;

<<<<<<< HEAD
module.exports = async (req, res, signingKey, sessionExpiration, eventLogHandler, trackingFieldAlias, nextFn) => {
  const data = await every([setHostOrigin, setReferringUrl, setOriginalUrl, checkForSession, createSession, checkForSessionId, createSessionId, checkForMarketingTracking, sendCookie], { req, res, signingKey, sessionExpiration, trackingFieldAlias });
  nextFn();
=======
module.exports = async (req, res, signingKey, sessionExpiration, eventLogHandler, trackingFieldAlias) => {
  const data = await every([setReferringUrl, setOriginalUrl, checkForSession, createSession, checkForSessionId, createSessionId, checkForMarketingTracking, sendCookie], { req, res, signingKey, sessionExpiration, trackingFieldAlias });
>>>>>>> do not set host origin based on request
  if (eventLogHandler && req.method === "GET") {
    await eventLogHandler(data);
  }
  return data;
};