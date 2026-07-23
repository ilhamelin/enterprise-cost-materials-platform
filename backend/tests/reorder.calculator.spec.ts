import { describe, expect, it } from 'vitest';
import { RawMaterialItem } from '../src/domain/models/financial.model.js';
import { ReorderCalculator } from '../src/domain/services/reorder.calculator.js';

describe('ReorderCalculator Unit Tests', () => {
  it('should generate purchase order suggestion for items with low stock or high risk', () => {
    const mockMaterials: RawMaterialItem[] = [
      {
        id: 'm1',
        code: 'MP-LOW',
        name: 'Cobre Crítico',
        category: 'Metales',
        supplier: 'Proveedor Cuprum',
        quantity: 20, // Muy bajo stock
        unit: 'kg',
        unitCost: 30,
        expectedYieldPercent: 90,
        wastePercent: 3,
        riskStatus: 'critical',
        lastUpdated: Date.now(),
      },
    ];

    const suggestions = ReorderCalculator.calculateReorderSuggestions(mockMaterials, 7);
    expect(suggestions.length).toBe(1);
    expect(suggestions[0].materialCode).toBe('MP-LOW');
    expect(suggestions[0].urgency).toBe('critical');
    expect(suggestions[0].suggestedQuantityToOrder).toBeGreaterThan(0);
  });
});
