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

module.exports = async (req, res, signingKey, sessionExpiration, eventLogHandler) => {
  const data = await every([setReferringUrl, setOriginalUrl, checkForSession, createSession, checkForSessionId, createSessionId, checkForMarketingTracking, sendCookie], { req, res, signingKey, sessionExpiration });
  if (eventLogHandler && req.method === "GET") {
    eventLogHandler(data);
  }
};