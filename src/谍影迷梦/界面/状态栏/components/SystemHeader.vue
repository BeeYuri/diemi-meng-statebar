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
