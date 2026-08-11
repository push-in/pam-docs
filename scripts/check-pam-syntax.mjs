import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative, resolve, sep } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const content = join(root, 'src', 'content', 'docs');
const failures = [];
const explicitCurrentDirectory = /\bpam\b[^\n`]*\s+\.(?=\s*(?:\\|`|$)|\s+--)/;
const directComposerCommand = /^\s*composer\s+(?:install|update|require|remove|audit|test|benchmark)\b/;

for (const example of [
  'pam desktop doctor .',
  'pam desktop dev .',
  'pam desktop build .',
  'pam dev . --host 0.0.0.0',
]) {
  if (!explicitCurrentDirectory.test(example)) {
    throw new Error(`PAM syntax detector does not reject: ${example}`);
  }
}

for (const example of ['composer require vendor/package', 'composer install']) {
  if (!directComposerCommand.test(example)) {
    throw new Error(`Composer syntax detector does not reject: ${example}`);
  }
}

for (const file of walk(content).filter((path) => extname(path) === '.mdx')) {
  const source = readFileSync(file, 'utf8');
  const lines = source.split('\n');

  lines.forEach((line, index) => {
    const legacyDirective = line.match(/\bv-(?:for|if|else-if|else|show|bind|on)\b/);
    if (legacyDirective) {
      failures.push({
        file,
        line: index + 1,
        message: `legacy directive ${legacyDirective[0]}; use p-*`,
      });
    }

    if (explicitCurrentDirectory.test(line)) {
      failures.push({
        file,
        line: index + 1,
        message: 'explicit current-directory argument; PAM uses it implicitly',
      });
    }

    if (directComposerCommand.test(line)) {
      failures.push({
        file,
        line: index + 1,
        message: 'direct Composer command; execute it through pam composer',
      });
    }
  });
}

if (failures.length > 0) {
  console.error('PAM documentation syntax validation failed:');
  for (const failure of failures) {
    const path = relative(root, failure.file).split(sep).join('/');
    console.error(`- ${path}:${failure.line}: ${failure.message}`);
  }
  process.exit(1);
}

console.log('PAM examples use p-* directives and implicit project paths.');

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}
