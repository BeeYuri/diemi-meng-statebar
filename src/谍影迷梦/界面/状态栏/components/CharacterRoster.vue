<template>
  <div class="roster">
    <div class="section-title">❤️ 人物档案</div>
    <div class="char-grid">
      <div
        v-for="char in characters"
        :key="char.key"
        class="char-card"
        :class="{ 'char-known': char.data.是否相识, 'char-active': char.data.是否相识 && char.data.好感度 >= 50 }"
        @click="toggleDetail(char)"
      >
        <div class="char-header">
          <span class="char-name">{{ char.key }}</span>
          <span v-if="char.code" class="char-code">「{{ char.code }}」</span>
        </div>
        <div v-if="char.data.是否相识" class="char-affection">
          <div class="aff-bar-wrap">
            <div
              class="aff-bar"
              :style="{ width: char.data.好感度 + '%', background: affectionColor(char.data.好感度) }"
            ></div>
          </div>
          <span class="aff-val">{{ char.data.好感度 }}/100</span>
        </div>
        <div v-else class="char-locked">
          <span class="lock-icon">🔒</span> 尚未相识
        </div>

        <!-- Expanded detail -->
        <div v-if="expanded === char.key && char.data.是否相识" class="char-detail">
          <div class="detail-row">
            <span class="detail-label">堕落阶段</span>
            <span class="detail-val stage-badge" :class="`stage-${char.data.堕落阶段}`">
              {{ stageLabel(char.data.堕落阶段) }}
            </span>
            <span class="detail-label">互动</span>
            <span class="detail-val">{{ char.data.交互次数 }}次</span>
          </div>
          <div class="body-status">
            <div v-for="b in bodyParts" :key="b.key" class="body-part">
              <span class="body-icon">{{ b.icon }}</span>
              <span class="body-state" :class="`body-${char.data.身体状态[b.key]}`">
                {{ char.data.身体状态[b.key] === '纯洁' ? '✦' : '♥' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDataStore } from '../store';

const store = useDataStore();
const expanded = ref<string | null>(null);

const characters = [
  { key: '沈静姝', code: '夜莺' },
  { key: '顾曼筠', code: '' },
  { key: '白露凝', code: '' },
  { key: '藤原千代', code: '' },
  { key: '萧佩玖', code: '' },
  { key: '文漪清', code: '启明星' },
  { key: '凯瑟琳·薇安', code: '' },
  { key: '陆采薇', code: '' },
];

const bodyParts = [
  { key: '口腔', icon: '👄' },
  { key: '双乳', icon: '🍒' },
  { key: '嫩屄', icon: '🌸' },
  { key: '臀部', icon: '🍑' },
  { key: '玉足', icon: '👣' },
];

function toggleDetail(char: any) {
  expanded.value = expanded.value === char.key ? null : char.key;
}

function affectionColor(val: number): string {
  if (val < 25) return 'var(--c-slate-light)';
  if (val < 55) return 'var(--c-gold)';
  return 'var(--c-crimson)';
}

function stageLabel(stage: number): string {
  const labels = ['未觉醒', '❶ 初萌', '❷ 暗涌', '❸ 沉溺'];
  return labels[stage] || '未知';
}
</script>

<style lang="scss" scoped>
.roster {
  padding: 8px 10px;
  border-bottom: 1px solid var(--c-sepia-light);
}

.section-title {
  font-size: 0.8rem;
  font-weight: bold;
  color: var(--c-sepia-dark);
  margin-bottom: 6px;
  letter-spacing: 1px;
  font-family: var(--font-mono);
}

.char-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
  gap: 4px;
}

.char-card {
  border: 1px solid var(--c-sepia-light);
  padding: 5px 7px;
  cursor: pointer;
  transition: all 0.2s;
  background: rgba(255,255,255,0.4);

  &:hover {
    border-color: var(--c-gold);
    background: rgba(255,255,255,0.8);
  }

  &.char-active {
    border-left: 3px solid var(--c-crimson);
    background: linear-gradient(90deg, rgba(139, 26, 26, 0.05) 0%, rgba(255,255,255,0.4) 100%);
  }
}

.char-header {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-bottom: 3px;
}

.char-name {
  font-size: 0.78rem;
  font-weight: bold;
  color: var(--c-ink);
}

.char-code {
  font-size: 0.6rem;
  color: var(--c-crimson-dim);
}

.char-affection {
  display: flex;
  align-items: center;
  gap: 4px;
}

.aff-bar-wrap {
  flex: 1;
  height: 4px;
  background: rgba(0,0,0,0.06);
  border-radius: 2px;
  overflow: hidden;
}

.aff-bar {
  height: 100%;
  border-radius: 2px;
  transition: width 0.8s ease;
}

.aff-val {
  font-size: 0.6rem;
  font-family: var(--font-mono);
  color: var(--c-sepia-mid);
  width: 32px;
  text-align: right;
}

.char-locked {
  font-size: 0.65rem;
  color: var(--c-sepia-light);
  font-style: italic;
}

.lock-icon {
  font-size: 0.7rem;
}

.char-detail {
  margin-top: 5px;
  padding-top: 5px;
  border-top: 1px dashed var(--c-sepia-light);
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
  font-size: 0.68rem;
}

.detail-label {
  color: var(--c-sepia-mid);
  font-size: 0.6rem;
}

.stage-badge {
  padding: 0 4px;
  border-radius: 2px;
  font-weight: bold;
  font-size: 0.65rem;

  &.stage-0 { background: var(--c-slate-light); color: var(--c-parchment); }
  &.stage-1 { background: var(--c-gold); color: var(--c-ink); }
  &.stage-2 { background: var(--c-crimson-dim); color: var(--c-parchment); }
  &.stage-3 { background: var(--c-crimson); color: var(--c-parchment); }
}

.body-status {
  display: flex;
  gap: 6px;
}

.body-part {
  display: flex;
  align-items: center;
  gap: 1px;
}

.body-icon {
  font-size: 0.7rem;
}

.body-state {
  font-size: 0.65rem;
  &.body-纯洁 { color: var(--c-slate-light); }
  &.body-经验 { color: var(--c-crimson); }
}
</style>
