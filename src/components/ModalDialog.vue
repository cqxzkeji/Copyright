<template>
  <div class="modal-wrapper" role="dialog" aria-modal="true">
    <div class="backdrop" @click="emit('close')" />
    <div class="modal" :style="{ width }">
      <header>
        <h3>{{ title }}</h3>
        <button class="close" @click="emit('close')" aria-label="关闭">×</button>
      </header>
      <section>
        <slot />
      </section>
      <footer v-if="$slots.footer">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: '系统提示' },
  width: { type: String, default: '420px' }
});
const emit = defineEmits(['close']);
</script>

<style scoped>
.modal-wrapper {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.backdrop {
  position: absolute;
  inset: 0;
  background: rgba(4, 10, 20, 0.75);
}
.modal {
  position: relative;
  background: #10223b;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  color: #f7f9ff;
  font-size: 20px;
  line-height: 1;
}
footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
