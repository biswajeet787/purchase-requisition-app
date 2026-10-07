import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { DevTools } from '@/features/purchase-requisitions/components/DevTools';
import { NotFoundPage } from '@/components/layout/NotFoundPage';

const PRListPage = lazy(() => import('@/features/purchase-requisitions/pages/PRListPage'));
const PRFormPage = lazy(() => import('@/features/purchase-requisitions/pages/PRFormPage'));
const PRViewPage = lazy(() => import('@/features/purchase-requisitions/pages/PRViewPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout sidebarFooter={<DevTools />} />,
    children: [
      { index: true, element: <Navigate to="/purchase-requisitions" replace /> },
      { path: 'purchase-requisitions', element: <PRListPage /> },
      { path: 'purchase-requisitions/new', element: <PRFormPage /> },
      { path: 'purchase-requisitions/:id', element: <PRViewPage /> },
      { path: 'purchase-requisitions/:id/edit', element: <PRFormPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
