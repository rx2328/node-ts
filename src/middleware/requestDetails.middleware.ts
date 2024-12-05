import { Request, Response, NextFunction } from "express";
import { logDebug, logInfo } from "../utils/logger";

const RequestDetails = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { body, headers, params, query } = req;
  if (process.env.NODE_ENV === "development") {
    logDebug(
      {
        reqUrl: req.originalUrl,
        body,
        headers,
        params,
        query,
      },
      "Middleware info"
    );
  }

  const start = Date.now();

  res.on("finish", () => {
    const finish = Date.now();
    if (process.env.NODE_ENV === "production") {
      logInfo("Request middleware", {
        reqUrl: req.originalUrl,
        exeTime: `${finish - start}ms`,
        body,
        headers,
        params,
        query,
      });
    }
  });

  next();
};

export default RequestDetails;
