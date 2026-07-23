<template>
  <div class="charts-grid">
    <!-- Bar Chart: Revenue vs Expenses vs Net Profit -->
    <div class="glass-panel chart-box">
      <div class="chart-header">
        <h3>Balance Financiero: Ingresos vs Gastos vs Beneficio</h3>
        <span class="sub-label">Período Actual</span>
      </div>

      <div class="bars-wrapper">
        <!-- Revenue Bar -->
        <div class="bar-group">
          <div class="bar-label-top">${{ report.grossRevenue.toLocaleString('es-ES') }}</div>
          <div class="bar-track">
            <div class="bar-fill fill-cyan" :style="{ height: getBarHeight(report.grossRevenue) }"></div>
          </div>
          <div class="bar-legend">Ingresos Brutos</div>
        </div>

        <!-- Material Expenses Bar -->
        <div class="bar-group">
          <div class="bar-label-top">${{ report.totalRawMaterialExpenses.toLocaleString('es-ES') }}</div>
          <div class="bar-track">
            <div class="bar-fill fill-amber" :style="{ height: getBarHeight(report.totalRawMaterialExpenses) }"></div>
          </div>
          <div class="bar-legend">Gasto Materia Prima</div>
        </div>

        <!-- Overhead Expenses Bar -->
        <div class="bar-group">
          <div class="bar-label-top">${{ report.operationalOverhead.toLocaleString('es-ES') }}</div>
          <div class="bar-track">
            <div class="bar-fill fill-purple" :style="{ height: getBarHeight(report.operationalOverhead) }"></div>
          </div>
          <div class="bar-legend">Gastos Operativos</div>
        </div>

        <!-- Net Profit Bar -->
        <div class="bar-group">
          <div class="bar-label-top">${{ report.netProfit.toLocaleString('es-ES') }}</div>
          <div class="bar-track">
            <div 
              class="bar-fill" 
              :class="report.netProfit >= 0 ? 'fill-emerald' : 'fill-rose'"
              :style="{ height: getBarHeight(Math.abs(report.netProfit)) }"
            ></div>
          </div>
          <div class="bar-legend">Beneficio Neto</div>
        </div>
      </div>
    </div>

    <!-- Category Cost Breakdown -->
    <div class="glass-panel chart-box">
      <div class="chart-header">
        <h3>Distribución de Costo por Categoría de Materia Prima</h3>
        <span class="sub-label">Inversión Directa</span>
      </div>

      <div class="breakdown-list">
        <div 
          v-for="item in report.materialsBreakdown" 
          :key="item.category" 
          class="breakdown-item"
        >
          <div class="breakdown-info">
            <span class="cat-name">{{ item.category }}</span>
            <span class="cat-val">${{ item.totalCost.toLocaleString('es-ES', { minimumFractionDigits: 2 }) }}</span>
          </div>
          <div class="progress-track">
            <div 
              class="progress-fill" 
              :style="{ width: `${getCategoryPercent(item.totalCost)}%` }"
            ></div>
          </div>
        </div>

        <div v-if="report.materialsBreakdown.length === 0" class="empty-breakdown">
          Sin datos de categorías registrados.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CompanyFinancialReport } from '../types/platform';

interface Props {
  report: CompanyFinancialReport;
}

const props = defineProps<Props>();

const getBarHeight = (val: number): string => {
  const maxVal = Math.max(props.report.grossRevenue, 1);
  const percentage = Math.min(100, Math.max(5, (val / maxVal) * 100));
  return `${percentage}%`;
};

const getCategoryPercent = (totalCost: number): number => {
  const total = props.report.totalRawMaterialExpenses || 1;
  return Math.min(100, Number(((totalCost / total) * 100).toFixed(1)));
};
</script>

<style scoped>
.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (max-width: 900px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

.chart-box {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.chart-header h3 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
}

.sub-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.bars-wrapper {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 200px;
  padding-top: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
  flex: 1;
}

.bar-label-top {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-secondary);
  margin-bottom: 0.4rem;
}

.bar-track {
  width: 32px;
  height: 140px;
  background: hsla(220, 35%, 6%, 0.8);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  border: 1px solid hsla(215, 25%, 20%, 0.4);
}

.bar-fill {
  width: 100%;
  transition: height 0.4s ease-out;
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
}

.fill-cyan { background: linear-gradient(0deg, var(--accent-cyan), var(--accent-blue)); }
.fill-amber { background: linear-gradient(0deg, var(--accent-amber), hsla(38, 95%, 55%, 0.7)); }
.fill-purple { background: linear-gradient(0deg, var(--accent-purple), hsla(270, 85%, 65%, 0.7)); }
.fill-emerald { background: linear-gradient(0deg, var(--accent-emerald), hsla(160, 84%, 45%, 0.7)); }
.fill-rose { background: linear-gradient(0deg, var(--accent-rose), hsla(350, 89%, 60%, 0.7)); }

.bar-legend {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
  text-align: center;
  font-weight: 500;
}

.breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.breakdown-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.breakdown-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.cat-name {
  color: var(--text-primary);
  font-weight: 500;
}

.cat-val {
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--accent-emerald);
}

.progress-track {
  height: 8px;
  background: hsla(220, 35%, 6%, 0.8);
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-emerald), var(--accent-cyan));
  border-radius: 9999px;
  transition: width 0.4s ease-out;
}

.empty-breakdown {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.85rem;
  padding: 2rem;
}
</style>
