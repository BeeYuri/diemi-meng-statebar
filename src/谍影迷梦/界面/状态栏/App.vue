<template>
  <div class="dossier">
    <SystemHeader />
    <PlayerPanel />
    <CharacterRoster />
    <QuestPanel />
  </div>
</template>

<script setup lang="ts">
import SystemHeader from './components/SystemHeader.vue';
import PlayerPanel from './components/PlayerPanel.vue';
import CharacterRoster from './components/CharacterRoster.vue';
import QuestPanel from './components/QuestPanel.vue';
</script>

<style lang="scss" scoped>
.dossier {
  width: 100%;
  max-width: 720px;
  background: linear-gradient(180deg, var(--c-bone) 0%, var(--c-parchment) 100%);
  border: 2px solid var(--c-sepia-dark);
  box-shadow: 4px 4px 0 rgba(61, 43, 31, 0.2), inset 0 0 40px rgba(201, 168, 76, 0.04);
  font-family: var(--font-dossier);
  color: var(--c-ink);
  font-size: 12.5px;
  line-height: 1.45;
  margin: 0 auto;
  position: relative;

  &::before {
    content: 'TOP SECRET';
    position: absolute;
    top: -1px;
    right: 12px;
    transform: translateY(-50%);
    background: var(--c-crimson);
    color: var(--c-parchment);
    font-size: 0.6rem;
    font-weight: bold;
    padding: 2px 8px;
    letter-spacing: 2px;
    font-family: var(--font-mono);
    border: 1px solid var(--c-crimson-dim);
  }
}
</style>
