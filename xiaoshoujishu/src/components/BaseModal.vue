<template>
  <teleport to="body">
    <div v-if="open" class="modal-backdrop" @click.self="emit('close')">
      <div class="modal-card" role="dialog" aria-modal="true">
        <header class="modal-header">
          <h3>{{ title }}</h3>
          <button class="icon-button" type="button" @click="emit('close')">✕</button>
        </header>
        <section class="modal-body">
          <slot />
        </section>
        <footer class="modal-footer" v-if="showFooter">
          <button class="btn" type="button" @click="emit('close')">关闭</button>
          <button v-if="primaryText" class="btn primary" type="button" @click="emit('confirm')">
            {{ primaryText }}
          </button>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
const props = defineProps({
  open: Boolean,
  title: {
    type: String,
    default: ''
  },
  primaryText: {
    type: String,
    default: ''
  },
  showFooter: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'confirm'])
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.modal-card {
  background: #ffffff;
  border-radius: 16px;
  max-width: 520px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.modal-body {
  padding: 20px;
  display: grid;
  gap: 12px;
}

.modal-footer {
  padding: 16px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.icon-button {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
}

.btn {
  border: 1px solid #cbd5f5;
  background: #ffffff;
  color: #1f2937;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.btn.primary {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
}
</style>
