export const PR_STATUSES = ['Draft', 'Pending Approval', 'Approved', 'Rejected'] as const;
export type PRStatus = (typeof PR_STATUSES)[number];

export const PRIORITIES = ['Low', 'Medium', 'High'] as const;
export type Priority = (typeof PRIORITIES)[number];

export const UNITS = ['NOS', 'KG', 'MTR', 'LTR', 'BOX', 'SET'] as const;
export type Unit = (typeof UNITS)[number];

export interface PRItem {
  id: string;
  materialCode: string;
  materialName: string;
  quantity: number;
  unit: Unit;
  requiredDate: string; // yyyy-MM-dd
  remarks: string;
}

export interface PRHistoryEntry {
  status: PRStatus;
  at: string; // ISO timestamp
  by: string;
  note?: string;
}

export interface PurchaseRequisition {
  id: string;
  prNumber: string;
  requestDate: string; // yyyy-MM-dd
  department: string;
  requestedBy: string;
  priority: Priority;
  status: PRStatus;
  items: PRItem[];
  history: PRHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface PRListParams {
  search: string;
  status: PRStatus | 'All';
  dateFrom: string;
  dateTo: string;
  page: number;
  pageSize: number;
}

export interface PRListResult {
  data: PurchaseRequisition[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type SaveAction = 'draft' | 'submit';
