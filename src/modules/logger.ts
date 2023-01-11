import winston from 'winston';
import { LOG_DIR } from './constants';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({
      filename: `${LOG_DIR}/error.log`,
      level: 'error'
    }),
    new winston.transports.File({ filename: `${LOG_DIR}/combined.log` })
  ]
});

export { logger };
