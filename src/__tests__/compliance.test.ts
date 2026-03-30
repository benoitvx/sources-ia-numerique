import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { parse } from 'yaml';
import { SourceSchema, FORMAT_KEYS } from '@/lib/types';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');

function loadYamlFiles() {
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.yaml'));
  return files.map((file) => ({
    file,
    raw: parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8')),
  }));
}

describe('Source data compliance', () => {
  it('every YAML file in src/data/ must match the Zod schema', () => {
    const entries = loadYamlFiles();
    for (const { file, raw } of entries) {
      const result = SourceSchema.safeParse(raw);
      expect(result.success, `${file} failed schema validation: ${JSON.stringify(result.error?.format())}`).toBe(true);
    }
  });

  it('every source must have an id matching its filename', () => {
    const entries = loadYamlFiles();
    for (const { file, raw } of entries) {
      const expectedId = file.replace('.yaml', '');
      expect(raw.id, `${file}: id "${raw.id}" does not match filename "${expectedId}"`).toBe(expectedId);
    }
  });

  it('every available format must have a url and provenance', () => {
    const entries = loadYamlFiles();
    for (const { file, raw } of entries) {
      if (!raw.formats) continue;
      for (const [key, entry] of Object.entries(raw.formats)) {
        const format = entry as Record<string, unknown>;
        if (format.statut === 'disponible' || format.statut === 'experimental') {
          expect(format.url, `${file}: format ${key} is ${format.statut} but has no url`).toBeTruthy();
          expect(format.provenance, `${file}: format ${key} is ${format.statut} but has no provenance`).toBeTruthy();
        }
      }
    }
  });

  it('every source must have at least one available format', () => {
    const entries = loadYamlFiles();
    for (const { file, raw } of entries) {
      const formats = Object.values(raw.formats || {}) as Array<Record<string, unknown>>;
      const hasAvailable = formats.some(
        (f) => f.statut === 'disponible' || f.statut === 'experimental'
      );
      expect(hasAvailable, `${file}: no available format found`).toBe(true);
    }
  });

  it('tutoriel URLs must be valid URLs or null', () => {
    const entries = loadYamlFiles();
    const urlRegex = /^https?:\/\/.+/;
    for (const { file, raw } of entries) {
      for (const [key, entry] of Object.entries(raw.formats || {})) {
        const format = entry as Record<string, unknown>;
        if (format.tutoriel !== null && format.tutoriel !== undefined) {
          expect(
            urlRegex.test(format.tutoriel as string),
            `${file}: format ${key} tutoriel "${format.tutoriel}" is not a valid URL`
          ).toBe(true);
        }
      }
    }
  });

  it('every source must have all 7 format keys', () => {
    const entries = loadYamlFiles();
    for (const { file, raw } of entries) {
      for (const key of FORMAT_KEYS) {
        expect(raw.formats[key], `${file}: missing format key "${key}"`).toBeDefined();
      }
    }
  });

  it('tags must be non-empty arrays', () => {
    const entries = loadYamlFiles();
    for (const { file, raw } of entries) {
      expect(Array.isArray(raw.tags), `${file}: tags is not an array`).toBe(true);
      expect(raw.tags.length, `${file}: tags array is empty`).toBeGreaterThan(0);
    }
  });
});
