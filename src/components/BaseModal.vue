<template>
  <div v-if="modelValue" class="overlay" @click.self="close">
    <div class="modal">
      <header>
        <h3>{{ title }}</h3>
        <button type="button" class="close" @click="close">×</button>
      </header>
      <section>
        <slot />
      </section>
      <footer v-if="showFooter">
        <button class="primary" @click="close">知道了</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: '提示'
  },
  showFooter: {
    type: Boolean,
    default: true
  }
});
const emit = defineEmits(['update:modelValue']);
const close = () => emit('update:modelValue', false);
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  width: min(500px, 92vw);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.25);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h3 {
  margin: 0;
  font-size: 1.1rem;
}

.close {
  border: none;
  background: transparent;
  font-size: 1.5rem;
  line-height: 1;
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
  background: linear-gradient(120deg, #4c6ef5, #5ce1e6);
  color: #fff;
  border: none;
  padding: 8px 18px;
  border-radius: 999px;
}
</style>
