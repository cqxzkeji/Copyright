<template>
  <teleport to="body">
    <div v-if="visible" class="modal-backdrop" @click.self="onOverlay">
      <div class="modal-card" role="dialog" aria-modal="true" :aria-label="title">
        <header>
          <h3>{{ title }}</h3>
          <button class="btn light" @click="$emit('close')">关闭</button>
        </header>
        <div class="body">
          <slot />
        </div>
        <footer class="flex-between" style="margin-top: 14px;">
          <div class="muted">{{ helper }}</div>
          <div class="flex-center">
            <button class="btn secondary" @click="$emit('confirm')">确认</button>
            <button class="btn light" @click="$emit('close')">取消</button>
          </div>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '操作' },
  helper: { type: String, default: '请确认信息后提交' }
});

const emit = defineEmits(['close', 'confirm']);

const onOverlay = () => emit('close');
</script>

<style scoped>
.muted {
  color: var(--muted);
  font-size: 13px;
}
</style>
