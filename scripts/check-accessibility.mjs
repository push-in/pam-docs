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
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? collectHtml(path) : path.endsWith('.html') ? [path] : [];
    }),
  );

  return files.flat();
}

const failures = [];
const htmlFiles = await collectHtml(outputDirectory);

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const relativeFile = file.replace(outputDirectory, '');
  const redirect = html.match(/<meta\s+http-equiv="refresh"\s+content="\d+;url=([^\"]+)"/i);
  if (redirect) {
    if (!redirect[1].startsWith('/') || redirect[1].startsWith('//')) {
      failures.push(`${relativeFile}: redirect target must be a local absolute path`);
    }
    continue;
  }
  const h1Count = (html.match(/<h1(?:\s|>)/g) ?? []).length;
  const mainCount = (html.match(/<main(?:\s|>)/g) ?? []).length;

  if (h1Count !== 1) failures.push(`${relativeFile}: expected one h1, found ${h1Count}`);
  if (mainCount !== 1) failures.push(`${relativeFile}: expected one main, found ${mainCount}`);
  if (!/<a\b[^>]*class="[^"]*\bsl-skip-link\b[^"]*"[^>]*href="#_top"/.test(html)) {
    failures.push(`${relativeFile}: missing skip link`);
  }
  if (/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(?:[^\d]|$)/i.test(html)) {
    failures.push(`${relativeFile}: viewport prevents browser zoom`);
  }

  for (const image of html.match(/<img\b[^>]*>/g) ?? []) {
    if (!/\balt(?:\s|=|>)/.test(image)) failures.push(`${relativeFile}: image is missing alt`);
    if (!/\bwidth=/.test(image) || !/\bheight=/.test(image)) {
      failures.push(`${relativeFile}: image is missing intrinsic dimensions`);
    }
  }

  for (const button of html.match(/<button\b[^>]*>[\s\S]*?<\/button>/g) ?? []) {
    const openingTag = button.match(/^<button\b[^>]*>/)?.[0] ?? '';
    const text = button.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (!text && !/\baria-label=|\baria-labelledby=|\btitle=/.test(openingTag)) {
      failures.push(`${relativeFile}: button has no accessible name`);
    }
  }
}

const stylesheet = await readFile(new URL('../src/styles/pam.css', import.meta.url), 'utf8');
if (/transition\s*:\s*all\b/i.test(stylesheet)) failures.push('pam.css: avoid transition: all');
if (/outline\s*:\s*none\b/i.test(stylesheet)) failures.push('pam.css: avoid removing focus outlines');

if (failures.length > 0) {
  console.error(`Accessibility validation failed:\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
  process.exit(1);
}

console.log(`Accessibility validation passed for ${htmlFiles.length} HTML files.`);
