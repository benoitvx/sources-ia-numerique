import { Card } from '@codegouvfr/react-dsfr/Card';
import { Badge } from '@codegouvfr/react-dsfr/Badge';
import { FORMAT_KEYS, FORMAT_LABELS, type Source } from '@/lib/types';

export function SourceCard({ source }: { source: Source }) {
  const availableFormats = FORMAT_KEYS.filter(
    (key) =>
      key in source.formats && source.formats[key]!.statut !== 'indisponible'
  );

  return (
    <Card
      enlargeLink
      title={source.nom}
      desc={source.description}
      detail={source.source}
      linkProps={{ href: `/sources/${source.id}` }}
      start={
        <ul className="fr-badges-group">
          {availableFormats.map((key) => (
            <li key={key}>
              <Badge severity="info">{FORMAT_LABELS[key]}</Badge>
            </li>
          ))}
        </ul>
      }
    />
  );
}
