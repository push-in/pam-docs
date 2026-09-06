import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const componentDirectory = join(root, 'src', 'assets', 'mobile-ui', 'components');
const gifDirectory = join(root, 'src', 'assets', 'mobile-ui', 'gifs');
const contract = JSON.parse(
  readFileSync(join(root, 'src', 'data', 'mobile-ui-evidence.json'), 'utf8'),
);

const components = tags(componentDirectory, '.png');
const gifs = tags(gifDirectory, '.gif');
const staticComponents = new Set(contract.staticComponents);
const failures = [];

if (components.size !== contract.expectedComponentCount) {
  failures.push(
    `expected ${contract.expectedComponentCount} component screenshots, found ${components.size}`,
  );
}

for (const tag of staticComponents) {
  if (!components.has(tag)) failures.push(`${tag} is classified as static but has no screenshot`);
  if (gifs.has(tag)) failures.push(`${tag} is static and must not publish a misleading interaction GIF`);
}

for (const tag of components) {
  const image = readFileSync(join(componentDirectory, `${tag}.png`));
  if (!isPng(image)) failures.push(`${tag}.png is not a valid PNG asset`);
  if (!staticComponents.has(tag) && !gifs.has(tag)) {
    failures.push(`${tag} is interactive but has no Android interaction GIF`);
  }
}

for (const tag of gifs) {
  if (!components.has(tag)) failures.push(`${tag}.gif has no matching component screenshot/page`);
  const recording = readFileSync(join(gifDirectory, `${tag}.gif`));
  if (!isGif(recording)) failures.push(`${tag}.gif is not a valid GIF asset`);
}

if (failures.length > 0) {
  console.error(`PAM Native UI evidence contract failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log(
  `PAM Native UI evidence complete: ${components.size}/${contract.expectedComponentCount} screenshots, ` +
    `${components.size - staticComponents.size} interactive GIFs, ${staticComponents.size} static specimens.`,
);

function tags(directory, extension) {
  return new Set(
    readdirSync(directory)
      .filter((name) => name.startsWith('p-') && name.endsWith(extension))
      .map((name) => name.slice(0, -extension.length)),
  );
}

function isPng(buffer) {
  return buffer.length > 24 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
}

function isGif(buffer) {
  if (buffer.length < 13) return false;
  const signature = buffer.subarray(0, 6).toString('ascii');
  return signature === 'GIF87a' || signature === 'GIF89a';
}
