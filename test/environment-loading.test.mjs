import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const viewPath = path.join(root, 'src', 'view', 'threejs', 'index.vue');
const source = readFileSync(viewPath, 'utf8');

test('slow HDR delivery does not block the model scene from rendering', () => {
  const start = source.indexOf('onMounted(async () => {');
  const end = source.indexOf('\n});', start);
  assert.ok(start >= 0 && end > start, 'onMounted block must exist');
  const mounted = source.slice(start, end);

  assert.match(mounted, /const envMapPromise\s*=\s*rgbeLoader\.loadAsync\(["']\.\/envMap\.hdr["']\)/);
  assert.match(mounted, /envMapPromise[\s\S]*\.catch\(/);
  assert.doesNotMatch(mounted, /await\s+rgbeLoader\.loadAsync\(["']\.\/envMap\.hdr["']\)/);

  const modelLoad = mounted.indexOf('sewageModel = await addSewageModel(');
  const renderStart = mounted.indexOf('render();');
  const envWait = mounted.indexOf('await envMapPromise');
  assert.ok(modelLoad >= 0, 'model load must start');
  assert.ok(renderStart > modelLoad, 'render must start after model load');
  assert.ok(envWait > renderStart, 'HDR may be awaited only after the scene starts rendering');
});
