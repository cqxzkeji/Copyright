<template>
  <div v-if="modelValue" class="overlay" @click.self="$emit('update:modelValue', false)">
    <div class="dialog">
      <header>
        <h3>{{ title }}</h3>
        <button class="close" @click="$emit('update:modelValue', false)">×</button>
      </header>
      <section class="body">
        <slot />
      </section>
      <footer>
        <button class="primary" @click="$emit('confirm')">确认</button>
        <button class="ghost" @click="$emit('update:modelValue', false)">取消</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '操作' }
});
defineEmits(['update:modelValue', 'confirm']);
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 50;
}

.dialog {
  background: var(--surface);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  width: min(520px, 100%);
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 12px;
  padding: 18px;
  border: 1px solid var(--border);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h3 {
  margin: 0;
}

.close {
  background: transparent;
  border: none;
  font-size: 20px;
  color: #9ca3af;
}

.body {
  padding: 4px 2px;
  color: #374151;
}

footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.primary {
  background: linear-gradient(120deg, var(--primary), #60a5fa);
  border: none;
  color: white;
  padding: 10px 16px;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(29, 155, 240, 0.25);
}

.ghost {
  background: #f3f4f6;
  border: 1px solid var(--border);
  color: #374151;
  padding: 10px 16px;
  border-radius: 12px;
}
</style>
