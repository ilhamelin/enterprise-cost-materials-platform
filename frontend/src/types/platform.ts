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
  expectedYieldPercent: number;
  wastePercent: number;
  riskStatus: RiskLevel;
  lastUpdated: number;
}

export interface KpiSummary {
  totalMaterialCost: number;
  totalProductionYield: number;
  averageWastePercent: number;
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

export interface CompanyDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  relatedMaterialCode?: string;
  category: 'Factura' | 'Guía de Despacho' | 'Ficha Técnica' | 'Certificado de Calidad';
}
