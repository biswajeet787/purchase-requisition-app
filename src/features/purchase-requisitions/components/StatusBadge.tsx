import { Badge, type BadgeTone } from '@/components/ui/Badge';
import type { Priority, PRStatus } from '../types';

const STATUS_TONE: Record<PRStatus, BadgeTone> = {
  Draft: 'blue',
  'Pending Approval': 'amber',
  Approved: 'green',
  Rejected: 'red',
};
const PRIORITY_TONE: Record<Priority, BadgeTone> = { Low: 'slate', Medium: 'amber', High: 'red' };

export const StatusBadge = ({ status }: { status: PRStatus }) => <Badge tone={STATUS_TONE[status]}>{status}</Badge>;
export const PriorityBadge = ({ priority }: { priority: Priority }) => (
  <Badge tone={PRIORITY_TONE[priority]} dot={false}>{priority}</Badge>
);
