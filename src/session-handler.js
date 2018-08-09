import { every } from "every-fn";
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
  const data = await every(
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
  if (eventLogHandler && req.method === "GET") {
    eventLogHandler(data);
  }
};
