import { z } from 'zod';
import { PRIORITIES, UNITS } from './types';

const itemSchema = z.object({
  id: z.string(),
  materialCode: z.string().min(1, 'Select a material'),
  materialName: z.string(),
  quantity: z
    .number({ error: 'Enter a quantity' })
    .positive('Must be greater than 0')
    .max(1_000_000, 'Quantity is too large')
    .refine((n) => Math.round(n * 1000) / 1000 === n, 'Max 3 decimal places'),
  unit: z.enum(UNITS, { error: 'Select a unit' }),
  requiredDate: z.string().min(1, 'Select required date'),
  remarks: z.string().max(200, 'Max 200 characters'),
});

const baseSchema = z.object({
  requestDate: z.string().min(1, 'Request date is required'),
  department: z.string().min(1, 'Select a department'),
  requestedBy: z.string().min(1, 'Requested by is required'),
  priority: z.enum(PRIORITIES, { error: 'Select a priority' }),
  items: z.array(itemSchema),
});

type FormShape = z.infer<typeof baseSchema>;

/** Cross-field rules: required date >= request date, and no duplicate materials. */
const crossFieldRules = (values: FormShape, ctx: z.RefinementCtx) => {
  const seen = new Set<string>();
  values.items.forEach((item, index) => {
    if (item.requiredDate && values.requestDate && item.requiredDate < values.requestDate) {
      ctx.addIssue({
        code: 'custom',
        path: ['items', index, 'requiredDate'],
        message: 'Cannot be before request date',
      });
    }
    if (item.materialCode) {
      if (seen.has(item.materialCode)) {
        ctx.addIssue({
          code: 'custom',
          path: ['items', index, 'materialCode'],
          message: 'Duplicate material — increase the quantity on the existing row',
        });
      }
      seen.add(item.materialCode);
    }
  });
};

/** Save as Draft: header must be valid, rows (if any) must be valid. */
export const draftSchema = baseSchema.superRefine(crossFieldRules);

/** Submit for Approval: everything in draft + at least one material item. */
export const submitSchema = baseSchema
  .extend({ items: z.array(itemSchema).min(1, 'Add at least one material item') })
  .superRefine(crossFieldRules);

export type PRFormValues = z.input<typeof submitSchema>;
