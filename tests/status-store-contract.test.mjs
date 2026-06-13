import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const componentDirectory = new URL('../src/谍影迷梦/界面/状态栏/components/', import.meta.url);
const componentNames = ['SystemHeader.vue', 'PlayerPanel.vue', 'CharacterRoster.vue', 'QuestPanel.vue'];

test('status components use the data property exposed by defineMvuDataStore', () => {
  for (const componentName of componentNames) {
    const source = fs.readFileSync(new URL(componentName, componentDirectory), 'utf8');

    assert.ok(source.includes('store.data'), `${componentName} does not read store.data`);
    assert.ok(!source.includes('store.stat_data'), `${componentName} reads a store property that does not exist`);
  }
});
