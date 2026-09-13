import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const modulePath = path.join(root, 'src', 'view', 'threejs', 'modelCapabilities.js');

function fakeModel(names) {
  const set = new Set(names);
  return { getObjectByName(name) { return set.has(name) ? { name } : undefined; } };
}

async function loadCapabilities() {
  assert.ok(existsSync(modulePath), 'modelCapabilities.js should exist');
  return import(pathToFileURL(modulePath));
}

test('detects the original semantic sewage model from sentinel nodes', async () => {
  const mod = await loadCapabilities();
  const model = fakeModel(mod.originalSentinelNames);
  const capabilities = mod.detectModelCapabilities(model);

  assert.equal(capabilities.kind, 'original');
  assert.equal(capabilities.semantic, true);
  assert.equal(mod.supportsModelFeature(capabilities, 'water'), true);
  assert.equal(mod.supportsModelFeature(capabilities, 'inspection'), true);
});

test('treats a generic replacement as render-only without semantic features', async () => {
  const mod = await loadCapabilities();
  const capabilities = mod.detectModelCapabilities(fakeModel(['Object_2', 'Object_3']));

  assert.equal(capabilities.kind, 'generic');
  assert.equal(capabilities.semantic, false);
  for (const feature of ['water', 'fence', 'plants', 'poolMaterial', 'craft', 'inspection']) {
    assert.equal(mod.supportsModelFeature(capabilities, feature), false);
  }
});

test('generic profile still supports base rendering and safe lookup', async () => {
  const mod = await loadCapabilities();
  const model = fakeModel(['Object_2']);
  const capabilities = mod.detectModelCapabilities(model);

  assert.equal(mod.supportsModelFeature(capabilities, 'render'), true);
  assert.equal(mod.findModelObject(model, 'Object_2')?.name, 'Object_2');
  assert.equal(mod.findModelObject(model, 'missing'), null);
  assert.equal(mod.findModelObject(null, 'missing'), null);
});