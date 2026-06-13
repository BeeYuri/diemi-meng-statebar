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
