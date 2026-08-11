import { access, readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const distributionDirectory = fileURLToPath(new URL('../dist/', import.meta.url));
const clientDirectory = join(distributionDirectory, 'client');
const outputDirectory = await access(clientDirectory).then(
  () => clientDirectory,
  () => distributionDirectory,
);

async function collectHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? collectHtml(path) : path.endsWith('.html') ? [path] : [];
  }));
  return nested.flat();
}

const failures = [];
const htmlFiles = await collectHtml(outputDirectory);
const required = [
  ['title', /<title>[^<]{10,}<\/title>/],
  ['description', /<meta\s+name="description"\s+content="[^"]{40,}"\s*\/?\s*>/],
  ['canonical URL', /<link\s+rel="canonical"\s+href="https?:\/\/[^\"]+"\s*\/?\s*>/],
  ['Open Graph title', /<meta\s+property="og:title"\s+content="[^"]+"\s*\/?\s*>/],
  ['Open Graph description', /<meta\s+property="og:description"\s+content="[^"]+"\s*\/?\s*>/],
  ['Open Graph URL', /<meta\s+property="og:url"\s+content="https?:\/\/[^\"]+"\s*\/?\s*>/],
  ['Open Graph image', /<meta\s+property="og:image"\s+content="https?:\/\/[^\"]+"\s*\/?\s*>/],
  ['Twitter card', /<meta\s+name="twitter:card"\s+content="summary_large_image"\s*\/?\s*>/],
  ['Twitter image', /<meta\s+name="twitter:image"\s+content="https?:\/\/[^\"]+"\s*\/?\s*>/],
];

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const relativeFile = file.replace(outputDirectory, '');
  if (relativeFile === '/404.html') continue;
  const redirect = html.match(/<meta\s+http-equiv="refresh"\s+content="\d+;url=([^\"]+)"/i);
  if (redirect) {
    if (!redirect[1].startsWith('/') || redirect[1].startsWith('//')) {
      failures.push(`${relativeFile}: redirect target must be a local absolute path`);
    }
    if (!/<meta\s+name="robots"\s+content="noindex"/i.test(html)) {
      failures.push(`${relativeFile}: redirect must be excluded from search indexes`);
    }
    continue;
  }
  for (const [label, pattern] of required) {
    if (!pattern.test(html)) failures.push(`${relativeFile}: missing or invalid ${label}`);
  }
  if ((html.match(/<h1(?:\s|>)/g) ?? []).length !== 1) {
    failures.push(`${relativeFile}: must contain exactly one h1`);
  }
}

for (const asset of ['robots.txt', 'sitemap-index.xml', 'og-pam.png']) {
  await access(join(outputDirectory, asset)).catch(() => failures.push(`/${asset}: missing from build`));
}

if (failures.length) {
  console.error(`SEO validation failed:\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
  process.exit(1);
}

console.log(`SEO validation passed for ${htmlFiles.length} indexable HTML files.`);
