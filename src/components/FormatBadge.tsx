import { Badge } from '@codegouvfr/react-dsfr/Badge';
import type { Status } from '@/lib/types';

const STATUS_CONFIG: Record<
  Status,
  { severity: 'success' | 'warning' | 'error'; label: string }
> = {
  disponible: { severity: 'success', label: 'Disponible' },
  experimental: { severity: 'warning', label: 'Experimental' },
  indisponible: { severity: 'error', label: 'Indisponible' },
};

export function FormatBadge({ status }: { status: Status }) {
  const { severity, label } = STATUS_CONFIG[status];
  return <Badge severity={severity}>{label}</Badge>;
}
