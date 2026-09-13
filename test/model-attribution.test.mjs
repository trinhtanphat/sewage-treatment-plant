import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const attributionPath = path.join(root, 'public', 'AL_AMERAT_STP_ATTRIBUTION.txt');
const readmePath = path.join(root, 'README.md');

test('ships attribution for the CC BY fallback model', () => {
  assert.ok(existsSync(attributionPath), 'public attribution file should exist');
  const text = readFileSync(attributionPath, 'utf8');
  assert.match(text, /AL AMERAT STP 03FEB2018/i);
  assert.match(text, /moh\.mag\.omar/i);
  assert.match(text, /CC[- ]BY[- ]4\.0/i);
  assert.match(text, /05a5be48805b414bb86bde27bc9eca1c/i);
});

test('documents that the CC BY asset is a fallback replacement', () => {
  const text = readFileSync(readmePath, 'utf8');
  assert.match(text, /replacement|fallback/i);
  assert.match(text, /AL AMERAT STP 03FEB2018/i);
  assert.match(text, /CC BY 4\.0/i);
});