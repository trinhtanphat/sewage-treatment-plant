import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const loaderPath = path.join(root, 'src', 'view', 'threejs', 'addSewageModel', 'index.js');
const viewPath = path.join(root, 'src', 'view', 'threejs', 'index.vue');
const source = (p) => readFileSync(p, 'utf8');

test('loader records capabilities and gates original-only scene augmentation', () => {
  const text = source(loaderPath);
  assert.match(text, /detectModelCapabilities\(gltf\.scenes\[0\]\)/);
  assert.match(text, /model\.userData\.modelCapabilities\s*=\s*capabilities/);
  assert.match(text, /supportsModelFeature\(capabilities, ['"]fence['"]\)/);
  assert.match(text, /supportsModelFeature\(capabilities, ['"]plants['"]\)/);
});

test('view gates semantic-only runtime features for a generic replacement', () => {
  const text = source(viewPath);
  assert.match(text, /modelCapabilities\s*=\s*sewageModel\.userData\.modelCapabilities/);
  assert.match(text, /supportsModelFeature\(modelCapabilities, ['"]water['"]\)/);
  assert.match(text, /supportsModelFeature\(modelCapabilities, ['"]poolMaterial['"]\)/);
  assert.match(text, /supportsModelFeature\(modelCapabilities, ['"]craft['"]\)/);
  assert.match(text, /supportsModelFeature\(modelCapabilities, ['"]inspection['"]\)/);
});