<template>
  <main class="ledger-shell" aria-label="谍影迷梦状态栏">
    <div class="ledger-page">
      <SystemHeader />
      <PlayerPanel />
      <CharacterRoster />
      <NewsPanel />
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
import NewsPanel from './components/NewsPanel.vue';
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
