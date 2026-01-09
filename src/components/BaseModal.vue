<template>
  <teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click.self="close">
      <div class="modal-card" role="dialog" aria-modal="true">
        <header class="modal-header">
          <h3>{{ title }}</h3>
          <button class="btn btn-ghost" @click="close">关闭</button>
        </header>
        <section class="modal-body">
          <slot />
        </section>
        <footer class="modal-footer">
          <slot name="footer">
            <button class="btn btn-outline" @click="close">取消</button>
            <button class="btn btn-primary" @click="confirm">确认</button>
          </slot>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: '提示'
  }
});

const emit = defineEmits(['update:modelValue', 'confirm']);

const close = () => emit('update:modelValue', false);
const confirm = () => emit('confirm');
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 24px;
}

.modal-card {
  width: min(720px, 94vw);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.2);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: #1f2937;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
