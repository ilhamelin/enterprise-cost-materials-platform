<template>
  <div class="kpi-kri-section">
    <!-- KPI Section -->
    <div class="section-title-group">
      <h3 class="section-heading">Indicadores Clave de Rendimiento (KPIs)</h3>
      <span class="sub-heading">Desempeño Económico & Eficiencia de Producción</span>
    </div>

    <div class="kpi-grid">
      <div class="glass-panel kpi-card">
        <div class="card-top">
          <span class="kpi-label">MARGEN DE BENEFICIO NETO</span>
          <span class="kpi-icon">📈</span>
        </div>
        <div class="kpi-value-group">
          <span class="kpi-number" :class="{ 'positive': report.profitMargin > 20, 'negative': report.profitMargin < 0 }">
            {{ report.profitMargin }}%
          </span>
          <span class="kpi-subtext">Beneficio Neto: ${{ report.netProfit.toLocaleString('es-ES') }}</span>
        </div>
      </div>

      <div class="glass-panel kpi-card">
        <div class="card-top">
          <span class="kpi-label">RENDIMIENTO PROMEDIO DE MATERIA PRIMA</span>
          <span class="kpi-icon">⚙️</span>
        </div>
        <div class="kpi-value-group">
          <span class="kpi-number highlight-emerald">{{ report.kpis.totalProductionYield }}%</span>
          <span class="kpi-subtext">Yield Rate por Lote de Producción</span>
        </div>
      </div>

      <div class="glass-panel kpi-card">
        <div class="card-top">
          <span class="kpi-label">RETORNO SOBRE INVERSIÓN (ROI) INSUMOS</span>
          <span class="kpi-icon">💰</span>
        </div>
        <div class="kpi-value-group">
          <span class="kpi-number highlight-cyan">{{ report.kpis.roiPercentage }}%</span>
          <span class="kpi-subtext">Rendimiento por Dólar Invertido en Materia Prima</span>
        </div>
      </div>

      <div class="glass-panel kpi-card">
        <div class="card-top">
          <span class="kpi-label">COSTO TOTAL MATERIA PRIMA</span>
          <span class="kpi-icon">📦</span>
        </div>
        <div class="kpi-value-group">
          <span class="kpi-number">${{ report.totalRawMaterialExpenses.toLocaleString('es-ES') }}</span>
          <span class="kpi-subtext">Inversión Directa en Insumos</span>
        </div>
      </div>
    </div>

    <!-- KRI Section -->
    <div class="section-title-group kri-title-margin">
      <h3 class="section-heading heading-kri">Indicadores Clave de Riesgo (KRIs)</h3>
      <span class="sub-heading">Alertas Tempranas de Merma Crítica y Volatilidad de Proveedores</span>
    </div>

    <div class="kri-feed-grid">
      <div 
        v-for="kri in report.kris" 
        :key="kri.id" 
        class="glass-panel kri-card"
        :class="`kri-border-${kri.severity}`"
      >
        <div class="kri-card-header">
          <span class="badge-risk" :class="`risk-${kri.severity}`">{{ kri.severity }}</span>
          <span class="kri-time">{{ new Date(kri.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
        </div>
        <h4 class="kri-title">{{ kri.title }}</h4>
        <p class="kri-desc">{{ kri.description }}</p>
        <div class="kri-footer">
          <span class="affected-tag">Insumo: {{ kri.affectedMaterialName }}</span>
        </div>
      </div>

      <div v-if="report.kris.length === 0" class="glass-panel no-risk-card">
        <span class="check-icon">✓</span>
        <span>Sin Alertas de Riesgo Crítico. Los niveles de merma y proveedores operan dentro de los márgenes seguros.</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CompanyFinancialReport } from '../types/platform';

interface Props {
  report: CompanyFinancialReport;
}

defineProps<Props>();
</script>

<style scoped>
.kpi-kri-section {
  margin-bottom: 2rem;
}

.section-title-group {
  margin-bottom: 1rem;
}

.section-heading {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.heading-kri {
  color: var(--accent-amber);
}

.sub-heading {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
}

.kpi-card {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.kpi-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.kpi-icon {
  font-size: 1.2rem;
}

.kpi-number {
  font-size: 2.1rem;
  font-weight: 800;
  font-family: var(--font-sans);
  letter-spacing: -0.03em;
  color: var(--text-primary);
}

.positive { color: var(--accent-emerald); }
.negative { color: var(--accent-rose); }
.highlight-emerald { color: var(--accent-emerald); }
.highlight-cyan { color: var(--accent-cyan); }

.kpi-subtext {
  font-size: 0.75rem;
  color: var(--text-secondary);
  display: block;
  margin-top: 0.2rem;
}

.kri-title-margin {
  margin-top: 2rem;
}

.kri-feed-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.kri-card {
  padding: 1rem 1.25rem;
}

.kri-border-critical { border-left: 4px solid var(--accent-rose); }
.kri-border-high { border-left: 4px solid var(--accent-amber); }
.kri-border-medium { border-left: 4px solid var(--accent-cyan); }
.kri-border-low { border-left: 4px solid var(--accent-emerald); }

.kri-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.kri-time {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
}

.kri-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.kri-desc {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.affected-tag {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
}

.no-risk-card {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--accent-emerald);
  font-size: 0.85rem;
  font-weight: 500;
  grid-column: 1 / -1;
}

.check-icon {
  font-size: 1.25rem;
  font-weight: 800;
}
</style>
