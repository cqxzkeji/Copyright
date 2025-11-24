<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal">
      <header>
        <h3>{{ title }}</h3>
        <button class="close" @click="$emit('close')">×</button>
      </header>
      <section class="body">
        <slot />
      </section>
      <footer>
        <button class="primary" @click="$emit('close')">知道了</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '提示'
  }
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal {
  width: min(420px, 90vw);
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem 1.5rem 1.5rem;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h3 {
  font-size: 1.1rem;
}

.close {
  border: none;
  background: transparent;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
}

.body {
  color: #4b5563;
  font-size: 0.95rem;
}

footer {
  display: flex;
  justify-content: flex-end;
}

.primary {
  background: linear-gradient(120deg, #4ade80, #22d3ee);
  border: none;
  color: #fff;
  padding: 0.45rem 1.5rem;
  border-radius: 999px;
  cursor: pointer;
}

.primary:hover {
  opacity: 0.9;
}
</style>
