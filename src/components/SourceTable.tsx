import { Table } from '@codegouvfr/react-dsfr/Table';
import {
  TABLE_FORMAT_COLUMNS,
  TABLE_FORMAT_LABELS,
  type Source,
  type FormatEntry,
  type TableFormatKey,
} from '@/lib/types';
import styles from './SourceTable.module.css';

const FORMAT_TOOLTIPS: Record<TableFormatKey, string> = {
  api: 'Accès via une API REST. Idéal pour l\u2019intégration applicative et les requêtes dynamiques.',
  albert_api:
    'Collection dans Albert API, la plateforme RAG souveraine de l\u2019État.',
  parquet:
    'Fichiers Parquet sur HuggingFace. Idéal pour le fine-tuning et la data science.',
  mcp: 'Serveur MCP (Model Context Protocol). Connecte la source à un agent IA ou un assistant.',
  cli: 'Interface en ligne de commande. Idéal pour le scripting et les pipelines d\u2019automatisation.',
  skill:
    'Skill pour un IDE IA. Accès aux données pendant le développement.',
};

function getStatusCell(
  entry: FormatEntry,
  sourceLabel: string
): React.ReactNode {
  switch (entry.statut) {
    case 'officiel':
      return (
        <span title={`Disponible — source officielle ${sourceLabel}`}>✅</span>
      );
    case 'tiers':
      return (
        <span title={`Disponible — proposé par ${entry.tiers_label}`}>☑️</span>
      );
    case 'wip':
      return <span title="En cours de développement">🚧</span>;
    case 'indisponible':
      return <span title="Non disponible">❌</span>;
  }
}

function formatHeader(key: TableFormatKey): React.ReactNode {
  return (
    <span style={{ whiteSpace: 'nowrap' }}>
      {TABLE_FORMAT_LABELS[key]}{' '}
      <span
        className="fr-icon-question-line fr-icon--sm"
        title={FORMAT_TOOLTIPS[key]}
        aria-label={FORMAT_TOOLTIPS[key]}
      />
    </span>
  );
}

export function SourceTable({ sources }: { sources: Source[] }) {
  const headers = [
    'Source',
    'Description',
    ...TABLE_FORMAT_COLUMNS.map((key) => formatHeader(key)),
  ];

  const data = sources.map((source) => [
    <a key={source.id} href={`/sources/${source.id}`}>
      {source.nom}
      <br />
      <span className="fr-text--sm fr-text--mention-grey">
        {source.source}
      </span>
    </a>,
    <span key={`desc-${source.id}`} className="fr-text--sm">
      {source.description}
    </span>,
    ...TABLE_FORMAT_COLUMNS.map((key) =>
      getStatusCell(source.formats[key]!, source.source)
    ),
  ]);

  return (
    <div>
      <ul className={styles.legend}>
        <li>✅ Disponible — officiel</li>
        <li>☑️ Disponible — proposé par un tiers</li>
        <li>🚧 En cours de développement</li>
        <li>❌ Non disponible</li>
      </ul>
      <div className={styles.table}>
        <Table headers={headers} data={data} />
      </div>
    </div>
  );
}
