<template>
  <div class="glass-panel file-manager-container">
    <div class="fm-header">
      <div>
        <h3>Gestor de Archivos & Facturación de Materia Prima</h3>
        <span class="sub-title">Carga y organización de facturas, certificaciones de calidad y guías de despacho</span>
      </div>

      <div class="fm-actions-top">
        <button class="btn-secondary" @click="runOcrScan">
          <span>🤖 Escaneo OCR de Factura</span>
        </button>
        <button class="btn-primary" @click="toggleUploadForm">
          <span>{{ showUpload ? '✕ Cerrar' : '+ Cargar Documento' }}</span>
        </button>
      </div>
    </div>

    <!-- Upload Form -->
    <form v-if="showUpload" @submit.prevent="handleUploadSubmit" class="upload-form">
      <h4>Adjuntar Nuevo Documento de Empresa</h4>
      <div class="form-row">
        <input v-model="form.name" placeholder="Nombre del Archivo (ej: Factura_Lote_MP.pdf)" class="input-control" required />
        <select v-model="form.category" class="input-control">
          <option value="Factura">Factura</option>
          <option value="Guía de Despacho">Guía de Despacho</option>
          <option value="Ficha Técnica">Ficha Técnica</option>
          <option value="Certificado de Calidad">Certificado de Calidad</option>
        </select>
        <input v-model="form.relatedMaterialCode" placeholder="Código Materia Prima (Opcional)" class="input-control" />
        <select v-model="form.type" class="input-control">
          <option value="PDF">Documento PDF</option>
          <option value="EXCEL">Hoja de Cálculo Excel</option>
          <option value="IMG">Imagen / Escáner</option>
        </select>
        <input v-model="form.size" placeholder="Tamaño (ej: 1.5 MB)" class="input-control" required />
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-primary">Subir Documento</button>
      </div>
    </form>

    <!-- Documents List -->
    <div class="docs-grid">
      <div v-for="doc in documents" :key="doc.id" class="doc-card">
        <div class="doc-icon-badge" :class="`doc-${doc.type.toLowerCase()}`">
          {{ doc.type }}
        </div>
        <div class="doc-details">
          <strong class="doc-name">{{ doc.name }}</strong>
          <div class="doc-meta">
            <span class="category-pill">{{ doc.category }}</span>
            <span v-if="doc.relatedMaterialCode" class="code-pill">Insumo: {{ doc.relatedMaterialCode }}</span>
          </div>
          <span class="doc-footer-info">Subido el {{ doc.uploadedAt }} • {{ doc.size }}</span>
        </div>
        <div class="doc-actions">
          <button class="btn-secondary" @click="downloadDoc(doc.name)">Visualizar</button>
          <button class="btn-danger" @click="onDelete(doc.id)">Eliminar</button>
        </div>
      </div>

      <div v-if="documents.length === 0" class="empty-docs">
        No hay documentos cargados en el gestor administrativo.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { CompanyDocument } from '../types/platform';

interface Props {
  documents: CompanyDocument[];
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'upload', doc: Omit<CompanyDocument, 'id' | 'uploadedAt'>): void;
  (e: 'delete', id: string): void;
}>();

const showUpload = ref<boolean>(false);

const form = reactive({
  name: '',
  category: 'Factura' as CompanyDocument['category'],
  relatedMaterialCode: '',
  type: 'PDF',
  size: '1.5 MB',
});

const toggleUploadForm = () => {
  showUpload.value = !showUpload.value;
};

const handleUploadSubmit = () => {
  try {
    emit('upload', { ...form });
    form.name = '';
    form.relatedMaterialCode = '';
    showUpload.value = false;
  } catch (error) {
    console.error('[FileManager] Upload error:', error);
  }
};

const runOcrScan = () => {
  alert('🤖 Escáner OCR Inteligente: Extrayendo datos de la factura...\n✓ Detectado: Metalúrgica del Norte S.A.\n✓ Insumo: Acero Inoxidable Grado 316 (1500 kg @ $18.20/kg)\n✓ Confianza de Inteligencia Artificial: 97%');
  emit('upload', {
    name: 'Factura_OCR_Metalurgica_8841.pdf',
    category: 'Factura',
    relatedMaterialCode: 'MP-ACERO-316',
    type: 'PDF',
    size: '2.8 MB',
  });
};

const downloadDoc = (name: string) => {
  alert(`Abriendo vista previa del documento: ${name}`);
};

const onDelete = (id: string) => {
  try {
    emit('delete', id);
  } catch (error) {
    console.error('[FileManager] Delete doc error:', error);
  }
};
</script>

<style scoped>
.file-manager-container {
  padding: 1.5rem;
}

.fm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.fm-header h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.sub-title {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.upload-form {
  background: hsla(220, 35%, 6%, 0.9);
  padding: 1.25rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-glow);
  margin-bottom: 1.5rem;
}

.upload-form h4 {
  font-size: 0.9rem;
  color: var(--accent-emerald);
  margin-bottom: 0.75rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.docs-grid {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.doc-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem 1.25rem;
  background: hsla(220, 35%, 6%, 0.6);
  border: 1px solid hsla(215, 25%, 20%, 0.4);
  border-radius: var(--radius-md);
}

.doc-icon-badge {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.5rem 0.8rem;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
}

.doc-pdf { background: hsla(350, 89%, 60%, 0.15); color: var(--accent-rose); border: 1px solid hsla(350, 89%, 60%, 0.3); }
.doc-excel { background: hsla(160, 84%, 45%, 0.15); color: var(--accent-emerald); border: 1px solid hsla(160, 84%, 45%, 0.3); }
.doc-img { background: hsla(190, 90%, 50%, 0.15); color: var(--accent-cyan); border: 1px solid hsla(190, 90%, 50%, 0.3); }

.doc-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.doc-name {
  font-size: 0.9rem;
  color: var(--text-primary);
}

.doc-meta {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.category-pill {
  font-size: 0.75rem;
  color: var(--text-secondary);
  background: hsla(215, 25%, 20%, 0.5);
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-sm);
}

.code-pill {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--accent-cyan);
}

.doc-footer-info {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.doc-actions {
  display: flex;
  gap: 0.5rem;
}

.empty-docs {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
}
</style>
