<template>
  <section v-if="newsEntries.length > 0" class="news-panel">
    <div class="section-heading">
      <h2>今日消息</h2>
      <span>FOLIO 03</span>
    </div>
    <ul class="news-list">
      <li v-for="(item, id) in newsEntries" :key="id" class="news-item">
        <span class="news-badge" :class="`badge-${item.类型}`">{{ item.类型 }}</span>
        <span class="news-source">{{ item.来源 }}</span>
        <span class="news-divider" aria-hidden="true">—</span>
        <span class="news-title">{{ item.标题 }}</span>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from '../store';

const store = useDataStore();

interface NewsItem {
  标题: string;
  内容: string;
  类型: '主线' | '支线' | '委托' | '邂逅';
  来源: string;
  关联角色: string;
  时效: number;
}

const newsEntries = computed<Record<string, NewsItem>>(() => {
  const list = (store.data as any).新闻?.当前新闻列表;
  return list || {};
});
</script>

<style lang="scss" scoped>
.news-panel {
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

.news-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.news-item {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px 6px;
  padding: 5px 7px;
  font-size: 0.7rem;
  background: rgba(247, 240, 223, 0.38);
  border-left: 2px solid var(--line);
  border-radius: 0 2px 2px 0;
  line-height: 1.5;
}

.news-badge {
  padding: 0 5px;
  color: var(--paper-light);
  font-family: var(--font-data);
  font-size: 0.6rem;
  font-weight: 700;
  border-radius: 2px;
  white-space: nowrap;
  background: var(--book-blue);
}

.badge-主线 {
  background: var(--annotation-red);
}

.badge-支线 {
  background: var(--book-blue);
}

.badge-委托 {
  background: var(--brass);
  color: var(--ink);
}

.badge-邂逅 {
  background: var(--jade);
}

.news-source {
  color: var(--annotation-red);
  font-family: var(--font-display);
  font-size: 0.65rem;
  white-space: nowrap;
}

.news-divider {
  color: var(--line);
  font-size: 0.55rem;
}

.news-title {
  color: var(--ink);
  flex: 1;
  min-width: 0;
}
</style>
