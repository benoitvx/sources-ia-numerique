import { fr } from '@codegouvfr/react-dsfr';
import { CallOut } from '@codegouvfr/react-dsfr/CallOut';

export default function EnSavoirPlusPage() {
  return (
    <div className={fr.cx('fr-container', 'fr-my-4w')}>
      <h1 className={fr.cx('fr-mb-4w')}>En savoir plus</h1>

      <h2 className={fr.cx('fr-mb-2w')}>Contexte et enjeux</h2>
      <p className={fr.cx('fr-mb-3w')}>
        L'intelligence artificielle transforme les services publics. Pour que les
        agents IA, les modèles de langage et les outils d'analyse puissent
        exploiter les données publiques françaises, celles-ci doivent être
        disponibles dans des formats adaptés : API REST, fichiers Parquet pour le
        fine-tuning, serveurs MCP pour les agents, skills pour les assistants de
        code.
      </p>
      <p className={fr.cx('fr-mb-3w')}>
        sources.ia.numerique.gouv.fr est le référentiel national qui recense ces sources de
        données et indique, pour chacune, les formats de consommation disponibles,
        leur statut et leur provenance.
      </p>

      <CallOut title="Le site ne produit aucun format">
        sources.ia.numerique.gouv.fr référence l'existant. Il ne crée pas de nouveaux jeux de
        données ni de nouvelles API. Il offre une vue d'ensemble des formats déjà
        disponibles pour chaque source de données publique.
      </CallOut>

      <h2 className={fr.cx('fr-mt-4w', 'fr-mb-2w')}>
        Gouvernance du référentiel
      </h2>
      <p className={fr.cx('fr-mb-3w')}>
        Le référentiel est porté par le département Intelligence Artificielle dans
        l'État (IAE) de la Direction interministérielle du numérique (DINUM). Les
        fiches sources de données sont déclaratives et gérées en code ouvert :
        ajouter ou modifier une source consiste à éditer un fichier YAML et
        proposer une contribution.
      </p>

      <h2 className={fr.cx('fr-mt-4w', 'fr-mb-2w')}>
        Rapport avec data.gouv.fr
      </h2>
      <p className={fr.cx('fr-mb-3w')}>
        data.gouv.fr est la plateforme nationale de données ouvertes. Elle héberge
        et distribue les jeux de données. sources.ia.numerique.gouv.fr est complémentaire : il
        ne duplique pas les données mais référence les formats de consommation
        spécifiquement utiles pour l'IA, y compris ceux disponibles sur
        data.gouv.fr.
      </p>

      <h2 className={fr.cx('fr-mt-4w', 'fr-mb-2w')}>
        Demander une nouvelle source
      </h2>
      <p className={fr.cx('fr-mb-3w')}>
        Vous pouvez soumettre une demande d'ajout de source de données via le
        bouton &quot;Demander une source de données&quot; présent dans l'en-tête du
        site. L'équipe évaluera la demande (formats disponibles, provenance,
        qualité) avant de l'intégrer au référentiel.
      </p>
    </div>
  );
}
