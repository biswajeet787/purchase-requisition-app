import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ERROR_FLAG_KEY, resetMockData } from '../api/prApi';
import { resetFilters } from '../store/filtersSlice';
import { useAppDispatch } from '@/hooks/useAppStore';

const readFlag = () => {
  try {
    return localStorage.getItem(ERROR_FLAG_KEY) === '1';
  } catch {
    return false;
  }
};

/** Demo helpers: trigger the error state and reset seed data. */
export function DevTools() {
  const qc = useQueryClient();
  const dispatch = useAppDispatch();
  const [simulate, setSimulate] = useState(readFlag);

  const toggle = () => {
    const next = !simulate;
    try {
      localStorage.setItem(ERROR_FLAG_KEY, next ? '1' : '0');
    } catch {
      /* ignore */
    }
    setSimulate(next);
    void qc.invalidateQueries();
    toast.info(next ? 'API errors enabled — data requests will fail' : 'API errors disabled');
  };

  const reset = () => {
    resetMockData();
    dispatch(resetFilters());
    void qc.invalidateQueries();
    toast.success('Demo data reset');
  };

  return (
    <div className="space-y-3 text-xs">
      <p className="font-semibold tracking-wide text-slate-400 uppercase">Demo tools</p>
      <label className="flex cursor-pointer items-center justify-between gap-2 text-slate-300">
        Simulate API error
        <button
          type="button"
          role="switch"
          aria-checked={simulate}
          onClick={toggle}
          className={`relative h-5 w-9 rounded-full transition-colors ${simulate ? 'bg-red-500' : 'bg-white/20'}`}
        >
          <span className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white transition-transform ${simulate ? 'translate-x-4' : ''}`} />
        </button>
      </label>
      <button type="button" onClick={reset} className="w-full rounded-lg bg-white/10 px-3 py-2 text-slate-200 transition-colors hover:bg-white/20">
        Reset demo data
      </button>
    </div>
  );
}
