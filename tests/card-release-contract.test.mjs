import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { materializeRegexScripts, paths } from '../scripts/package-jing-an-card.mjs';

test('release materializes every regex file reference for SillyTavern', () => {
  const scripts = materializeRegexScripts();
  const names = scripts.map(script => script.scriptName);

  assert.deepEqual(names, [
    '对AI隐藏状态栏',
    '隐藏文字状态栏',
    '状态栏界面',
    '对AI隐藏变量更新',
    '变量更新中美化',
    '变量更新美化',
  ]);
  assert.ok(scripts.every(script => !('replace_file' in script)));

  const status = scripts.find(script => script.scriptName === '状态栏界面');
  assert.equal(status.replaceString, fs.readFileSync(paths.statusReplacement, 'utf8'));
  assert.match(status.replaceString, /^```html\r?\n/);
  assert.match(status.replaceString, /\r?\n```\s*$/);
});
