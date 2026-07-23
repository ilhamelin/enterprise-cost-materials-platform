import { describe, expect, it } from 'vitest';
import { RawMaterialItem } from '../src/domain/models/financial.model.js';
import { KpiKriCalculator } from '../src/domain/services/kpi-kri.calculator.js';

describe('KpiKriCalculator Unit Tests', () => {
  const mockMaterials: RawMaterialItem[] = [
    {
      id: 'm1',
      code: 'MP-01',
      name: 'Acero Inoxidable',
      category: 'Metales',
      supplier: 'Proveedor A',
      quantity: 100,
      unitCost: 50, // Costo total = 5000
      expectedYieldPercent: 90,
      wastePercent: 3,
      riskStatus: 'low',
      unit: 'kg',
      lastUpdated: Date.now(),
    },
    {
      id: 'm2',
      code: 'MP-02',
      name: 'Resina Plástica',
      category: 'Plásticos',
      supplier: 'Proveedor B',
      quantity: 200,
      unitCost: 10, // Costo total = 2000
      expectedYieldPercent: 80,
      wastePercent: 7.5, // Exceso de merma > 5% -> Debe activar KRI
      riskStatus: 'high', // Riesgo Alto -> Debe activar KRI
      unit: 'kg',
      lastUpdated: Date.now(),
    },
  ];

  it('should correctly calculate total material expenses, net profit, and profit margin', () => {
    const grossRevenue = 20000;
    const operationalOverhead = 3000;

    const report = KpiKriCalculator.computeFinancialReport(mockMaterials, grossRevenue, operationalOverhead);

    expect(report.totalRawMaterialExpenses).toBe(7000); // 5000 + 2000
    expect(report.netProfit).toBe(10000); // 20000 - (7000 + 3000)
    expect(report.profitMargin).toBe(50); // (10000 / 20000) * 100
    expect(report.kpis.totalProductionYield).toBe(85); // (90 + 80) / 2
    expect(report.kpis.averageWastePercent).toBe(5.25); // (3 + 7.5) / 2
  });

  it('should trigger KRI alerts for items exceeding 5% waste limit or marked high/critical risk', () => {
    const report = KpiKriCalculator.computeFinancialReport(mockMaterials, 20000, 3000);

    expect(report.kris.length).toBe(2);
    expect(report.kris[0].type).toBe('waste_limit_exceeded');
    expect(report.kris[0].affectedMaterialName).toBe('Resina Plástica');
    expect(report.kris[1].type).toBe('supplier_risk');
  });

  it('should handle empty materials list gracefully without dividing by zero', () => {
    const report = KpiKriCalculator.computeFinancialReport([], 10000, 2000);

    expect(report.totalRawMaterialExpenses).toBe(0);
    expect(report.netProfit).toBe(8000);
    expect(report.kpis.totalProductionYield).toBe(0);
    expect(report.kris).toEqual([]);
  });
});
