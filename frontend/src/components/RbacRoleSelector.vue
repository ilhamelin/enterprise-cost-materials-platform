<template>
  <div class="rbac-bar glass-panel">
    <div class="user-profile">
      <span class="user-avatar">👤</span>
      <div class="user-text">
        <strong class="user-name">{{ currentUserName }}</strong>
        <span class="role-badge" :class="`role-${currentRole}`">{{ roleLabels[currentRole] }}</span>
      </div>
    </div>

    <div class="role-switcher">
      <span class="switcher-label">Simular Rol RBAC:</span>
      <select 
        :value="currentRole" 
        @change="onRoleChange"
        class="input-control select-role"
      >
        <option value="admin">Administrador / Gerente</option>
        <option value="purchasing_manager">Jefe de Compras</option>
        <option value="plant_operator">Operador de Planta</option>
        <option value="auditor">Auditor (Solo Lectura)</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserRole } from '../types/rbac';

interface Props {
  currentRole: UserRole;
  currentUserName: string;
  roleLabels: Record<UserRole, string>;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'switch', role: UserRole): void;
}>();

const onRoleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('switch', target.value as UserRole);
};
</script>

<style scoped>
.rbac-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.65rem 1.25rem;
  margin-bottom: 1.25rem;
  font-size: 0.85rem;
  border-left: 4px solid var(--accent-cyan);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  font-size: 1.2rem;
}

.user-text {
  display: flex;
  flex-direction: column;
}

.user-name {
  color: var(--text-primary);
  font-size: 0.85rem;
}

.role-badge {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--accent-cyan);
}

.role-switcher {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.switcher-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.select-role {
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
}
</style>
