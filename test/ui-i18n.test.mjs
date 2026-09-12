import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (file) => readFileSync(path.join(root, file), 'utf8');
const template = (file) => {
  const source = read(file);
  const match = source.match(/<template>([\s\S]*?)<\/template>/);
  return (match?.[1] ?? '').replace(/<!--[\s\S]*?-->/g, '');
};

test('Vue app installs a shared i18n instance', () => {
  assert.ok(existsSync(path.join(root, 'src/i18n/index.js')));
  assert.match(read('src/main.js'), /app\.use\(i18n\)/);
  assert.match(read('src/i18n/index.js'), /createI18n/);
});

test('primary user-facing templates use translations instead of hard-coded Chinese', () => {
  const cases = [
    ['src/view/shouye/index.vue', ['污水处理厂智能数字孪生平台', '电耗情况', '水质实时数据', '报警信息', '历史数据', '工艺辅助']],
    ['src/view/shouye/craftAssist.vue', ['精确曝气', '精确加药', '污泥回流', '设备名称', '模拟值', '实际值']],
    ['src/view/shouye/historyData.vue', ['查询']],
    ['src/view/threejs/index.vue', ['介绍', '数据记录', '返回', '暂停', '继续']],
    ['src/view/threejs/progressBar/index.vue', ['巡检进度']],
    ['src/view/threejs/speedControlBar/index.vue', ['巡检速度']],
    ['src/view/threejs/label/index.vue', ['巡检员: 小王', '建筑标签']],
  ];
  for (const [file, forbidden] of cases) {
    const markup = template(file);
    for (const text of forbidden) {
      assert.equal(markup.includes(text), false, `${file} still hard-codes ${text}`);
    }
  }
});

test('Three.js model lookup keys remain unchanged', () => {
  const model = read('src/view/threejs/addSewageModel/index.js');
  const scene = read('src/view/threejs/index.vue');
  assert.match(model, /污水厂模型/);
  assert.match(scene, /南北生物池水面/);
  assert.match(scene, /东西生物池-东水面1/);
});


test('dynamic process and inspection content is localized without changing internal keys', () => {
  const craft = read('src/view/shouye/craftAssist.vue');
  const inspection = read('src/view/threejs/inspection/index.js');

  assert.match(craft, /craftDevices\.westAerationFanFrequency/);
  assert.match(craft, /\$t\(item\[0\]\)/);
  assert.equal(craft.includes('["西侧曝气风机算法频率给定"'), false);

  assert.match(inspection, /i18n\.global\.t/);
  assert.match(inspection, /labelKey/);
  assert.match(inspection, /describeKey/);
  assert.match(inspection, /'曝气池': \[/);
  assert.match(inspection, /'鼓风机房': \[/);
});
