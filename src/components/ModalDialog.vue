<template>
  <div v-if="show" class="modal-mask" role="dialog" aria-modal="true">
    <div class="modal">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close" type="button" @click="$emit('close')">×</button>
      </header>
      <section class="modal-body">
        <slot />
      </section>
      <footer class="modal-footer">
        <slot name="footer">
          <button class="button primary" type="button" @click="$emit('close')">关闭</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: {
    type: String,
    default: ''
  }
})

defineEmits(['close'])
</script>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 20;
}

.modal {
  width: min(640px, 100%);
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.25);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  font-size: 18px;
}

.close {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
}

.modal-body {
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-footer {
  padding: 16px 20px;
  background: #f8fafc;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.button {
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.button.primary {
  background: #4f46e5;
  color: #fff;
}

.button.ghost {
  background: #e2e8f0;
  color: #1f2937;
}
</style>
