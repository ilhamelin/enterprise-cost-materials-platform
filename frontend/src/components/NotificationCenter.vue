<template>
  <div class="notification-panel glass-panel">
    <div class="notif-header">
      <div class="title-with-bell">
        <span class="bell-icon">🔔</span>
        <h4>Centro de Alertas KRI en Tiempo Real</h4>
      </div>
      <span class="alert-count">{{ alerts.length }} alertas activas</span>
    </div>

    <div class="alerts-feed">
      <div 
        v-for="alert in alerts" 
        :key="alert.id" 
        class="alert-item"
        :class="`alert-border-${alert.severity}`"
      >
        <div class="alert-top">
          <span class="badge-risk" :class="`risk-${alert.severity}`">{{ alert.severity }}</span>
          <span class="alert-time">{{ new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
        </div>
        <strong class="alert-title">{{ alert.title }}</strong>
        <p class="alert-desc">{{ alert.description }}</p>
      </div>

      <div v-if="alerts.length === 0" class="empty-alerts">
        <span>✓ Sin alertas pendientes. Todo en parámetros normales.</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { KriAlert } from '../types/platform';

interface Props {
  alerts: KriAlert[];
}

defineProps<Props>();
</script>

<style scoped>
.notification-panel {
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid var(--accent-amber);
}

.notif-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.title-with-bell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bell-icon { font-size: 1.1rem; }

.notif-header h4 {
  font-size: 0.95rem;
  color: var(--text-primary);
}

.alert-count {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--accent-amber);
}

.alerts-feed {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 0.85rem;
}

.alert-item {
  background: hsla(220, 35%, 6%, 0.8);
  padding: 0.85rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.alert-border-critical { border-left: 3px solid var(--accent-rose); }
.alert-border-high { border-left: 3px solid var(--accent-amber); }
.alert-border-medium { border-left: 3px solid var(--accent-cyan); }
.alert-border-low { border-left: 3px solid var(--accent-emerald); }

.alert-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.alert-title {
  color: var(--text-primary);
  font-size: 0.85rem;
}

.alert-desc {
  color: var(--text-secondary);
  line-height: 1.3;
}

.empty-alerts {
  color: var(--accent-emerald);
  font-size: 0.85rem;
  grid-column: 1 / -1;
}
</style>
