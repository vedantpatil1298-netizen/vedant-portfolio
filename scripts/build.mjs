import { cp, mkdtemp, rename, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const temp = await mkdtemp(path.join(root, '.portfolio-build-'));
try {
  await cp(path.join(root, 'src'), temp, { recursive: true });
  await rm(path.join(root, 'dist'), { recursive: true, force: true });
  await rename(temp, path.join(root, 'dist'));
  console.log('Production site built in dist/');
} finally {
  await rm(temp, { recursive: true, force: true });
}
