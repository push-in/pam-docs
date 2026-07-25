import { copyFile, mkdir, readdir, rename, writeFile } from 'node:fs/promises';

const distribution = new URL('../dist/', import.meta.url);
const clientDirectory = new URL('./client/', distribution);
const serverDirectory = new URL('./server/', distribution);
const hostingDirectory = new URL('./.openai/', distribution);

await mkdir(clientDirectory, { recursive: true });
for (const entry of await readdir(distribution, { withFileTypes: true })) {
  if (['client', 'server', '.openai'].includes(entry.name)) continue;
  await rename(
    new URL(`./${entry.name}`, distribution),
    new URL(`./${entry.name}`, clientDirectory),
  );
}

await mkdir(serverDirectory, { recursive: true });
await mkdir(hostingDirectory, { recursive: true });
await copyFile(
  new URL('../.openai/hosting.json', import.meta.url),
  new URL('./hosting.json', hostingDirectory),
);
await writeFile(
  new URL('./server/index.js', distribution),
  `export default {
  fetch(request, environment) {
    return environment.ASSETS.fetch(request);
  },
};
`,
  'utf8',
);

console.log('Prepared the static Sites asset worker and hosting metadata.');
