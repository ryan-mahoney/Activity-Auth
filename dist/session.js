"use strict";

var nJwt = require("njwt");

const sendCookie = exports.sendCookie = (res, name, value) => {
  const inEightHours = new Date(new Date().getTime() + 1000 * 60 * 60 * 8);
  res.cookie(name, value, {
    expires: inEightHours,
    httpOnly: true,
    path: "/"
  });
};

const decryptSession = exports.decryptSession = async (res, userModel, clientId, token, refresh, signingKey, sessionExpiration) => {
  try {
    return nJwt.verify(token, signingKey).body;
  } catch (e) {
    if (e.userMessage === "Jwt is expired" && refresh !== false) {
      const {
        session,
        refreshToken
      } = await userModel.refreshSession(refresh, clientId);

      if (session == undefined && refreshToken == undefined) {
        return false;
      }

      const token = encryptSession(session, new Date().getTime() + sessionExpiration, signingKey);
      sendCookie(res, "token", token);
      sendCookie(res, "refresh", refreshToken);
      return session;
    }

    return false;
  }
};

const encryptSession = exports.encryptSession = (data, expiration, signingKey) => nJwt.create(data, signingKey).setExpiration(expiration).compact();