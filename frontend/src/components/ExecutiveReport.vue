<template>
  <div class="glass-panel report-container">
    <!-- Header Controls -->
    <div class="report-header-actions">
      <div>
        <h3>Informe Ejecutivo de Costo/Rendimiento y Riesgos</h3>
        <span class="sub-title">Resumen financiero consolidado para la toma de decisiones directivas</span>
      </div>

      <button class="btn-primary" @click="handlePrint">
        <span>🖨️ Imprimir / Exportar PDF</span>
      </button>
    </div>

    <!-- Executive Document Sheet -->
    <div class="report-sheet">
      <div class="sheet-header">
        <div class="company-brand">
          <div class="logo">E</div>
          <div>
            <h2>MaterialCost Enterprise S.A.</h2>
            <span>Departamento de Administración & Control de Gestión</span>
          </div>
        </div>
        <div class="report-meta">
          <strong>REPORTE FINANCIERO & MATERIA PRIMA</strong>
          <span>{{ report.period }}</span>
        </div>
      </div>

      <hr class="divider" />

      <!-- Section 1: Financial Summary -->
      <div class="report-section">
        <h4>1. RESUMEN FINANCIERO EJECUTIVO</h4>
        <div class="summary-grid">
          <div class="summary-box">
            <span class="lbl">Ingresos Brutos:</span>
            <span class="val">${{ report.grossRevenue.toLocaleString('es-ES') }}</span>
          </div>
          <div class="summary-box">
            <span class="lbl">Costo Materia Prima:</span>
            <span class="val text-amber">${{ report.totalRawMaterialExpenses.toLocaleString('es-ES') }}</span>
          </div>
          <div class="summary-box">
            <span class="lbl">Gastos Operativos:</span>
            <span class="val text-purple">${{ report.operationalOverhead.toLocaleString('es-ES') }}</span>
          </div>
          <div class="summary-box highlight-box">
            <span class="lbl">BENEFICIO NETO:</span>
            <span class="val text-emerald">${{ report.netProfit.toLocaleString('es-ES') }}</span>
          </div>
        </div>
      </div>

      <!-- Section 2: KPIs & Yield -->
      <div class="report-section">
        <h4>2. INDICADORES DE RENDIMIENTO (KPIs)</h4>
        <ul class="kpi-bullet-list">
          <li><strong>Margen de Beneficio Neto:</strong> {{ report.profitMargin }}% sobre el total de ventas.</li>
          <li><strong>Yield Rate de Producción:</strong> {{ report.kpis.totalProductionYield }}% de aprovechamiento útil de insumos.</li>
          <li><strong>Porcentaje Promedio de Merma:</strong> {{ report.kpis.averageWastePercent }}% desperdiciado en procesos.</li>
          <li><strong>Retorno sobre Inversión (ROI):</strong> {{ report.kpis.roiPercentage }}% por dólar destinado a insumos.</li>
        </ul>
      </div>

      <!-- Section 3: KRIs & Risk Status -->
      <div class="report-section">
        <h4>3. INDICADORES CLAVE DE RIESGO (KRIs)</h4>
        <div v-if="report.kris.length > 0" class="kri-list">
          <div v-for="kri in report.kris" :key="kri.id" class="kri-item">
            <span class="kri-badge" :class="`risk-${kri.severity}`">[{{ kri.severity.toUpperCase() }}]</span>
            <strong>{{ kri.title }}:</strong> {{ kri.description }}
          </div>
        </div>
        <p v-else class="clean-risk">No se registraron desviaciones críticas ni riesgos sobre la tolerancia permitida.</p>
      </div>

      <!-- Section 4: Category Cost Breakdown -->
      <div class="report-section">
        <h4>4. DESGLOSE DE GASTOS POR CATEGORÍA DE MATERIA PRIMA</h4>
        <table class="report-mini-table">
          <thead>
            <tr>
              <th>Categoría Insumo</th>
              <th>Costo Total Directo ($)</th>
              <th>% del Gasto Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in report.materialsBreakdown" :key="item.category">
              <td>{{ item.category }}</td>
              <td>${{ item.totalCost.toLocaleString('es-ES', { minimumFractionDigits: 2 }) }}</td>
              <td>{{ ((item.totalCost / (report.totalRawMaterialExpenses || 1)) * 100).toFixed(1) }}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="sheet-footer">
        <span>Documento generado automáticamente por la Plataforma de Control de Rendimiento Enterprise.</span>
        <span>Página 1 de 1</span>
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

const handlePrint = () => {
  window.print();
};
</script>

<style scoped>
.report-container {
  padding: 1.5rem;
}

.report-header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.report-header-actions h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.sub-title {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.report-sheet {
  background: hsla(220, 35%, 6%, 0.9);
  padding: 2rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  font-size: 0.85rem;
}

.sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.company-brand {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.company-brand .logo {
  width: 38px;
  height: 38px;
  background: var(--accent-emerald);
  border-radius: var(--radius-sm);
  color: white;
  font-weight: 800;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.company-brand h2 {
  font-size: 1rem;
  color: var(--text-primary);
}

.company-brand span {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.report-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.divider {
  border: none;
  height: 1px;
  background: var(--border-color);
  margin: 1.5rem 0;
}

.report-section {
  margin-bottom: 1.5rem;
}

.report-section h4 {
  font-size: 0.85rem;
  color: var(--accent-cyan);
  margin-bottom: 0.75rem;
  letter-spacing: 0.04em;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.summary-box {
  background: hsla(220, 35%, 10%, 0.8);
  padding: 0.85rem;
  border-radius: var(--radius-sm);
  display: flex;
  flex-direction: column;
}

.summary-box .lbl {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.summary-box .val {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 1.1rem;
  margin-top: 0.25rem;
}

.highlight-box {
  border: 1px solid var(--accent-emerald);
}

.text-amber { color: var(--accent-amber); }
.text-purple { color: var(--accent-purple); }
.text-emerald { color: var(--accent-emerald); }

.kpi-bullet-list {
  padding-left: 1.25rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

.kri-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.kri-item {
  background: hsla(350, 89%, 60%, 0.1);
  padding: 0.6rem 0.8rem;
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--accent-rose);
  color: var(--text-secondary);
}

.kri-badge {
  font-weight: 700;
  margin-right: 0.5rem;
}

.clean-risk {
  color: var(--accent-emerald);
}

.report-mini-table {
  width: 100%;
  border-collapse: collapse;
}

.report-mini-table th, .report-mini-table td {
  padding: 0.6rem 0.85rem;
  border: 1px solid var(--border-color);
  text-align: left;
}

.report-mini-table th {
  background: hsla(220, 35%, 10%, 0.8);
  color: var(--text-muted);
}

.sheet-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}
</style>
