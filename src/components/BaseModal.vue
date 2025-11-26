<template>
  <div class="backdrop" @click.self="close">
    <div class="panel">
      <header>
        <div class="title">{{ title }}</div>
        <button class="icon-btn" @click="close">×</button>
      </header>
      <main>
        <slot />
      </main>
      <footer v-if="actions && actions.length">
        <button
          v-for="(action, index) in actions"
          :key="index"
          class="btn"
          :class="action.primary ? 'btn-primary' : 'btn-outline'"
          type="button"
          @click="action.onClick"
        >
          {{ action.label }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: '操作' },
  actions: { type: Array, default: () => [] }
});
const emit = defineEmits(['close']);
const close = () => emit('close');
</script>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.25);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  padding: 16px;
  z-index: 30;
}

.panel {
  width: min(640px, 100%);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 30px 80px rgba(45, 123, 255, 0.25);
  border: 1px solid rgba(45, 123, 255, 0.14);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 18px;
  border-bottom: 1px solid rgba(45, 123, 255, 0.14);
}

.title {
  font-weight: 700;
}

.icon-btn {
  background: rgba(45, 123, 255, 0.1);
  border: none;
  border-radius: 10px;
  font-size: 18px;
  width: 32px;
  height: 32px;
  cursor: pointer;
}

main {
  padding: 18px;
  overflow: auto;
  color: #1f2937;
}

footer {
  padding: 12px 18px;
  border-top: 1px solid rgba(45, 123, 255, 0.14);
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
