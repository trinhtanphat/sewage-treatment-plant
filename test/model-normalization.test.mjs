import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { inferGenericAxisScale } from '../src/view/threejs/modelNormalization.js';

test('converts geodetic lon/lat axes to meters before fitting fallback model', () => {
  const scale = inferGenericAxisScale({
    center: { x: 58.5045, y: 92.6805, z: -23.4702 },
    size: { x: 0.0041084, y: 42.8526, z: 0.0031719 },
  });
  assert.equal(scale.kind, 'geodetic');
  assert.ok(scale.x > 100000 && scale.x < 105000);
  assert.equal(scale.y, 1);
  assert.ok(scale.z > 110000 && scale.z < 112000);
});

test('keeps ordinary cartesian fallback models isotropic', () => {
  const scale = inferGenericAxisScale({
    center: { x: 0, y: 10, z: 0 }, size: { x: 80, y: 20, z: 120 },
  });
  assert.deepEqual(scale, { kind: 'cartesian', x: 1, y: 1, z: 1 });
});

test('generic model fitter applies inferred axis scale before uniform fit', () => {
  const source = fs.readFileSync(new URL('../src/view/threejs/addSewageModel/index.js', import.meta.url), 'utf8');
  assert.match(source, /inferGenericAxisScale/);
  assert.match(source, /root\.scale\.multiply\(new THREE\.Vector3\(axisScale\.x, axisScale\.y, axisScale\.z\)\)/);
});
