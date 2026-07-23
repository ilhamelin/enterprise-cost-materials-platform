import { computed, ref } from 'vue';
import { RolePermissions, UserRole } from '../types/rbac';

export function useRbac() {
  const currentRole = ref<UserRole>('admin');
  const currentUserName = ref<string>('Carlos Mendoza (Gerente General)');

  const roleLabels: Record<UserRole, string> = {
    admin: 'Administrador / Gerente General',
    purchasing_manager: 'Jefe de Compras & Proveedores',
    plant_operator: 'Operador de Planta & Control de Merma',
    auditor: 'Auditor Externo (Solo Lectura)',
  };

  const permissions = computed<RolePermissions>(() => {
    switch (currentRole.value) {
      case 'admin':
        return {
          canAddMaterial: true,
          canEditMaterial: true,
          canDeleteMaterial: true,
          canSimulateScenarios: true,
          canUploadDocuments: true,
          canExportReports: true,
          canViewAuditLogs: true,
        };
      case 'purchasing_manager':
        return {
          canAddMaterial: true,
          canEditMaterial: true,
          canDeleteMaterial: false,
          canSimulateScenarios: true,
          canUploadDocuments: true,
          canExportReports: true,
          canViewAuditLogs: false,
        };
      case 'plant_operator':
        return {
          canAddMaterial: false,
          canEditMaterial: true, // Para ajustar merma
          canDeleteMaterial: false,
          canSimulateScenarios: false,
          canUploadDocuments: false,
          canExportReports: false,
          canViewAuditLogs: false,
        };
      case 'auditor':
        return {
          canAddMaterial: false,
          canEditMaterial: false,
          canDeleteMaterial: false,
          canSimulateScenarios: true,
          canUploadDocuments: false,
          canExportReports: true,
          canViewAuditLogs: true,
        };
    }
  });

  const switchRole = (newRole: UserRole) => {
    currentRole.value = newRole;
    if (newRole === 'admin') currentUserName.value = 'Carlos Mendoza (Gerente General)';
    if (newRole === 'purchasing_manager') currentUserName.value = 'Lucía Ramos (Jefe Compras)';
    if (newRole === 'plant_operator') currentUserName.value = 'Jorge Silva (Operador Planta)';
    if (newRole === 'auditor') currentUserName.value = 'Firma Auditores ISO 9001';
  };

  return {
    currentRole,
    currentUserName,
    roleLabels,
    permissions,
    switchRole,
  };
}
