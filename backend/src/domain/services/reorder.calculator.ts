import { StructuredLogger } from '../../config/logger.js';
import { RawMaterialItem } from '../models/financial.model.js';

export interface PurchaseOrderSuggestion {
  materialId: string;
  materialCode: string;
  materialName: string;
  supplier: string;
  currentQuantity: number;
  reorderPoint: number; // Umbral mínimo de reorden
  suggestedQuantityToOrder: number;
  estimatedCost: number;
  urgency: 'normal' | 'urgent' | 'critical';
}

export class ReorderCalculator {
  /**
   * Computes Reorder Points (ROP) and generates Purchase Order Suggestions for items below safety stock.
   * Formula: ROP = (Daily Usage * Lead Time Days) + Safety Stock
   * 
   * @param materials List of raw material items
   * @param leadTimeDays Average supplier lead time in days (Default: 7 days)
   * @returns Array of suggested purchase orders
   */
  public static calculateReorderSuggestions(
    materials: RawMaterialItem[],
    leadTimeDays: number = 7
  ): PurchaseOrderSuggestion[] {
    try {
      const suggestions: PurchaseOrderSuggestion[] = [];

      for (let i = 0; i < materials.length; i++) {
        const item = materials[i];
        // Estimated daily usage = 5% of current quantity per day
        const estimatedDailyUsage = Math.max(10, item.quantity * 0.05);
        const safetyStock = estimatedDailyUsage * 3; // 3 days safety stock
        const reorderPoint = Math.ceil(estimatedDailyUsage * leadTimeDays + safetyStock);

        if (item.quantity <= reorderPoint || item.riskStatus === 'high' || item.riskStatus === 'critical') {
          const suggestedQuantity = Math.max(500, reorderPoint * 2 - item.quantity);
          const estimatedCost = Number((suggestedQuantity * item.unitCost).toFixed(2));

          const urgency = 
            item.quantity <= reorderPoint * 0.5 
              ? 'critical' 
              : item.quantity <= reorderPoint 
                ? 'urgent' 
                : 'normal';

          suggestions.push({
            materialId: item.id,
            materialCode: item.code,
            materialName: item.name,
            supplier: item.supplier,
            currentQuantity: item.quantity,
            reorderPoint,
            suggestedQuantityToOrder: suggestedQuantity,
            estimatedCost,
            urgency,
          });
        }
      }

      StructuredLogger.info(`Generated ${suggestions.length} purchase order suggestions`, 'ReorderCalculator');
      return suggestions;
    } catch (error) {
      StructuredLogger.error('Failed to calculate reorder suggestions', error as Error, 'ReorderCalculator');
      throw error;
    }
  }
}
