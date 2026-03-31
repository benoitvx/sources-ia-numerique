'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { fr } from '@codegouvfr/react-dsfr';
import { SegmentedControl } from '@codegouvfr/react-dsfr/SegmentedControl';
import { Tag } from '@codegouvfr/react-dsfr/Tag';
import { SourceCard } from './SourceCard';
import { SourceTable } from './SourceTable';
import {
  FORMAT_KEYS,
  FORMAT_LABELS,
  type Source,
  type FormatKey,
} from '@/lib/types';

type View = 'table' | 'list';

const FILTER_FORMATS: FormatKey[] = FORMAT_KEYS.filter((key) => key !== 'site_web');

function isValidView(value: string | null): value is View {
  return value === 'table' || value === 'list';
}

function isValidFormat(value: string | null): value is FormatKey {
  return value !== null && FILTER_FORMATS.includes(value as FormatKey);
}

export function SourceFilter({ sources }: { sources: Source[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const rawView = searchParams.get('view');
  const urlView: View = isValidView(rawView) ? rawView : 'table';

  const rawFormat = searchParams.get('format');
  const urlFormat: FormatKey | null = isValidFormat(rawFormat)
    ? rawFormat
    : null;

  const [view, setView] = useState<View>('table');
  const [activeFormat, setActiveFormat] = useState<FormatKey | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setView(urlView);
    setActiveFormat(urlFormat);
    setMounted(true);
  }, [urlView, urlFormat]);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const handleViewChange = useCallback(
    (newView: View) => {
      setView(newView);
      updateParams({ view: newView });
    },
    [updateParams]
  );

  const handleFormatChange = useCallback(
    (format: FormatKey | null) => {
      setActiveFormat(format);
      updateParams({ format });
    },
    [updateParams]
  );

  const formatCounts = useMemo(() => {
    const counts: Partial<Record<FormatKey, number>> = {};
    for (const key of FILTER_FORMATS) {
      counts[key] = sources.filter(
        (s) =>
          s.formats[key] &&
          (s.formats[key]!.statut === 'officiel' ||
            s.formats[key]!.statut === 'tiers' ||
            s.formats[key]!.statut === 'wip')
      ).length;
    }
    return counts;
  }, [sources]);

  const filteredSources = useMemo(() => {
    if (!activeFormat) return sources;
    return sources.filter(
      (s) =>
        s.formats[activeFormat] &&
        (s.formats[activeFormat]!.statut === 'officiel' ||
          s.formats[activeFormat]!.statut === 'tiers' ||
          s.formats[activeFormat]!.statut === 'wip')
    );
  }, [sources, activeFormat]);

  if (!mounted) {
    return (
      <div>
        <div className={fr.cx('fr-mb-3w')}>
          <SegmentedControl
            hideLegend
            legend="Mode d'affichage"
            segments={[
              {
                label: 'Tableau',
                nativeInputProps: {
                  checked: true,
                  readOnly: true,
                },
              },
              {
                label: 'Liste',
                nativeInputProps: {
                  checked: false,
                  readOnly: true,
                },
              },
            ]}
          />
        </div>
        <SourceTable sources={sources} />
      </div>
    );
  }

  return (
    <div>
      <div className={fr.cx('fr-mb-3w')}>
        <SegmentedControl
          hideLegend
          legend="Mode d'affichage"
          segments={[
            {
              label: 'Tableau',
              nativeInputProps: {
                checked: view === 'table',
                onChange: () => handleViewChange('table'),
              },
            },
            {
              label: 'Liste',
              nativeInputProps: {
                checked: view === 'list',
                onChange: () => handleViewChange('list'),
              },
            },
          ]}
        />
      </div>

      {view === 'table' ? (
        <SourceTable sources={sources} />
      ) : (
        <>
          <ul
            className={fr.cx('fr-tags-group', 'fr-mb-3w')}
            role="list"
            aria-label="Filtrer par format"
          >
            <li>
              <Tag
                pressed={!activeFormat}
                nativeButtonProps={{
                  onClick: () => handleFormatChange(null),
                }}
              >
                Tous ({sources.length})
              </Tag>
            </li>
            {FILTER_FORMATS.map((key) => (
              <li key={key}>
                <Tag
                  pressed={activeFormat === key}
                  nativeButtonProps={{
                    onClick: () =>
                      handleFormatChange(activeFormat === key ? null : key),
                  }}
                >
                  {FORMAT_LABELS[key]} ({formatCounts[key] ?? 0})
                </Tag>
              </li>
            ))}
          </ul>
          <div className={fr.cx('fr-grid-row', 'fr-grid-row--gutters')}>
            {filteredSources.map((source) => (
              <div
                key={source.id}
                className={fr.cx('fr-col-12', 'fr-col-md-6', 'fr-col-lg-4')}
              >
                <SourceCard source={source} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
