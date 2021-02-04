"use strict";

var _session = require("./session");

var encryptSession = _session.encryptSession;

const checkForSession = exports.checkForSession = ({
  req: {
    session
  }
}) => ({
  hasSession: session ? true : false,
  session
});

const createSession = exports.createSession = ({
  session,
  hasSession
}) => ({
  session: hasSession ? session : {}
});

const sendCookie = exports.sendCookie = ({
  req,
  res,
  session,
  signingKey,
  sessionExpiration
}) => {
  const token = encryptSession(session, new Date().getTime() + sessionExpiration, signingKey);
  req.session = session;
  const inEightHours = new Date(new Date().getTime() + 1000 * 60 * 8);
  res.cookie("token", token, {
    expires: inEightHours,
    httpOnly: true,
    path: "/"
  });
  return {
    sendCookie: true
  };
};