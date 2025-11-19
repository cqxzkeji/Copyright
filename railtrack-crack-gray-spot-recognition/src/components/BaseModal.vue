<template>
  <div v-if="show" class="modal-backdrop" @click.self="emitClose">
    <div class="modal-panel">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="ghost" type="button" @click="emitClose">×</button>
      </header>
      <section>
        <slot />
      </section>
      <footer class="footer">
        <button type="button" @click="emitClose">关闭</button>
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
const emitClose = () => emit('close');
</script>

<style scoped>
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-header h3 {
  margin: 0;
}

button.ghost {
  background: transparent;
  color: #111;
  font-size: 1.5rem;
  padding: 0;
}

.footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}
</style>
