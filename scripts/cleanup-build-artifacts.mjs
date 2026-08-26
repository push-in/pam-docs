import { lstat, rm } from 'node:fs/promises';
import { resolve, sep } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const targets = ['dist', '.astro'];

for (const relative of targets) {
  const target = resolve(root, relative);
  if (!target.startsWith(`${root}${sep}`)) {
    throw new Error(`Refusing cleanup outside repository: ${target}`);
  }

  try {
    const metadata = await lstat(target);
    if (metadata.isSymbolicLink()) {
      throw new Error(`Refusing symlinked build artifact root: ${target}`);
    }
  } catch (error) {
    if (error?.code === 'ENOENT') continue;
    throw error;
  }

  await rm(target, { recursive: true });
}

