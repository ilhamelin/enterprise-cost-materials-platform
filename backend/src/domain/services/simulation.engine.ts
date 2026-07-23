import { StructuredLogger } from '../../config/logger.js';
import { RawMaterialItem } from '../models/financial.model.js';
import { SimulationScenario, StressFactor } from '../models/simulation.model.js';

export class SimulationEngine {
  /**
   * Computes What-If financial stress testing scenario in linear time complexity O(N).
   * 
   * @param scenarioName Name of the simulation scenario
   * @param materials Active list of raw material items
   * @param baseRevenue Base gross revenue
   * @param baseOverhead Base operational overhead
   * @param stressFactors Array of category stress factors
   */
  public static runSimulation(
    scenarioName: string,
    materials: RawMaterialItem[],
    baseRevenue: number,
    baseOverhead: number,
    stressFactors: StressFactor[]
  ): SimulationScenario {
    try {
      const factorMap = new Map<string, StressFactor>();
      stressFactors.forEach((f) => factorMap.set(f.category, f));

      let baseMaterialCost = 0;
      let projectedMaterialCost = 0;

      for (let i = 0; i < materials.length; i++) {
        const item = materials[i];
        const itemBaseCost = item.quantity * item.unitCost;
        baseMaterialCost += itemBaseCost;

        const factor = factorMap.get(item.category) || { category: item.category, priceVariationPercent: 0, wasteIncreasePercent: 0 };

        const priceMultiplier = 1 + factor.priceVariationPercent / 100;
        const wasteMultiplier = 1 + factor.wasteIncreasePercent / 100;

        const itemProjectedCost = item.quantity * (item.unitCost * priceMultiplier) * wasteMultiplier;
        projectedMaterialCost += itemProjectedCost;
      }

      const baseProfit = baseRevenue - (baseMaterialCost + baseOverhead);
      const projectedProfit = baseRevenue - (projectedMaterialCost + baseOverhead);

      const projectedMargin = baseRevenue > 0 ? (projectedProfit / baseRevenue) * 100 : 0;
      const profitImpact = baseProfit !== 0 ? ((projectedProfit - baseProfit) / Math.abs(baseProfit)) * 100 : 0;

      StructuredLogger.info(`Simulation scenario executed: ${scenarioName}`, 'SimulationEngine', {
        baseProfit,
        projectedProfit,
        profitImpactPercent: profitImpact,
      });

      return {
        scenarioName,
        stressFactors,
        projectedRevenue: baseRevenue,
        projectedRawMaterialCost: Number(projectedMaterialCost.toFixed(2)),
        projectedOverhead: baseOverhead,
        projectedNetProfit: Number(projectedProfit.toFixed(2)),
        projectedProfitMargin: Number(projectedMargin.toFixed(2)),
        profitImpactPercent: Number(profitImpact.toFixed(2)),
      };
    } catch (error) {
      StructuredLogger.error('Failed to run financial simulation scenario', error as Error, 'SimulationEngine');
      throw error;
    }
  }
}
