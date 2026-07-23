import { describe, expect, it } from 'vitest';
import { RawMaterialItem } from '../src/domain/models/financial.model.js';
import { SimulationEngine } from '../src/domain/services/simulation.engine.js';

describe('SimulationEngine Unit Tests', () => {
  const mockMaterials: RawMaterialItem[] = [
    {
      id: 'm1',
      code: 'MP-01',
      name: 'Acero',
      category: 'Metales',
      supplier: 'Proveedor A',
      quantity: 100,
      unitCost: 10, // Costo base = 1000
      expectedYieldPercent: 95,
      wastePercent: 2,
      riskStatus: 'low',
      unit: 'kg',
      lastUpdated: Date.now(),
    },
  ];

  it('should correctly simulate profit impact when applying +20% price stress factor', () => {
    const baseRevenue = 5000;
    const baseOverhead = 1000;

    // Base Profit = 5000 - (1000 + 1000) = 3000
    const scenario = SimulationEngine.runSimulation(
      'Estrés de Precios Metales',
      mockMaterials,
      baseRevenue,
      baseOverhead,
      [{ category: 'Metales', priceVariationPercent: 20, wasteIncreasePercent: 0 }]
    );

    // Projected Material Cost = 100 * (10 * 1.2) = 1200
    // Projected Profit = 5000 - (1200 + 1000) = 2800
    expect(scenario.projectedRawMaterialCost).toBe(1200);
    expect(scenario.projectedNetProfit).toBe(2800);
    expect(scenario.profitImpactPercent).toBeCloseTo(-6.67, 1);
  });
});
