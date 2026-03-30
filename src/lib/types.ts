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

export const StatusEnum = z.enum([
  'disponible',
  'experimental',
  'indisponible',
]);
export type Status = z.infer<typeof StatusEnum>;

export const ProvenanceEnum = z.enum(['officielle', 'validee']);
export type Provenance = z.infer<typeof ProvenanceEnum>;

const AvailableFormatSchema = z.object({
  statut: z.enum(['disponible', 'experimental']),
  url: z.string(),
  provenance: ProvenanceEnum,
  tutoriel: z.string().url().nullable().optional(),
});

const UnavailableFormatSchema = z.object({
  statut: z.literal('indisponible'),
  url: z.string().optional(),
  provenance: ProvenanceEnum.optional(),
  tutoriel: z.string().url().nullable().optional(),
});

export const FormatEntrySchema = z.discriminatedUnion('statut', [
  AvailableFormatSchema,
  UnavailableFormatSchema,
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
