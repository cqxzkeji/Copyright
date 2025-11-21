<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="close">
    <div class="modal-panel">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button type="button" class="close-btn" @click="close">×</button>
      </header>
      <section class="modal-body">
        <slot />
      </section>
      <footer class="modal-footer" v-if="showFooter">
        <button type="button" class="primary" @click="close">确定</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '信息提醒'
  },
  showFooter: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue']);

const close = () => emit('update:modelValue', false);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.modal-panel {
  width: min(480px, 90vw);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 25px 55px rgba(15, 23, 42, 0.18);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 20px 24px;
  line-height: 1.6;
}

.modal-footer {
  padding: 16px 24px 24px;
  display: flex;
  justify-content: flex-end;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 24px;
  color: #94a3b8;
}

.primary {
  background: linear-gradient(120deg, #2563eb, #9333ea);
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 10px 24px;
  font-weight: 600;
}
</style>
