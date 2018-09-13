import { every } from "every-fn";
import {
  setHostOrigin,
  setReferringUrl,
  setOriginalUrl,
  checkForSession,
  createSession,
  checkForSessionId,
  createSessionId,
  checkForMarketingTracking,
  sendCookie
} from "./session-context";

export default async (
  req,
  res,
  signingKey,
  sessionExpiration,
  eventLogHandler,
  trackingFieldAlias,
  nextFn
) => {
  const data = await every(
    [
      setHostOrigin,
      setReferringUrl,
      setOriginalUrl,
      checkForSession,
      createSession,
      checkForSessionId,
      createSessionId,
      checkForMarketingTracking,
      sendCookie
    ],
    { req, res, signingKey, sessionExpiration, trackingFieldAlias }
  );
  nextFn();
  if (eventLogHandler && req.method === "GET") {
    await eventLogHandler(data);
  }
  return data;
};
