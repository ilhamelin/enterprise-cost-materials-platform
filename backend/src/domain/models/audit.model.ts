export type UserRole = 'admin' | 'purchasing_manager' | 'plant_operator' | 'auditor';

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'SIMULATE' | 'IMPORT' | 'EXPORT';
  entityName: string;
  entityId: string;
  fieldName?: string;
  previousValue?: string;
  newValue?: string;
  ipAddress?: string;
}
