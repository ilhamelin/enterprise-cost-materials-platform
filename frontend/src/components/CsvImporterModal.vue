<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="glass-panel modal-box">
      <div class="modal-header">
        <h3>Importador Masivo de Materia Prima (CSV / Excel)</h3>
        <button class="close-btn" @click="closeModal">✕</button>
      </div>

      <div class="drop-zone" @dragover.prevent @drop.prevent="handleFileDrop">
        <span class="drop-icon">📄</span>
        <p>Arrastra y suelta tu archivo <strong>.CSV</strong> o <strong>.XLSX</strong> aquí</p>
        <span class="sub-text">O haz clic para seleccionar un archivo local</span>
        <button class="btn-secondary" @click="simulateFileUpload">Seleccionar Archivo Demo</button>
      </div>

      <!-- Preview Table -->
      <div v-if="parsedPreview.length > 0" class="preview-section">
        <h4>Vista Previa de Filas a Importar ({{ parsedPreview.length }} insumos)</h4>
        <div class="table-wrapper">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre Insumo</th>
                <th>Categoría</th>
                <th>Cantidad</th>
                <th>Costo Unit. ($)</th>
                <th>Merma %</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in parsedPreview" :key="i">
                <td class="numeric">{{ row.code }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.category }}</td>
                <td class="numeric">{{ row.quantity }} {{ row.unit }}</td>
                <td class="numeric">${{ row.unitCost }}</td>
                <td class="numeric">{{ row.wastePercent }}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal">Cancelar</button>
          <button class="btn-primary" @click="confirmImport">Confirmar e Inserción Masiva</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RawMaterialItem } from '../types/platform';

interface Props {
  isOpen: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'importBatch', items: Omit<RawMaterialItem, 'id' | 'lastUpdated'>[]): void;
}>();

const parsedPreview = ref<Omit<RawMaterialItem, 'id' | 'lastUpdated'>[]>([]);

const closeModal = () => {
  parsedPreview.value = [];
  emit('close');
};

const simulateFileUpload = () => {
  parsedPreview.value = [
    {
      code: 'MP-TITANIO-05',
      name: 'Titanio Grado 5 de Alta Resistencia',
      category: 'Metales & Aleaciones',
      supplier: 'Titanium Alloys Corp.',
      quantity: 350,
      unit: 'kg',
      unitCost: 45.0,
      expectedYieldPercent: 97.5,
      wastePercent: 1.5,
      riskStatus: 'low',
    },
    {
      code: 'MP-FIBRA-CARB',
      name: 'Fibra de Carbono 3K Tecno',
      category: 'Componentes',
      supplier: 'Carbon Fiber Solutions',
      quantity: 600,
      unit: 'm2',
      unitCost: 28.5,
      expectedYieldPercent: 93.0,
      wastePercent: 4.2,
      riskStatus: 'medium',
    },
  ];
};

const handleFileDrop = () => {
  simulateFileUpload();
};

const confirmImport = () => {
  emit('importBatch', parsedPreview.value);
  closeModal();
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-box {
  width: 90%;
  max-width: 800px;
  padding: 1.5rem;
  background: var(--bg-dark);
  border: 1px solid var(--border-glow);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.modal-header h3 {
  font-size: 1.1rem;
  color: var(--text-primary);
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 1.25rem;
  cursor: pointer;
}

.drop-zone {
  border: 2px dashed var(--border-color);
  padding: 2rem;
  text-align: center;
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.drop-icon { font-size: 2.5rem; }
.sub-text { font-size: 0.75rem; color: var(--text-muted); }

.preview-section h4 {
  font-size: 0.9rem;
  color: var(--accent-emerald);
  margin-bottom: 0.75rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.numeric { font-family: var(--font-mono); }
</style>
