import { toISODate } from '@/lib/date';
import { uid } from '@/lib/id';
import type { PRFormValues } from './schemas';
import type { PurchaseRequisition } from './types';

export const emptyItem = (): PRFormValues['items'][number] => ({
  id: uid(),
  materialCode: '',
  materialName: '',
  // Left undefined so the number input renders empty; validation asks the user to fill it.
  quantity: undefined as unknown as number,
  unit: 'NOS',
  requiredDate: '',
  remarks: '',
});

export const createDefaults = (userName: string): PRFormValues => ({
  requestDate: toISODate(),
  department: '',
  requestedBy: userName,
  priority: 'Medium',
  items: [emptyItem()],
});

export const toFormValues = (pr: PurchaseRequisition): PRFormValues => ({
  requestDate: pr.requestDate,
  department: pr.department,
  requestedBy: pr.requestedBy,
  priority: pr.priority,
  items: pr.items.map((i) => ({ ...i })),
});
