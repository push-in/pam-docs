import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = join(root, 'dist');

if (!existsSync(output)) {
  console.error('The dist directory does not exist. Run npm run build first.');
  process.exit(1);
}

const htmlFiles = walk(output).filter((file) => extname(file) === '.html');
const failures = [];
let inspectedLinks = 0;

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const links = html.matchAll(/\bhref=(?:"([^"]+)"|'([^']+)')/g);

  for (const match of links) {
    const href = match[1] ?? match[2];

    if (
      !href.startsWith('/') ||
      href.startsWith('//') ||
      href.startsWith('/_')
    ) {
      continue;
    }

    inspectedLinks++;

    const url = new URL(href, 'https://pam.dev');
    const pathname = decodeURIComponent(url.pathname);
    const target = resolveTarget(output, pathname);

    if (!target) {
      failures.push({
        source: relative(output, file),
        href,
      });
    }
  }
}

if (failures.length > 0) {
  console.error(`Found ${failures.length} broken internal link(s):`);
  for (const failure of failures) {
    console.error(`- ${failure.source}: ${failure.href}`);
  }
  process.exit(1);
}

console.log(
  `Checked ${inspectedLinks} internal links across ${htmlFiles.length} HTML files.`,
);

function resolveTarget(directory, pathname) {
  const cleanPath = pathname.replace(/^\/+/, '');
  const candidates = pathname.endsWith('/')
    ? [join(directory, cleanPath, 'index.html')]
    : [
        join(directory, cleanPath),
        join(directory, `${cleanPath}.html`),
        join(directory, cleanPath, 'index.html'),
      ];

  return candidates.find((candidate) => existsSync(candidate));
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}
