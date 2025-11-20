<template>
  <div v-if="open" class="modal-overlay" @click.self="emit('update:open', false)">
    <div class="modal-card">
      <header>
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="emit('update:open', false)">×</button>
      </header>
      <section>
        <slot />
      </section>
      <footer>
        <button class="primary" @click="emit('confirm')">确认</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  open: Boolean,
  title: {
    type: String,
    default: '操作提示'
  }
})

const emit = defineEmits(['update:open', 'confirm'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  width: min(420px, 92vw);
  background: #fff;
  border-radius: 18px;
  padding: 1.5rem;
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

h3 {
  font-size: 1.1rem;
}

section {
  color: #4b5563;
  line-height: 1.5;
}

footer {
  display: flex;
  justify-content: flex-end;
}

button {
  border: none;
  background: none;
}

.primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  padding: 0.55rem 1.2rem;
  border-radius: 999px;
}

.close-btn {
  font-size: 1.2rem;
  color: #9ca3af;
}
</style>
