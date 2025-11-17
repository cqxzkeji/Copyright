<template>
  <div class="overlay" v-if="modelValue">
    <div class="modal">
      <header>
        <h3>{{ title }}</h3>
        <button class="close" @click="$emit('update:modelValue', false)">×</button>
      </header>
      <section>
        <slot />
      </section>
      <footer>
        <button class="action" @click="$emit('update:modelValue', false)">好的</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '提示' }
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(9, 14, 40, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}
.modal {
  width: min(420px, 90vw);
  background: #fff;
  border-radius: 18px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 20px 60px rgba(5, 10, 50, 0.18);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.close {
  border: none;
  background: transparent;
  font-size: 1.2rem;
  cursor: pointer;
}
section {
  color: #4b5563;
  line-height: 1.6;
}
footer {
  display: flex;
  justify-content: flex-end;
}
.action {
  border: none;
  background: #2dd4bf;
  color: #fff;
  border-radius: 999px;
  padding: 0.45rem 1.5rem;
  cursor: pointer;
  font-weight: 600;
}
.action:hover {
  background: #14b8a6;
}
</style>
