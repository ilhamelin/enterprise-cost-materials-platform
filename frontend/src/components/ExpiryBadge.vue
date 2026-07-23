<template>
  <span class="expiry-pill" :class="statusClass">
    ⏱️ {{ daysText }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  lastUpdatedTimestamp: number;
}

const props = defineProps<Props>();

const daysOld = computed(() => {
  const diffMs = Date.now() - props.lastUpdatedTimestamp;
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
});

const daysText = computed(() => {
  if (daysOld.value === 0) return 'Hoy';
  return `${daysOld.value}d en bodega`;
});

const statusClass = computed(() => {
  if (daysOld.value > 14) return 'expiry-stale';
  if (daysOld.value > 7) return 'expiry-warning';
  return 'expiry-fresh';
});
</script>

<style scoped>
.expiry-pill {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
}

.expiry-fresh {
  background: hsla(160, 84%, 45%, 0.15);
  color: var(--accent-emerald);
  border: 1px solid hsla(160, 84%, 45%, 0.3);
}

.expiry-warning {
  background: hsla(38, 95%, 55%, 0.15);
  color: var(--accent-amber);
  border: 1px solid hsla(38, 95%, 55%, 0.3);
}

.expiry-stale {
  background: hsla(350, 89%, 60%, 0.15);
  color: var(--accent-rose);
  border: 1px solid hsla(350, 89%, 60%, 0.3);
}
</style>
