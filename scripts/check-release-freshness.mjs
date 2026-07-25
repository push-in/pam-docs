import { readFile } from 'node:fs/promises';

const response = await fetch(
  'https://api.github.com/repos/push-in/pam/releases/latest',
  {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'pam-docs-release-check',
      ...(process.env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : {}),
    },
  },
);

if (!response.ok) {
  throw new Error(
    `GitHub release lookup failed with ${response.status} ${response.statusText}`,
  );
}

const release = await response.json();
const tag = String(release.tag_name ?? '');

if (!/^v\d+\.\d+\.\d+$/.test(tag)) {
  throw new Error(`Unexpected latest release tag: ${JSON.stringify(tag)}`);
}

const version = tag.slice(1);
const files = [
  'astro.config.mjs',
  'src/components/PamHeader.astro',
  'src/content/docs/getting-started/installation.mdx',
  `src/content/docs/project/release-${version.replaceAll('.', '-')}.mdx`,
];

const missing = [];

for (const file of files) {
  let content;

  try {
    content = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
  } catch {
    missing.push(`${file} does not exist`);
    continue;
  }

  if (!content.includes(version)) {
    missing.push(`${file} does not mention ${version}`);
  }
}

if (missing.length > 0) {
  console.error(`Documentation is behind PAM ${tag}:`);
  for (const failure of missing) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Documentation release markers match ${tag}.`);
