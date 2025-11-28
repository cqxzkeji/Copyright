<template>
  <div v-if="show" class="overlay" @click.self="emitClose">
    <div class="modal">
      <header class="modal__header">
        <h3>{{ title }}</h3>
        <button class="icon-btn" @click="emitClose" aria-label="关闭弹窗">✕</button>
      </header>
      <section class="modal__body">
        <slot />
      </section>
      <footer class="modal__footer" v-if="showFooter">
        <button class="ghost" @click="emitClose">取消</button>
        <button class="primary" @click="emitConfirm">{{ primaryText }}</button>
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
  primaryText: {
    type: String,
    default: '确定'
  },
  showFooter: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'confirm'])

const emitClose = () => emit('close')
const emitConfirm = () => emit('confirm')
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(21, 29, 51, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  backdrop-filter: blur(2px);
}

.modal {
  background: var(--surface);
  color: #123;
  border-radius: 16px;
  width: min(640px, 92vw);
  box-shadow: var(--shadow);
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.modal__body {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
}

.modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.primary {
  background: linear-gradient(135deg, var(--primary), var(--primary-strong));
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 10px 20px rgba(45, 156, 219, 0.25);
}

.primary:hover {
  background: var(--primary-strong);
}

.ghost {
  background: #f1f4f9;
  border: 1px solid var(--border);
  color: #274;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.icon-btn {
  background: #eef2f7;
  border: 1px solid var(--border);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: #567;
}
</style>
