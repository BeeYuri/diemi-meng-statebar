<template>
  <nav class="action-buttons" aria-label="行动选项">
    <button
      v-for="action in actions"
      :key="action.label"
      type="button"
      class="action-btn"
      :class="`action-${action.style}`"
      @click="triggerAction(action)"
    >
      <span class="action-tag">{{ action.tag }}</span>
      <span class="action-label">{{ action.label }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

interface Action {
  tag: string;
  label: string;
  style: 'low' | 'high' | 'pink';
  promptTemplate: () => string;
}

const store = useDataStore();

const actions: Action[] = [
  {
    tag: '低风险',
    label: '隐秘侦查',
    style: 'low',
    promptTemplate: () =>
      '我打算谨慎行事。先仔细观察周围的环境和每个人的举动，不放过任何反常的细节。如果有机会，找个自然的由头与相关的人攀谈，旁敲侧击地套取信息。安全第一。',
  },
  {
    tag: '高风险',
    label: '正面交锋',
    style: 'high',
    promptTemplate: () =>
      '不能再等了，我决定铤而走险。直接潜入目标地点，如果遭遇抵抗就正面交锋；该亮身份的时候绝不犹豫，用最快的速度拿到我需要的东西。',
  },
  {
    tag: '桃色',
    label: '情感深入',
    style: 'pink',
    promptTemplate: () =>
      '我放慢脚步，借着当下的气氛靠近她。用眼神试探她的反应，在言语间留出暧昧的余地；如果她并不抗拒，我想让这一刻继续深入下去。',
  },
];

function triggerAction(action: Action) {
  const message = action.promptTemplate();
  const $parentSend = window.parent.$('#send_textarea');
  if ($parentSend.length) {
    $parentSend.val(message).trigger('input');
    window.parent.SillyTavern?.activateSendButtons?.();
  }
}
</script>

<style lang="scss" scoped>
.action-buttons {
  display: flex;
  gap: 7px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--line);
}

.action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 0;
  padding: 7px 6px 6px;
  font-family: var(--font-body);
  background: rgba(247, 240, 223, 0.42);
  border: 1px solid var(--line);
  border-radius: 2px;
  cursor: pointer;
  transition: background-color 180ms ease, border-color 180ms ease, transform 120ms ease;

  &:hover {
    background: rgba(247, 240, 223, 0.82);
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid var(--book-blue);
    outline-offset: 1px;
  }
}

.action-tag {
  font-family: var(--font-data);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.action-label {
  font-size: 0.62rem;
  color: var(--ink-muted);
}

.action-low {
  --action-accent: var(--book-blue);

  .action-tag {
    color: var(--book-blue);
  }

  &:hover {
    border-color: var(--book-blue);
    box-shadow: inset 0 0 0 2px rgba(64, 80, 90, 0.12);
  }
}

.action-high {
  --action-accent: var(--annotation-red);

  .action-tag {
    color: var(--annotation-red);
  }

  &:hover {
    border-color: var(--annotation-red);
    box-shadow: inset 0 0 0 2px rgba(143, 48, 48, 0.12);
  }
}

.action-pink {
  --action-accent: var(--jade);

  .action-tag {
    color: var(--jade);
  }

  &:hover {
    border-color: var(--jade);
    box-shadow: inset 0 0 0 2px rgba(65, 103, 86, 0.12);
  }
}

@media (max-width: 480px) {
  .action-buttons {
    flex-direction: column;
    gap: 5px;
  }

  .action-btn {
    flex-direction: row;
    justify-content: center;
    gap: 6px;
    padding: 6px 10px;
  }
}
</style>
