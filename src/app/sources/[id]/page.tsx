import type { Metadata } from 'next';
import { fr } from '@codegouvfr/react-dsfr';
import { Breadcrumb } from '@codegouvfr/react-dsfr/Breadcrumb';
import { Tag } from '@codegouvfr/react-dsfr/Tag';
import { FormatTable } from '@/components/FormatTable';
import { loadAllSources, getSourceById } from '@/lib/sources';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  const sources = loadAllSources();
  return sources.map((s) => ({ id: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const source = getSourceById(id);
  if (!source) return { title: 'Source introuvable' };
  return {
    title: `${source.nom} — sources.ia.numerique.gouv.fr`,
    description: source.description,
  };
}

export default async function SourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const source = getSourceById(id);
  if (!source) notFound();

  return (
    <div className={fr.cx('fr-container', 'fr-my-4w')}>
      <Breadcrumb
        currentPageLabel={source.nom}
        homeLinkProps={{ href: '/' }}
        segments={[
          {
            label: 'Sources de données',
            linkProps: { href: '/' },
          },
        ]}
      />

      <h1 className={fr.cx('fr-mb-2w')}>{source.nom}</h1>

      <div className={fr.cx('fr-mb-4w')}>
        <p>{source.description}</p>
        <ul className={fr.cx('fr-text--sm')}>
          <li>
            <strong>Source :</strong> {source.source}
          </li>
          <li>
            <strong>Licence :</strong> {source.licence}
          </li>
          <li>
            <strong>Mise à jour :</strong> {source.mise_a_jour}
          </li>
          <li>
            <strong>Dernière mise à jour :</strong> {source.derniere_maj}
          </li>
          {source.volumes && (
            <>
              {source.volumes.documents && (
                <li>
                  <strong>Documents :</strong>{' '}
                  {source.volumes.documents.toLocaleString('fr-FR')}
                </li>
              )}
              {source.volumes.chunks && (
                <li>
                  <strong>Chunks :</strong>{' '}
                  {source.volumes.chunks.toLocaleString('fr-FR')}
                </li>
              )}
            </>
          )}
        </ul>
      </div>

      <h2 className={fr.cx('fr-mb-2w')}>Formats disponibles</h2>
      <FormatTable formats={source.formats} />

      <div className={fr.cx('fr-mt-4w')}>
        <h2 className={fr.cx('fr-mb-2w')}>Tags</h2>
        <ul className="fr-tags-group">
          {source.tags.map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
