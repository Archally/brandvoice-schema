import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { loadBrandvoice } from './loader.js';

const EXAMPLES_DIR = path.resolve(__dirname, '..', '..', '..', 'examples');

describe('loadBrandvoice', () => {
  it('loads fitness-app example without errors', () => {
    const fitnessPath = path.join(EXAMPLES_DIR, 'fitness-app', '.brandvoice', 'v1.8');
    const result = loadBrandvoice(fitnessPath);
    expect(result.errors).toHaveLength(0);
    expect(result.root.name).toBe('FitPulse');
    expect(result.root.market).toBeDefined();
    expect(result.root.strategy).toBeDefined();
    expect(result.root.activation).toBeDefined();
    expect(result.root.governance).toBeDefined();
  });

  it('loads time-management example without errors', () => {
    const timePath = path.join(EXAMPLES_DIR, 'time-management', '.brandvoice', 'v1.8');
    const result = loadBrandvoice(timePath);
    expect(result.errors).toHaveLength(0);
    expect(result.root.name).toBe('Chronoflow');
  });

  it('composes $ref files into planes', () => {
    const fitnessPath = path.join(EXAMPLES_DIR, 'fitness-app', '.brandvoice', 'v1.8');
    const result = loadBrandvoice(fitnessPath);
    const market = result.root.market as Record<string, unknown>;
    const landscape = market.landscape as Record<string, unknown>;
    expect(Array.isArray(landscape.markets)).toBe(true);
    expect(Array.isArray(landscape.forces)).toBe(true);
  });

  it('tracks composed files', () => {
    const fitnessPath = path.join(EXAMPLES_DIR, 'fitness-app', '.brandvoice', 'v1.8');
    const result = loadBrandvoice(fitnessPath);
    expect(Object.keys(result.files).length).toBeGreaterThan(1);
  });
});
