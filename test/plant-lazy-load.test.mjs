import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const plantPath = path.join(root, 'src', 'view', 'threejs', 'addPlant', 'index.js');
const loaderPath = path.join(root, 'src', 'view', 'threejs', 'addSewageModel', 'index.js');

test('plant assets load lazily only when semantic plants are enabled', () => {
  const source = readFileSync(plantPath, 'utf8');
  const beforeLoaderFunction = source.split(/async\s+function\s+loadPlantModels/)[0];
  assert.doesNotMatch(beforeLoaderFunction, /loadAsync\s*\(/);
  assert.doesNotMatch(source, /shortTree1\.glb|shortTree2\.glb/);
  assert.match(source, /async\s+function\s+addPlant/);
  assert.match(source, /await\s+loadPlantModels\(\)/);
});

test('sewage loader awaits lazy plant setup', () => {
  const source = readFileSync(loaderPath, 'utf8');
  assert.match(source, /await\s+addPlant\(gltf\.scenes\[0\]\)/);
});
