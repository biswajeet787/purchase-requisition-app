import { useEffect, useRef, useState } from 'react';
import { RotateCcw, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { resetFilters, setDateRange, setSearch, setStatus } from '../store/filtersSlice';
import { PR_STATUSES, type PRStatus } from '../types';

export function PRFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.filters);
  const [text, setText] = useState(filters.search);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onSearch = (value: string) => {
    setText(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => dispatch(setSearch(value)), 300);
  };

  const active = Boolean(filters.search || text || filters.status !== 'All' || filters.dateFrom || filters.dateTo);

  const reset = () => {
    clearTimeout(timer.current);
    setText('');
    dispatch(resetFilters());
  };

  return (
    <Card className="mb-4 p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_1fr_1fr_1fr_auto] lg:items-end">
        <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600">
          Search PR number
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <Input value={text} onChange={(e) => onSearch(e.target.value)} placeholder="e.g. PR-0012" className="pl-9" />
          </div>
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600">
          Status
          <Select value={filters.status} onChange={(e) => dispatch(setStatus(e.target.value as PRStatus | 'All'))}>
            <option value="All">All statuses</option>
            {PR_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600">
          Date from
          <Input type="date" value={filters.dateFrom} max={filters.dateTo || undefined} onChange={(e) => dispatch(setDateRange({ dateFrom: e.target.value }))} />
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600">
          Date to
          <Input type="date" value={filters.dateTo} min={filters.dateFrom || undefined} onChange={(e) => dispatch(setDateRange({ dateTo: e.target.value }))} />
        </label>
        <Button variant="outline" onClick={reset} disabled={!active} icon={<RotateCcw className="size-4" />}>Reset</Button>
      </div>
    </Card>
  );
}
