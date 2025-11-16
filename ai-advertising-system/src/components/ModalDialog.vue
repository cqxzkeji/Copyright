<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="close">
    <div class="modal-card">
      <header>
        <h3>{{ title }}</h3>
        <button class="plain" @click="close">×</button>
      </header>
      <section class="content">
        <slot />
      </section>
      <footer>
        <button class="primary" @click="close">关闭</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['update:modelValue']);
const close = () => emit('update:modelValue', false);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  width: min(520px, 90%);
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.25);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.content {
  color: #4b5563;
  line-height: 1.6;
}

footer {
  display: flex;
  justify-content: flex-end;
}

button.plain {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #475569;
}

button.primary {
  background: linear-gradient(120deg, #6366f1, #8b5cf6);
  border: none;
  color: #fff;
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}
</style>
