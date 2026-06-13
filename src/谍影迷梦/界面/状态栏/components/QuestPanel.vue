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
