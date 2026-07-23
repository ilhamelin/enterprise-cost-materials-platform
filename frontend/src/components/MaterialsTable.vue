<template>
  <div class="glass-panel table-container">
    <!-- Action Toolbar -->
    <div class="toolbar">
      <div class="search-filter-group">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Buscar por insumo, código o proveedor..." 
          class="input-control search-input"
        />
        <select v-model="selectedCategory" class="input-control">
          <option value="all">Todas las Categorías</option>
          <option value="Metales & Aleaciones">Metales & Aleaciones</option>
          <option value="Plásticos & Resinas">Plásticos & Resinas</option>
          <option value="Químicos">Químicos</option>
          <option value="Componentes">Componentes</option>
        </select>
      </div>

      <div class="action-buttons">
        <button class="btn-secondary" @click="exportToCsv">
          <span>📊 Exportar CSV</span>
        </button>
        <button class="btn-secondary" @click="$emit('openReorderModal')">
          <span>🛍️ Orden Sugerida</span>
        </button>
        <button v-if="canAddMaterial" class="btn-secondary" @click="$emit('openCsvImporter')">
          <span>📥 Importar CSV/Excel</span>
        </button>
        <button v-if="canAddMaterial" class="btn-primary" @click="toggleForm">
          <span>{{ showForm ? '✕ Cancelar' : '+ Registrar Materia Prima' }}</span>
        </button>
      </div>
    </div>

    <!-- Inline Form to Add New Material -->
    <form v-if="showForm" @submit.prevent="handleFormSubmit" class="add-material-form">
      <h4>Nuevo Insumo de Materia Prima</h4>
      <div class="form-grid">
        <input v-model="form.code" placeholder="Código (ej: MP-005)" class="input-control" required />
        <input v-model="form.name" placeholder="Nombre Insumo" class="input-control" required />
        <input v-model="form.category" placeholder="Categoría" class="input-control" required />
        <input v-model="form.supplier" placeholder="Proveedor" class="input-control" required />
        <input v-model.number="form.quantity" type="number" step="any" placeholder="Cantidad" class="input-control" required />
        <input v-model="form.unit" placeholder="Unidad (kg, ton)" class="input-control" required />
        <input v-model.number="form.unitCost" type="number" step="0.01" placeholder="Costo Unit. ($)" class="input-control" required />
        <input v-model.number="form.expectedYieldPercent" type="number" step="0.1" placeholder="Rendimiento Esperado (%)" class="input-control" required />
        <input v-model.number="form.wastePercent" type="number" step="0.1" placeholder="Merma/Desperdicio (%)" class="input-control" required />
        <select v-model="form.riskStatus" class="input-control">
          <option value="low">Riesgo Bajo</option>
          <option value="medium">Riesgo Medio</option>
          <option value="high">Riesgo Alto</option>
          <option value="critical">Riesgo Crítico</option>
        </select>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-primary">Guardar En Registro</button>
      </div>
    </form>

    <!-- Table -->
    <div class="table-wrapper">
      <table class="custom-table">
        <thead>
          <tr>
            <th>Código / Insumo</th>
            <th>Categoría</th>
            <th>Proveedor</th>
            <th>Cantidad</th>
            <th>Costo Unit.</th>
            <th>Costo Total ($)</th>
            <th>Rendimiento %</th>
            <th>Merma %</th>
            <th>Estado Riesgo</th>
            <th>Almacenamiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredMaterials" :key="item.id">
            <td>
              <div class="material-name-cell">
                <span class="code-tag">{{ item.code }}</span>
                <strong class="item-name">{{ item.name }}</strong>
              </div>
            </td>
            <td>{{ item.category }}</td>
            <td>{{ item.supplier }}</td>
            <td class="numeric">{{ item.quantity }} {{ item.unit }}</td>
            <td class="numeric">${{ item.unitCost.toFixed(2) }}</td>
            <td class="numeric cost-highlight">${{ (item.quantity * item.unitCost).toLocaleString('es-ES', { minimumFractionDigits: 2 }) }}</td>
            <td class="numeric">{{ item.expectedYieldPercent }}%</td>
            <td class="numeric" :class="{ 'waste-alert': item.wastePercent > 5.0 }">
              {{ item.wastePercent }}%
            </td>
            <td>
              <span class="badge-risk" :class="`risk-${item.riskStatus}`">
                {{ item.riskStatus }}
              </span>
            </td>
            <td>
              <ExpiryBadge :lastUpdatedTimestamp="item.lastUpdated" />
            </td>
            <td>
              <button v-if="canDeleteMaterial" class="btn-danger" @click="onDelete(item.id)">Eliminar</button>
              <span v-else class="text-muted" style="font-size: 0.75rem;">Lectura</span>
            </td>
          </tr>
          <tr v-if="filteredMaterials.length === 0">
            <td colspan="11" class="empty-state">No se encontraron insumos registrados en el inventario.</td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="summary-row">
            <td colspan="5"><strong>TOTAL GASTOS EN MATERIA PRIMA</strong></td>
            <td class="numeric grand-total">${{ totalMaterialCostSum.toLocaleString('es-ES', { minimumFractionDigits: 2 }) }}</td>
            <td colspan="4"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { RawMaterialItem, RiskLevel } from '../types/platform';
import ExpiryBadge from './ExpiryBadge.vue';

interface Props {
  materials: RawMaterialItem[];
  canAddMaterial?: boolean;
  canDeleteMaterial?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  canAddMaterial: true,
  canDeleteMaterial: true,
});

const emit = defineEmits<{
  (e: 'add', item: Omit<RawMaterialItem, 'id' | 'lastUpdated'>): void;
  (e: 'delete', id: string): void;
  (e: 'openCsvImporter'): void;
  (e: 'openReorderModal'): void;
}>();

const exportToCsv = () => {
  try {
    const headers = ['Codigo', 'Nombre', 'Categoria', 'Proveedor', 'Cantidad', 'Unidad', 'Costo Unitario ($)', 'Costo Total ($)', 'Rendimiento %', 'Merma %', 'Riesgo'];
    const rows = props.materials.map((m) => [
      `"${m.code}"`,
      `"${m.name}"`,
      `"${m.category}"`,
      `"${m.supplier}"`,
      m.quantity,
      `"${m.unit}"`,
      m.unitCost,
      (m.quantity * m.unitCost).toFixed(2),
      m.expectedYieldPercent,
      m.wastePercent,
      `"${m.riskStatus.toUpperCase()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Inventario_Materia_Prima_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('[MaterialsTable] Export error:', error);
  }
};

const searchQuery = ref<string>('');
const selectedCategory = ref<string>('all');
const showForm = ref<boolean>(false);

const form = reactive({
  code: '',
  name: '',
  category: 'Metales & Aleaciones',
  supplier: '',
  quantity: 100,
  unit: 'kg',
  unitCost: 10.0,
  expectedYieldPercent: 95.0,
  wastePercent: 2.0,
  riskStatus: 'low' as RiskLevel,
});

const toggleForm = () => {
  showForm.value = !showForm.value;
};

const filteredMaterials = computed(() => {
  try {
    return props.materials.filter((m) => {
      const matchesSearch = 
        m.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        m.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        m.supplier.toLowerCase().includes(searchQuery.value.toLowerCase());
      
      const matchesCategory = selectedCategory.value === 'all' || m.category === selectedCategory.value;
      return matchesSearch && matchesCategory;
    });
  } catch (error) {
    console.error('[MaterialsTable] Filter error:', error);
    return [];
  }
});

const totalMaterialCostSum = computed(() => {
  return filteredMaterials.value.reduce((acc, curr) => acc + curr.quantity * curr.unitCost, 0);
});

const handleFormSubmit = () => {
  try {
    emit('add', { ...form });
    // Reset form
    form.code = '';
    form.name = '';
    form.supplier = '';
    showForm.value = false;
  } catch (error) {
    console.error('[MaterialsTable] Form submit error:', error);
  }
};

const onDelete = (id: string) => {
  try {
    emit('delete', id);
  } catch (error) {
    console.error('[MaterialsTable] Delete error:', error);
  }
};
</script>

<style scoped>
.table-container {
  padding: 1.25rem;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  gap: 1rem;
}

.search-filter-group {
  display: flex;
  gap: 0.75rem;
  flex: 1;
  max-width: 600px;
}

.search-input {
  flex: 1;
}

.add-material-form {
  background: hsla(220, 35%, 6%, 0.9);
  padding: 1.25rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-glow);
  margin-bottom: 1.25rem;
}

.add-material-form h4 {
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
  color: var(--accent-emerald);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.material-name-cell {
  display: flex;
  flex-direction: column;
}

.code-tag {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--accent-cyan);
}

.item-name {
  font-size: 0.85rem;
}

.numeric {
  font-family: var(--font-mono);
}

.cost-highlight {
  color: var(--accent-emerald);
  font-weight: 700;
}

.waste-alert {
  color: var(--accent-rose);
  font-weight: 700;
}

.summary-row td {
  background: hsla(220, 35%, 6%, 0.9);
  border-top: 2px solid var(--accent-emerald);
  padding: 1rem;
}

.grand-total {
  font-size: 1rem;
  color: var(--accent-emerald);
  font-weight: 800;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
}
</style>
