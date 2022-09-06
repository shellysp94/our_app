const { createLogger, format, transports } = require("winston");
const { timestamp, printf, errors } = format;

// const logFormat = printf(({ level, message, timestamp, stack }) => {
//   return `${timestamp} ${level}: ${stack || message}`;
// });

// const logger = createLogger({
//   transports: [
//     new transports.Console(),
//     new transports.File({
//       level: "info",
//       filename: "logsWarnings.log",
//     }),
//     new transports.File({
//       level: "error",
//       filename: "logsErrors.log",
//     }),
//   ],
//   format: format.combine(
//     timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
//     format.json(),
//     format.prettyPrint(),
//     errors({ stack: true })
//     //logFormat
//   ),
//   statusLevels: true,
// });

const formatConf = format.combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.json(),
  format.prettyPrint(),
  errors({ stack: true })
);

const infoLogger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({
      level: "info",
      filename: "./logs/logsInfo.log",
    }),
  ],
  format: formatConf,
  statusLevels: true,
});

const errLogger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({
      level: "error",
      filename: "./logs/logsErrors.log",
    }),
  ],
  format: formatConf,
  statusLevels: true,
});

module.exports = { infoLogger: infoLogger, errLogger: errLogger };
