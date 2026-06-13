import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const replacementPath = new URL('../../cards/谍影迷梦/正则/状态栏界面.html', import.meta.url);

test('status frontend is fenced so SillyTavern markdown does not rewrite its CSS', () => {
  const replacement = fs.readFileSync(replacementPath, 'utf8');
  const match = replacement.match(/^```html\r?\n([\s\S]*?)\r?\n```\s*$/);

  assert.ok(match, 'status replacement must be an html code block for Tavern Helper rendering');
  assert.match(match[1], /<head>[\s\S]*<\/head>/);
  assert.match(match[1], /<body>[\s\S]*<\/body>/);
});
