import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const docs = join(root, 'src', 'content', 'docs');
const requiredRepositories = [
  'pam',
  'pam-http',
  'pam-contracts',
  'pam-desktop',
  'pam-docs',
  'pam-laravel',
  'pam-native-ui',
  'pam-native-ui-php',
  'pam-native',
  'pam-native-auth',
  'pam-native-background-transfer',
  'pam-native-bluetooth',
  'pam-native-devtools',
  'pam-native-feature-flags',
  'pam-native-firebase',
  'pam-native-health',
  'pam-native-intents',
  'pam-native-sync-laravel',
  'pam-native-live-activities',
  'pam-native-maps',
  'pam-native-media',
  'pam-native-nfc',
  'pam-native-nitro',
  'pam-native-observability',
  'pam-native-payments',
  'pam-native-php',
  'pam-native-plugin-kit',
  'pam-native-realtime',
  'pam-native-scanner',
  'pam-native-share-extension',
  'pam-native-subscriptions',
  'pam-native-sync',
  'pam-native-testing',
  'pam-native-video',
  'pam-native-widgets',
  'pam-psr',
  'pam-skeleton',
  'pam-socket',
  'pam-testing',
];
const compatibilityRepositories = [
  'pam-api',
  'pam-core-api',
  'pam-mobile-ui',
  'pam-native-laravel-sync',
  'pam-psr-bridge',
];
const documentedRepositories = [
  ...requiredRepositories,
  ...compatibilityRepositories,
];

const mapPath = join(docs, 'project', 'repository-map.mdx');
if (!existsSync(mapPath)) {
  throw new Error('The public repository map is missing.');
}

const map = readFileSync(mapPath, 'utf8');
const missing = documentedRepositories.filter(
  (repository) => !map.includes(`\`${repository}\``),
);

if (missing.length > 0) {
  console.error(`Repositories missing from the public map: ${missing.join(', ')}`);
  process.exit(1);
}

const allDocs = walk(docs)
  .filter((path) => extname(path) === '.mdx')
  .map((path) => readFileSync(path, 'utf8'))
  .join('\n');

const undocumented = documentedRepositories.filter(
  (repository) => !allDocs.includes(repository),
);

if (undocumented.length > 0) {
  console.error(`Repositories absent from documentation: ${undocumented.join(', ')}`);
  process.exit(1);
}

console.log(`${requiredRepositories.length} canonical and ${compatibilityRepositories.length} compatibility repositories have documentation ownership.`);

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}
