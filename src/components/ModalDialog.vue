<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="close">
    <div class="modal" :style="{ maxWidth: width }">
      <header class="modal__header">
        <h3>{{ title }}</h3>
        <button class="modal__close" @click="close">×</button>
      </header>
      <section class="modal__body">
        <slot />
      </section>
      <footer class="modal__footer">
        <slot name="footer">
          <button class="ghost" @click="close">关闭</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: '提示'
  },
  width: {
    type: String,
    default: '560px'
  }
});
const emit = defineEmits(['update:modelValue']);

const close = () => emit('update:modelValue', false);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal {
  width: 94%;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 20px 60px rgba(30, 136, 229, 0.25);
  overflow: hidden;
  animation: pop 0.2s ease;
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid #eef2f7;
  background: linear-gradient(135deg, #f7fbff 0%, #eef5ff 100%);
}

.modal__header h3 {
  margin: 0;
}

.modal__close {
  border: none;
  background: transparent;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  color: #6b7280;
}

.modal__body {
  padding: 16px 18px;
  max-height: 60vh;
  overflow-y: auto;
}

.modal__footer {
  padding: 14px 18px;
  border-top: 1px solid #eef2f7;
  text-align: right;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

button.ghost {
  background: #f1f5f9;
  color: #1f2933;
}

@keyframes pop {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
