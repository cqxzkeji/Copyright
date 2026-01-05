<template>
  <div v-if="show" class="overlay" @click.self="close">
    <div class="modal" :style="{ maxWidth: width }">
      <header class="modal__header">
        <h3>{{ title }}</h3>
        <button class="close" @click="close" aria-label="关闭弹窗">×</button>
      </header>
      <section class="modal__body">
        <slot />
      </section>
      <footer class="modal__footer">
        <slot name="footer">
          <button class="primary" @click="close">完成</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  title: {
    type: String,
    default: '提示'
  },
  width: {
    type: String,
    default: '520px'
  }
});

const emit = defineEmits(['close']);

const close = () => emit('close');
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(8, 21, 44, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  z-index: 999;
}

.modal {
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  box-shadow: 0 24px 48px rgba(31, 42, 68, 0.16);
  border: 1px solid #e4ecf5;
  overflow: hidden;
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: linear-gradient(120deg, #f0f6ff, #fff9f2);
  color: #1f2a44;
}

.modal__body {
  padding: 16px 18px;
  max-height: 60vh;
  overflow-y: auto;
}

.modal__footer {
  padding: 14px 18px;
  background: #f9fbff;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.primary {
  background: linear-gradient(120deg, #4f9dff, #7bd8ff);
  color: #0f1c3f;
}

.close {
  background: #fff;
  color: #1f2a44;
  width: 32px;
  height: 32px;
  border-radius: 10px;
}
</style>
