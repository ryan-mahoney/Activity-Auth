"use strict";

var _session = require("./session");

var decryptSession = _session.decryptSession;
const handleError = exports.handleError = ({ errorCode }) => errorCode ? false : {};

const getTokenFromCookie = exports.getTokenFromCookie = ({ req }) => ({
  token: req.cookies && req.cookies.token ? req.cookies.token : false
});

const getTokenFromHeader = exports.getTokenFromHeader = ({ token, req }) => ({
  token: token ? token : req.header("Authorization") ? req.header("Authorization").replace(/^Bearer /, "") : false
});

const sendTokenRejection = exports.sendTokenRejection = ({ token, activity }) => token ? {} : activity == "public" ? false : { errorCode: 1 };

const getSessionFromToken = exports.getSessionFromToken = ({ token, signingKey }) => ({
  session: decryptSession(token, signingKey)
});

const sendSessionRejection = exports.sendSessionRejection = ({ session, activity }) => session ? activity == "public" ? false : {} : activity == "public" ? false : { errorCode: 2 };

const sendRoleRejection = exports.sendRoleRejection = ({ session }) => session.roles ? {} : { errorCode: 3 };

const sendActivityRejection = exports.sendActivityRejection = ({
  session: { roles },
  activity,
  activityAuth
}) => activityAuth.check(activity, roles) ? false : { errorCode: 4 };