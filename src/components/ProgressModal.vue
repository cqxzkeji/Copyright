<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal">
      <header>
        <h3>{{ title }}</h3>
      </header>
      <section>
        <p>{{ description }}</p>
        <div class="progress">
          <div class="bar" :style="{ width: progress + '%' }"></div>
        </div>
        <p class="value">{{ progress }}%</p>
      </section>
      <footer>
        <button @click="$emit('close')" :disabled="progress < 100">
          {{ progress < 100 ? '后台运行' : '关闭' }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '执行中'
  },
  description: {
    type: String,
    default: ''
  },
  progress: {
    type: Number,
    default: 0
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
  z-index: 60;
}

.modal {
  width: min(400px, 90vw);
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.25);
  padding: 1.25rem 1.5rem 1.5rem;
}

header {
  margin-bottom: 0.75rem;
}

.progress {
  margin-top: 0.75rem;
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.bar {
  background: linear-gradient(120deg, #34d399, #38bdf8);
  height: 100%;
  transition: width 0.3s ease;
}

.value {
  margin-top: 0.5rem;
  font-weight: 600;
  text-align: right;
}

footer {
  margin-top: 1rem;
  text-align: right;
}

button {
  border: none;
  background: #0ea5e9;
  color: #fff;
  padding: 0.45rem 1.5rem;
  border-radius: 999px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
