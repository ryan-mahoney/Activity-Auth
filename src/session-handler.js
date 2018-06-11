import everyFn from "every-fn";
import {
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
  eventLogHandler
) => {
  const data = await everyFn(
    [
      setReferringUrl,
      setOriginalUrl,
      checkForSession,
      createSession,
      checkForSessionId,
      createSessionId,
      checkForMarketingTracking,
      sendCookie
    ],
    { req, res, signingKey, sessionExpiration }
  );
  if (eventLogHandler) {
    eventLogHandler(data);
  }
};
