"use strict";

var _everyFn = require("every-fn");

var every = _everyFn.every;

var sessionHandler = require("./session-handler");

var _middlewareContext = require("./middleware-context");

var getTokenFromCookie = _middlewareContext.getTokenFromCookie;
var getTokenFromHeader = _middlewareContext.getTokenFromHeader;
var sendTokenRejection = _middlewareContext.sendTokenRejection;
var handleError = _middlewareContext.handleError;
var getSessionFromToken = _middlewareContext.getSessionFromToken;
var sendSessionRejection = _middlewareContext.sendSessionRejection;
var sendRoleRejection = _middlewareContext.sendRoleRejection;
var sendActivityRejection = _middlewareContext.sendActivityRejection;
const middlewareFactory = exports.middlewareFactory = (activityAuth, signingKey, logHandler, trackingFieldAlias = {}) => (activity, redirect = "/access-denied") => async (req, res, nextFn) => {
  const data = await every([getTokenFromCookie, getTokenFromHeader, sendTokenRejection, handleError, getSessionFromToken, sendSessionRejection, handleError, sendRoleRejection, handleError, sendActivityRejection, handleError], { activity, req, signingKey, activityAuth });
  if (data.activity != "public" && data.errorCode) {
    res.set("x-error", data.errorCode);
    res.redirect(redirect);
    res.status(403);
    return;
  }
  if (data.session) {
    req.session = data.session;
  }
  if (data.session && data.session.roles) {
    req.access = activityAuth.getAccessData(data.session.roles);
  }
  await sessionHandler(req, res, signingKey, null, logHandler, trackingFieldAlias, nextFn);
};