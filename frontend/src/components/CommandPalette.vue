<template>
  <div v-if="isOpen" class="palette-overlay" @click.self="close">
    <div class="glass-panel palette-box">
      <div class="search-line">
        <span class="search-icon">🔍</span>
        <input 
          ref="searchInput"
          v-model="query" 
          type="text" 
          placeholder="Escribe una acción, insumo o comando... (ej: 'Tabla', 'Simulador', 'Acero', 'Auditor')"
          class="palette-input"
          @keydown.esc="close"
        />
        <span class="esc-badge">ESC</span>
      </div>

      <div class="commands-list">
        <div class="group-title">Navegación Rápida & Acciones</div>
        <div 
          v-for="cmd in filteredCommands" 
          :key="cmd.id" 
          class="cmd-item"
          @click="selectCommand(cmd)"
        >
          <span class="cmd-icon">{{ cmd.icon }}</span>
          <div class="cmd-text">
            <span class="cmd-name">{{ cmd.name }}</span>
            <span class="cmd-sub">{{ cmd.description }}</span>
          </div>
          <span class="cmd-shortcut">Enter ↵</span>
        </div>

        <div v-if="filteredCommands.length === 0" class="empty-commands">
          No se encontraron comandos para "{{ query }}"
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'navigate', tab: 'dashboard' | 'simulator' | 'table' | 'files' | 'audit' | 'report'): void;
  (e: 'openCsvImporter'): void;
  (e: 'openReorderModal'): void;
}>();

const query = ref<string>('');
const searchInput = ref<HTMLInputElement | null>(null);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    nextTick(() => searchInput.value?.focus());
  }
});

const close = () => {
  query.value = '';
  emit('close');
};

interface CommandItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  action: () => void;
}

const commands: CommandItem[] = [
  {
    id: 'cmd-dash',
    name: 'Ir a Dashboard & KPIs',
    description: 'Visualizar resumen de beneficio neto, rendimiento y gráficos',
    icon: '📊',
    action: () => emit('navigate', 'dashboard'),
  },
  {
    id: 'cmd-sim',
    name: 'Ir al Simulador What-If',
    description: 'Modelar estrés financiero de precios y mermas',
    icon: '🔮',
    action: () => emit('navigate', 'simulator'),
  },
  {
    id: 'cmd-table',
    name: 'Ir a Tabla de Insumos',
    description: 'Gestionar, editar o registrar materias primas',
    icon: '📦',
    action: () => emit('navigate', 'table'),
  },
  {
    id: 'cmd-import',
    name: 'Importar Inventario CSV/Excel',
    description: 'Carga masiva drag-and-drop de materias primas',
    icon: '📥',
    action: () => emit('openCsvImporter'),
  },
  {
    id: 'cmd-reorder',
    name: 'Generar Orden de Compra Sugerida',
    description: 'Calculadora de punto de reorden en 1-clic',
    icon: '🛍️',
    action: () => emit('openReorderModal'),
  },
  {
    id: 'cmd-audit',
    name: 'Ver Bitácora de Auditoría',
    description: 'Consultar registro de trazabilidad inmutable',
    icon: '📜',
    action: () => emit('navigate', 'audit'),
  },
  {
    id: 'cmd-report',
    name: 'Ver Reporte Ejecutivo PDF',
    description: 'Vista de impresión y exportación de informe financiero',
    icon: '📄',
    action: () => emit('navigate', 'report'),
  },
];

const filteredCommands = computed(() => {
  if (!query.value) return commands;
  return commands.filter((c) =>
    c.name.toLowerCase().includes(query.value.toLowerCase()) ||
    c.description.toLowerCase().includes(query.value.toLowerCase())
  );
});

const selectCommand = (cmd: CommandItem) => {
  cmd.action();
  close();
};
</script>

<style scoped>
.palette-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 10vh;
  z-index: 2000;
}

.palette-box {
  width: 90%;
  max-width: 650px;
  background: var(--bg-dark);
  border: 1px solid var(--border-glow);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
}

.search-line {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
  background: hsla(220, 35%, 6%, 0.8);
}

.search-icon { font-size: 1.2rem; }

.palette-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 1rem;
  outline: none;
}

.esc-badge {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  background: hsla(215, 25%, 20%, 0.5);
  border-radius: var(--radius-sm);
  color: var(--text-muted);
}

.commands-list {
  padding: 0.75rem;
  max-height: 380px;
  overflow-y: auto;
}

.group-title {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  padding: 0.5rem 0.75rem;
}

.cmd-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.15s;
}

.cmd-item:hover {
  background: hsla(215, 90%, 60%, 0.15);
}

.cmd-icon { font-size: 1.2rem; }

.cmd-text {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.cmd-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
}

.cmd-sub {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.cmd-shortcut {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
}

.empty-commands {
  padding: 2rem;
  text-align: center;
  color: var(--text-muted);
}
</style>
