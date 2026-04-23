import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

export const loadFixture = (name: string): string => {
  return readFileSync(resolve(here, '../fixtures', name), 'utf8').trim();
};
