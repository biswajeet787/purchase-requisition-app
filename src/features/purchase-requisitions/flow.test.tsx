// @vitest-environment jsdom
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Providers } from '@/app/providers';
import { resetMockData } from './api/prApi';
import PRFormPage from './pages/PRFormPage';
import PRListPage from './pages/PRListPage';
import PRViewPage from './pages/PRViewPage';

const renderAt = (path: string) =>
  render(
    <Providers>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/purchase-requisitions" element={<PRListPage />} />
          <Route path="/purchase-requisitions/new" element={<PRFormPage />} />
          <Route path="/purchase-requisitions/:id" element={<PRViewPage />} />
        </Routes>
      </MemoryRouter>
    </Providers>,
  );

beforeEach(() => resetMockData());
afterEach(cleanup);

describe('Purchase requisition flows', () => {
  it('lists seeded requisitions with pagination and PR-number search', async () => {
    const user = userEvent.setup();
    renderAt('/purchase-requisitions');
    expect((await screen.findAllByText('PR-0026', {}, { timeout: 4000 })).length).toBeGreaterThan(0);
    expect(screen.getByText('26')).toBeTruthy(); // pagination total

    await user.type(screen.getByPlaceholderText('e.g. PR-0012'), '0012');
    await waitFor(() => expect(screen.getAllByText('PR-0012').length).toBeGreaterThan(0), { timeout: 4000 });
    await waitFor(() => expect(screen.queryByText('PR-0013')).toBeNull(), { timeout: 4000 });
  });

  it('validates on submit, then saves a draft and opens the detail page', async () => {
    const user = userEvent.setup();
    renderAt('/purchase-requisitions/new');
    await screen.findByDisplayValue('PR-0027', {}, { timeout: 4000 });

    await user.click(screen.getByRole('button', { name: /submit for approval/i }));
    expect(await screen.findByText('Select a department')).toBeTruthy();
    expect(screen.getByText('Select a material')).toBeTruthy();
    expect(screen.getByText('Enter a quantity')).toBeTruthy();

    await user.selectOptions(screen.getByLabelText(/^department/i), 'Production');
    await user.selectOptions(screen.getByLabelText('Material code, row 1'), 'MAT-001');
    expect((screen.getByLabelText('Material name, row 1') as HTMLInputElement).value).toBe('Bearing');
    await user.type(screen.getByLabelText('Quantity, row 1'), '12');
    await user.type(screen.getByLabelText('Required date, row 1'), '2099-01-01');

    await user.click(screen.getByRole('button', { name: /save as draft/i }));
    const heading = await screen.findByRole('heading', { name: 'PR-0027' }, { timeout: 4000 });
    expect(heading).toBeTruthy();
    expect(within(document.body).getAllByText('Draft').length).toBeGreaterThan(0);
  });
});
