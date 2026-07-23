import { ref } from 'vue';
import { AuditLogEntry, UserRole } from '../types/rbac';

export function useAuditTrail() {
  const auditLogs = ref<AuditLogEntry[]>([
    {
      id: 'aud-001',
      timestamp: Date.now() - 3600000 * 4,
      userName: 'Carlos Mendoza',
      userRole: 'admin',
      action: 'CREATE',
      entityName: 'Materia Prima',
      entityId: 'MP-ACERO-316',
      details: 'Registrado nuevo insumo Acero Inoxidable Grado 316. Cantidad: 1250 kg @ $18.50/kg',
    },
    {
      id: 'aud-002',
      timestamp: Date.now() - 3600000 * 2,
      userName: 'Lucía Ramos',
      userRole: 'purchasing_manager',
      action: 'UPDATE',
      entityName: 'Polímero HDPE',
      entityId: 'MP-POLI-HDPE',
      details: 'Ajustado costo unitario de $4.50 a $4.20/kg por renegociación de contrato.',
    },
  ]);

  const recordAudit = (
    userName: string,
    userRole: UserRole,
    action: AuditLogEntry['action'],
    entityName: string,
    entityId: string,
    details: string
  ) => {
    try {
      const entry: AuditLogEntry = {
        id: `aud-${crypto.randomUUID().substring(0, 6)}`,
        timestamp: Date.now(),
        userName,
        userRole,
        action,
        entityName,
        entityId,
        details,
      };
      auditLogs.value.unshift(entry);
    } catch (error) {
      console.error('[useAuditTrail] Record error:', error);
    }
  };

  return {
    auditLogs,
    recordAudit,
  };
}
