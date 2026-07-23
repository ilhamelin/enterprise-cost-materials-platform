import { StructuredLogger } from '../../config/logger.js';
import { RawMaterialItem } from '../models/financial.model.js';

export class ExporterService {
  /**
   * Formats raw materials inventory into a standard CSV string payload.
   * @param materials List of raw materials
   * @returns Formatted CSV content string
   */
  public static exportMaterialsToCsv(materials: RawMaterialItem[]): string {
    try {
      const headers = ['Codigo', 'Nombre Insumo', 'Categoria', 'Proveedor', 'Cantidad', 'Unidad', 'Costo Unitario ($)', 'Costo Total ($)', 'Rendimiento (%)', 'Merma (%)', 'Riesgo'];
      
      const rows = materials.map((m) => [
        `"${m.code}"`,
        `"${m.name}"`,
        `"${m.category}"`,
        `"${m.supplier}"`,
        m.quantity,
        `"${m.unit}"`,
        m.unitCost.toFixed(2),
        (m.quantity * m.unitCost).toFixed(2),
        m.expectedYieldPercent,
        m.wastePercent,
        `"${m.riskStatus.toUpperCase()}"`,
      ]);

      const csvString = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      StructuredLogger.info(`Generated CSV export payload with ${materials.length} rows`, 'ExporterService');
      return csvString;
    } catch (error) {
      StructuredLogger.error('Failed to generate CSV export payload', error as Error, 'ExporterService');
      throw error;
    }
  }
}
