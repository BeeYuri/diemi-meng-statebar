import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const components = new URL('../src/谍影迷梦/界面/状态栏/components/', import.meta.url);
const player = fs.readFileSync(new URL('PlayerPanel.vue', components), 'utf8');
const quest = fs.readFileSync(new URL('QuestPanel.vue', components), 'utf8');

test('player panel preserves every status item and numeric format', () => {
  for (const label of ['特工状态', 'FOLIO 01', '枪械', '潜行', '交际', '观察', '大洋', '青帮', '巡捕房', '/100']) {
    assert.ok(player.includes(label), `player panel lost protected label ${label}`);
  }

  for (const binding of ['持有金钱', '青帮声望', '巡捕房声望']) {
    assert.ok(player.includes(`store.data.主角.${binding}`), `player panel lost ${binding} binding`);
  }
});

test('quest panel preserves the complete main quest bindings and wording', () => {
  for (const label of ['任务与委托', '主线', '剩余', '小时']) {
    assert.ok(quest.includes(label), `quest panel lost protected label ${label}`);
  }

  assert.match(quest, /store\.data\.任务\.当前主线任务/);
  assert.match(quest, /store\.data\.任务\.主线剩余时间/);
});
