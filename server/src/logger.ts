import 'winston-daily-rotate-file';

import * as winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
});

const timestamp = winston.format.timestamp({
  format: 'DD-MM-YYYY-HH:MM',
});

const format = winston.format.printf(
  ({ level, message, timestamp, data }) =>
    `${timestamp} (${level}) ${message} ${data ? JSON.stringify(data) : ''}`
);

const logToFiles = () => {
  const dailyRotateFile = (filename: string, level: string) => {
    return new winston.transports.DailyRotateFile({
      filename,
      level,
      dirname: '../logs',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(timestamp, format),
    });
  };

  const errors = dailyRotateFile('error-%DATE%.log', 'error');
  const combined = dailyRotateFile('combined-%DATE%.log', 'info');

  logger.add(errors);
  logger.add(combined);
};

const logToConsole = () => {
  const consoleTransport = new winston.transports.Console({
    format: winston.format.combine(
      timestamp,
      format,
      winston.format.colorize({
        all: true,
      })
    ),
  });

  logger.add(consoleTransport);
};

if (process.env.NODE_ENV === 'production') {
  logToFiles();
} else {
  logToConsole();
}

export default {
  info: (message: string, data?: { [key: string]: unknown }) =>
    logger.info(message, data ? { data } : undefined),
  error: (message: string, data?: { [key: string]: unknown }) =>
    logger.error(message, data ? { data } : undefined),
};
