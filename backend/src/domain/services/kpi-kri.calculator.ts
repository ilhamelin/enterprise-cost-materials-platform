import { StructuredLogger } from '../../config/logger.js';
import { CompanyFinancialReport, KpiSummary, KriAlert, RawMaterialItem } from '../models/financial.model.js';

export class KpiKriCalculator {
  /**
   * Computes company Key Performance Indicators (KPIs) and Key Risk Indicators (KRIs)
   * from the active list of raw material items in single-pass linear time complexity O(N).
   * 
   * Algorithmic Complexity:
   * - Time Complexity: O(N) where N is the number of raw material inventory items.
   * - Space Complexity: O(M) for storing generated KRI alerts and category aggregates.
   * 
   * @param materials List of company raw material inventory items
   * @param grossRevenue Company gross revenue for the evaluation period
   * @param operationalOverhead Fixed operational overhead costs
   * @returns Complete CompanyFinancialReport object
   */
  public static computeFinancialReport(
    materials: RawMaterialItem[],
    grossRevenue: number = 250000,
    operationalOverhead: number = 45000
  ): CompanyFinancialReport {
    try {
      if (!materials || materials.length === 0) {
        return this.generateEmptyReport(grossRevenue, operationalOverhead);
      }

      let totalMaterialCost = 0;
      let totalYieldSum = 0;
      let totalWasteSum = 0;
      const kris: KriAlert[] = [];
      const categoryMap = new Map<string, number>();

      const itemCount = materials.length;

      // Single-pass processing O(N)
      for (let i = 0; i < itemCount; i++) {
        const item = materials[i];
        const itemTotalCost = item.quantity * item.unitCost;
        totalMaterialCost += itemTotalCost;
        totalYieldSum += item.expectedYieldPercent;
        totalWasteSum += item.wastePercent;

        // Group expenses by category O(1) Map lookup
        const currentCatCost = categoryMap.get(item.category) || 0;
        categoryMap.set(item.category, currentCatCost + itemTotalCost);

        // KRI Detection: Merma / Waste exceedance (> 5.0% threshold)
        if (item.wastePercent > 5.0) {
          kris.push({
            id: `kri-waste-${item.id}`,
            type: 'waste_limit_exceeded',
            severity: item.wastePercent > 8.0 ? 'critical' : 'high',
            title: `Exceso de Merma en Insumo: ${item.name}`,
            description: `El porcentaje de desperdicio (${item.wastePercent}%) supera el límite tolerado del 5.0%. Impacto económico estimado: $${(itemTotalCost * (item.wastePercent / 100)).toFixed(2)}.`,
            affectedMaterialName: item.name,
            timestamp: Date.now(),
          });
        }

        // KRI Detection: Critical Risk Status Flag
        if (item.riskStatus === 'critical' || item.riskStatus === 'high') {
          kris.push({
            id: `kri-risk-${item.id}`,
            type: 'supplier_risk',
            severity: item.riskStatus,
            title: `Riesgo de Proveedor/Cadena: ${item.supplier}`,
            description: `El insumo ${item.name} presenta riesgo nivel ${item.riskStatus.toUpperCase()} registrado para el proveedor ${item.supplier}.`,
            affectedMaterialName: item.name,
            timestamp: Date.now(),
          });
        }
      }

      const totalExpenses = totalMaterialCost + operationalOverhead;
      const netProfit = grossRevenue - totalExpenses;
      const profitMargin = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;
      const roiPercentage = totalMaterialCost > 0 ? (netProfit / totalMaterialCost) * 100 : 0;

      const kpis: KpiSummary = {
        totalMaterialCost: Number(totalMaterialCost.toFixed(2)),
        totalProductionYield: Number((totalYieldSum / itemCount).toFixed(2)),
        averageWastePercent: Number((totalWasteSum / itemCount).toFixed(2)),
        netProfitMarginPercent: Number(profitMargin.toFixed(2)),
        roiPercentage: Number(roiPercentage.toFixed(2)),
      };

      const materialsBreakdown = Array.from(categoryMap.entries()).map(([category, totalCost]) => ({
        category,
        totalCost: Number(totalCost.toFixed(2)),
      }));

      StructuredLogger.info('Company financial report and KPI/KRI generated successfully', 'KpiKriCalculator.computeFinancialReport', {
        itemCount,
        totalMaterialCost,
        netProfit,
        kriCount: kris.length,
      });

      return {
        period: `Período ${new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`,
        grossRevenue,
        totalRawMaterialExpenses: Number(totalMaterialCost.toFixed(2)),
        operationalOverhead,
        netProfit: Number(netProfit.toFixed(2)),
        profitMargin: Number(profitMargin.toFixed(1)),
        kpis,
        kris,
        materialsBreakdown,
      };
    } catch (error) {
      StructuredLogger.error('Failed to compute financial report and KPIs/KRIs', error as Error, 'KpiKriCalculator.computeFinancialReport');
      throw error;
    }
  }

  private static generateEmptyReport(grossRevenue: number, operationalOverhead: number): CompanyFinancialReport {
    const netProfit = grossRevenue - operationalOverhead;
    return {
      period: 'Sin Datos de Materia Prima',
      grossRevenue,
      totalRawMaterialExpenses: 0,
      operationalOverhead,
      netProfit,
      profitMargin: grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0,
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
}
