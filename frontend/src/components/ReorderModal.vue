<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="glass-panel modal-box">
      <div class="modal-header">
        <h3>🛍️ Calculadora de Punto de Reorden & Órdenes de Compra Sugeridas</h3>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <p class="sub-text">
        Análisis automático de reabastecimiento ($ROP = \text{Consumo} \times \text{Lead Time} + \text{Safety Stock}$). Se detectaron 
        <strong>{{ suggestions.length }} insumos con necesidad de reorden</strong>.
      </p>

      <div class="suggestions-list">
        <div v-for="item in suggestions" :key="item.materialId" class="suggestion-card">
          <div class="sug-header">
            <span class="code-pill">{{ item.materialCode }}</span>
            <strong class="mat-name">{{ item.materialName }}</strong>
            <span class="badge-risk" :class="`risk-${item.urgency}`">
              {{ item.urgency === 'critical' ? 'CRÍTICO' : 'URGENTE' }}
            </span>
          </div>

          <div class="sug-body">
            <span>Stock Actual: <strong>{{ item.currentQuantity }}</strong> | Punto de Reorden: <strong>{{ item.reorderPoint }}</strong></span>
            <span class="supplier-tag">Proveedor: {{ item.supplier }}</span>
          </div>

          <div class="sug-footer">
            <span class="suggested-qty">Cantidad Sugerida a Pedir: <strong>+{{ item.suggestedQuantityToOrder }} unidades</strong></span>
            <span class="est-cost">Costo Est.: <strong>${{ item.estimatedCost.toLocaleString('es-ES') }}</strong></span>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" @click="$emit('close')">Cerrar</button>
        <button class="btn-primary" @click="confirmPurchaseOrders">
          <span>✓ Generar Orden de Compra de 1-Clic</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RawMaterialItem } from '../types/platform';

interface Props {
  isOpen: boolean;
  materials: RawMaterialItem[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'orderGenerated'): void;
}>();

const suggestions = computed(() => {
  try {
    return props.materials.map((m) => {
      const dailyUsage = Math.max(10, m.quantity * 0.05);
      const reorderPoint = Math.ceil(dailyUsage * 7 + dailyUsage * 3);
      const suggestedQty = Math.max(500, reorderPoint * 2 - m.quantity);
      return {
        materialId: m.id,
        materialCode: m.code,
        materialName: m.name,
        supplier: m.supplier,
        currentQuantity: m.quantity,
        reorderPoint,
        suggestedQuantityToOrder: suggestedQty,
        estimatedCost: Number((suggestedQty * m.unitCost).toFixed(2)),
        urgency: m.quantity <= reorderPoint * 0.5 ? 'critical' : 'urgent',
      };
    });
  } catch (error) {
    return [];
  }
});

const confirmPurchaseOrders = () => {
  alert(`✓ Órdenes de Compra Sugeridas enviadas exitosamente a los proveedores por un total estimado de $${suggestions.value.reduce((a, b) => a + b.estimatedCost, 0).toLocaleString('es-ES')}.`);
  emit('orderGenerated');
  emit('close');
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
  max-width: 750px;
  padding: 1.5rem;
  background: var(--bg-dark);
  border: 1px solid var(--border-glow);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
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

.sub-text {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 1.25rem;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  max-height: 380px;
  overflow-y: auto;
}

.suggestion-card {
  background: hsla(220, 35%, 6%, 0.8);
  border: 1px solid hsla(215, 25%, 20%, 0.4);
  padding: 1rem;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.85rem;
}

.sug-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.code-pill {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--accent-cyan);
}

.mat-name {
  flex: 1;
  color: var(--text-primary);
}

.sug-body {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.supplier-tag { color: var(--text-muted); }

.sug-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 0.4rem;
  border-top: 1px solid hsla(215, 25%, 20%, 0.3);
  font-size: 0.8rem;
}

.suggested-qty { color: var(--accent-emerald); }
.est-cost { font-family: var(--font-mono); color: var(--accent-amber); }

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.25rem;
}
</style>
