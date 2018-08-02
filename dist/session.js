"use strict";

var nJwt = require("njwt");

const decryptSession = exports.decryptSession = (token, signingKey) => {
  try {
    return nJwt.verify(token, signingKey).body;
  } catch (e) {
    return false;
  }
};

const encryptSession = exports.encryptSession = (data, expiration, signingKey) => nJwt.create(data, signingKey).setExpiration(expiration).compact();