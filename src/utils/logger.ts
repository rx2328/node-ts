import pino from "pino";
import pretty from "pino-pretty";
import { join } from "path";
import fs from "fs";

const devLogger = pino(
  {
    level: "debug",
  },
  pretty({
    colorize: true, // Enable colorized output
    translateTime: true, // Readable timestamps
    ignore: "pid,hostname",
  })
);

const logsDir = join(__dirname, "..", "..", "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir); // Create logs directory if it doesn't exist
}

const errorLogFile = join(logsDir, "error.log");
const infoLogFile = join(logsDir, "info.log");

const prodLogger = pino(
  {
    level: "info",
  },
  pino.transport({
    targets: [
      {
        target: "pino-pretty",
        options: {
          colorize: true, // Enable colorization
          translateTime: true, // Add timestamps in a readable format
          ignore: "pid,hostname", // Customize to remove unnecessary fields
        },
        level: "debug",
      },
      {
        target: "pino/file",
        options: { destination: errorLogFile, mkdir: true, append: true },
        level: "error",
      },
      {
        target: "pino/file",
        options: { destination: infoLogFile, mkdir: true, append: true },
        level: "info",
      },
    ],
  })
);

const logger = process.env.NODE_ENV === "production" ? prodLogger : devLogger;

// const maskSensitiveData = (data: object, maskFields: string[]): object => {
//   const maskedData = Array.isArray(data) ? [] : {};

//   for (const key in data) {
//     if (data.hasOwnProperty(key)) {
//       if (maskFields.includes(key)) {
//         maskedData[key] = "**mask**"; // Mask the sensitive field
//       } else if (typeof data[key] === "object" && data[key] !== null) {
//         maskedData[key] = maskSensitiveData(data[key], maskFields); // Recursively mask nested objects
//       } else {
//         maskedData[key] = data[key]; // Copy other fields as is
//       }
//     }
//   }

//   return maskedData;
// };
// Helper function for logging info messages
const logInfo = (
  message: string,
  details?: object,
  maskFieldList: string[] = []
) => {
  const maskList = [
    "password",
    "token",
    "authorization",
    "creditCard",
    ...maskFieldList,
  ];
  // const maskedDetails = maskSensitiveData(details || {}, maskList);
  logger.info({ message /* ...maskedDetails */ });
};

// Helper function for logging error messages
const logError = (serviceName: string, error?: unknown, uri?: string) => {
  logger.error({
    serviceName,
    uri,
    error: error instanceof Error ? error?.message : error,
    stack: error instanceof Error ? error?.stack : error,
  });
};

const logDebug = (obj: Object, message?: string) => {
  logger.debug(obj, message);
};

export { logger, logInfo, logError, logDebug };
