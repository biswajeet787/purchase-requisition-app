import type { Unit } from './types';

export const PAGE_SIZE = 8;

export const DEPARTMENTS = [
  'Production',
  'Purchase',
  'Stores',
  'Maintenance',
  'Quality Control',
  'Finance',
  'HR',
] as const;

export const USERS = [
  { id: 'u1', name: 'John Doe' },
  { id: 'u2', name: 'Priya Sharma' },
  { id: 'u3', name: 'Rahul Verma' },
  { id: 'u4', name: 'Anita Desai' },
  { id: 'u5', name: 'Michael Chen' },
] as const;

export interface MaterialMaster {
  code: string;
  name: string;
  unit: Unit;
}

export const MATERIALS: readonly MaterialMaster[] = [
  { code: 'MAT-001', name: 'Bearing', unit: 'NOS' },
  { code: 'MAT-002', name: 'Hydraulic Oil', unit: 'LTR' },
  { code: 'MAT-003', name: 'Mild Steel Sheet 2mm', unit: 'KG' },
  { code: 'MAT-004', name: 'Copper Wire 1.5 sq.mm', unit: 'MTR' },
  { code: 'MAT-005', name: 'Safety Gloves', unit: 'BOX' },
  { code: 'MAT-006', name: 'V-Belt B-52', unit: 'NOS' },
  { code: 'MAT-007', name: 'Welding Electrode 3.15mm', unit: 'KG' },
  { code: 'MAT-008', name: 'Pneumatic Fitting Kit', unit: 'SET' },
  { code: 'MAT-009', name: 'Cutting Coolant', unit: 'LTR' },
  { code: 'MAT-010', name: 'Hex Bolt M12', unit: 'NOS' },
];

export const findMaterial = (code: string) => MATERIALS.find((m) => m.code === code);
