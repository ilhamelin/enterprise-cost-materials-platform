<template>
  <div class="presets-bar">
    <span class="presets-label">Plantillas Guardadas de Simulación:</span>
    <div class="presets-buttons">
      <button 
        v-for="preset in defaultPresets" 
        :key="preset.id" 
        class="preset-btn"
        @click="applyPreset(preset)"
      >
        <span>{{ preset.icon }} {{ preset.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PresetItem {
  id: string;
  name: string;
  icon: string;
  metalsVar: number;
  plasticsVar: number;
  wasteIncrease: number;
}

const emit = defineEmits<{
  (e: 'apply', metals: number, plastics: number, waste: number): void;
}>();

const defaultPresets: PresetItem[] = [
  {
    id: 'p-1',
    name: 'Crisis Alza Metales +25%',
    icon: '⚡',
    metalsVar: 25,
    plasticsVar: 5,
    wasteIncrease: 2,
  },
  {
    id: 'p-2',
    name: 'Alza Plásticos +20%',
    icon: '🛢️',
    metalsVar: 0,
    plasticsVar: 20,
    wasteIncrease: 1.5,
  },
  {
    id: 'p-3',
    name: 'Escenario Optimista (-10% Costos)',
    icon: '🚀',
    metalsVar: -10,
    plasticsVar: -10,
    wasteIncrease: 0,
  },
];

const applyPreset = (preset: PresetItem) => {
  emit('apply', preset.metalsVar, preset.plasticsVar, preset.wasteIncrease);
};
</script>

<style scoped>
.presets-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding: 0.75rem 1rem;
  background: hsla(220, 35%, 6%, 0.7);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.presets-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 600;
}

.presets-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.preset-btn {
  background: hsla(215, 25%, 20%, 0.5);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.preset-btn:hover {
  background: hsla(270, 85%, 65%, 0.2);
  border-color: var(--accent-purple);
}
</style>
