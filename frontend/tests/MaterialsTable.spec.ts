import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import MaterialsTable from '../src/components/MaterialsTable.vue';
import { RawMaterialItem } from '../src/types/platform';

describe('MaterialsTable.vue Unit Tests', () => {
  const mockMaterials: RawMaterialItem[] = [
    {
      id: 'm1',
      code: 'MP-001',
      name: 'Acero Inoxidable',
      category: 'Metales & Aleaciones',
      supplier: 'Proveedor Alfa',
      quantity: 500,
      unit: 'kg',
      unitCost: 10,
      expectedYieldPercent: 95,
      wastePercent: 2,
      riskStatus: 'low',
      lastUpdated: Date.now(),
    },
    {
      id: 'm2',
      code: 'MP-002',
      name: 'Resina Plástica',
      category: 'Plásticos & Resinas',
      supplier: 'Proveedor Beta',
      quantity: 200,
      unit: 'kg',
      unitCost: 5,
      expectedYieldPercent: 90,
      wastePercent: 6,
      riskStatus: 'high',
      lastUpdated: Date.now(),
    },
  ];

  it('renders raw materials list, code, supplier and calculates total costs correctly', () => {
    const wrapper = mount(MaterialsTable, {
      props: {
        materials: mockMaterials,
      },
    });

    expect(wrapper.text()).toContain('Acero Inoxidable');
    expect(wrapper.text()).toContain('MP-001');
    expect(wrapper.text()).toContain('Proveedor Alfa');
    // Total calculation: (500*10) + (200*5) = 5000 + 1000 = 6000
    expect(wrapper.text()).toContain('6000,00');
  });

  it('filters raw materials based on search query input', async () => {
    const wrapper = mount(MaterialsTable, {
      props: {
        materials: mockMaterials,
      },
    });

    const searchInput = wrapper.find('.search-input');
    await searchInput.setValue('Resina');

    expect(wrapper.text()).toContain('Resina Plástica');
    expect(wrapper.text()).not.toContain('Acero Inoxidable');
  });

  it('emits delete event when delete button is clicked', async () => {
    const wrapper = mount(MaterialsTable, {
      props: {
        materials: mockMaterials,
      },
    });

    const deleteBtn = wrapper.find('.btn-danger');
    await deleteBtn.trigger('click');

    expect(wrapper.emitted('delete')).toBeTruthy();
    expect(wrapper.emitted('delete')?.[0]).toEqual(['m1']);
  });
});
