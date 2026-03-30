import { Header as DsfrHeader } from '@codegouvfr/react-dsfr/Header';

export function Header() {
  return (
    <DsfrHeader
      brandTop={
        <>
          RÉPUBLIQUE
          <br />
          FRANÇAISE
        </>
      }
      homeLinkProps={{
        href: '/',
        title: 'Accueil - sources.ia.numerique.gouv.fr',
      }}
      serviceTitle="Données publiques pour l'IA"
      serviceTagline="Référentiel national des données publiques exploitables par l'intelligence artificielle."
      navigation={[
        {
          text: 'Accueil',
          linkProps: { href: '/' },
        },
        {
          text: 'En savoir plus',
          linkProps: { href: '/en-savoir-plus' },
        },
      ]}
      quickAccessItems={[
        {
          iconId: 'fr-icon-add-circle-line',
          text: 'Demander une source de données',
          linkProps: {
            href: '#',
          },
        },
      ]}
    />
  );
}
