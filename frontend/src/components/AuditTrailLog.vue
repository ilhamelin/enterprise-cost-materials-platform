<template>
  <div class="glass-panel audit-container">
    <div class="audit-header">
      <div>
        <h3>Bitácora de Auditoría Inmutable (Audit Trail)</h3>
        <span class="sub-title">Trazabilidad de cambios, modificaciones de costos, mermas y acciones administrativas</span>
      </div>

      <span class="count-pill">{{ logs.length }} registros auditados</span>
    </div>

    <div class="logs-list">
      <div v-for="log in logs" :key="log.id" class="log-row">
        <div class="action-badge" :class="`action-${log.action.toLowerCase()}`">
          {{ log.action }}
        </div>

        <div class="log-main">
          <div class="log-title-line">
            <strong class="user-name">{{ log.userName }}</strong>
            <span class="user-role">[{{ log.userRole }}]</span>
            <span class="entity-info">• {{ log.entityName }} ({{ log.entityId }})</span>
          </div>
          <p class="log-details">{{ log.details }}</p>
        </div>

        <div class="log-time">
          {{ new Date(log.timestamp).toLocaleString('es-ES') }}
        </div>
      </div>

      <div v-if="logs.length === 0" class="empty-logs">
        Sin registros de auditoría almacenados.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AuditLogEntry } from '../types/rbac';

interface Props {
  logs: AuditLogEntry[];
}

defineProps<Props>();
</script>

<style scoped>
.audit-container {
  padding: 1.5rem;
}

.audit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.audit-header h3 {
  font-size: 1.1rem;
  color: var(--text-primary);
}

.sub-title {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.count-pill {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  background: hsla(220, 35%, 6%, 0.7);
  padding: 0.3rem 0.7rem;
  border-radius: var(--radius-sm);
  color: var(--accent-cyan);
  border: 1px solid var(--border-color);
}

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.log-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem;
  background: hsla(220, 35%, 6%, 0.6);
  border: 1px solid hsla(215, 25%, 20%, 0.4);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
}

.action-badge {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.3rem 0.6rem;
  border-radius: var(--radius-sm);
  min-width: 70px;
  text-align: center;
}

.action-create { background: hsla(160, 84%, 45%, 0.15); color: var(--accent-emerald); border: 1px solid hsla(160, 84%, 45%, 0.3); }
.action-update { background: hsla(190, 90%, 50%, 0.15); color: var(--accent-cyan); border: 1px solid hsla(190, 90%, 50%, 0.3); }
.action-delete { background: hsla(350, 89%, 60%, 0.15); color: var(--accent-rose); border: 1px solid hsla(350, 89%, 60%, 0.3); }
.action-import { background: hsla(270, 85%, 65%, 0.15); color: var(--accent-purple); border: 1px solid hsla(270, 85%, 65%, 0.3); }

.log-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.log-title-line {
  display: flex;
  gap: 0.4rem;
  align-items: baseline;
}

.user-name { color: var(--text-primary); }
.user-role { font-size: 0.75rem; color: var(--text-muted); }
.entity-info { font-size: 0.75rem; color: var(--accent-cyan); font-family: var(--font-mono); }

.log-details {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.log-time {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
}

.empty-logs {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
}
</style>
