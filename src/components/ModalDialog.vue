<template>
  <div class="modal-backdrop" v-if="modelValue">
    <div class="modal" role="dialog" aria-modal="true">
      <header class="modal__header">
        <h3>{{ title }}</h3>
        <button class="secondary" @click="$emit('update:modelValue', false)">关闭</button>
      </header>
      <section class="modal__body">
        <slot />
      </section>
      <footer class="modal__footer" v-if="$slots.footer">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: '操作'
  }
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.42);
  display: grid;
  place-items: center;
  z-index: 50;
}

.modal {
  background: #fff;
  padding: 20px;
  border-radius: 16px;
  width: min(650px, 92vw);
  box-shadow: 0 20px 70px rgba(0, 0, 0, 0.18);
}

.modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.modal__body {
  margin-bottom: 12px;
  line-height: 1.6;
}

.modal__footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
</style>
