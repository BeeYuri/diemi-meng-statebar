# Jing An Ledger Status Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the 《谍影迷梦》 status frontend as the approved “静安书局内部借阅账页”, restore read-only body-part interaction, hide the duplicated plain-text status only in Markdown display, and publish a verified SillyTavern PNG without changing story text, status data, or MVU business behavior.

**Architecture:** Keep the existing Vue 3 component boundary and `store.data` bindings, using CSS-only paper texture and component-local presentation. Treat duplicate text suppression as a separate SillyTavern regex concern, then use a small release utility to fence the production HTML and synchronize the materialized regex array into both PNG metadata chunks.

**Tech Stack:** Vue 3 SFC, TypeScript, SCSS/CSS, Pinia/MVU store, Node.js built-in test runner, Webpack, SillyTavern regex scripts, PNG `tEXt` chunks.

---

## File Map

- Modify `src/谍影迷梦/界面/状态栏/App.vue`: ledger shell, paper treatment, and bookplate mark.
- Modify `src/谍影迷梦/界面/状态栏/global.css`: approved palette, typography, reset, and reduced-motion behavior.
- Modify `src/谍影迷梦/界面/状态栏/components/SystemHeader.vue`: book-ledger masthead with existing system values.
- Modify `src/谍影迷梦/界面/状态栏/components/PlayerPanel.vue`: `FOLIO 01`, skills, and resources.
- Modify `src/谍影迷梦/界面/状态栏/components/CharacterRoster.vue`: `FOLIO 02`, known/unknown behavior, and per-character body-part selection.
- Modify `src/谍影迷梦/界面/状态栏/components/QuestPanel.vue`: ledger-style main quest annotation.
- Create `tests/status-visual-contract.test.mjs`: visual tokens, decorative wording, and protected layout contract.
- Create `tests/status-content-contract.test.mjs`: protected labels, bindings, and status value formatting.
- Create `tests/character-roster-interaction.test.mjs`: semantic buttons, event isolation, read-only behavior, and locked-card guard.
- Create `tests/status-duplicate-text-filter.test.mjs`: display-only duplicate status removal against the real opening message.
- Create `tests/card-release-contract.test.mjs`: regex materialization contract for the release utility.
- Create `scripts/package-jing-an-card.mjs`: copy/fence built HTML and update `chara` plus `ccv3` safely.
- Modify `../cards/谍影迷梦/tavern-cards-state.json`: add one Markdown-only regex entry; do not edit any existing entry.
- Generated `../cards/谍影迷梦/正则/状态栏界面.html`: fenced production frontend.
- Generated `../cards/谍影迷梦/谍影迷梦.png`: final importable card artifact.
- Never modify `../cards/谍影迷梦/开场白/0.txt`, `src/谍影迷梦/schema.ts`, `src/谍影迷梦/界面/状态栏/store.ts`, or `src/谍影迷梦/界面/状态栏/index.ts`.

### Task 1: Establish the ledger frame and system header

**Files:**
- Create: `tests/status-visual-contract.test.mjs`
- Modify: `src/谍影迷梦/界面/状态栏/global.css`
- Modify: `src/谍影迷梦/界面/状态栏/App.vue`
- Modify: `src/谍影迷梦/界面/状态栏/components/SystemHeader.vue`

- [ ] **Step 1: Write the failing visual contract test**

```js
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
```

- [ ] **Step 2: Run the new test and confirm the legacy dossier fails it**

Run:

```powershell
node --test tests/status-visual-contract.test.mjs
```

Expected: FAIL for missing approved colors or `ledger-page`, and for the existing `TOP SECRET` decoration.

- [ ] **Step 3: Replace the global design tokens**

Replace `src/谍影迷梦/界面/状态栏/global.css` with:

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --paper: #eee4cf;
  --paper-light: #f7f0df;
  --book-blue: #40505a;
  --ink: #282722;
  --ink-muted: #746c5f;
  --annotation-red: #8f3030;
  --brass: #a98b50;
  --jade: #416756;
  --line: rgba(92, 78, 57, 0.28);
  --line-soft: rgba(92, 78, 57, 0.14);
  --shadow: rgba(43, 38, 29, 0.22);

  --font-body: 'Microsoft YaHei UI', 'Microsoft YaHei', 'PingFang SC', sans-serif;
  --font-display: 'YouYuan', 'Microsoft YaHei UI', 'Microsoft YaHei', 'PingFang SC', sans-serif;
  --font-data: 'Cascadia Mono', 'Consolas', monospace;
}

html,
body {
  width: 100%;
  min-width: 0;
  background: transparent;
  color: var(--ink);
  font-family: var(--font-body);
}

body {
  overflow-x: hidden;
  padding: 6px;
}

button {
  color: inherit;
  font: inherit;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

- [ ] **Step 4: Replace the dossier shell with the approved ledger shell**

Replace `src/谍影迷梦/界面/状态栏/App.vue` with:

```vue
<template>
  <main class="ledger-shell" aria-label="谍影迷梦状态栏">
    <div class="ledger-page">
      <SystemHeader />
      <PlayerPanel />
      <CharacterRoster />
      <QuestPanel />
      <div class="bookplate" aria-hidden="true">
        <span>静安书局</span>
        <small>藏书</small>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import CharacterRoster from './components/CharacterRoster.vue';
import PlayerPanel from './components/PlayerPanel.vue';
import QuestPanel from './components/QuestPanel.vue';
import SystemHeader from './components/SystemHeader.vue';
</script>

<style lang="scss" scoped>
.ledger-shell {
  width: 100%;
  min-width: 0;
}

.ledger-page {
  position: relative;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  overflow: hidden;
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 13px;
  line-height: 1.55;
  background:
    linear-gradient(rgba(92, 78, 57, 0.035) 1px, transparent 1px) 0 10px / 100% 27px,
    radial-gradient(circle at 18% 10%, rgba(255, 255, 255, 0.48), transparent 28%),
    linear-gradient(135deg, var(--paper-light), var(--paper) 58%, #e6dac2);
  border: 1px solid rgba(78, 67, 51, 0.56);
  border-radius: 3px;
  box-shadow:
    0 10px 24px var(--shadow),
    inset 0 0 30px rgba(86, 70, 46, 0.08),
    inset 0 0 0 3px rgba(255, 255, 255, 0.24);
}

.bookplate {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin: 0 14px 13px auto;
  padding: 4px 7px;
  color: rgba(143, 48, 48, 0.78);
  font-family: var(--font-display);
  border: 1px solid rgba(143, 48, 48, 0.52);
  box-shadow: inset 0 0 0 2px rgba(143, 48, 48, 0.08);
  transform: rotate(-1.5deg);
}

.bookplate span {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.bookplate small {
  font-size: 0.58rem;
  letter-spacing: 0.15em;
}

@media (max-width: 480px) {
  .ledger-page {
    font-size: 12.5px;
  }
}
</style>
```

- [ ] **Step 5: Implement the book-ledger system header**

Replace `src/谍影迷梦/界面/状态栏/components/SystemHeader.vue` with:

```vue
<template>
  <header class="ledger-header">
    <div class="header-mast">
      <div class="title-group">
        <span class="shop-name">静安书局</span>
        <strong>内部借阅簿</strong>
      </div>
      <div class="alert-chip" :class="`alert-${store.data.系统.警觉度}`">
        <span>警觉度</span>
        <strong>{{ store.data.系统.警觉度 }}</strong>
      </div>
    </div>
    <div class="header-meta">
      <div class="location-line">
        <span class="location-mark" aria-hidden="true">◆</span>
        <span>{{ store.data.系统.当前地点 }}</span>
      </div>
      <time>{{ store.data.系统.当前时间 }}</time>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.ledger-header {
  color: var(--paper-light);
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.06), transparent 42%),
    var(--book-blue);
  border-bottom: 2px solid var(--brass);
  box-shadow: inset 0 -1px rgba(31, 37, 40, 0.45);
}

.header-mast,
.header-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.header-mast {
  padding: 10px 13px 7px;
}

.title-group {
  display: flex;
  min-width: 0;
  align-items: baseline;
  gap: 9px;
  font-family: var(--font-display);
}

.shop-name {
  color: #ead7aa;
  font-size: 0.74rem;
  letter-spacing: 0.12em;
}

.title-group strong {
  font-size: 1rem;
  letter-spacing: 0.08em;
}

.alert-chip {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 6px;
  padding: 3px 7px;
  font-size: 0.68rem;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 2px;
}

.alert-chip strong {
  font-family: var(--font-display);
  font-size: 0.78rem;
}

.alert-低 {
  background: var(--jade);
}

.alert-中 {
  color: var(--ink);
  background: #c8aa68;
}

.alert-高 {
  background: var(--annotation-red);
}

.header-meta {
  padding: 7px 13px 9px;
  color: rgba(247, 240, 223, 0.88);
  font-size: 0.73rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.location-line {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  gap: 6px;
}

.location-mark {
  color: #d6b766;
  font-size: 0.62rem;
  transform: translateY(0.18em);
}

time {
  flex: 0 0 auto;
  color: #efd9a5;
  font-family: var(--font-data);
  font-size: 0.7rem;
}

@media (max-width: 480px) {
  .header-mast,
  .header-meta {
    align-items: flex-start;
  }

  .header-meta {
    flex-direction: column;
    gap: 4px;
  }

  time {
    align-self: flex-end;
  }
}
</style>
```

- [ ] **Step 6: Run the visual contract and existing store contract**

Run:

```powershell
node --test tests/status-visual-contract.test.mjs tests/status-store-contract.test.mjs
```

Expected: 4 tests PASS.

- [ ] **Step 7: Commit the ledger frame**

```powershell
git add tests/status-visual-contract.test.mjs src/谍影迷梦/界面/状态栏/global.css src/谍影迷梦/界面/状态栏/App.vue src/谍影迷梦/界面/状态栏/components/SystemHeader.vue
git commit -m "feat: 建立静安书局账页状态栏框架"
```

### Task 2: Restyle player and quest panels without changing status content

**Files:**
- Create: `tests/status-content-contract.test.mjs`
- Modify: `src/谍影迷梦/界面/状态栏/components/PlayerPanel.vue`
- Modify: `src/谍影迷梦/界面/状态栏/components/QuestPanel.vue`

- [ ] **Step 1: Write the failing content-protection test**

```js
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
```

- [ ] **Step 2: Run the test and confirm `FOLIO 01` is missing**

Run:

```powershell
node --test tests/status-content-contract.test.mjs
```

Expected: FAIL with `player panel lost protected label FOLIO 01`.

- [ ] **Step 3: Implement the player ledger section**

Replace `src/谍影迷梦/界面/状态栏/components/PlayerPanel.vue` with:

```vue
<template>
  <section class="ledger-section player-panel">
    <div class="section-heading">
      <h2>特工状态</h2>
      <span>FOLIO 01</span>
    </div>
    <div class="skills-grid">
      <div v-for="skill in skills" :key="skill.key" class="skill-row">
        <span class="skill-icon" aria-hidden="true">{{ skill.icon }}</span>
        <span class="skill-name">{{ skill.label }}</span>
        <div class="meter" aria-hidden="true">
          <div
            class="meter-fill"
            :style="{ width: `${store.data.主角[skill.key] ?? 0}%`, backgroundColor: skill.color }"
          ></div>
        </div>
        <span class="skill-value">{{ store.data.主角[skill.key] }}/100</span>
      </div>
    </div>
    <div class="resource-strip">
      <span class="money"><b aria-hidden="true">💰</b>{{ store.data.主角.持有金钱 }} 大洋</span>
      <span><b>青帮</b>{{ store.data.主角.青帮声望 }}/100</span>
      <span><b>巡捕房</b>{{ store.data.主角.巡捕房声望 }}/100</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
const skills = [
  { key: '枪械', icon: '🔫', label: '枪械', color: 'var(--annotation-red)' },
  { key: '潜行', icon: '🤫', label: '潜行', color: 'var(--book-blue)' },
  { key: '交际', icon: '🤝', label: '交际', color: 'var(--brass)' },
  { key: '观察', icon: '👁️', label: '观察', color: 'var(--jade)' },
] as const;
</script>

<style lang="scss" scoped>
.ledger-section {
  padding: 12px 14px;
  border-bottom: 1px solid var(--line);
}

.section-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 9px;
}

.section-heading h2 {
  color: var(--book-blue);
  font-family: var(--font-display);
  font-size: 0.92rem;
  letter-spacing: 0.06em;
}

.section-heading span {
  color: var(--brass);
  font-family: var(--font-data);
  font-size: 0.62rem;
  letter-spacing: 0.12em;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px 16px;
}

.skill-row {
  display: grid;
  grid-template-columns: 18px 32px minmax(48px, 1fr) 50px;
  align-items: center;
  gap: 5px;
  min-width: 0;
}

.skill-icon {
  font-size: 0.78rem;
  filter: saturate(0.78);
}

.skill-name {
  color: var(--ink-muted);
  font-size: 0.72rem;
}

.meter {
  height: 5px;
  overflow: hidden;
  background: rgba(70, 62, 50, 0.12);
  border-radius: 2px;
  box-shadow: inset 0 1px 2px rgba(62, 52, 39, 0.14);
}

.meter-fill {
  height: 100%;
  transition: width 180ms ease;
}

.skill-value {
  color: var(--ink-muted);
  font-family: var(--font-data);
  font-size: 0.66rem;
  text-align: right;
}

.resource-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 5px 18px;
  margin-top: 10px;
  padding: 7px 9px;
  color: var(--ink-muted);
  font-family: var(--font-data);
  font-size: 0.68rem;
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid var(--line-soft);
}

.resource-strip b {
  margin-right: 6px;
  color: var(--book-blue);
  font-family: var(--font-body);
  font-weight: 700;
}

.money {
  color: var(--ink);
}

@media (max-width: 480px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>
```

- [ ] **Step 4: Implement the quest annotation without shortening its text**

Replace `src/谍影迷梦/界面/状态栏/components/QuestPanel.vue` with:

```vue
<template>
  <section class="quest-panel">
    <div class="quest-heading">
      <h2>任务与委托</h2>
    </div>
    <div class="main-quest">
      <span class="quest-tag">主线</span>
      <div class="quest-copy">
        <strong>{{ store.data.任务.当前主线任务 }}</strong>
        <span>剩余 {{ store.data.任务.主线剩余时间 }} 小时</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.quest-panel {
  padding: 12px 14px 10px;
}

.quest-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.quest-heading h2 {
  color: var(--book-blue);
  font-family: var(--font-display);
  font-size: 0.88rem;
  letter-spacing: 0.05em;
}

.main-quest {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 8px 10px;
  background: linear-gradient(90deg, rgba(143, 48, 48, 0.08), transparent 78%);
  border-left: 3px solid var(--annotation-red);
}

.quest-tag {
  flex: 0 0 auto;
  padding: 1px 6px;
  color: var(--paper-light);
  font-size: 0.64rem;
  font-weight: 700;
  background: var(--annotation-red);
  border-radius: 2px;
}

.quest-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}

.quest-copy strong {
  overflow-wrap: anywhere;
  font-size: 0.75rem;
  font-weight: 700;
}

.quest-copy span {
  color: var(--annotation-red);
  font-family: var(--font-data);
  font-size: 0.65rem;
}
</style>
```

- [ ] **Step 5: Run content and store tests**

Run:

```powershell
node --test tests/status-content-contract.test.mjs tests/status-store-contract.test.mjs
```

Expected: 3 tests PASS.

- [ ] **Step 6: Commit the status content panels**

```powershell
git add tests/status-content-contract.test.mjs src/谍影迷梦/界面/状态栏/components/PlayerPanel.vue src/谍影迷梦/界面/状态栏/components/QuestPanel.vue
git commit -m "feat: 重塑特工与任务账页"
```

### Task 3: Restore body-part interaction and known-card behavior

**Files:**
- Create: `tests/character-roster-interaction.test.mjs`
- Modify: `src/谍影迷梦/界面/状态栏/components/CharacterRoster.vue`

- [ ] **Step 1: Write the failing interaction contract**

```js
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
```

- [ ] **Step 2: Run the test and confirm the current spans and unguarded toggle fail**

Run:

```powershell
node --test tests/character-roster-interaction.test.mjs
```

Expected: FAIL because body parts are spans and `toggleDetail` lacks the acquaintance guard.

- [ ] **Step 3: Implement the complete roster interaction and ledger presentation**

Replace `src/谍影迷梦/界面/状态栏/components/CharacterRoster.vue` with:

```vue
<template>
  <section class="roster">
    <div class="section-heading">
      <h2>人物档案</h2>
      <span>FOLIO 02</span>
    </div>
    <div class="char-grid">
      <article
        v-for="char in characters"
        :key="char.key"
        class="char-card"
        :class="{
          'char-known': char.data.是否相识,
          'char-active': char.data.是否相识 && char.data.好感度 >= 50,
          'char-expanded': expanded === char.key,
        }"
        :role="char.data.是否相识 ? 'button' : undefined"
        :tabindex="char.data.是否相识 ? 0 : undefined"
        :aria-expanded="char.data.是否相识 ? expanded === char.key : undefined"
        @click="toggleDetail(char)"
        @keydown.enter.prevent="toggleDetail(char)"
        @keydown.space.prevent="toggleDetail(char)"
      >
        <div class="char-header">
          <span class="char-name">{{ char.key }}</span>
          <span v-if="char.code" class="char-code">「{{ char.code }}」</span>
        </div>

        <div v-if="char.data.是否相识" class="char-affection">
          <div class="affection-meter" aria-hidden="true">
            <div
              class="affection-fill"
              :style="{ width: `${char.data.好感度}%`, backgroundColor: affectionColor(char.data.好感度) }"
            ></div>
          </div>
          <span>{{ char.data.好感度 }}/100</span>
        </div>
        <div v-else class="char-locked"><span aria-hidden="true">◇</span> 尚未相识</div>

        <div v-if="expanded === char.key && char.data.是否相识" class="char-detail">
          <div class="detail-ledger">
            <span>堕落阶段</span>
            <strong :class="`stage-${char.data.堕落阶段}`">{{ stageLabel(char.data.堕落阶段) }}</strong>
            <span>互动</span>
            <strong>{{ char.data.交互次数 }}次</strong>
          </div>

          <div class="body-status" aria-label="身体状态">
            <button
              v-for="bodyPart in bodyParts"
              :key="bodyPart.key"
              type="button"
              class="body-part"
              :class="[
                `body-${char.data.身体状态[bodyPart.key]}`,
                { selected: isBodyPartSelected(char.key, bodyPart.key) },
              ]"
              :aria-pressed="isBodyPartSelected(char.key, bodyPart.key)"
              @click.stop="selectBodyPart(char.key, bodyPart.key)"
            >
              <span aria-hidden="true">{{ bodyPart.icon }}</span>
              <span>{{ bodyPart.key }}</span>
              <small>{{ char.data.身体状态[bodyPart.key] }}</small>
            </button>
          </div>

          <div v-if="selectedBodyPart(char)" class="body-detail" aria-live="polite">
            <strong>{{ selectedBodyPart(char) }}</strong>
            <span>状态：{{ selectedBodyState(char) }}</span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDataStore } from '../store';

type BodyState = '纯洁' | '经验';
type BodyPartKey = '口腔' | '双乳' | '嫩屄' | '臀部' | '玉足';
type CharacterView = {
  key: string;
  code: string;
  data: {
    是否相识: boolean;
    好感度: number;
    堕落阶段: number;
    交互次数: number;
    身体状态: Record<BodyPartKey, BodyState>;
  };
};

const store = useDataStore();
const expanded = ref<string | null>(null);
const bodyParts: ReadonlyArray<{ key: BodyPartKey; icon: string }> = [
  { key: '口腔', icon: '👄' },
  { key: '双乳', icon: '●' },
  { key: '嫩屄', icon: '✿' },
  { key: '臀部', icon: '◆' },
  { key: '玉足', icon: '〽' },
];
const selectedBodyParts = ref<Partial<Record<string, BodyPartKey>>>({});

const characters = computed<CharacterView[]>(() => [
  { key: '沈静姝', code: '夜莺', data: store.data.沈静姝 },
  { key: '顾曼筠', code: '', data: store.data.顾曼筠 },
  { key: '白露凝', code: '', data: store.data.白露凝 },
  { key: '藤原千代', code: '', data: store.data.藤原千代 },
  { key: '萧佩玖', code: '', data: store.data.萧佩玖 },
  { key: '文漪清', code: '启明星', data: store.data.文漪清 },
  { key: '凯瑟琳·薇安', code: '', data: store.data.凯瑟琳·薇安 },
  { key: '陆采薇', code: '', data: store.data.陆采薇 },
]);

function toggleDetail(char: CharacterView) {
  if (!char.data.是否相识) return;
  expanded.value = expanded.value === char.key ? null : char.key;
}

function selectBodyPart(characterKey: string, bodyPartKey: BodyPartKey) {
  selectedBodyParts.value[characterKey] = bodyPartKey;
}

function isBodyPartSelected(characterKey: string, bodyPartKey: BodyPartKey) {
  return selectedBodyParts.value[characterKey] === bodyPartKey;
}

function selectedBodyPart(char: CharacterView) {
  return selectedBodyParts.value[char.key];
}

function selectedBodyState(char: CharacterView) {
  const bodyPart = selectedBodyPart(char);
  return bodyPart ? char.data.身体状态[bodyPart] : undefined;
}

function affectionColor(value: number) {
  if (value < 25) return 'var(--book-blue)';
  if (value < 55) return 'var(--brass)';
  return 'var(--annotation-red)';
}

function stageLabel(stage: number) {
  return ['未觉醒', '初萌', '暗涌', '沉溺'][stage] ?? '未知';
}
</script>

<style lang="scss" scoped>
.roster {
  padding: 12px 14px;
  border-bottom: 1px solid var(--line);
}

.section-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 9px;
}

.section-heading h2 {
  color: var(--book-blue);
  font-family: var(--font-display);
  font-size: 0.92rem;
  letter-spacing: 0.06em;
}

.section-heading span {
  color: var(--brass);
  font-family: var(--font-data);
  font-size: 0.62rem;
  letter-spacing: 0.12em;
}

.char-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;
}

.char-card {
  min-width: 0;
  padding: 7px 8px;
  background: rgba(247, 240, 223, 0.46);
  border: 1px solid var(--line);
  border-radius: 2px;
  outline: none;
  transition: background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.char-known {
  cursor: pointer;
}

.char-known:hover,
.char-known:focus-visible {
  background: rgba(247, 240, 223, 0.82);
  border-color: rgba(169, 139, 80, 0.82);
  box-shadow: inset 3px 0 var(--brass);
}

.char-active {
  box-shadow: inset 3px 0 rgba(143, 48, 48, 0.72);
}

.char-expanded {
  grid-column: 1 / -1;
  background: rgba(247, 240, 223, 0.9);
  border-color: rgba(64, 80, 90, 0.55);
}

.char-header {
  display: flex;
  min-width: 0;
  align-items: baseline;
  gap: 5px;
  margin-bottom: 4px;
}

.char-name {
  overflow-wrap: anywhere;
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 700;
}

.char-code {
  color: var(--annotation-red);
  font-size: 0.62rem;
}

.char-affection {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--ink-muted);
  font-family: var(--font-data);
  font-size: 0.61rem;
}

.affection-meter {
  height: 4px;
  min-width: 52px;
  flex: 1;
  overflow: hidden;
  background: rgba(70, 62, 50, 0.1);
}

.affection-fill {
  height: 100%;
  transition: width 180ms ease;
}

.char-locked {
  color: var(--ink-muted);
  font-size: 0.66rem;
}

.char-detail {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed rgba(92, 78, 57, 0.34);
}

.detail-ledger {
  display: grid;
  grid-template-columns: auto auto auto auto;
  justify-content: start;
  gap: 5px 9px;
  margin-bottom: 8px;
  color: var(--ink-muted);
  font-size: 0.66rem;
}

.detail-ledger strong {
  color: var(--ink);
}

.detail-ledger [class^='stage-'] {
  padding: 0 5px;
  color: var(--paper-light);
  background: var(--book-blue);
  border-radius: 2px;
}

.detail-ledger .stage-1 {
  color: var(--ink);
  background: var(--brass);
}

.detail-ledger .stage-2,
.detail-ledger .stage-3 {
  background: var(--annotation-red);
}

.body-status {
  display: grid;
  grid-template-columns: repeat(5, minmax(74px, 1fr));
  gap: 5px;
}

.body-part {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0 4px;
  min-width: 0;
  padding: 5px 6px;
  text-align: left;
  background: rgba(255, 255, 255, 0.28);
  border: 1px solid var(--line-soft);
  border-radius: 2px;
  cursor: pointer;
  transition: background-color 160ms ease, border-color 160ms ease, transform 160ms ease;
}

.body-part:hover {
  border-color: var(--brass);
}

.body-part:active {
  transform: translateY(1px);
}

.body-part:focus-visible {
  outline: 2px solid var(--book-blue);
  outline-offset: 1px;
}

.body-part.selected {
  background: var(--paper-light);
  border-color: var(--book-blue);
  box-shadow: inset 0 -2px var(--book-blue);
}

.body-part small {
  grid-column: 2;
  font-size: 0.58rem;
}

.body-纯洁 small {
  color: var(--book-blue);
}

.body-经验 small {
  color: var(--annotation-red);
  font-weight: 700;
}

.body-detail {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 7px;
  padding: 5px 7px;
  color: var(--ink-muted);
  font-size: 0.67rem;
  background: rgba(64, 80, 90, 0.06);
  border-left: 2px solid var(--book-blue);
}

.body-detail strong {
  color: var(--ink);
  font-family: var(--font-display);
}

@media (max-width: 600px) {
  .body-status {
    grid-template-columns: repeat(3, minmax(74px, 1fr));
  }
}

@media (max-width: 380px) {
  .char-grid {
    gap: 5px;
  }

  .char-card {
    padding: 6px;
  }

  .body-status {
    grid-template-columns: repeat(2, minmax(74px, 1fr));
  }
}
</style>
```

- [ ] **Step 4: Run roster tests and production build**

Run:

```powershell
node --test tests/character-roster-data-binding.test.mjs tests/character-roster-interaction.test.mjs
pnpm build
```

Expected: 4 tests PASS and Webpack exits with code 0.

- [ ] **Step 5: Commit the roster fix**

```powershell
git add tests/character-roster-interaction.test.mjs src/谍影迷梦/界面/状态栏/components/CharacterRoster.vue
git commit -m "fix: 恢复人物部位只读交互"
```

### Task 4: Hide the duplicated text status in Markdown display only

**Files:**
- Create: `tests/status-duplicate-text-filter.test.mjs`
- Modify: `../cards/谍影迷梦/tavern-cards-state.json`
- Verify unchanged: `../cards/谍影迷梦/开场白/0.txt`

- [ ] **Step 1: Record the protected opening-message hash**

Run:

```powershell
Get-FileHash -LiteralPath '..\cards\谍影迷梦\开场白\0.txt' -Algorithm SHA256 | Select-Object -ExpandProperty Hash
```

Expected exactly:

```text
9F8DB9B07D9E5375E1D7D6592AE2D8CE88C763F910F74D953F22FEDA2DFAFEEA
```

- [ ] **Step 2: Write the failing duplicate-filter test**

```js
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
```

- [ ] **Step 3: Run the test and confirm the filter is absent**

Run:

```powershell
node --test tests/status-duplicate-text-filter.test.mjs
```

Expected: FAIL with `missing display-only duplicate status filter`.

- [ ] **Step 4: Add the exact display-only regex entry**

Insert this object between `对AI隐藏状态栏` and `状态栏界面` in `../cards/谍影迷梦/tavern-cards-state.json`:

```json
"隐藏文字状态栏": {
  "id": "824fd3ca-e9a3-4b68-a3a8-4a49a55aeb7f",
  "findRegex": "/\\n?━{8,}\\r?\\n🕒[^\\r\\n]*\\r?\\n━{8,}\\r?\\n🔫[^\\r\\n]*\\r?\\n💰[^\\r\\n]*\\r?\\n📋[^\\r\\n]*\\r?\\n━{8,}\\r?\\n[^\\r\\n]*\\r?\\n❤️[^\\r\\n]*\\r?\\n━{8,}(?=\\r?\\n<StatusPlaceHolderImpl\\/>)/g",
  "replaceString": "",
  "trimStrings": [],
  "placement": [2],
  "disabled": false,
  "markdownOnly": true,
  "promptOnly": false,
  "runOnEdit": true,
  "substituteRegex": 0,
  "minDepth": null,
  "maxDepth": null
},
```

Do not edit `开场白/0.txt` and do not merge this behavior into the Vue components.

- [ ] **Step 5: Verify the filter and protected hash**

Run:

```powershell
node --test tests/status-duplicate-text-filter.test.mjs
Get-FileHash -LiteralPath '..\cards\谍影迷梦\开场白\0.txt' -Algorithm SHA256 | Select-Object -ExpandProperty Hash
```

Expected: test PASS and the hash remains `9F8DB9B07D9E5375E1D7D6592AE2D8CE88C763F910F74D953F22FEDA2DFAFEEA`.

- [ ] **Step 6: Commit the regression test**

The card state lives outside this Git repository, so commit the in-repo regression test while retaining the workspace artifact change:

```powershell
git add tests/status-duplicate-text-filter.test.mjs
git commit -m "test: 保护状态栏展示层去重"
```

### Task 5: Add a reproducible card release utility

**Files:**
- Create: `scripts/package-jing-an-card.mjs`
- Create: `tests/card-release-contract.test.mjs`
- Generated: `../cards/谍影迷梦/正则/状态栏界面.html`
- Generated: `../cards/谍影迷梦/谍影迷梦.png`

- [ ] **Step 1: Write the failing release-contract test**

```js
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
```

- [ ] **Step 2: Run the test and confirm the module is missing**

Run:

```powershell
node --test tests/card-release-contract.test.mjs
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `scripts/package-jing-an-card.mjs`.

- [ ] **Step 3: Implement the release utility**

Create `scripts/package-jing-an-card.mjs` with:

```js
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptPath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(scriptPath), '..');
const cardRoot = path.resolve(repoRoot, '..', 'cards', '谍影迷梦');
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

export const paths = {
  state: path.join(cardRoot, 'tavern-cards-state.json'),
  statusBuild: path.join(repoRoot, 'dist', '谍影迷梦', '界面', '状态栏', 'index.html'),
  statusReplacement: path.join(cardRoot, '正则', '状态栏界面.html'),
  artifact: path.join(cardRoot, '谍影迷梦.png'),
};

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function parseChunks(buffer) {
  assert.deepEqual(buffer.subarray(0, 8), pngSignature, 'artifact is not a PNG');
  const chunks = [];
  let offset = 8;

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const typeBuffer = buffer.subarray(offset + 4, offset + 8);
    const type = typeBuffer.toString('ascii');
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    const expectedCrc = buffer.readUInt32BE(offset + 8 + length);
    const actualCrc = crc32(Buffer.concat([typeBuffer, data]));
    assert.equal(actualCrc, expectedCrc, `invalid CRC in ${type} chunk`);
    chunks.push({ type, data: Buffer.from(data) });
    offset += length + 12;
    if (type === 'IEND') break;
  }

  return chunks;
}

function encodeChunk({ type, data }) {
  const typeBuffer = Buffer.from(type, 'ascii');
  const output = Buffer.alloc(data.length + 12);
  output.writeUInt32BE(data.length, 0);
  typeBuffer.copy(output, 4);
  data.copy(output, 8);
  output.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), data.length + 8);
  return output;
}

function decodeTextChunk(data) {
  const separator = data.indexOf(0);
  assert.notEqual(separator, -1, 'invalid PNG tEXt chunk');
  return {
    keyword: data.toString('latin1', 0, separator),
    text: data.toString('latin1', separator + 1),
  };
}

function encodeTextChunk(keyword, text) {
  return Buffer.concat([Buffer.from(keyword, 'latin1'), Buffer.from([0]), Buffer.from(text, 'latin1')]);
}

function cardExtensions(card) {
  const extensions = card.data?.extensions ?? card.extensions;
  assert.ok(extensions, 'card metadata has no extensions object');
  return extensions;
}

export function materializeRegexScripts() {
  const state = JSON.parse(fs.readFileSync(paths.state, 'utf8'));
  return Object.entries(state.regex_scripts).map(([scriptName, config]) => {
    const replaceString = config.replace_file
      ? fs.readFileSync(path.resolve(cardRoot, config.replace_file), 'utf8')
      : (config.replaceString ?? '');
    const materialized = { ...config, scriptName, replaceString };
    delete materialized.replace_file;
    return materialized;
  });
}

export function updateCardMetadata(buffer, regexScripts) {
  const replaced = new Set();
  const chunks = parseChunks(buffer).map(chunk => {
    if (chunk.type !== 'tEXt') return chunk;
    const text = decodeTextChunk(chunk.data);
    if (text.keyword !== 'chara' && text.keyword !== 'ccv3') return chunk;

    const card = JSON.parse(Buffer.from(text.text, 'base64').toString('utf8'));
    cardExtensions(card).regex_scripts = regexScripts;
    const encoded = Buffer.from(JSON.stringify(card), 'utf8').toString('base64');
    replaced.add(text.keyword);
    return { type: 'tEXt', data: encodeTextChunk(text.keyword, encoded) };
  });

  assert.deepEqual([...replaced].sort(), ['ccv3', 'chara']);
  return Buffer.concat([pngSignature, ...chunks.map(encodeChunk)]);
}

export function verifyCardMetadata(buffer, expectedScripts) {
  const found = new Map();
  for (const chunk of parseChunks(buffer)) {
    if (chunk.type !== 'tEXt') continue;
    const text = decodeTextChunk(chunk.data);
    if (text.keyword !== 'chara' && text.keyword !== 'ccv3') continue;
    const card = JSON.parse(Buffer.from(text.text, 'base64').toString('utf8'));
    found.set(text.keyword, cardExtensions(card).regex_scripts);
  }

  assert.deepEqual([...found.keys()].sort(), ['ccv3', 'chara']);
  assert.deepEqual(found.get('chara'), expectedScripts);
  assert.deepEqual(found.get('ccv3'), expectedScripts);
}

function syncStatusReplacement() {
  const html = fs.readFileSync(paths.statusBuild, 'utf8').trim();
  assert.match(html, /<head>[\s\S]*<\/head>/);
  assert.match(html, /<body>[\s\S]*<\/body>/);
  fs.writeFileSync(paths.statusReplacement, `\`\`\`html\n${html}\n\`\`\`\n`, 'utf8');
}

function main() {
  syncStatusReplacement();
  const scripts = materializeRegexScripts();
  const original = fs.readFileSync(paths.artifact);
  const updated = updateCardMetadata(original, scripts);
  verifyCardMetadata(updated, scripts);

  const backup = `${paths.artifact}.before-ledger`;
  if (!fs.existsSync(backup)) fs.copyFileSync(paths.artifact, backup);

  const temporary = `${paths.artifact}.tmp`;
  fs.writeFileSync(temporary, updated);
  verifyCardMetadata(fs.readFileSync(temporary), scripts);
  fs.copyFileSync(temporary, paths.artifact);
  fs.unlinkSync(temporary);
  verifyCardMetadata(fs.readFileSync(paths.artifact), scripts);
  console.log(`Packaged ${path.relative(repoRoot, paths.artifact)} with ${scripts.length} regex scripts.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) main();
```

- [ ] **Step 4: Run the release-contract test**

Run:

```powershell
node --test tests/card-release-contract.test.mjs
```

Expected: PASS and the materialized script order includes `隐藏文字状态栏` before `状态栏界面`.

- [ ] **Step 5: Build, fence, and package the real artifact**

Run:

```powershell
pnpm build
node scripts/package-jing-an-card.mjs
```

Expected final line:

```text
Packaged ..\cards\谍影迷梦\谍影迷梦.png with 6 regex scripts.
```

- [ ] **Step 6: Verify the generated frontend fence and all automated contracts**

Run:

```powershell
node --test tests/status-store-contract.test.mjs tests/character-roster-data-binding.test.mjs tests/status-frontend-fence.test.mjs tests/status-visual-contract.test.mjs tests/status-content-contract.test.mjs tests/character-roster-interaction.test.mjs tests/status-duplicate-text-filter.test.mjs tests/card-release-contract.test.mjs
```

Expected: all tests PASS with zero failures.

- [ ] **Step 7: Commit the release utility**

```powershell
git add scripts/package-jing-an-card.mjs tests/card-release-contract.test.mjs
git commit -m "build: 增加谍影迷梦角色卡发布校验"
```

### Task 6: Browser acceptance and final integrity checks

**Files:**
- Verify: `dist/谍影迷梦/界面/状态栏/index.html`
- Verify: `../cards/谍影迷梦/正则/状态栏界面.html`
- Verify: `../cards/谍影迷梦/谍影迷梦.png`
- Verify unchanged: `../cards/谍影迷梦/开场白/0.txt`

- [ ] **Step 1: Start a local server for the production build**

Run:

```powershell
$server = Start-Process python -ArgumentList '-m','http.server','49210','--directory','dist\谍影迷梦\界面\状态栏' -PassThru -WindowStyle Hidden
$server.Id
```

Expected: a numeric process ID and `http://localhost:49210/` responds.

- [ ] **Step 2: Verify the 720px layout with the in-app Browser**

Use `browser:control-in-app-browser` to navigate to `http://localhost:49210/`, set the viewport near 720px wide, and confirm:

- The paper texture is subtle, the blue-gray header is legible, and no `TOP SECRET` label exists.
- `静安书局 · 内部借阅簿`, `FOLIO 01`, `FOLIO 02`, and the bookplate are visible.
- Skills remain two columns and no horizontal scrollbar appears.
- Clicking 沈静姝 expands one full-width card.
- Clicking each body-part button keeps the card expanded and changes the read-only detail to the selected name and current `纯洁`/`经验` value.
- Clicking a locked character does not close or replace the expanded known character.
- Browser console contains no errors.

- [ ] **Step 3: Verify the 360px responsive layout**

Use the same Browser page at approximately 360px width and confirm:

- Skills form one column.
- Locked characters remain a compact two-column grid where space permits.
- Location, task text, and character names wrap without horizontal overflow.
- Body-part controls remain clickable and keyboard focus is visible.

- [ ] **Step 4: Stop the local server**

Run with the process ID returned in Step 1:

```powershell
Stop-Process -Id $server.Id
```

Expected: the server exits cleanly.

- [ ] **Step 5: Run the final build, tests, package, and protected-file check**

Run:

```powershell
pnpm build
node scripts/package-jing-an-card.mjs
node --test tests/status-store-contract.test.mjs tests/character-roster-data-binding.test.mjs tests/status-frontend-fence.test.mjs tests/status-visual-contract.test.mjs tests/status-content-contract.test.mjs tests/character-roster-interaction.test.mjs tests/status-duplicate-text-filter.test.mjs tests/card-release-contract.test.mjs
Get-FileHash -LiteralPath '..\cards\谍影迷梦\开场白\0.txt' -Algorithm SHA256 | Select-Object -ExpandProperty Hash
git status --short
```

Expected:

- Webpack exits with code 0.
- The packager reports 6 regex scripts.
- All tests pass.
- Opening hash remains `9F8DB9B07D9E5375E1D7D6592AE2D8CE88C763F910F74D953F22FEDA2DFAFEEA`.
- Git status shows no uncommitted implementation files; the pre-existing unrelated `?? pnpm-workspace.yaml` may remain and must not be added or removed.

- [ ] **Step 6: Inspect the final history**

Run:

```powershell
git log -7 --oneline
```

Expected to include the design-spec commit plus the five focused implementation commits from Tasks 1–5. The external card state, fenced HTML, PNG, and `.before-ledger` backup remain workspace artifacts outside this repository.
