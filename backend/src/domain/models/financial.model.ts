export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface RawMaterialItem {
  id: string;
  code: string;
  name: string;
  category: string;
  supplier: string;
  quantity: number;
  unit: string;
  unitCost: number;
  expectedYieldPercent: number; // Ej: 92%
  wastePercent: number; // Merma Ej: 4.5%
  riskStatus: RiskLevel;
  lastUpdated: number;
}

export interface KpiSummary {
  totalMaterialCost: number;
  totalProductionYield: number; // Porcentaje promedio de rendimiento
  averageWastePercent: number; // Promedio de merma
  netProfitMarginPercent: number;
  roiPercentage: number;
}

export interface KriAlert {
  id: string;
  type: 'waste_limit_exceeded' | 'price_volatility' | 'supplier_risk';
  severity: RiskLevel;
  title: string;
  description: string;
  affectedMaterialName: string;
  timestamp: number;
}

export interface CompanyFinancialReport {
  period: string;
  grossRevenue: number;
  totalRawMaterialExpenses: number;
  operationalOverhead: number;
  netProfit: number;
  profitMargin: number;
  kpis: KpiSummary;
  kris: KriAlert[];
  materialsBreakdown: { category: string; totalCost: number }[];
}
