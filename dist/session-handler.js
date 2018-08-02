"use strict";

var everyFn = require("every-fn");

var _sessionContext = require("./session-context");

var setReferringUrl = _sessionContext.setReferringUrl;
var setOriginalUrl = _sessionContext.setOriginalUrl;
var checkForSession = _sessionContext.checkForSession;
var createSession = _sessionContext.createSession;
var checkForSessionId = _sessionContext.checkForSessionId;
var createSessionId = _sessionContext.createSessionId;
var checkForMarketingTracking = _sessionContext.checkForMarketingTracking;
var sendCookie = _sessionContext.sendCookie;

module.exports = async (req, res, signingKey, sessionExpiration, eventLogHandler) => {
  const data = await everyFn([setReferringUrl, setOriginalUrl, checkForSession, createSession, checkForSessionId, createSessionId, checkForMarketingTracking, sendCookie], { req, res, signingKey, sessionExpiration });
  if (eventLogHandler) {
    eventLogHandler(data);
  }
};