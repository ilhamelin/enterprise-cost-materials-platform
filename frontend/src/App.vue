<template>
  <div class="dashboard-container">
    <!-- Top RBAC Selector -->
    <RbacRoleSelector
      :currentRole="currentRole"
      :currentUserName="currentUserName"
      :roleLabels="roleLabels"
      @switch="switchRole"
    />

    <!-- Header Navbar -->
    <header class="glass-panel app-header">
      <div class="brand-section">
        <div class="brand-icon">M</div>
        <div>
          <h1 class="brand-title">MaterialCost Enterprise</h1>
          <span class="sub-heading">Gestión Administrativa, Simulador What-If & Control Costo/Rendimiento</span>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <nav class="nav-tabs" aria-label="Navegación Principal">
        <button 
          class="tab-btn" 
          :class="{ active: currentTab === 'dashboard' }"
          @click="currentTab = 'dashboard'"
        >
          📊 Dashboard & KPI/KRI
        </button>

        <button 
          class="tab-btn" 
          :class="{ active: currentTab === 'simulator' }"
          @click="currentTab = 'simulator'"
        >
          🔮 Simulador What-If
        </button>

        <button 
          class="tab-btn" 
          :class="{ active: currentTab === 'table' }"
          @click="currentTab = 'table'"
        >
          📦 Insumos ({{ materials.length }})
        </button>

        <button 
          class="tab-btn" 
          :class="{ active: currentTab === 'files' }"
          @click="currentTab = 'files'"
        >
          📁 Archivos ({{ documents.length }})
        </button>

        <button 
          v-if="permissions.canViewAuditLogs"
          class="tab-btn" 
          :class="{ active: currentTab === 'audit' }"
          @click="currentTab = 'audit'"
        >
          📜 Bitácora Auditoría
        </button>

        <button 
          class="tab-btn" 
          :class="{ active: currentTab === 'report' }"
          @click="currentTab = 'report'"
        >
          📄 Reporte PDF
        </button>
      </nav>
    </header>

    <!-- Notification Center for KRI Alerts -->
    <NotificationCenter :alerts="financialReport.kris" />

    <!-- Financial Scenario Inputs Bar -->
    <div class="glass-panel scenario-bar">
      <div class="scenario-title">
        <strong>Modelo Financiero Base:</strong>
      </div>

      <div class="scenario-inputs">
        <label>
          <span>Ingresos Brutos ($):</span>
          <input 
            v-model.number="grossRevenue" 
            type="number" 
            step="1000" 
            class="input-control" 
          />
        </label>

        <label>
          <span>Gastos Operativos ($):</span>
          <input 
            v-model.number="operationalOverhead" 
            type="number" 
            step="1000" 
            class="input-control" 
          />
        </label>
      </div>

      <div class="scenario-summary">
        <span>Beneficio Neto Est.: <strong :class="financialReport.netProfit >= 0 ? 'text-emerald' : 'text-rose'">${{ financialReport.netProfit.toLocaleString('es-ES') }}</strong></span>
      </div>
    </div>

    <!-- Main Content Area -->
    <main class="tab-content">
      <!-- TAB 1: Dashboard -->
      <section v-if="currentTab === 'dashboard'">
        <KpiKriCards :report="financialReport" />
        <FinancialCharts :report="financialReport" />
      </section>

      <!-- TAB 2: What-If Simulator -->
      <section v-else-if="currentTab === 'simulator'">
        <ScenarioSimulator :report="financialReport" :materials="materials" />
      </section>

      <!-- TAB 3: Interactive Materials Table -->
      <section v-else-if="currentTab === 'table'">
        <MaterialsTable
          :materials="materials"
          :canAddMaterial="permissions.canAddMaterial"
          :canDeleteMaterial="permissions.canDeleteMaterial"
          @add="handleAddMaterial"
          @delete="handleDeleteMaterial"
          @openCsvImporter="isCsvModalOpen = true"
          @openReorderModal="isReorderModalOpen = true"
        />
      </section>

      <!-- TAB 4: File Manager -->
      <section v-else-if="currentTab === 'files'">
        <FileManager
          :documents="documents"
          @upload="handleAddDocument"
          @delete="handleDeleteDocument"
        />
      </section>

      <!-- TAB 5: Audit Trail Log -->
      <section v-else-if="currentTab === 'audit' && permissions.canViewAuditLogs">
        <AuditTrailLog :logs="auditLogs" />
      </section>

      <!-- TAB 6: Executive Report -->
      <section v-else-if="currentTab === 'report'">
        <ExecutiveReport :report="financialReport" />
      </section>
    </main>

    <!-- Modal CSV Importer -->
    <CsvImporterModal
      :isOpen="isCsvModalOpen"
      @close="isCsvModalOpen = false"
      @importBatch="handleImportBatch"
    />

    <!-- Modal Reorder Purchase Orders -->
    <ReorderModal
      :isOpen="isReorderModalOpen"
      :materials="materials"
      @close="isReorderModalOpen = false"
    />

    <!-- Command Palette (Ctrl+K) -->
    <CommandPalette
      :isOpen="isCommandPaletteOpen"
      @close="isCommandPaletteOpen = false"
      @navigate="(tab) => currentTab = tab"
      @openCsvImporter="isCsvModalOpen = true"
      @openReorderModal="isReorderModalOpen = true"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import AuditTrailLog from './components/AuditTrailLog.vue';
import CommandPalette from './components/CommandPalette.vue';
import CsvImporterModal from './components/CsvImporterModal.vue';
import ExecutiveReport from './components/ExecutiveReport.vue';
import FileManager from './components/FileManager.vue';
import FinancialCharts from './components/FinancialCharts.vue';
import KpiKriCards from './components/KpiKriCards.vue';
import MaterialsTable from './components/MaterialsTable.vue';
import NotificationCenter from './components/NotificationCenter.vue';
import RbacRoleSelector from './components/RbacRoleSelector.vue';
import ReorderModal from './components/ReorderModal.vue';
import ScenarioSimulator from './components/ScenarioSimulator.vue';

import { useAuditTrail } from './composables/useAuditTrail';
import { useEnterpriseMaterials } from './composables/useEnterpriseMaterials';
import { useRbac } from './composables/useRbac';
import { CompanyDocument, RawMaterialItem } from './types/platform';

const {
  materials,
  grossRevenue,
  operationalOverhead,
  financialReport,
  documents,
  addMaterialItem,
  deleteMaterialItem,
  addDocument,
  deleteDocument,
} = useEnterpriseMaterials();

const { currentRole, currentUserName, roleLabels, permissions, switchRole } = useRbac();
const { auditLogs, recordAudit } = useAuditTrail();

const currentTab = ref<'dashboard' | 'simulator' | 'table' | 'files' | 'audit' | 'report'>('dashboard');
const isCsvModalOpen = ref<boolean>(false);
const isReorderModalOpen = ref<boolean>(false);
const isCommandPaletteOpen = ref<boolean>(false);

const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    isCommandPaletteOpen.value = !isCommandPaletteOpen.value;
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

const handleAddMaterial = (item: Omit<RawMaterialItem, 'id' | 'lastUpdated'>) => {
  addMaterialItem(item);
  recordAudit(
    currentUserName.value,
    currentRole.value,
    'CREATE',
    'Materia Prima',
    item.code,
    `Insumo ${item.name} registrado. Cantidad: ${item.quantity} ${item.unit} @ $${item.unitCost}/unidad.`
  );
};

const handleDeleteMaterial = (id: string) => {
  const target = materials.value.find((m) => m.id === id);
  deleteMaterialItem(id);
  if (target) {
    recordAudit(
      currentUserName.value,
      currentRole.value,
      'DELETE',
      'Materia Prima',
      target.code,
      `Insumo ${target.name} eliminado del inventario.`
    );
  }
};

const handleImportBatch = (items: Omit<RawMaterialItem, 'id' | 'lastUpdated'>[]) => {
  items.forEach((item) => addMaterialItem(item));
  recordAudit(
    currentUserName.value,
    currentRole.value,
    'IMPORT',
    'Catálogo Insumos',
    'BATCH',
    `Importados ${items.length} insumos mediante archivo CSV/Excel masivo.`
  );
};

const handleAddDocument = (doc: Omit<CompanyDocument, 'id' | 'uploadedAt'>) => {
  addDocument(doc);
  recordAudit(
    currentUserName.value,
    currentRole.value,
    'CREATE',
    'Documento Empresa',
    doc.name,
    `Cargado documento categoría ${doc.category}.`
  );
};

const handleDeleteDocument = (id: string) => {
  const doc = documents.value.find((d) => d.id === id);
  deleteDocument(id);
  if (doc) {
    recordAudit(
      currentUserName.value,
      currentRole.value,
      'DELETE',
      'Documento Empresa',
      doc.name,
      `Documento ${doc.name} eliminado.`
    );
  }
};
</script>

<style scoped>
.brand-title {
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(90deg, #ffffff, var(--text-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sub-heading {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.scenario-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.85rem;
}

.scenario-title {
  color: var(--text-secondary);
}

.scenario-inputs {
  display: flex;
  gap: 1.5rem;
}

.scenario-inputs label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
}

.scenario-inputs input {
  width: 130px;
  font-family: var(--font-mono);
  font-weight: 700;
}

.scenario-summary {
  font-family: var(--font-mono);
}

.scenario-summary strong {
  font-size: 1.05rem;
}

.text-emerald { color: var(--accent-emerald); }
.text-rose { color: var(--accent-rose); }
</style>
