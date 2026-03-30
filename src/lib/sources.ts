import fs from 'fs';
import path from 'path';
import { parse } from 'yaml';
import { SourceSchema, type Source } from './types';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');

export function loadAllSources(): Source[] {
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.yaml'))
    .sort();

  return files.map((file) => {
    const filePath = path.join(DATA_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const raw = parse(content);
    const expectedId = file.replace('.yaml', '');

    if (raw.id !== expectedId) {
      throw new Error(
        `File ${file}: id "${raw.id}" does not match filename "${expectedId}"`
      );
    }

    const result = SourceSchema.safeParse(raw);
    if (!result.success) {
      throw new Error(
        `File ${file}: schema validation failed\n${result.error.format()._errors.join('\n')}`
      );
    }

    return result.data;
  });
}

export function getSourceById(id: string): Source | undefined {
  const sources = loadAllSources();
  return sources.find((s) => s.id === id);
}

export function getAllSourceIds(): string[] {
  return loadAllSources().map((s) => s.id);
}
