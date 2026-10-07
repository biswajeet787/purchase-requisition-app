import { Lock } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { Card, CardHeader } from '@/components/ui/Card';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DEPARTMENTS, USERS } from '../constants';
import type { PRFormValues } from '../schemas';
import { PRIORITIES } from '../types';

export function PRHeaderForm({ prNumber }: { prNumber: string }) {
  const { register, formState: { errors }, trigger } = useFormContext<PRFormValues>();

  return (
    <Card>
      <CardHeader title="Header information" description="General details about this requisition." />
      <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <FormField label="PR Number" htmlFor="prNumber" hint="System generated (read-only)">
          <div className="relative">
            <Input id="prNumber" value={prNumber} readOnly tabIndex={-1} className="pr-9 font-semibold" />
            <Lock className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
          </div>
        </FormField>

        <FormField label="Request Date" htmlFor="requestDate" required error={errors.requestDate?.message}>
          <Input
            id="requestDate"
            type="date"
            invalid={!!errors.requestDate}
            {...register('requestDate', { onChange: () => errors.items && void trigger('items') })}
          />
        </FormField>

        <FormField label="Department" htmlFor="department" required error={errors.department?.message}>
          <Select id="department" invalid={!!errors.department} {...register('department')}>
            <option value="">Select department</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </Select>
        </FormField>

        <FormField label="Requested By" htmlFor="requestedBy" required error={errors.requestedBy?.message}>
          <Select id="requestedBy" invalid={!!errors.requestedBy} {...register('requestedBy')}>
            {USERS.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
          </Select>
        </FormField>

        <FormField label="Priority" htmlFor="priority" required error={errors.priority?.message}>
          <Select id="priority" invalid={!!errors.priority} {...register('priority')}>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </Select>
        </FormField>
      </div>
    </Card>
  );
}
