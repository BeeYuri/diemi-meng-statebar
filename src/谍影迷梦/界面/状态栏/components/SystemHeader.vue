<template>
  <div class="sys-header">
    <div class="sys-row">
      <div class="sys-time">
        <span class="sys-icon">🕒</span>
        <span>{{ store.data.系统.当前时间 }}</span>
      </div>
      <div class="sys-loc">
        <span class="sys-icon">📍</span>
        <span>{{ store.data.系统.当前地点 }}</span>
      </div>
      <div class="sys-alert" :class="`alert-${store.data.系统.警觉度}`">
        <span class="sys-icon">🚨</span>
        <span>警觉: {{ store.data.系统.警觉度 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';
const store = useDataStore();
</script>

<style lang="scss" scoped>
.sys-header {
  background: var(--c-slate);
  color: var(--c-gold-light);
  padding: 6px 10px;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  border-bottom: 2px solid var(--c-gold);
}

.sys-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  align-items: center;
}

.sys-icon {
  margin-right: 3px;
}

.sys-alert {
  margin-left: auto;
  padding: 1px 6px;
  border-radius: 2px;
  font-weight: bold;

  &.alert-低 {
    background: var(--c-safe);
    color: var(--c-parchment);
  }
  &.alert-中 {
    background: var(--c-gold);
    color: var(--c-ink);
  }
  &.alert-高 {
    background: var(--c-crimson);
    color: var(--c-parchment);
    animation: alertPulse 1.5s ease-in-out infinite;
  }
}

@keyframes alertPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
</style>
