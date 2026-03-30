import { describe, it, expect } from 'vitest';
import { loadAllSources, getSourceById, getAllSourceIds } from '@/lib/sources';

describe('sources', () => {
  it('loadAllSources returns an array of sources', () => {
    const sources = loadAllSources();
    expect(Array.isArray(sources)).toBe(true);
    expect(sources.length).toBeGreaterThan(0);
  });

  it('loadAllSources returns 12 sources', () => {
    const sources = loadAllSources();
    expect(sources).toHaveLength(12);
  });

  it('every source has an id and nom', () => {
    const sources = loadAllSources();
    for (const source of sources) {
      expect(source.id).toBeTruthy();
      expect(source.nom).toBeTruthy();
    }
  });

  it('getSourceById returns the correct source', () => {
    const source = getSourceById('legi');
    expect(source).toBeDefined();
    expect(source!.id).toBe('legi');
  });

  it('getSourceById returns undefined for unknown id', () => {
    const source = getSourceById('nonexistent');
    expect(source).toBeUndefined();
  });

  it('getAllSourceIds returns all ids', () => {
    const ids = getAllSourceIds();
    expect(ids).toHaveLength(12);
    expect(ids).toContain('legi');
    expect(ids).toContain('data-gouv');
  });
});
