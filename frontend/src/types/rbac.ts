export type UserRole = 'admin' | 'purchasing_manager' | 'plant_operator' | 'auditor';

export interface RolePermissions {
  canAddMaterial: boolean;
  canEditMaterial: boolean;
  canDeleteMaterial: boolean;
  canSimulateScenarios: boolean;
  canUploadDocuments: boolean;
  canExportReports: boolean;
  canViewAuditLogs: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  userName: string;
  userRole: UserRole;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'SIMULATE' | 'IMPORT' | 'EXPORT';
  entityName: string;
  entityId: string;
  details: string;
}

export interface StressFactor {
  category: string;
  priceVariationPercent: number;
  wasteIncreasePercent: number;
}
