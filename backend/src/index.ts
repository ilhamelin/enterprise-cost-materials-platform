import { StructuredLogger } from './config/logger.js';
import { MaterialsController } from './presentation/controllers/materials.controller.js';

export function bootstrapEnterpriseService() {
  try {
    StructuredLogger.info('Bootstrapping Enterprise Cost & Materials Microservice...', 'Bootstrap');
    const materialsController = new MaterialsController();

    const initialReport = materialsController.handleGetFinancialReport(300000, 50000);
    StructuredLogger.info('Initial financial cost/performance analysis ready', 'Bootstrap', {
      totalMaterialExpenses: initialReport.data?.totalRawMaterialExpenses,
      netProfit: initialReport.data?.netProfit,
      kriAlertsCount: initialReport.data?.kris.length,
    });

    return { materialsController };
  } catch (error) {
    StructuredLogger.error('Fatal error during enterprise service bootstrap', error as Error, 'Bootstrap');
    throw error;
  }
}

if (process.env.NODE_ENV !== 'test') {
  bootstrapEnterpriseService();
}
