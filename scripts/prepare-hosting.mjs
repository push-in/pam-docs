import { access, copyFile, mkdir, writeFile } from 'node:fs/promises';

const distribution = new URL('../dist/', import.meta.url);
const serverEntry = new URL('./server/entry.mjs', distribution);
const hostingDirectory = new URL('./.openai/', distribution);

await access(serverEntry);
await mkdir(hostingDirectory, { recursive: true });
await copyFile(
  new URL('../.openai/hosting.json', import.meta.url),
  new URL('./hosting.json', hostingDirectory),
);
await writeFile(
  new URL('./server/index.js', distribution),
  "import './entry.mjs';\n",
  'utf8',
);

console.log('Prepared the standalone Sites entrypoint and hosting metadata.');
