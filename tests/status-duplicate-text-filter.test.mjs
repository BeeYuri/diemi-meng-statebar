import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const cardRoot = new URL('../../cards/谍影迷梦/', import.meta.url);
const state = JSON.parse(fs.readFileSync(new URL('tavern-cards-state.json', cardRoot), 'utf8'));
const opening = fs.readFileSync(new URL('开场白/0.txt', cardRoot), 'utf8');

function compileSerializedRegex(serialized) {
  const match = serialized.match(/^\/([\s\S]*)\/([dgimsuvy]*)$/);
  assert.ok(match, `invalid serialized regex: ${serialized}`);
  return new RegExp(match[1], match[2]);
}

test('plain text status is hidden only from Markdown display', () => {
  const script = state.regex_scripts['隐藏文字状态栏'];
  assert.ok(script, 'missing display-only duplicate status filter');
  assert.equal(script.markdownOnly, true);
  assert.equal(script.promptOnly, false);
  assert.deepEqual(script.placement, [2]);
  assert.equal(script.replaceString, '');

  const rendered = opening.replace(compileSerializedRegex(script.findRegex), script.replaceString);
  assert.match(rendered, /我相信你的能力，同志。组织也相信你/);
  assert.match(rendered, /<StatusPlaceHolderImpl\/>/);
  assert.doesNotMatch(rendered, /🕒 1938年10月12日/);
  assert.doesNotMatch(rendered, /🔫枪械:15/);
  assert.doesNotMatch(rendered, /❤️ 好感度: 12\/100/);
});
