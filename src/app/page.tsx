import { fr } from '@codegouvfr/react-dsfr';
import { loadAllSources } from '@/lib/sources';
import { SourceFilter } from '@/components/SourceFilter';

export default function HomePage() {
  const sources = loadAllSources();

  return (
    <div className={fr.cx('fr-container', 'fr-my-4w')}>
      <h1 className={fr.cx('fr-mb-2w')}>Sources de données</h1>

      <SourceFilter sources={sources} />
    </div>
  );
}
