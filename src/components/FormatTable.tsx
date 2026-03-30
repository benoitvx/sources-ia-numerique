import { Table } from '@codegouvfr/react-dsfr/Table';
import { FormatBadge } from './FormatBadge';
import { FORMAT_KEYS, FORMAT_LABELS, type Source } from '@/lib/types';

export function FormatTable({ formats }: { formats: Source['formats'] }) {
  const data = FORMAT_KEYS.filter((key) => key in formats).map((key) => {
    const entry = formats[key]!;
    const hasUrl = entry.statut !== 'indisponible' && entry.url;
    const hasTutoriel =
      'tutoriel' in entry && entry.tutoriel;

    return [
      FORMAT_LABELS[key],
      <FormatBadge key={`badge-${key}`} status={entry.statut} />,
      entry.statut !== 'indisponible' ? entry.provenance : '—',
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
      hasTutoriel ? (
        <a
          key={`tuto-${key}`}
          href={entry.tutoriel!}
          target="_blank"
          rel="noopener noreferrer"
        >
          Tutoriel
        </a>
      ) : (
        '—'
      ),
    ];
  });

  return (
    <Table
      headers={['Format', 'Statut', 'Provenance', 'Lien', 'Tutoriel']}
      data={data}
    />
  );
}
