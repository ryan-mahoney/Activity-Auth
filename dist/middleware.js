"use strict";

var _everyFn = require("every-fn");

var every = _everyFn.every;

var _middlewareContext = require("./middleware-context");

var getTokenFromCookie = _middlewareContext.getTokenFromCookie;
var getTokenFromHeader = _middlewareContext.getTokenFromHeader;
var sendTokenRejection = _middlewareContext.sendTokenRejection;
var handleError = _middlewareContext.handleError;
var getSessionFromToken = _middlewareContext.getSessionFromToken;
var sendSessionRejection = _middlewareContext.sendSessionRejection;
var sendRoleRejection = _middlewareContext.sendRoleRejection;
var sendActivityRejection = _middlewareContext.sendActivityRejection;

const middlewareFactory = exports.middlewareFactory = (userModel, clientId, activityAuth, signingKey, sessionExpiration) => (activity, redirect = "/access-denied") => async (req, res, nextFn) => {
  const data = await every([getTokenFromCookie, getTokenFromHeader, sendTokenRejection, handleError, getSessionFromToken, sendSessionRejection, handleError, sendRoleRejection, handleError, sendActivityRejection, handleError], {
    userModel,
    clientId,
    activity,
    req,
    res,
    signingKey,
    activityAuth,
    sessionExpiration
  });

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

  nextFn();
};