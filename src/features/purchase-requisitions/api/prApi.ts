/**
 * Mock REST layer. Persists to localStorage so the app behaves like a real
 * backend (latency, 404/409/503 errors, pagination) with zero setup.
 */
import { addDays, format } from 'date-fns';
import { uid } from '@/lib/id';
import { DEPARTMENTS, MATERIALS, USERS, findMaterial } from '../constants';
import type { PRFormValues } from '../schemas';
import {
  PRIORITIES,
  type PRHistoryEntry,
  type PRListParams,
  type PRListResult,
  type PRStatus,
  type PurchaseRequisition,
  type SaveAction,
} from '../types';

const STORAGE_KEY = 'pr-module:data:v1';
export const ERROR_FLAG_KEY = 'pr-module:simulate-error';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const wait = (ms = 350 + Math.random() * 350) => new Promise((r) => setTimeout(r, ms));

const isErrorSimulated = () => {
  try {
    return localStorage.getItem(ERROR_FLAG_KEY) === '1';
  } catch {
    return false;
  }
};

const guard = async () => {
  await wait();
  if (isErrorSimulated()) {
    throw new ApiError('We could not reach the server. Please try again.', 503);
  }
};

/* ------------------------------ persistence ------------------------------ */

let memory: PurchaseRequisition[] | null = null;

const readAll = (): PurchaseRequisition[] => {
  if (memory) return memory;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      memory = JSON.parse(raw) as PurchaseRequisition[];
      return memory;
    }
  } catch {
    /* fall through to seed */
  }
  memory = seed();
  writeAll(memory);
  return memory;
};

const writeAll = (data: PurchaseRequisition[]) => {
  memory = data;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable — keep in-memory copy */
  }
};

/** Dev helper: wipe saved data and re-seed on next read. */
export const resetMockData = () => {
  memory = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
};

/* --------------------------------- seeding -------------------------------- */

const pad = (n: number) => `PR-${String(n).padStart(4, '0')}`;
const iso = (d: Date) => format(d, 'yyyy-MM-dd');

function seed(): PurchaseRequisition[] {
  const statuses: PRStatus[] = ['Approved', 'Pending Approval', 'Rejected', 'Draft', 'Approved', 'Pending Approval'];
  const remarks = ['For production', 'Urgent replacement', 'Monthly stock', 'Maintenance shutdown', ''];

  return Array.from({ length: 26 }, (_, i) => {
    const n = i + 1;
    const first = n === 1;
    const date = first ? new Date(2025, 8, 25) : addDays(new Date(2025, 7, 20), n * 4);
    const user = first ? USERS[0] : USERS[n % USERS.length];
    const status: PRStatus = first ? 'Draft' : statuses[n % statuses.length];
    const itemCount = first ? 5 : (n % 5) + 1;

    const items = Array.from({ length: itemCount }, (_, k) => {
      const m = MATERIALS[(n + k) % MATERIALS.length];
      const mat = first && k === 0 ? MATERIALS[0] : m;
      return {
        id: uid(),
        materialCode: mat.code,
        materialName: mat.name,
        quantity: first && k === 0 ? 10 : (k + 1) * 5 + (n % 7),
        unit: mat.unit,
        requiredDate: first && k === 0 ? '2025-09-30' : iso(addDays(date, 7 + k)),
        remarks: first && k === 0 ? 'For production' : remarks[k % remarks.length],
      };
    });

    const stamp = (d: number) => addDays(date, d).toISOString();
    const history: PRHistoryEntry[] = [{ status: 'Draft', at: stamp(0), by: user.name, note: 'Requisition created' }];
    if (status !== 'Draft') history.push({ status: 'Pending Approval', at: stamp(1), by: user.name, note: 'Submitted for approval' });
    if (status === 'Approved') history.push({ status: 'Approved', at: stamp(2), by: 'Priya Sharma' });
    if (status === 'Rejected') history.push({ status: 'Rejected', at: stamp(2), by: 'Priya Sharma', note: 'Budget not available this quarter' });

    return {
      id: `pr-${n}`,
      prNumber: pad(n),
      requestDate: iso(date),
      department: first ? 'Production' : DEPARTMENTS[n % DEPARTMENTS.length],
      requestedBy: user.name,
      priority: PRIORITIES[n % PRIORITIES.length],
      status,
      items,
      history,
      createdAt: stamp(0),
      updatedAt: history[history.length - 1].at,
    };
  });
}

/* ------------------------------- public API ------------------------------- */

const nextNumber = (all: PurchaseRequisition[]) =>
  pad(all.reduce((max, pr) => Math.max(max, Number(pr.prNumber.replace(/\D/g, ''))), 0) + 1);

export async function getNextPRNumber(): Promise<string> {
  await guard();
  return nextNumber(readAll());
}

export async function listPRs(params: PRListParams): Promise<PRListResult> {
  await guard();
  const q = params.search.trim().toLowerCase();

  const filtered = readAll()
    .filter((pr) => (q ? pr.prNumber.toLowerCase().includes(q) : true))
    .filter((pr) => (params.status === 'All' ? true : pr.status === params.status))
    .filter((pr) => (params.dateFrom ? pr.requestDate >= params.dateFrom : true))
    .filter((pr) => (params.dateTo ? pr.requestDate <= params.dateTo : true))
    .sort((a, b) => b.prNumber.localeCompare(a.prNumber));

  const totalPages = Math.max(1, Math.ceil(filtered.length / params.pageSize));
  const page = Math.min(Math.max(1, params.page), totalPages);
  const start = (page - 1) * params.pageSize;

  return {
    data: filtered.slice(start, start + params.pageSize),
    total: filtered.length,
    page,
    pageSize: params.pageSize,
    totalPages,
  };
}

export async function getPR(id: string): Promise<PurchaseRequisition> {
  await guard();
  const found = readAll().find((pr) => pr.id === id);
  if (!found) throw new ApiError('This purchase requisition does not exist or was removed.', 404);
  return found;
}

interface SaveInput {
  id?: string;
  values: PRFormValues;
  action: SaveAction;
  by: string;
}

export async function savePR({ id, values, action, by }: SaveInput): Promise<PurchaseRequisition> {
  await guard();
  const all = readAll();
  const now = new Date().toISOString();
  const status: PRStatus = action === 'submit' ? 'Pending Approval' : 'Draft';

  const items = values.items.map((it) => ({
    ...it,
    id: it.id || uid(),
    materialName: findMaterial(it.materialCode)?.name ?? it.materialName,
    remarks: it.remarks.trim(),
  }));

  const fields = {
    requestDate: values.requestDate,
    department: values.department,
    requestedBy: values.requestedBy,
    priority: values.priority,
    items,
  };

  if (id) {
    const existing = all.find((pr) => pr.id === id);
    if (!existing) throw new ApiError('This purchase requisition does not exist.', 404);
    if (existing.status !== 'Draft') throw new ApiError('Only draft requisitions can be edited.', 409);

    const history = [...existing.history];
    if (action === 'submit') history.push({ status, at: now, by, note: 'Submitted for approval' });
    const updated: PurchaseRequisition = { ...existing, ...fields, status, history, updatedAt: now };
    writeAll(all.map((pr) => (pr.id === id ? updated : pr)));
    return updated;
  }

  const history: PRHistoryEntry[] = [{ status: 'Draft', at: now, by, note: 'Requisition created' }];
  if (action === 'submit') history.push({ status, at: now, by, note: 'Submitted for approval' });

  const created: PurchaseRequisition = {
    id: uid(),
    prNumber: nextNumber(all),
    ...fields,
    status,
    history,
    createdAt: now,
    updatedAt: now,
  };
  writeAll([...all, created]);
  return created;
}

const ALLOWED: Record<PRStatus, PRStatus[]> = {
  Draft: ['Pending Approval'],
  'Pending Approval': ['Approved', 'Rejected'],
  Approved: [],
  Rejected: [],
};

interface TransitionInput {
  id: string;
  to: PRStatus;
  by: string;
  note?: string;
}

export async function transitionPR({ id, to, by, note }: TransitionInput): Promise<PurchaseRequisition> {
  await guard();
  const all = readAll();
  const existing = all.find((pr) => pr.id === id);
  if (!existing) throw new ApiError('This purchase requisition does not exist.', 404);
  if (!ALLOWED[existing.status].includes(to)) {
    throw new ApiError(`Cannot move a "${existing.status}" requisition to "${to}".`, 409);
  }
  const at = new Date().toISOString();
  const updated: PurchaseRequisition = {
    ...existing,
    status: to,
    updatedAt: at,
    history: [...existing.history, { status: to, at, by, ...(note ? { note } : {}) }],
  };
  writeAll(all.map((pr) => (pr.id === id ? updated : pr)));
  return updated;
}

