'use client';

import { useState, useMemo } from 'react';
import { Tag } from '@codegouvfr/react-dsfr/Tag';
import { fr } from '@codegouvfr/react-dsfr';
import { SourceCard } from './SourceCard';
import { FORMAT_KEYS, FORMAT_LABELS, type Source } from '@/lib/types';

export function SourceFilter({ sources }: { sources: Source[] }) {
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return sources.filter((s) => {
      if (selectedFormats.length > 0) {
        const hasFormat = selectedFormats.some(
          (f) =>
            f in s.formats &&
            s.formats[f as keyof typeof s.formats]?.statut !== 'indisponible'
        );
        if (!hasFormat) return false;
      }

      return true;
    });
  }, [sources, selectedFormats]);

  const toggleFormat = (format: string) => {
    setSelectedFormats((prev) =>
      prev.includes(format)
        ? prev.filter((f) => f !== format)
        : [...prev, format]
    );
  };

  return (
    <div>
      <div className={fr.cx('fr-mb-3w')}>
        <p className={fr.cx('fr-text--bold', 'fr-mb-1w')}>
          Filtrer par formats disponibles
        </p>
        <ul className="fr-tags-group">
          {FORMAT_KEYS.map((key) => (
            <li key={key}>
              <Tag
                pressed={selectedFormats.includes(key)}
                nativeButtonProps={{
                  onClick: () => toggleFormat(key),
                }}
              >
                {FORMAT_LABELS[key]}
              </Tag>
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
