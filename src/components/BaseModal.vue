<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <header>
        <span>{{ title }}</span>
        <button class="close-btn" @click="$emit('close')">×</button>
      </header>
      <div class="modal-body">
        <slot />
      </div>
      <footer v-if="showFooter">
        <button class="secondary-btn" @click="$emit('close')">{{ closeText }}</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: '提示' },
  closeText: { type: String, default: '关闭' },
  showFooter: { type: Boolean, default: true }
});
</script>

<style scoped>
.close-btn {
  background: transparent;
  border: none;
  color: var(--text);
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body {
  color: var(--muted);
  line-height: 1.6;
}
</style>
