import { DEV_CONFIG, ERROR_CONFIG, FEATURE_FLAGS, isDevelopment } from '../constants/config';

/**
 * Logging utility
 * Uses configuration from config.ts for log levels and settings
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

class Logger {
  private logLevel: LogLevel;
  private enabled: boolean;

  constructor() {
    this.logLevel = DEV_CONFIG.LOG_LEVEL as LogLevel;
    this.enabled = FEATURE_FLAGS.ENABLE_LOGGING;
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.enabled) {
      return false;
    }

    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);

    return messageLevelIndex >= currentLevelIndex;
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    return `${prefix} ${message}`;
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(this.formatMessage(LogLevel.DEBUG, message), ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage(LogLevel.INFO, message), ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage(LogLevel.WARN, message), ...args);
    }
  }

  error(message: string, error?: Error | unknown, ...args: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage(LogLevel.ERROR, message), error, ...args);
      
      // In production, you might want to send errors to an error reporting service
      if (!isDevelopment() && ERROR_CONFIG.ENABLE_ERROR_REPORTING) {
        // TODO: Implement error reporting service integration
        // reportError(message, error);
      }
    }
  }

  /**
   * Log network requests (if enabled in config)
   */
  logNetworkRequest(method: string, url: string, data?: any): void {
    if (DEV_CONFIG.LOG_NETWORK_REQUESTS) {
      this.debug(`Network Request: ${method} ${url}`, data);
    }
  }

  /**
   * Log network responses (if enabled in config)
   */
  logNetworkResponse(method: string, url: string, status: number, data?: any): void {
    if (DEV_CONFIG.LOG_NETWORK_REQUESTS) {
      this.debug(`Network Response: ${method} ${url} - ${status}`, data);
    }
  }

  /**
   * Log Redux actions (if enabled in config)
   */
  logReduxAction(action: any): void {
    if (DEV_CONFIG.LOG_REDUX_ACTIONS) {
      this.debug('Redux Action:', action);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions
export const logDebug = (message: string, ...args: any[]) => logger.debug(message, ...args);
export const logInfo = (message: string, ...args: any[]) => logger.info(message, ...args);
export const logWarn = (message: string, ...args: any[]) => logger.warn(message, ...args);
export const logError = (message: string, error?: Error | unknown, ...args: any[]) =>
  logger.error(message, error, ...args);

export default logger;

