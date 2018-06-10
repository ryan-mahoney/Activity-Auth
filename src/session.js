import nJwt from "njwt";

export const decryptSession = (token, signingKey) => {
  try {
    return nJwt.verify(token, signingKey).body;
  } catch (e) {
    return false;
  }
};

export const encryptSession = (data, expiration, signingKey) =>
  nJwt
    .create(data, signingKey)
    .setExpiration(expiration)
    .compact();
