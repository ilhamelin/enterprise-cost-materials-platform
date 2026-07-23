export interface StressFactor {
  category: string;
  priceVariationPercent: number; // Ej: +15%
  wasteIncreasePercent: number; // Ej: +2%
}

export interface SimulationScenario {
  scenarioName: string;
  stressFactors: StressFactor[];
  projectedRevenue: number;
  projectedRawMaterialCost: number;
  projectedOverhead: number;
  projectedNetProfit: number;
  projectedProfitMargin: number;
  profitImpactPercent: number; // Diferencia porcentual con el escenario base
}
