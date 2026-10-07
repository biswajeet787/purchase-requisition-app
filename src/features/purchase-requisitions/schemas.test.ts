import { describe, expect, it } from 'vitest';
import { draftSchema, submitSchema } from './schemas';

const item = (over: Record<string, unknown> = {}) => ({
  id: 'a',
  materialCode: 'MAT-001',
  materialName: 'Bearing',
  quantity: 10,
  unit: 'NOS',
  requiredDate: '2025-10-05',
  remarks: '',
  ...over,
});
const form = (items: unknown[]) => ({
  requestDate: '2025-09-25',
  department: 'Production',
  requestedBy: 'John Doe',
  priority: 'Medium',
  items,
});

describe('PR form schemas', () => {
  it('accepts a valid submission', () => {
    expect(submitSchema.safeParse(form([item()])).success).toBe(true);
  });
  it('requires at least one item to submit, but not to save a draft', () => {
    expect(submitSchema.safeParse(form([])).success).toBe(false);
    expect(draftSchema.safeParse(form([])).success).toBe(true);
  });
  it('rejects zero, negative and NaN quantities', () => {
    for (const quantity of [0, -4, NaN]) {
      expect(submitSchema.safeParse(form([item({ quantity })])).success).toBe(false);
    }
  });
  it('rejects duplicate materials', () => {
    const res = submitSchema.safeParse(form([item(), item({ id: 'b' })]));
    expect(res.success).toBe(false);
  });
  it('rejects a required date before the request date', () => {
    const res = submitSchema.safeParse(form([item({ requiredDate: '2025-09-01' })]));
    expect(res.success).toBe(false);
  });
});
