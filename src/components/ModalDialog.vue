<template>
  <teleport to="body">
    <div v-if="visible" class="overlay" @click.self="$emit('close')">
      <div class="modal">
        <header class="modal-header">
          <h3>{{ title }}</h3>
          <button class="close" @click="$emit('close')">×</button>
        </header>
        <section class="modal-body">
          <slot />
        </section>
        <footer class="modal-footer">
          <button class="btn" @click="$emit('close')">关闭</button>
          <button v-if="showConfirm" class="btn primary" @click="$emit('confirm')">确认</button>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
defineProps({
  visible: Boolean,
  title: { type: String, default: '提示' },
  showConfirm: { type: Boolean, default: false }
})

defineEmits(['close', 'confirm'])
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(22, 29, 45, 0.45);
  display: grid;
  place-items: center;
  z-index: 999;
  padding: 16px;
}

.modal {
  width: min(640px, 100%);
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 20px 50px rgba(30, 64, 175, 0.24);
  overflow: hidden;
}

.modal-header,
.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid #ebeff8;
}

.modal-footer {
  border-bottom: none;
  border-top: 1px solid #ebeff8;
  justify-content: flex-end;
  gap: 10px;
}

.modal-body {
  padding: 18px;
  max-height: 70vh;
  overflow-y: auto;
}

.close {
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 24px;
  cursor: pointer;
}

.btn {
  border: 1px solid #d4dbef;
  background: #f8faff;
  color: #344255;
  border-radius: 10px;
  padding: 8px 14px;
  cursor: pointer;
}

.btn.primary {
  border-color: #2563eb;
  background: #2563eb;
  color: #fff;
}
</style>
