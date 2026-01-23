<template>
  <div class="modal-backdrop" role="dialog" aria-modal="true">
    <div class="modal-card">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="icon-btn" @click="$emit('close')">×</button>
      </header>
      <section class="modal-body">
        <slot />
      </section>
      <footer v-if="showFooter" class="modal-footer">
        <button class="btn" @click="$emit('close')">关闭</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "提示"
  },
  showFooter: {
    type: Boolean,
    default: true
  }
});
defineEmits(["close"]);
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(16, 24, 40, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 50;
}

.modal-card {
  width: min(520px, 94vw);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 18px 60px rgba(15, 23, 42, 0.2);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f2f6ff;
}

.modal-header h3 {
  font-size: 18px;
  color: #1c2a4a;
}

.icon-btn {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  color: #5b6b8b;
}

.modal-body {
  padding: 18px 20px;
  color: #2d3b55;
  line-height: 1.6;
}

.modal-footer {
  padding: 0 20px 18px;
  display: flex;
  justify-content: flex-end;
}

.btn {
  border: none;
  background: #3b82f6;
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
