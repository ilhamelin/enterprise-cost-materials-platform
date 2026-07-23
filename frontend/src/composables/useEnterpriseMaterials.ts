import { computed, ref } from 'vue';
import { CompanyDocument, CompanyFinancialReport, KriAlert, RawMaterialItem } from '../types/platform';

/**
 * Composable for managing Enterprise Raw Materials, Cost/Performance KPIs & KRIs, and Documents.
 */
export function useEnterpriseMaterials() {
  const materials = ref<RawMaterialItem[]>([
    {
      id: 'mat-001',
      code: 'MP-ACERO-316',
      name: 'Acero Inoxidable Grado 316',
      category: 'Metales & Aleaciones',
      supplier: 'Metalúrgica del Norte S.A.',
      quantity: 1250,
      unit: 'kg',
      unitCost: 18.5,
      expectedYieldPercent: 94.5,
      wastePercent: 3.2,
      riskStatus: 'low',
      lastUpdated: Date.now() - 86400000 * 2,
    },
    {
      id: 'mat-002',
      code: 'MP-POLI-HDPE',
      name: 'Polímero HDPE de Alta Densidad',
      category: 'Plásticos & Resinas',
      supplier: 'Plastiquim Corp.',
      quantity: 3400,
      unit: 'kg',
      unitCost: 4.2,
      expectedYieldPercent: 91.0,
      wastePercent: 6.8, // Trigger KRI: > 5.0%
      riskStatus: 'medium',
      lastUpdated: Date.now() - 86400000,
    },
    {
      id: 'mat-003',
      code: 'MP-ALUM-6061',
      name: 'Aluminio Extruido 6061-T6',
      category: 'Metales & Aleaciones',
      supplier: 'Aluminios Globales Ltda.',
      quantity: 800,
      unit: 'kg',
      unitCost: 12.8,
      expectedYieldPercent: 96.0,
      wastePercent: 2.1,
      riskStatus: 'low',
      lastUpdated: Date.now(),
    },
    {
      id: 'mat-004',
      code: 'MP-COBRE-ELEC',
      name: 'Cobre Electrolítico de Alta Pureza',
      category: 'Metales & Aleaciones',
      supplier: 'Cuprum Industries',
      quantity: 450,
      unit: 'kg',
      unitCost: 32.0,
      expectedYieldPercent: 88.0,
      wastePercent: 7.5, // Trigger KRI
      riskStatus: 'critical', // Trigger KRI
      lastUpdated: Date.now(),
    },
  ]);

  const grossRevenue = ref<number>(280000);
  const operationalOverhead = ref<number>(45000);

  const documents = ref<CompanyDocument[]>([
    {
      id: 'doc-101',
      name: 'Factura_Importacion_Acero_316.pdf',
      type: 'PDF',
      size: '2.4 MB',
      uploadedAt: new Date().toLocaleDateString('es-ES'),
      relatedMaterialCode: 'MP-ACERO-316',
      category: 'Factura',
    },
    {
      id: 'doc-102',
      name: 'Certificado_Calidad_Polimero_HDPE.pdf',
      type: 'PDF',
      size: '1.1 MB',
      uploadedAt: new Date().toLocaleDateString('es-ES'),
      relatedMaterialCode: 'MP-POLI-HDPE',
      category: 'Certificado de Calidad',
    },
  ]);

  // Compute live Financial Report and KPIs/KRIs in O(N)
  const financialReport = computed<CompanyFinancialReport>(() => {
    try {
      const items = materials.value;
      if (items.length === 0) {
        return {
          period: 'Sin Datos',
          grossRevenue: grossRevenue.value,
          totalRawMaterialExpenses: 0,
          operationalOverhead: operationalOverhead.value,
          netProfit: grossRevenue.value - operationalOverhead.value,
          profitMargin: 0,
          kpis: {
            totalMaterialCost: 0,
            totalProductionYield: 0,
            averageWastePercent: 0,
            netProfitMarginPercent: 0,
            roiPercentage: 0,
          },
          kris: [],
          materialsBreakdown: [],
        };
      }

      let totalMaterialCost = 0;
      let totalYieldSum = 0;
      let totalWasteSum = 0;
      const kris: KriAlert[] = [];
      const categoryMap = new Map<string, number>();

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemTotalCost = item.quantity * item.unitCost;
        totalMaterialCost += itemTotalCost;
        totalYieldSum += item.expectedYieldPercent;
        totalWasteSum += item.wastePercent;

        const currentCatCost = categoryMap.get(item.category) || 0;
        categoryMap.set(item.category, currentCatCost + itemTotalCost);

        // KRI: Waste limit exceeded
        if (item.wastePercent > 5.0) {
          kris.push({
            id: `kri-w-${item.id}`,
            type: 'waste_limit_exceeded',
            severity: item.wastePercent > 8.0 ? 'critical' : 'high',
            title: `Exceso de Merma: ${item.name}`,
            description: `Merma de ${item.wastePercent}% supera la tolerancia recomendada del 5.0%.`,
            affectedMaterialName: item.name,
            timestamp: item.lastUpdated,
          });
        }

        // KRI: Supplier risk
        if (item.riskStatus === 'high' || item.riskStatus === 'critical') {
          kris.push({
            id: `kri-r-${item.id}`,
            type: 'supplier_risk',
            severity: item.riskStatus,
            title: `Riesgo de Insumo: ${item.name}`,
            description: `Proveedor ${item.supplier} marcado con riesgo ${item.riskStatus.toUpperCase()}.`,
            affectedMaterialName: item.name,
            timestamp: item.lastUpdated,
          });
        }
      }

      const totalExpenses = totalMaterialCost + operationalOverhead.value;
      const netProfit = grossRevenue.value - totalExpenses;
      const profitMargin = grossRevenue.value > 0 ? (netProfit / grossRevenue.value) * 100 : 0;
      const roiPercentage = totalMaterialCost > 0 ? (netProfit / totalMaterialCost) * 100 : 0;

      const materialsBreakdown = Array.from(categoryMap.entries()).map(([category, totalCost]) => ({
        category,
        totalCost: Number(totalCost.toFixed(2)),
      }));

      return {
        period: `Período ${new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`,
        grossRevenue: grossRevenue.value,
        totalRawMaterialExpenses: Number(totalMaterialCost.toFixed(2)),
        operationalOverhead: operationalOverhead.value,
        netProfit: Number(netProfit.toFixed(2)),
        profitMargin: Number(profitMargin.toFixed(2)),
        kpis: {
          totalMaterialCost: Number(totalMaterialCost.toFixed(2)),
          totalProductionYield: Number((totalYieldSum / items.length).toFixed(2)),
          averageWastePercent: Number((totalWasteSum / items.length).toFixed(2)),
          netProfitMarginPercent: Number(profitMargin.toFixed(2)),
          roiPercentage: Number(roiPercentage.toFixed(2)),
        },
        kris,
        materialsBreakdown,
      };
    } catch (error) {
      console.error('[Composable] Error calculating financial report:', error);
      throw error;
    }
  });

  const addMaterialItem = (item: Omit<RawMaterialItem, 'id' | 'lastUpdated'>): void => {
    try {
      const newItem: RawMaterialItem = {
        ...item,
        id: `mat-${crypto.randomUUID().substring(0, 6)}`,
        lastUpdated: Date.now(),
      };
      materials.value.push(newItem);
    } catch (error) {
      console.error('[Composable] Failed to add material item:', error);
    }
  };

  const updateMaterialItem = (updated: RawMaterialItem): void => {
    try {
      const index = materials.value.findIndex((m) => m.id === updated.id);
      if (index !== -1) {
        materials.value[index] = { ...updated, lastUpdated: Date.now() };
      }
    } catch (error) {
      console.error('[Composable] Failed to update material item:', error);
    }
  };

  const deleteMaterialItem = (id: string): void => {
    try {
      materials.value = materials.value.filter((m) => m.id !== id);
    } catch (error) {
      console.error('[Composable] Failed to delete material item:', error);
    }
  };

  const addDocument = (doc: Omit<CompanyDocument, 'id' | 'uploadedAt'>): void => {
    try {
      const newDoc: CompanyDocument = {
        ...doc,
        id: `doc-${crypto.randomUUID().substring(0, 6)}`,
        uploadedAt: new Date().toLocaleDateString('es-ES'),
      };
      documents.value.unshift(newDoc);
    } catch (error) {
      console.error('[Composable] Failed to add document:', error);
    }
  };

  const deleteDocument = (id: string): void => {
    try {
      documents.value = documents.value.filter((d) => d.id !== id);
    } catch (error) {
      console.error('[Composable] Failed to delete document:', error);
    }
  };

  return {
    materials,
    grossRevenue,
    operationalOverhead,
    financialReport,
    documents,
    addMaterialItem,
    updateMaterialItem,
    deleteMaterialItem,
    addDocument,
    deleteDocument,
  };
}
