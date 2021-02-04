"use strict";

var _everyFn = require("every-fn");

var every = _everyFn.every;

var _sessionContext = require("./session-context");

var checkForSession = _sessionContext.checkForSession;
var createSession = _sessionContext.createSession;
var sendCookie = _sessionContext.sendCookie;

module.exports = async (userModel, clientId, req, res, signingKey, sessionExpiration, nextFn) => {
  const data = await every([checkForSession, createSession, sendCookie], {
    userModel,
    clientId,
    req,
    res,
    signingKey,
    sessionExpiration
  });
  nextFn();
  return data;
};