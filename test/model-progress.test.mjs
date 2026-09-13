import test from 'node:test';
import assert from 'node:assert/strict';

async function loadProgressHelper() {
  try {
    return await import('../src/view/threejs/modelProgress.js');
  } catch (error) {
    assert.fail(`model progress helper must exist: ${error.message}`);
  }
}

test('model progress never reports a premature 100 percent', async () => {
  const { getModelLoadPercent } = await loadProgressHelper();
  assert.equal(getModelLoadPercent(25, 100), 25);
  assert.equal(getModelLoadPercent(100, 100), 99.9);
});

test('model progress becomes indeterminate when transfer totals are unreliable', async () => {
  const { getModelLoadPercent } = await loadProgressHelper();
  assert.equal(getModelLoadPercent(150, 100), null);
  assert.equal(getModelLoadPercent(10, 0), null);
  assert.equal(getModelLoadPercent(Number.NaN, 100), null);
});

import { readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const loaderSource = readFileSync(
  path.join(root, 'src', 'view', 'threejs', 'addSewageModel', 'index.js'),
  'utf8',
);

test('loader uses safe progress and reserves 100 percent for successful GLTF load', () => {
  assert.match(loaderSource, /getModelLoadPercent\(xhr\.loaded, xhr\.total\)/);
  assert.match(loaderSource, /percent\s*===\s*null[\s\S]*模型加载中/);
  assert.match(loaderSource, /progressDiv\.style\.width\s*=\s*['"]100%['"]/);
  assert.match(loaderSource, /progressText\.innerHTML\s*=\s*`项目正在初始化`/);
});
