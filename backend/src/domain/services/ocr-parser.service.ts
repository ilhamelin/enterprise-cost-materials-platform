import { StructuredLogger } from '../../config/logger.js';

export interface ParsedInvoiceData {
  invoiceNumber: string;
  supplierName: string;
  detectedMaterialCode: string;
  detectedMaterialName: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalAmount: number;
  confidenceScore: number; // Ej: 0.98 (98%)
}

export class SmartOcrParserService {
  /**
   * Simulates intelligent OCR parsing of uploaded PDF/Image invoices.
   */
  public static parseInvoiceDocument(fileName: string): ParsedInvoiceData {
    try {
      StructuredLogger.info(`Running Smart OCR Scanner on document: ${fileName}`, 'SmartOcrParserService');

      const isMetal = fileName.toLowerCase().includes('acero') || fileName.toLowerCase().includes('metal');
      const isPlastic = fileName.toLowerCase().includes('poli') || fileName.toLowerCase().includes('plast');

      if (isMetal) {
        return {
          invoiceNumber: 'FAC-2026-8841',
          supplierName: 'Metalúrgica del Norte S.A.',
          detectedMaterialCode: 'MP-ACERO-316',
          detectedMaterialName: 'Acero Inoxidable Grado 316',
          quantity: 1500,
          unit: 'kg',
          unitCost: 18.2,
          totalAmount: 27300,
          confidenceScore: 0.97,
        };
      }

      if (isPlastic) {
        return {
          invoiceNumber: 'FAC-2026-9923',
          supplierName: 'Plastiquim Corp.',
          detectedMaterialCode: 'MP-POLI-HDPE',
          detectedMaterialName: 'Polímero HDPE de Alta Densidad',
          quantity: 2000,
          unit: 'kg',
          unitCost: 4.15,
          totalAmount: 8300,
          confidenceScore: 0.95,
        };
      }

      return {
        invoiceNumber: `FAC-GEN-${Math.floor(1000 + Math.random() * 9000)}`,
        supplierName: 'Proveedor Extracto OCR S.A.',
        detectedMaterialCode: 'MP-GENERICO',
        detectedMaterialName: 'Insumo Detectado Vía OCR',
        quantity: 500,
        unit: 'unidades',
        unitCost: 25.0,
        totalAmount: 12500,
        confidenceScore: 0.92,
      };
    } catch (error) {
      StructuredLogger.error('Failed to run smart OCR invoice parsing', error as Error, 'SmartOcrParserService');
      throw error;
    }
  }
}
