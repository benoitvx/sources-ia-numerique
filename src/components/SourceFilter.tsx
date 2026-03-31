'use client';

import { useState, useMemo } from 'react';
import { fr } from '@codegouvfr/react-dsfr';
import { Button } from '@codegouvfr/react-dsfr/Button';
import { SourceCard } from './SourceCard';
import { FORMAT_KEYS, FORMAT_LABELS, type Source } from '@/lib/types';

const FILTERABLE_FORMATS = FORMAT_KEYS.filter((key) => key !== 'site_web');

function countSourcesForFormat(sources: Source[], format: string): number {
  return sources.filter(
    (s) =>
      format in s.formats &&
      s.formats[format as keyof typeof s.formats]?.statut !== 'indisponible'
  ).length;
}

export function SourceFilter({ sources }: { sources: Source[] }) {
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);

  const formatCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const key of FILTERABLE_FORMATS) {
      counts[key] = countSourcesForFormat(sources, key);
    }
    return counts;
  }, [sources]);

  const filtered = useMemo(() => {
    if (!selectedFormat) return sources;
    return sources.filter(
      (s) =>
        selectedFormat in s.formats &&
        s.formats[selectedFormat as keyof typeof s.formats]?.statut !==
          'indisponible'
    );
  }, [sources, selectedFormat]);

  return (
    <div>
      <div className={fr.cx('fr-mb-3w')}>
        <ul className="fr-btns-group fr-btns-group--inline fr-btns-group--sm">
          <li>
            <Button
              priority={selectedFormat === null ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setSelectedFormat(null)}
            >
              Tous ({sources.length})
            </Button>
          </li>
          {FILTERABLE_FORMATS.map((key) => (
            <li key={key}>
              <Button
                priority={selectedFormat === key ? 'primary' : 'secondary'}
                size="small"
                onClick={() =>
                  setSelectedFormat(selectedFormat === key ? null : key)
                }
              >
                {FORMAT_LABELS[key]} ({formatCounts[key]})
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <div className={fr.cx('fr-grid-row', 'fr-grid-row--gutters')}>
        {filtered.map((source) => (
          <div
            key={source.id}
            className={fr.cx('fr-col-12', 'fr-col-md-6', 'fr-col-lg-4')}
          >
            <SourceCard source={source} />
          </div>
        ))}
        {filtered.length === 0 && (
          <div className={fr.cx('fr-col-12')}>
            <p>Aucune source de données ne correspond à votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
}
