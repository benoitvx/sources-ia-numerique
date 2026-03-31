import fs from 'fs';
import path from 'path';
import { parse } from 'yaml';
import { SourceSchema, FORMAT_LABELS, type Source, type FormatKey } from '../src/lib/types';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

function loadSources(): Source[] {
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.yaml'))
    .sort();

  return files.map((file) => {
    const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
    const raw = parse(content);
    const result = SourceSchema.parse(raw);
    return result;
  });
}

function statusEmoji(statut: string): string {
  switch (statut) {
    case 'officiel':
      return '✅';
    case 'tiers':
      return '☑️';
    case 'wip':
      return '🚧';
    case 'indisponible':
      return '❌';
    default:
      return '—';
  }
}

function formatList(source: Source): string {
  return (Object.entries(source.formats) as [FormatKey, { statut: string }][])
    .filter(([, f]) => f.statut !== 'indisponible')
    .map(([key]) => FORMAT_LABELS[key])
    .join(', ');
}

function generateLlmsTxt(sources: Source[]): string {
  const lines: string[] = [];

  lines.push('# sources.ia.numerique.gouv.fr');
  lines.push('');
  lines.push(
    '> Référentiel national des sources de données publiques françaises exploitables par l\'IA. Pour chaque source, indique les formats de consommation disponibles : API REST, Parquet, MCP, CLI, Skill, Collection Albert API.'
  );
  lines.push('');
  lines.push(
    'Projet porté par le département Intelligence Artificielle dans l\'État (IAE) de la DINUM.'
  );
  lines.push('');

  lines.push('## Sources de données');
  lines.push('');
  for (const source of sources) {
    const formats = formatList(source);
    lines.push(`- [${source.nom}](/sources/${source.id}): ${formats}`);
  }
  lines.push('');

  lines.push('## Détail des fiches');
  lines.push('');
  for (const source of sources) {
    lines.push(`- [${source.nom}](/sources/${source.id}.md)`);
  }
  lines.push('');

  lines.push('## Optional');
  lines.push('');
  lines.push('- [En savoir plus](/en-savoir-plus): Contexte, gouvernance et positionnement du référentiel');

  return lines.join('\n') + '\n';
}

function generateLlmsFullTxt(sources: Source[]): string {
  const lines: string[] = [];

  lines.push('# sources.ia.numerique.gouv.fr');
  lines.push('');
  lines.push(
    '> Référentiel national des sources de données publiques françaises exploitables par l\'IA. Pour chaque source, indique les formats de consommation disponibles : API REST, Parquet, MCP, CLI, Skill, Collection Albert API.'
  );
  lines.push('');
  lines.push(
    'Projet porté par le département Intelligence Artificielle dans l\'État (IAE) de la DINUM.'
  );
  lines.push('');
  lines.push('---');
  lines.push('');

  for (const source of sources) {
    lines.push(`## ${source.nom}`);
    lines.push('');
    lines.push(`**Source** : ${source.source}`);
    lines.push(`**Licence** : ${source.licence}`);
    lines.push(`**Mise à jour** : ${source.mise_a_jour}`);
    lines.push(`**Dernière mise à jour** : ${source.derniere_maj}`);
    if (source.volumes) {
      const parts: string[] = [];
      if (source.volumes.documents)
        parts.push(`${source.volumes.documents.toLocaleString('fr-FR')} documents`);
      if (source.volumes.chunks)
        parts.push(`${source.volumes.chunks.toLocaleString('fr-FR')} chunks`);
      if (parts.length > 0) lines.push(`**Volumes** : ${parts.join(', ')}`);
    }
    lines.push('');
    lines.push(source.description.trim());
    lines.push('');

    lines.push('### Formats');
    lines.push('');
    for (const [key, format] of Object.entries(source.formats) as [
      FormatKey,
      { statut: string; url?: string; tiers_label?: string; tutoriel?: string | null },
    ][]) {
      const label = FORMAT_LABELS[key];
      const emoji = statusEmoji(format.statut);
      let line = `- ${emoji} **${label}** — ${format.statut}`;
      if (format.url) line += ` — ${format.url}`;
      if ('tiers_label' in format && format.tiers_label)
        line += ` (${format.tiers_label})`;
      if (format.tutoriel) line += ` | Tutoriel : ${format.tutoriel}`;
      lines.push(line);
    }
    lines.push('');
    lines.push(`**Tags** : ${source.tags.join(', ')}`);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  return lines.join('\n');
}

const sources = loadSources();

fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), generateLlmsTxt(sources), 'utf-8');
fs.writeFileSync(path.join(PUBLIC_DIR, 'llms-full.txt'), generateLlmsFullTxt(sources), 'utf-8');

console.log(`Generated llms.txt (${sources.length} sources)`);
console.log(`Generated llms-full.txt (${sources.length} sources)`);
