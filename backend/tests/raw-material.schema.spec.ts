import { describe, expect, it } from 'vitest';
import { validateRawMaterialItem } from '../src/domain/schemas/raw-material.schema.js';

describe('RawMaterial Schema Zod Validation Unit Tests', () => {
  it('should pass valid raw material input payload', () => {
    const validPayload = {
      code: 'MP-ACERO-101',
      name: 'Acero Inoxidable 316',
      category: 'Metales',
      supplier: 'Aceros Industriales',
      quantity: 500,
      unit: 'kg',
      unitCost: 15.5,
      expectedYieldPercent: 95.0,
      wastePercent: 2.0,
      riskStatus: 'low',
    };

    const validated = validateRawMaterialItem(validPayload);
    expect(validated.code).toBe('MP-ACERO-101');
    expect(validated.quantity).toBe(500);
    expect(validated.riskStatus).toBe('low');
  });

  it('should throw validation error on negative unit cost or quantity', () => {
    const invalidPayload = {
      code: 'MP-FAIL',
      name: 'Item Inválido',
      category: 'Prueba',
      supplier: 'Proveedor',
      quantity: -50,
      unit: 'kg',
      unitCost: 10,
      expectedYieldPercent: 90,
      wastePercent: 1,
      riskStatus: 'low',
    };

    expect(() => validateRawMaterialItem(invalidPayload)).toThrow();
  });

  it('should throw validation error on yield percentage greater than 100%', () => {
    const invalidYield = {
      code: 'MP-YIELD-OVER',
      name: 'Item Inválido',
      category: 'Prueba',
      supplier: 'Proveedor',
      quantity: 100,
      unit: 'kg',
      unitCost: 10,
      expectedYieldPercent: 150, // Imposible > 100%
      wastePercent: 1,
      riskStatus: 'low',
    };

    expect(() => validateRawMaterialItem(invalidYield)).toThrow();
  });
});
