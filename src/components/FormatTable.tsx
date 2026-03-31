import { Table } from '@codegouvfr/react-dsfr/Table';
import { FormatBadge } from './FormatBadge';
import { FORMAT_KEYS, FORMAT_LABELS, type Source } from '@/lib/types';

export function FormatTable({ formats }: { formats: Source['formats'] }) {
  const data = FORMAT_KEYS.filter((key) => key in formats).map((key) => {
    const entry = formats[key]!;
    const hasUrl = 'url' in entry && entry.url;
    let provenance = '—';
    if (entry.statut === 'officiel') {
      provenance = 'Officielle';
    } else if (entry.statut === 'tiers') {
      provenance = entry.tiers_label;
    }

    return [
      FORMAT_LABELS[key],
      <FormatBadge key={`badge-${key}`} status={entry.statut} />,
      provenance,
      hasUrl ? (
        <a
          key={`url-${key}`}
          href={entry.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Accéder
        </a>
      ) : (
        '—'
      ),
    ];
  });

  return (
    <Table
      headers={['Format', 'Statut', 'Provenance', 'Lien']}
      data={data}
    />
  );
}
