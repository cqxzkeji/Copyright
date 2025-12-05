<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close" @click="$emit('close')">×</button>
      </header>
      <div class="modal-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String
});
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #fff;
  border-radius: 14px;
  width: min(720px, 92vw);
  box-shadow: 0 20px 60px rgba(30, 64, 175, 0.2);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f8fbff, #eef2ff);
}

.modal-body {
  padding: 20px;
}

.close {
  border: none;
  background: transparent;
  font-size: 22px;
  line-height: 1;
}
</style>
