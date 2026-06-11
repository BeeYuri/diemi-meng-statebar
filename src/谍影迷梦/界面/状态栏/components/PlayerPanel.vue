<template>
  <div class="player-panel">
    <div class="section-title">👤 特工状态</div>
    <div class="skills-row">
      <div class="skill" v-for="s in skills" :key="s.key">
        <span class="skill-icon">{{ s.icon }}</span>
        <span class="skill-name">{{ s.label }}</span>
        <div class="skill-bar-wrap">
          <div class="skill-bar" :style="{ width: (store.stat_data.主角[s.key] ?? 0) + '%', background: s.color }"></div>
        </div>
        <span class="skill-val">{{ store.stat_data.主角[s.key] }}/100</span>
      </div>
    </div>
    <div class="resource-row">
      <span class="res-item">💰 {{ store.stat_data.主角.持有金钱 }} <span class="res-unit">大洋</span></span>
      <span class="res-item res-faction">青帮: <strong>{{ store.stat_data.主角.青帮声望 }}/100</strong></span>
      <span class="res-item res-faction">巡捕房: <strong>{{ store.stat_data.主角.巡捕房声望 }}/100</strong></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';
const store = useDataStore();

const skills = [
  { key: '枪械', icon: '🔫', label: '枪械', color: 'var(--c-crimson)' },
  { key: '潜行', icon: '🤫', label: '潜行', color: 'var(--c-slate)' },
  { key: '交际', icon: '🤝', label: '交际', color: 'var(--c-gold)' },
  { key: '观察', icon: '👁️', label: '观察', color: 'var(--c-jade)' },
];
</script>

<style lang="scss" scoped>
.player-panel {
  padding: 8px 10px;
  border-bottom: 1px solid var(--c-sepia-light);
  background: linear-gradient(90deg, rgba(201, 168, 76, 0.08) 0%, transparent 100%);
}

.section-title {
  font-size: 0.8rem;
  font-weight: bold;
  color: var(--c-sepia-dark);
  margin-bottom: 6px;
  letter-spacing: 1px;
  font-family: var(--font-mono);
}

.skills-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 12px;
  margin-bottom: 6px;
}

@media (max-width: 480px) {
  .skills-row {
    grid-template-columns: 1fr;
  }
}

.skill {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
}

.skill-icon {
  font-size: 0.85rem;
}

.skill-name {
  width: 28px;
  color: var(--c-sepia-mid);
}

.skill-bar-wrap {
  flex: 1;
  height: 5px;
  background: rgba(0,0,0,0.08);
  border-radius: 2px;
  overflow: hidden;
}

.skill-bar {
  height: 100%;
  border-radius: 2px;
  transition: width 0.6s ease;
}

.skill-val {
  width: 42px;
  text-align: right;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--c-sepia-mid);
}

.resource-row {
  display: flex;
  gap: 12px;
  font-size: 0.72rem;
  color: var(--c-sepia-mid);
  flex-wrap: wrap;
}

.res-item strong {
  color: var(--c-ink);
}

.res-unit {
  color: var(--c-sepia-light);
  font-size: 0.65rem;
}
</style>
