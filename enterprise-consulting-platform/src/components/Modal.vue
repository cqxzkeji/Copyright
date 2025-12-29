<template>
  <div class="modal-backdrop" role="dialog" aria-modal="true">
    <div class="modal-card">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close" @click="$emit('close')" aria-label="关闭">×</button>
      </header>
      <div class="modal-body">
        <slot />
      </div>
      <footer class="modal-footer">
        <button class="primary" @click="$emit('confirm')">确认</button>
        <button class="ghost" @click="$emit('close')">取消</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: '操作确认'
  }
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 35, 82, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  width: min(90vw, 520px);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 16px 50px rgba(0, 46, 100, 0.15);
  overflow: hidden;
  border: 1px solid #e3e9f2;
}

.modal-header,
.modal-footer {
  padding: 14px 18px;
  background: #f7f9fc;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-body {
  padding: 16px 18px;
  color: #2c3e50;
  line-height: 1.5;
}

.modal-footer {
  gap: 10px;
}

.close {
  border: none;
  background: transparent;
  font-size: 20px;
  color: #5b6b7b;
}

button.primary {
  background: linear-gradient(120deg, #27a5ff, #68d5ff);
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 600;
}

button.ghost {
  background: #fff;
  color: #1d4f8b;
  border: 1px solid #d7e3f1;
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 600;
}
</style>
