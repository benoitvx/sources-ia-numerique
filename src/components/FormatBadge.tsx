import { Badge } from '@codegouvfr/react-dsfr/Badge';
import type { Status } from '@/lib/types';

const STATUS_CONFIG: Record<
  Status,
  { severity: 'success' | 'warning' | 'error' | 'info' | 'new'; label: string }
> = {
  officiel: { severity: 'success', label: 'Disponible' },
  tiers: { severity: 'info', label: 'Disponible (tiers)' },
  wip: { severity: 'warning', label: 'En cours' },
  indisponible: { severity: 'error', label: 'Indisponible' },
  na: { severity: 'new', label: 'N/A' },
};

export function FormatBadge({ status }: { status: Status }) {
  const { severity, label } = STATUS_CONFIG[status];
  return <Badge severity={severity}>{label}</Badge>;
}
