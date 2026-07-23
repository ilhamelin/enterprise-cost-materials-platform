/**
 * Logger Estructurado JSON para trazabilidad y depuración empresarial.
 */
export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

export interface LogPayload {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  meta?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

export class StructuredLogger {
  private static formatLog(
    level: LogLevel,
    message: string,
    context?: string,
    meta?: Record<string, unknown>,
    err?: Error
  ): LogPayload {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(context && { context }),
      ...(meta && { meta }),
      ...(err && {
        error: {
          name: err.name,
          message: err.message,
          stack: err.stack,
        },
      }),
    };
  }

  public static info(message: string, context?: string, meta?: Record<string, unknown>): void {
    try {
      const payload = this.formatLog(LogLevel.INFO, message, context, meta);
      console.log(JSON.stringify(payload));
    } catch (error) {
      console.log(`[LOGGER-FALLBACK] INFO: ${message}`);
    }
  }

  public static warn(message: string, context?: string, meta?: Record<string, unknown>): void {
    try {
      const payload = this.formatLog(LogLevel.WARN, message, context, meta);
      console.warn(JSON.stringify(payload));
    } catch (error) {
      console.warn(`[LOGGER-FALLBACK] WARN: ${message}`);
    }
  }

  public static error(message: string, err?: Error, context?: string, meta?: Record<string, unknown>): void {
    try {
      const payload = this.formatLog(LogLevel.ERROR, message, context, meta, err);
      console.error(JSON.stringify(payload));
    } catch (error) {
      console.error(`[LOGGER-FALLBACK] ERROR: ${message}`, err);
    }
  }
}
