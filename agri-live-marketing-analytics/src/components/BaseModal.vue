<template>
  <teleport to="body">
    <div v-if="show" class="modal-mask" @click.self="emit('close')">
      <div class="modal-card">
        <header class="modal-header">
          <h3>{{ title }}</h3>
          <button class="icon-button" @click="emit('close')">✕</button>
        </header>
        <section class="modal-body">
          <slot />
        </section>
        <footer class="modal-footer">
          <slot name="footer">
            <button class="primary" @click="emit('close')">确定</button>
          </slot>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  title: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close']);
</script>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.modal-card {
  width: min(520px, 100%);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.2);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #eef0f6;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.modal-body {
  padding: 16px 20px;
  color: #3b4766;
}

.modal-footer {
  padding: 12px 20px 18px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.icon-button {
  border: none;
  background: #eef2f9;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
}

.primary {
  background: #377dff;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
}
</style>
