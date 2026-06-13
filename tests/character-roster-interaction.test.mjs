import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const component = fs.readFileSync(
  new URL('../src/谍影迷梦/界面/状态栏/components/CharacterRoster.vue', import.meta.url),
  'utf8',
);

test('body parts are semantic isolated read-only controls', () => {
  assert.match(component, /<button[\s\S]*?v-for="bodyPart in bodyParts"[\s\S]*?type="button"/);
  assert.match(component, /@click\.stop="selectBodyPart\(char\.key, bodyPart\.key\)"/);
  assert.match(component, /:aria-pressed="isBodyPartSelected\(char\.key, bodyPart\.key\)"/);
  assert.match(component, /selectedBodyParts\.value\[characterKey\]\s*=\s*bodyPartKey/);
  assert.doesNotMatch(component, /store\.data[^\n]*=/, 'body-part interaction must not write MVU data');
});

test('body-part detail displays only an existing name and existing state', () => {
  assert.match(component, /selectedBodyPart\(char\)/);
  assert.match(component, /return bodyPart \? char\.data\.身体状态\[bodyPart\] : undefined;/);
  assert.match(component, /纯洁/);
  assert.match(component, /经验/);
});

test('locked cards are guarded before expansion state changes', () => {
  const toggle = component.match(/function toggleDetail\(char: CharacterView\) \{([\s\S]*?)\n\}/)?.[1];
  assert.ok(toggle, 'toggleDetail implementation not found');
  assert.match(toggle, /^\s*if \(!char\.data\.是否相识\) return;/);
  assert.match(component, /:tabindex="char\.data\.是否相识 \? 0 : undefined"/);
});
