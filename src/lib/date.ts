import { format, isValid, parseISO } from 'date-fns';

/** `yyyy-MM-dd` — the format used by <input type="date"> and our storage. */
export const toISODate = (date: Date = new Date()) => format(date, 'yyyy-MM-dd');

/** DD/MM/YYYY — display format required by the assignment. */
export const formatDate = (iso?: string) => {
  if (!iso) return '—';
  const d = parseISO(iso);
  return isValid(d) ? format(d, 'dd/MM/yyyy') : '—';
};

export const formatDateTime = (iso: string) => {
  const d = parseISO(iso);
  return isValid(d) ? format(d, 'dd/MM/yyyy, hh:mm a') : '—';
};
