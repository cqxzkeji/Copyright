<template>
  <div v-if="show" class="modal" @click.self="emit('close')">
    <div class="modal-card">
      <header>
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="emit('close')">×</button>
      </header>
      <section>
        <slot />
      </section>
      <footer>
        <button class="primary" @click="emit('close')">确定</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  title: { type: String, default: '提示' }
});
const emit = defineEmits(['close']);
</script>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  background: rgba(13, 34, 54, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-card {
  width: min(480px, 90%);
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.3);
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 24px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  border: none;
  background: transparent;
  font-size: 22px;
}

section {
  color: #475569;
  line-height: 1.6;
}

footer {
  display: flex;
  justify-content: flex-end;
}

button.primary {
  border: none;
  padding: 8px 20px;
  background: #2563eb;
  color: #fff;
  border-radius: 6px;
  font-weight: 600;
}
</style>
