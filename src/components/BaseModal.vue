<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-window">
      <header class="modal-header">
        <div class="header-left">
          <span class="dot"></span>
          <h3>{{ title }}</h3>
        </div>
        <button class="icon-button" @click="close">✕</button>
      </header>
      <section class="modal-body">
        <slot />
      </section>
      <footer class="modal-footer" v-if="showFooter">
        <button class="secondary-button" @click="close">关闭</button>
        <button class="primary-button" @click="$emit('confirm')">确认</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '操作弹窗'
  },
  showFooter: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['close', 'confirm']);
const close = () => emit('close');
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.38);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 1000;
}

.modal-window {
  background: #ffffff;
  border-radius: 16px;
  width: min(720px, 100%);
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.35);
  display: flex;
  flex-direction: column;
  max-height: 85vh;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-left h3 {
  margin: 0;
  font-size: 18px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #22c55e);
}

.icon-button {
  border: none;
  background: #f1f5f9;
  border-radius: 8px;
  padding: 8px 10px;
  cursor: pointer;
}

.modal-body {
  padding: 16px 20px;
  overflow: auto;
}

.modal-footer {
  padding: 16px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #e2e8f0;
}
</style>
