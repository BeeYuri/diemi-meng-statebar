<template>
  <section class="roster">
    <div class="section-heading">
      <h2>人物档案</h2>
      <div class="heading-right">
        <button class="toggle-unacquainted" @click="showUnacquainted = !showUnacquainted">
          {{ showUnacquainted ? '隐藏未结识' : '显示全部' }}
        </button>
        <span>FOLIO 02</span>
      </div>
    </div>
    <div class="char-grid">
      <article
        v-for="char in characters"
        :key="char.key"
        class="char-card"
        :class="{
          'char-known': char.data.是否相识,
          'char-active': char.data.是否相识 && char.data.好感度 >= 50,
          'char-expanded': expanded === char.key,
        }"
        :role="char.data.是否相识 ? 'button' : undefined"
        :tabindex="char.data.是否相识 ? 0 : undefined"
        :aria-expanded="char.data.是否相识 ? expanded === char.key : undefined"
        @click="toggleDetail(char)"
        @keydown.enter.prevent="toggleDetail(char)"
        @keydown.space.prevent="toggleDetail(char)"
      >
        <div class="char-header">
          <span class="char-name">{{ char.key }}</span>
          <span v-if="char.code" class="char-code">「{{ char.code }}」</span>
        </div>

        <div v-if="char.data.是否相识" class="char-affection">
          <div class="affection-meter" aria-hidden="true">
            <div
              class="affection-fill"
              :style="{ width: `${char.data.好感度}%`, backgroundColor: affectionColor(char.data.好感度) }"
            ></div>
          </div>
          <span>{{ char.data.好感度 }}/100</span>
        </div>
        <div v-else class="char-locked"><span aria-hidden="true">◇</span> 尚未相识</div>

        <div v-if="expanded === char.key && char.data.是否相识" class="char-detail">
          <div class="detail-ledger">
            <span>堕落阶段</span>
            <strong :class="`stage-${char.data.堕落阶段}`">{{ stageLabel(char.data.堕落阶段) }}</strong>
            <span>互动</span>
            <strong>{{ char.data.交互次数 }}次</strong>
          </div>

          <div class="body-status" aria-label="身体状态">
            <button
              v-for="bodyPart in bodyParts"
              :key="bodyPart.key"
              type="button"
              class="body-part"
              :class="[
                `body-${char.data.身体状态[bodyPart.key]}`,
                { selected: isBodyPartSelected(char.key, bodyPart.key) },
              ]"
              :aria-pressed="isBodyPartSelected(char.key, bodyPart.key)"
              @click.stop="selectBodyPart(char.key, bodyPart.key)"
            >
              <span aria-hidden="true">{{ bodyPart.icon }}</span>
              <span>{{ bodyPart.key }}</span>
              <small>{{ bodyPartDisplay(char, bodyPart.key) }}</small>
            </button>
          </div>

          <div v-if="selectedBodyPart(char)" class="body-detail" aria-live="polite">
            <strong>{{ selectedBodyPart(char) }}</strong>
            <span>状态：{{ selectedBodyState(char) }}</span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDataStore } from '../store';

type BodyState = '纯洁' | '经验';
type BodyPartKey = '口腔' | '双乳' | '嫩屄' | '臀部' | '玉足';
type CharacterView = {
  key: string;
  code: string;
  data: {
    是否相识: boolean;
    好感度: number;
    堕落阶段: number;
    交互次数: number;
    身体状态: Record<BodyPartKey, BodyState>;
    身体状态描述: Record<BodyPartKey, string>;
  };
};

const store = useDataStore();
const expanded = ref<string | null>(null);
const showUnacquainted = ref(false);
const bodyParts: ReadonlyArray<{ key: BodyPartKey; icon: string }> = [
  { key: '口腔', icon: '👄' },
  { key: '双乳', icon: '🍒' },
  { key: '嫩屄', icon: '🌸' },
  { key: '臀部', icon: '🍑' },
  { key: '玉足', icon: '👣' },
];
const selectedBodyParts = ref<Partial<Record<string, BodyPartKey>>>({});

const characters = computed<CharacterView[]>(() => {
  const all: CharacterView[] = [
    { key: '沈静姝', code: '夜莺', data: store.data.沈静姝 },
    { key: '顾曼筠', code: '', data: store.data.顾曼筠 },
    { key: '白露凝', code: '', data: store.data.白露凝 },
    { key: '藤原千代', code: '', data: store.data.藤原千代 },
    { key: '萧佩玖', code: '', data: store.data.萧佩玖 },
    { key: '文漪清', code: '启明星', data: store.data.文漪清 },
    { key: '凯瑟琳·薇安', code: '', data: store.data.凯瑟琳·薇安 },
    { key: '陆采薇', code: '', data: store.data.陆采薇 },
  ];
  return showUnacquainted.value ? all : all.filter(c => c.data.是否相识);
});

function toggleDetail(char: CharacterView) {
  if (!char.data.是否相识) return;
  expanded.value = expanded.value === char.key ? null : char.key;
}

function selectBodyPart(characterKey: string, bodyPartKey: BodyPartKey) {
  selectedBodyParts.value[characterKey] = bodyPartKey;
}

function isBodyPartSelected(characterKey: string, bodyPartKey: BodyPartKey) {
  return selectedBodyParts.value[characterKey] === bodyPartKey;
}

function selectedBodyPart(char: CharacterView) {
  return selectedBodyParts.value[char.key];
}

function bodyPartDisplay(char: CharacterView, bodyPartKey: BodyPartKey): string {
  const desc: string | undefined = char.data.身体状态描述?.[bodyPartKey];
  if (desc && desc.trim()) return desc;
  return char.data.身体状态[bodyPartKey];
}

function selectedBodyState(char: CharacterView) {
  const bodyPart = selectedBodyPart(char);
  if (!bodyPart) return undefined;
  const desc: string | undefined = char.data.身体状态描述?.[bodyPart];
  return desc?.trim() || char.data.身体状态[bodyPart];
}

function affectionColor(value: number) {
  if (value < 25) return 'var(--book-blue)';
  if (value < 55) return 'var(--brass)';
  return 'var(--annotation-red)';
}

function stageLabel(stage: number) {
  return ['未觉醒', '初萌', '暗涌', '沉溺'][stage] ?? '未知';
}
</script>

<style lang="scss" scoped>
.roster {
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

.heading-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-unacquainted {
  padding: 1px 6px;
  font-family: var(--font-data);
  font-size: 0.56rem;
  color: var(--brass);
  background: transparent;
  border: 1px solid var(--line-soft);
  border-radius: 2px;
  cursor: pointer;
  line-height: 1.6;
  transition: color 160ms ease, border-color 160ms ease;
}

.toggle-unacquainted:hover {
  color: var(--ink);
  border-color: var(--brass);
}

.char-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;
}

.char-card {
  min-width: 0;
  padding: 7px 8px;
  background: rgba(247, 240, 223, 0.46);
  border: 1px solid var(--line);
  border-radius: 2px;
  outline: none;
  transition: background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.char-known {
  cursor: pointer;
}

.char-known:hover,
.char-known:focus-visible {
  background: rgba(247, 240, 223, 0.82);
  border-color: rgba(169, 139, 80, 0.82);
  box-shadow: inset 3px 0 var(--brass);
}

.char-active {
  box-shadow: inset 3px 0 rgba(143, 48, 48, 0.72);
}

.char-expanded {
  grid-column: 1 / -1;
  background: rgba(247, 240, 223, 0.9);
  border-color: rgba(64, 80, 90, 0.55);
}

.char-header {
  display: flex;
  min-width: 0;
  align-items: baseline;
  gap: 5px;
  margin-bottom: 4px;
}

.char-name {
  overflow-wrap: anywhere;
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 700;
}

.char-code {
  color: var(--annotation-red);
  font-size: 0.62rem;
}

.char-affection {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--ink-muted);
  font-family: var(--font-data);
  font-size: 0.61rem;
}

.affection-meter {
  height: 4px;
  min-width: 52px;
  flex: 1;
  overflow: hidden;
  background: rgba(70, 62, 50, 0.1);
}

.affection-fill {
  height: 100%;
  transition: width 180ms ease;
}

.char-locked {
  color: var(--ink-muted);
  font-size: 0.66rem;
}

.char-detail {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed rgba(92, 78, 57, 0.34);
}

.detail-ledger {
  display: grid;
  grid-template-columns: auto auto auto auto;
  justify-content: start;
  gap: 5px 9px;
  margin-bottom: 8px;
  color: var(--ink-muted);
  font-size: 0.66rem;
}

.detail-ledger strong {
  color: var(--ink);
}

.detail-ledger [class^='stage-'] {
  padding: 0 5px;
  color: var(--paper-light);
  background: var(--book-blue);
  border-radius: 2px;
}

.detail-ledger .stage-1 {
  color: var(--ink);
  background: var(--brass);
}

.detail-ledger .stage-2,
.detail-ledger .stage-3 {
  background: var(--annotation-red);
}

.body-status {
  display: grid;
  grid-template-columns: repeat(5, minmax(74px, 1fr));
  gap: 5px;
}

.body-part {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0 4px;
  min-width: 0;
  padding: 5px 6px;
  text-align: left;
  background: rgba(255, 255, 255, 0.28);
  border: 1px solid var(--line-soft);
  border-radius: 2px;
  cursor: pointer;
  transition: background-color 160ms ease, border-color 160ms ease, transform 160ms ease;
}

.body-part:hover {
  border-color: var(--brass);
}

.body-part:active {
  transform: translateY(1px);
}

.body-part:focus-visible {
  outline: 2px solid var(--book-blue);
  outline-offset: 1px;
}

.body-part.selected {
  background: var(--paper-light);
  border-color: var(--book-blue);
  box-shadow: inset 0 -2px var(--book-blue);
}

.body-part small {
  grid-column: 2;
  font-size: 0.58rem;
}

.body-纯洁 small {
  color: var(--book-blue);
}

.body-经验 small {
  color: var(--annotation-red);
  font-weight: 700;
}

.body-detail {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 7px;
  padding: 5px 7px;
  color: var(--ink-muted);
  font-size: 0.67rem;
  background: rgba(64, 80, 90, 0.06);
  border-left: 2px solid var(--book-blue);
}

.body-detail strong {
  color: var(--ink);
  font-family: var(--font-display);
}

@media (max-width: 600px) {
  .body-status {
    grid-template-columns: repeat(3, minmax(74px, 1fr));
  }
}

@media (max-width: 380px) {
  .char-grid {
    gap: 5px;
  }

  .char-card {
    padding: 6px;
  }

  .body-status {
    grid-template-columns: repeat(2, minmax(74px, 1fr));
  }
}
</style>
