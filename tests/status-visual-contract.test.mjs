import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const root = new URL('../src/谍影迷梦/界面/状态栏/', import.meta.url);
const globalCss = fs.readFileSync(new URL('global.css', root), 'utf8');
const app = fs.readFileSync(new URL('App.vue', root), 'utf8');
const header = fs.readFileSync(new URL('components/SystemHeader.vue', root), 'utf8');

test('ledger frontend uses the approved palette and typography', () => {
  for (const token of ['#EEE4CF', '#F7F0DF', '#40505A', '#282722', '#746C5F', '#8F3030', '#A98B50', '#416756']) {
    assert.ok(globalCss.toUpperCase().includes(token), `missing approved color ${token}`);
  }

  assert.match(globalCss, /Microsoft YaHei UI/);
  assert.match(globalCss, /YouYuan/);
  assert.match(globalCss, /Cascadia Mono/);
  assert.match(globalCss, /prefers-reduced-motion:\s*reduce/);
});

test('ledger shell uses the approved identity without generic dossier decoration', () => {
  assert.match(app, /class="ledger-page"/);
  assert.match(app, /静安书局/);
  assert.match(app, /藏书/);
  assert.doesNotMatch(app, /TOP SECRET/i);
  assert.match(app, /max-width:\s*720px/);
});

test('system header preserves system bindings and adds only decorative ledger wording', () => {
  assert.match(header, /静安书局/);
  assert.match(header, /内部借阅簿/);
  assert.match(header, /store\.data\.系统\.当前时间/);
  assert.match(header, /store\.data\.系统\.当前地点/);
  assert.match(header, /store\.data\.系统\.警觉度/);
  assert.match(header, /警觉度/);
});
