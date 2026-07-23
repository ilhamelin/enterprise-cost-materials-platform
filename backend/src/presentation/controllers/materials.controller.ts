import crypto from 'crypto';
import { StructuredLogger } from '../../config/logger.js';
import { RawMaterialItem } from '../../domain/models/financial.model.js';
import { validateRawMaterialItem } from '../../domain/schemas/raw-material.schema.js';
import { KpiKriCalculator } from '../../domain/services/kpi-kri.calculator.js';

export class MaterialsController {
  private materials: Map<string, RawMaterialItem> = new Map();

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData(): void {
    const seedList: RawMaterialItem[] = [
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
        wastePercent: 6.8, // Exceso de merma (> 5.0%) -> Desencadena KRI
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
        wastePercent: 7.5, // Exceso de merma -> Desencadena KRI
        riskStatus: 'critical', // Riesgo Crítico -> Desencadena KRI
        lastUpdated: Date.now(),
      },
    ];

    seedList.forEach((m) => this.materials.set(m.id, m));
  }

  /**
   * Retrieves all registered raw material inventory items.
   */
  public getAllMaterials(): { success: boolean; data: RawMaterialItem[] } {
    try {
      const list = Array.from(this.materials.values());
      StructuredLogger.info(`Retrieved ${list.length} raw material items`, 'MaterialsController.getAllMaterials');
      return { success: true, data: list };
    } catch (error) {
      StructuredLogger.error('Failed to retrieve raw materials', error as Error, 'MaterialsController.getAllMaterials');
      return { success: false, data: [] };
    }
  }

  /**
   * Adds or updates a raw material item with strict Zod validation.
   */
  public handleSaveMaterial(payload: unknown): { success: boolean; data?: RawMaterialItem; error?: string } {
    try {
      const validated = validateRawMaterialItem(payload);
      const rawPayload = payload as Record<string, unknown>;
      const existingId = typeof rawPayload.id === 'string' ? rawPayload.id : undefined;

      const itemToSave: RawMaterialItem = {
        id: existingId || `mat-${crypto.randomUUID().substring(0, 6)}`,
        ...validated,
        lastUpdated: Date.now(),
      };

      this.materials.set(itemToSave.id, itemToSave);
      StructuredLogger.info(`Raw material item saved: ${itemToSave.name}`, 'MaterialsController.handleSaveMaterial', { id: itemToSave.id });

      return { success: true, data: itemToSave };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown validation error';
      StructuredLogger.error('Failed to save raw material item', error as Error, 'MaterialsController.handleSaveMaterial');
      return { success: false, error: message };
    }
  }

  /**
   * Deletes a raw material item by ID.
   */
  public handleDeleteMaterial(id: string): { success: boolean; error?: string } {
    try {
      if (!this.materials.has(id)) {
        throw new Error(`Material with ID ${id} not found`);
      }
      this.materials.delete(id);
      StructuredLogger.info(`Raw material deleted: ${id}`, 'MaterialsController.handleDeleteMaterial');
      return { success: true };
    } catch (error) {
      StructuredLogger.error(`Failed to delete material ${id}`, error as Error, 'MaterialsController.handleDeleteMaterial');
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Generates the financial cost/performance report including KPIs & KRIs.
   */
  public handleGetFinancialReport(grossRevenue?: number, overhead?: number) {
    try {
      const materialsList = Array.from(this.materials.values());
      const report = KpiKriCalculator.computeFinancialReport(materialsList, grossRevenue, overhead);
      return { success: true, data: report };
    } catch (error) {
      StructuredLogger.error('Failed to generate financial report controller endpoint', error as Error, 'MaterialsController.handleGetFinancialReport');
      return { success: false, error: (error as Error).message };
    }
  }
}
