import { configureStore } from '@reduxjs/toolkit';
import filters from '@/features/purchase-requisitions/store/filtersSlice';
import session from '@/features/purchase-requisitions/store/sessionSlice';

export const store = configureStore({ reducer: { filters, session } });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
