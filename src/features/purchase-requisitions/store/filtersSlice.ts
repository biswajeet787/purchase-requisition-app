import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PRStatus } from '../types';

export interface FiltersState {
  search: string;
  status: PRStatus | 'All';
  dateFrom: string;
  dateTo: string;
  page: number;
}

export const initialFilters: FiltersState = { search: '', status: 'All', dateFrom: '', dateTo: '', page: 1 };

const filtersSlice = createSlice({
  name: 'prFilters',
  initialState: initialFilters,
  reducers: {
    setSearch(state, a: PayloadAction<string>) {
      state.search = a.payload;
      state.page = 1;
    },
    setStatus(state, a: PayloadAction<FiltersState['status']>) {
      state.status = a.payload;
      state.page = 1;
    },
    setDateRange(state, a: PayloadAction<{ dateFrom?: string; dateTo?: string }>) {
      Object.assign(state, a.payload);
      state.page = 1;
    },
    setPage(state, a: PayloadAction<number>) {
      state.page = a.payload;
    },
    resetFilters: () => initialFilters,
  },
});

export const { setSearch, setStatus, setDateRange, setPage, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
