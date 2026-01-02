import { config } from '@config/env';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
}

/**
 * Logger utility for consistent logging across the application.
 * Suppresses logs in production unless explicitly enabled.
 * Can be extended to integrate with external logging services (e.g., Sentry).
 */
class Logger {
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = config.app.isDevelopment || config.features.debugMode;
  }

  private formatMessage(entry: LogEntry): string {
    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
    return `${prefix} ${entry.message}`;
  }

  private createEntry(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
    };
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    if (!this.isEnabled) return;

    const entry = this.createEntry(level, message, data);
    const formattedMessage = this.formatMessage(entry);

    switch (level) {
      case 'error':
        // eslint-disable-next-line no-console
        console.error(formattedMessage, data ?? '');
        break;
      case 'warn':
        // eslint-disable-next-line no-console
        console.warn(formattedMessage, data ?? '');
        break;
      case 'debug':
        // eslint-disable-next-line no-console
        console.debug(formattedMessage, data ?? '');
        break;
      case 'info':
      default:
        // eslint-disable-next-line no-console
        console.info(formattedMessage, data ?? '');
    }
  }

  /**
   * Log an informational message
   */
  info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  /**
   * Log a warning message
   */
  warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }

  /**
   * Log an error message
   */
  error(message: string, data?: unknown): void {
    // Always log errors, even in production
    const entry = this.createEntry('error', message, data);
    const formattedMessage = this.formatMessage(entry);

    // eslint-disable-next-line no-console
    console.error(formattedMessage, data ?? '');

    // TODO: Integrate with external error tracking service (e.g., Sentry)
    // if (config.services.sentryDsn) {
    //   captureException(data instanceof Error ? data : new Error(message));
    // }
  }

  /**
   * Log a debug message (development only)
   */
  debug(message: string, data?: unknown): void {
    this.log('debug', message, data);
  }
}

export const logger = new Logger();
