import crypto from 'crypto';
import { StructuredLogger } from '../../config/logger.js';
import { AuditLogEntry, UserRole } from '../models/audit.model.js';

export class AuditService {
  private static logs: AuditLogEntry[] = [];

  /**
   * Records an immutable audit log entry.
   */
  public static logAction(
    userName: string,
    userRole: UserRole,
    action: AuditLogEntry['action'],
    entityName: string,
    entityId: string,
    fieldName?: string,
    previousValue?: string,
    newValue?: string
  ): AuditLogEntry {
    try {
      const entry: AuditLogEntry = {
        id: `audit-${crypto.randomUUID().substring(0, 8)}`,
        timestamp: Date.now(),
        userId: `usr-${userName.toLowerCase().replace(/\s+/g, '-')}`,
        userName,
        userRole,
        action,
        entityName,
        entityId,
        fieldName,
        previousValue,
        newValue,
        ipAddress: '192.168.1.100',
      };

      this.logs.unshift(entry);
      StructuredLogger.info(`Audit log recorded: ${action} on ${entityName}`, 'AuditService', { entryId: entry.id });
      return entry;
    } catch (error) {
      StructuredLogger.error('Failed to log audit action', error as Error, 'AuditService');
      throw error;
    }
  }

  public static getLogs(): AuditLogEntry[] {
    return [...this.logs];
  }
}
