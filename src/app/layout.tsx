import type { Metadata } from 'next';
import { DsfrProviderBase } from '@codegouvfr/react-dsfr/next-app-router';
import { createGetHtmlAttributes } from '@codegouvfr/react-dsfr/next-app-router/getHtmlAttributes';
import { DsfrHeadBase } from '@codegouvfr/react-dsfr/next-app-router/DsfrHead';
import { StartDsfrOnHydration } from '@codegouvfr/react-dsfr/next-app-router';
import { Header } from '@/components/Header';
import { Footer } from '@codegouvfr/react-dsfr/Footer';
import Link from 'next/link';

declare module '@codegouvfr/react-dsfr/next-app-router' {
  interface RegisterLink {
    Link: typeof Link;
  }
}

const defaultColorScheme = 'system' as const;

const { getHtmlAttributes } = createGetHtmlAttributes({ defaultColorScheme });

export const metadata: Metadata = {
  title:
    'sources.ia.numerique.gouv.fr — Référentiel national des données publiques AI-ready',
  description:
    "Portail officiel qui référence les sources de données publiques françaises exploitables par l'IA.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = 'fr';
  return (
    <html {...getHtmlAttributes({ lang })}>
      <head>
        <StartDsfrOnHydration />
        <DsfrHeadBase Link={Link} />
        <link
          rel="stylesheet"
          href={`${process.env.PAGES_BASE_PATH || ''}/dsfr/utility/icons/icons.min.css`}
        />
      </head>
      <body>
        <DsfrProviderBase
          lang={lang}
          Link={Link}
          defaultColorScheme={defaultColorScheme}
        >
          <Header />
          <main>{children}</main>
          <Footer
            accessibility="partially compliant"
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
          />
        </DsfrProviderBase>
      </body>
    </html>
  );
}
