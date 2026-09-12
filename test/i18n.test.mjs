import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const messagesPath = path.join(root, 'src', 'i18n', 'messages.js');

test('ships vi/en/zh translations with Vietnamese as the default locale', async () => {
  assert.ok(existsSync(messagesPath), 'src/i18n/messages.js should exist');

  const mod = await import(pathToFileURL(messagesPath));
  assert.deepEqual(mod.supportedLocales, ['vi', 'en', 'zh-CN']);
  assert.equal(mod.defaultLocale, 'vi');
  assert.equal(mod.normalizeLocale('vi-VN'), 'vi');
  assert.equal(mod.normalizeLocale('en-US'), 'en');
  assert.equal(mod.normalizeLocale('zh-TW'), 'zh-CN');
  assert.equal(mod.normalizeLocale('fr-FR'), 'vi');
  assert.match(mod.messages.vi.app.title, /Nước thải|nước thải/);
  assert.match(mod.messages.en.app.title, /Wastewater/i);
  assert.match(mod.messages['zh-CN'].app.title, /污水/);
});

test('prefers a saved locale and falls back to browser language', async () => {
  const mod = await import(pathToFileURL(messagesPath));
  const storage = {
    getItem(key) {
      return key === 'sewage-locale' ? 'en' : null;
    },
  };

  assert.equal(mod.resolveInitialLocale(storage, 'vi-VN'), 'en');
  assert.equal(mod.resolveInitialLocale({ getItem: () => null }, 'en-US'), 'en');
  assert.equal(mod.resolveInitialLocale({ getItem: () => null }, 'fr-FR'), 'vi');
});
