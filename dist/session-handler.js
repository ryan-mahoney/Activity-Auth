"use strict";

var _everyFn = require("every-fn");

var every = _everyFn.every;

var _sessionContext = require("./session-context");

var setHostOrigin = _sessionContext.setHostOrigin;
var setReferringUrl = _sessionContext.setReferringUrl;
var setOriginalUrl = _sessionContext.setOriginalUrl;
var checkForSession = _sessionContext.checkForSession;
var createSession = _sessionContext.createSession;
var checkForSessionId = _sessionContext.checkForSessionId;
var createSessionId = _sessionContext.createSessionId;
var checkForMarketingTracking = _sessionContext.checkForMarketingTracking;
var sendCookie = _sessionContext.sendCookie;

module.exports = async (req, res, signingKey, sessionExpiration, eventLogHandler, trackingFieldAlias) => {
  const data = await every([setHostOrigin, setReferringUrl, setOriginalUrl, checkForSession, createSession, checkForSessionId, createSessionId, checkForMarketingTracking, sendCookie], { req, res, signingKey, sessionExpiration, trackingFieldAlias });
  if (eventLogHandler && req.method === "GET") {
    eventLogHandler(data);
  }
};