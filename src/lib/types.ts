import { z } from 'zod';

export const FORMAT_KEYS = [
  'site_web',
  'api',
  'parquet',
  'mcp',
  'cli',
  'skill',
  'albert_api',
] as const;

export type FormatKey = (typeof FORMAT_KEYS)[number];

export const FORMAT_LABELS: Record<FormatKey, string> = {
  site_web: 'Site web',
  api: 'API REST',
  parquet: 'Parquet',
  mcp: 'MCP',
  cli: 'CLI',
  skill: 'Skill',
  albert_api: 'Collection Albert API',
};

export const TABLE_FORMAT_COLUMNS = [
  'api',
  'albert_api',
  'parquet',
  'mcp',
  'cli',
  'skill',
] as const;

export type TableFormatKey = (typeof TABLE_FORMAT_COLUMNS)[number];

export const TABLE_FORMAT_LABELS: Record<TableFormatKey, string> = {
  api: 'API',
  albert_api: 'RAG',
  parquet: 'Parquet',
  mcp: 'MCP',
  cli: 'CLI',
  skill: 'Skill',
};

export const StatusEnum = z.enum([
  'officiel',
  'tiers',
  'wip',
  'indisponible',
]);
export type Status = z.infer<typeof StatusEnum>;

const OfficielFormatSchema = z.object({
  statut: z.literal('officiel'),
  url: z.string(),
  tutoriel: z.string().url().nullable().optional(),
});

const TiersFormatSchema = z.object({
  statut: z.literal('tiers'),
  url: z.string(),
  tiers_label: z.string(),
  tutoriel: z.string().url().nullable().optional(),
});

const WipFormatSchema = z.object({
  statut: z.literal('wip'),
  url: z.string().optional(),
  tutoriel: z.string().url().nullable().optional(),
});

const IndisponibleFormatSchema = z.object({
  statut: z.literal('indisponible'),
  url: z.string().optional(),
  tutoriel: z.string().url().nullable().optional(),
});

export const FormatEntrySchema = z.discriminatedUnion('statut', [
  OfficielFormatSchema,
  TiersFormatSchema,
  WipFormatSchema,
  IndisponibleFormatSchema,
]);
export type FormatEntry = z.infer<typeof FormatEntrySchema>;

export const VolumesSchema = z.object({
  documents: z.number().optional(),
  chunks: z.number().optional(),
});

export const SourceSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  nom: z.string(),
  source: z.string(),
  description: z.string(),
  licence: z.string(),
  mise_a_jour: z.string(),
  derniere_maj: z.string(),
  volumes: VolumesSchema.optional(),
  formats: z.record(z.enum([...FORMAT_KEYS]), FormatEntrySchema),
  tags: z.array(z.string()).min(1),
});
export type Source = z.infer<typeof SourceSchema>;
