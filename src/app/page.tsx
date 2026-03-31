import { Suspense } from 'react';
import { fr } from '@codegouvfr/react-dsfr';
import { loadAllSources } from '@/lib/sources';
import { SourceFilter } from '@/components/SourceFilter';

export default function HomePage() {
  const sources = loadAllSources();

  return (
    <div className={fr.cx('fr-container', 'fr-my-4w')}>
      <Suspense>
        <SourceFilter sources={sources} />
      </Suspense>
    </div>
  );
}
