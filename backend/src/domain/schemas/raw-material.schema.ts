import { z } from 'zod';
import { StructuredLogger } from '../../config/logger.js';
import { RawMaterialItem } from '../models/financial.model.js';

export const RiskLevelSchema = z.enum(['low', 'medium', 'high', 'critical']);

export const RawMaterialItemSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(2, 'Material code must be at least 2 characters').max(32),
  name: z.string().min(2, 'Name must be at least 2 characters').max(128),
  category: z.string().min(2).max(64),
  supplier: z.string().min(2).max(128),
  quantity: z.number().positive('Quantity must be greater than zero'),
  unit: z.string().min(1).max(16),
  unitCost: z.number().nonnegative('Unit cost cannot be negative'),
  expectedYieldPercent: z.number().min(0).max(100, 'Yield percent cannot exceed 100%'),
  wastePercent: z.number().min(0).max(100, 'Waste percent cannot exceed 100%'),
  riskStatus: RiskLevelSchema,
  lastUpdated: z.number().int().optional(),
});

export const RawMaterialBatchSchema = z.array(RawMaterialItemSchema).min(1).max(200);

/**
 * Validates a raw material input item using Zod schema.
 * @param input Raw item payload
 * @returns Validated RawMaterialItem
 */
export function validateRawMaterialItem(input: unknown): Omit<RawMaterialItem, 'id' | 'lastUpdated'> {
  try {
    return RawMaterialItemSchema.parse(input) as RawMaterialItem;
  } catch (error) {
    StructuredLogger.error('Raw material item validation failed', error as Error, 'validateRawMaterialItem', { input });
    throw error;
  }
}
