<template>
  <div class="quest-panel">
    <div class="section-title">📋 任务与委托</div>
    <div class="main-quest">
      <div class="quest-tag main-tag">主线</div>
      <div class="quest-info">
        <span class="quest-name">{{ store.data.任务.当前主线任务 }}</span>
        <span class="quest-time">⏳ 剩余 {{ store.data.任务.主线剩余时间 }}小时</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';
const store = useDataStore();
</script>

<style lang="scss" scoped>
.quest-panel {
  padding: 8px 10px;
}

.section-title {
  font-size: 0.8rem;
  font-weight: bold;
  color: var(--c-sepia-dark);
  margin-bottom: 6px;
  letter-spacing: 1px;
  font-family: var(--font-mono);
}

.main-quest {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 5px 7px;
  background: linear-gradient(90deg, rgba(139, 26, 26, 0.06) 0%, transparent 100%);
  border-left: 3px solid var(--c-crimson);
}

.quest-tag {
  font-size: 0.6rem;
  font-weight: bold;
  padding: 1px 5px;
  border-radius: 2px;
  font-family: var(--font-mono);
  white-space: nowrap;

  &.main-tag {
    background: var(--c-crimson);
    color: var(--c-parchment);
  }
}

.quest-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.quest-name {
  font-size: 0.75rem;
  font-weight: bold;
  color: var(--c-ink);
}

.quest-time {
  font-size: 0.65rem;
  color: var(--c-crimson-dim);
  font-family: var(--font-mono);
}
</style>
