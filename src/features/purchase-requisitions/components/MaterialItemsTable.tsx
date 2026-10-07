import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { MATERIALS, findMaterial } from '../constants';
import { emptyItem } from '../formDefaults';
import type { PRFormValues } from '../schemas';
import { UNITS } from '../types';
import { TH } from './PRTable';

const CellError = ({ message }: { message?: string }) =>
  message ? <p role="alert" className="mt-1 text-xs font-medium text-red-600">{message}</p> : null;

export function MaterialItemsTable() {
  const { control, register, setValue, trigger, formState: { errors } } = useFormContext<PRFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const items = useWatch({ control, name: 'items' });
  const usedCodes = (items ?? []).map((i) => i?.materialCode).filter(Boolean);
  const listError = errors.items?.message ?? errors.items?.root?.message;

  const revalidate = () => {
    if (errors.items) void trigger('items');
  };

  return (
    <Card>
      <CardHeader
        title="Material items"
        description="Add every material required for this requisition."
        action={
          <Button size="sm" icon={<Plus className="size-4" />} onClick={() => append(emptyItem())}>
            Add Item
          </Button>
        }
      />

      {listError && (
        <p role="alert" className="mx-5 mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{listError}</p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-sm">
          <thead>
            <tr>
              {['Material Code', 'Material Name', 'Quantity', 'Unit', 'Required Date', 'Remarks'].map((h) => <TH key={h}>{h}</TH>)}
              <TH align="center">Action</TH>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {fields.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">
                  No items yet — click <span className="font-medium text-slate-700">Add Item</span> to start.
                </td>
              </tr>
            )}
            {fields.map((field, index) => {
              const rowErrors = errors.items?.[index];
              const code = `items.${index}.materialCode` as const;
              return (
                <tr key={field.id} className="align-top">
                  <td className="w-60 px-3 py-3">
                    <Select
                      aria-label={`Material code, row ${index + 1}`}
                      invalid={!!rowErrors?.materialCode}
                      {...register(code, {
                        onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                          const m = findMaterial(e.target.value);
                          setValue(`items.${index}.materialName`, m?.name ?? '');
                          if (m) setValue(`items.${index}.unit`, m.unit);
                          revalidate();
                        },
                      })}
                    >
                      <option value="">Select material</option>
                      {MATERIALS.map((m) => (
                        <option key={m.code} value={m.code} disabled={usedCodes.includes(m.code) && items?.[index]?.materialCode !== m.code}>
                          {m.code} — {m.name}
                        </option>
                      ))}
                    </Select>
                    <CellError message={rowErrors?.materialCode?.message} />
                  </td>
                  <td className="w-48 px-3 py-3">
                    <Input readOnly tabIndex={-1} placeholder="Auto-filled" aria-label={`Material name, row ${index + 1}`} {...register(`items.${index}.materialName`)} />
                  </td>
                  <td className="w-32 px-3 py-3">
                    <Input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="any"
                      placeholder="0"
                      aria-label={`Quantity, row ${index + 1}`}
                      invalid={!!rowErrors?.quantity}
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    />
                    <CellError message={rowErrors?.quantity?.message} />
                  </td>
                  <td className="w-28 px-3 py-3">
                    <Select aria-label={`Unit, row ${index + 1}`} invalid={!!rowErrors?.unit} {...register(`items.${index}.unit`)}>
                      {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                    </Select>
                    <CellError message={rowErrors?.unit?.message} />
                  </td>
                  <td className="w-44 px-3 py-3">
                    <Input
                      type="date"
                      aria-label={`Required date, row ${index + 1}`}
                      invalid={!!rowErrors?.requiredDate}
                      {...register(`items.${index}.requiredDate`)}
                    />
                    <CellError message={rowErrors?.requiredDate?.message} />
                  </td>
                  <td className="min-w-48 px-3 py-3">
                    <Input placeholder="Optional" maxLength={200} aria-label={`Remarks, row ${index + 1}`} invalid={!!rowErrors?.remarks} {...register(`items.${index}.remarks`)} />
                    <CellError message={rowErrors?.remarks?.message} />
                  </td>
                  <td className="w-20 px-3 py-3 text-center">
                    <button
                      type="button"
                      aria-label={`Remove row ${index + 1}`}
                      onClick={() => {
                        remove(index);
                        revalidate();
                      }}
                      className="grid size-10 place-items-center rounded-lg text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="size-4.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
