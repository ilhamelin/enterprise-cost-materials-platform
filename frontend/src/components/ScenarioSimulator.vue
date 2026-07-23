<template>
  <div class="glass-panel simulator-container">
    <div class="simulator-header">
      <div>
        <h3>Simulador de Escenarios Financieros (What-If Analysis)</h3>
        <span class="sub-title">Modelado preventivo de variación de precios de materia prima e impacto en la rentabilidad</span>
      </div>

      <button class="btn-secondary" @click="resetSliders">Restablecer Valores</button>
    </div>

    <!-- Presets Selector -->
    <ScenarioPresets @apply="handleApplyPreset" />

    <!-- Sliders Grid -->
    <div class="sliders-grid">
      <div class="slider-box">
        <div class="slider-info">
          <span class="cat-label">Metales & Aleaciones (Variación Precio)</span>
          <strong class="val-label" :class="metalsPriceVar >= 0 ? 'text-rose' : 'text-emerald'">
            {{ metalsPriceVar >= 0 ? '+' : '' }}{{ metalsPriceVar }}%
          </strong>
        </div>
        <input 
          v-model.number="metalsPriceVar" 
          type="range" 
          min="-30" 
          max="50" 
          step="1" 
          class="range-slider" 
        />
      </div>

      <div class="slider-box">
        <div class="slider-info">
          <span class="cat-label">Plásticos & Resinas (Variación Precio)</span>
          <strong class="val-label" :class="plasticsPriceVar >= 0 ? 'text-rose' : 'text-emerald'">
            {{ plasticsPriceVar >= 0 ? '+' : '' }}{{ plasticsPriceVar }}%
          </strong>
        </div>
        <input 
          v-model.number="plasticsPriceVar" 
          type="range" 
          min="-30" 
          max="50" 
          step="1" 
          class="range-slider" 
        />
      </div>

      <div class="slider-box">
        <div class="slider-info">
          <span class="cat-label">Incremento Global de Merma / Desperdicio</span>
          <strong class="val-label text-amber">+{{ globalWasteIncrease }}%</strong>
        </div>
        <input 
          v-model.number="globalWasteIncrease" 
          type="range" 
          min="0" 
          max="15" 
          step="0.5" 
          class="range-slider" 
        />
      </div>
    </div>

    <!-- Simulation Comparison Metrics -->
    <div class="comparison-grid">
      <div class="comp-card">
        <span class="comp-title">GASTO MATERIA PRIMA BASE</span>
        <span class="comp-value">${{ report.totalRawMaterialExpenses.toLocaleString('es-ES') }}</span>
      </div>

      <div class="comp-card highlight-card">
        <span class="comp-title">GASTO PROYECTADO SIMULADO</span>
        <span class="comp-value text-amber">${{ projectedMaterialCost.toLocaleString('es-ES') }}</span>
      </div>

      <div class="comp-card">
        <span class="comp-title">BENEFICIO NETO BASE</span>
        <span class="comp-value">${{ report.netProfit.toLocaleString('es-ES') }}</span>
      </div>

      <div class="comp-card highlight-card">
        <span class="comp-title">BENEFICIO NETO PROYECTADO</span>
        <span class="comp-value" :class="projectedNetProfit >= 0 ? 'text-emerald' : 'text-rose'">
          ${{ projectedNetProfit.toLocaleString('es-ES') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { CompanyFinancialReport, RawMaterialItem } from '../types/platform';
import ScenarioPresets from './ScenarioPresets.vue';

interface Props {
  report: CompanyFinancialReport;
  materials: RawMaterialItem[];
}

const props = defineProps<Props>();

const metalsPriceVar = ref<number>(10);
const plasticsPriceVar = ref<number>(5);
const globalWasteIncrease = ref<number>(2);

const handleApplyPreset = (metals: number, plastics: number, waste: number) => {
  metalsPriceVar.value = metals;
  plasticsPriceVar.value = plastics;
  globalWasteIncrease.value = waste;
};

const resetSliders = () => {
  metalsPriceVar.value = 0;
  plasticsPriceVar.value = 0;
  globalWasteIncrease.value = 0;
};

const projectedMaterialCost = computed(() => {
  try {
    return props.materials.reduce((acc, item) => {
      let varPercent = 0;
      if (item.category === 'Metales & Aleaciones') varPercent = metalsPriceVar.value;
      if (item.category === 'Plásticos & Resinas') varPercent = plasticsPriceVar.value;

      const priceMultiplier = 1 + varPercent / 100;
      const wasteMultiplier = 1 + globalWasteIncrease.value / 100;

      const itemCost = item.quantity * (item.unitCost * priceMultiplier) * wasteMultiplier;
      return acc + itemCost;
    }, 0);
  } catch (error) {
    return 0;
  }
});

const projectedNetProfit = computed(() => {
  return props.report.grossRevenue - (projectedMaterialCost.value + props.report.operationalOverhead);
});
</script>

<style scoped>
.simulator-container {
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-left: 4px solid var(--accent-purple);
}

.simulator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.simulator-header h3 {
  font-size: 1.1rem;
  color: var(--text-primary);
}

.sub-title {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.sliders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.slider-box {
  background: hsla(220, 35%, 6%, 0.8);
  padding: 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.slider-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.cat-label { color: var(--text-secondary); }
.val-label { font-family: var(--font-mono); font-weight: 700; }

.range-slider {
  width: 100%;
  accent-color: var(--accent-purple);
  cursor: pointer;
}

.comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.comp-card {
  background: hsla(220, 35%, 6%, 0.6);
  padding: 1rem;
  border-radius: var(--radius-sm);
  display: flex;
  flex-direction: column;
}

.highlight-card {
  border: 1px solid var(--accent-purple);
  background: hsla(270, 85%, 65%, 0.1);
}

.comp-title {
  font-size: 0.7rem;
  color: var(--text-muted);
  font-weight: 700;
}

.comp-value {
  font-family: var(--font-mono);
  font-size: 1.25rem;
  font-weight: 800;
  margin-top: 0.25rem;
}

.text-rose { color: var(--accent-rose); }
.text-emerald { color: var(--accent-emerald); }
.text-amber { color: var(--accent-amber); }
</style>
