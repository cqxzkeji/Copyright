<template>
  <div v-if="visible" class="modal-mask" @click.self="$emit('close')">
    <div class="modal">
      <header>
        <h3>{{ title }}</h3>
        <button class="close" @click="$emit('close')">×</button>
      </header>
      <section>
        <slot />
      </section>
      <footer>
        <button class="primary" @click="$emit('confirm')">确认</button>
        <button @click="$emit('close')">取消</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
  title: { type: String, default: '提示' },
});
</script>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(23, 39, 74, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.modal {
  width: min(90vw, 520px);
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 12px 40px rgba(32, 66, 123, 0.24);
}
header,
footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
}
section {
  padding: 0 20px 10px;
}
h3 {
  margin: 0;
  font-size: 18px;
}
.close {
  border: none;
  background: transparent;
  font-size: 22px;
}
button {
  border: 1px solid #c6d7f8;
  background: #f9fbff;
  color: #345;
  padding: 8px 14px;
  border-radius: 8px;
}
.primary {
  background: linear-gradient(90deg, #4b8cff, #5db0ff);
  color: #fff;
  border: none;
  margin-right: 8px;
}
</style>
