<template>
  <div v-if="show" class="modal-mask" @click.self="onClose">
    <div class="modal-card">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="icon-button" type="button" @click="onClose">×</button>
      </header>
      <section class="modal-body">
        <slot />
      </section>
      <footer class="modal-footer">
        <slot name="footer">
          <button class="primary" type="button" @click="onClose">确定</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: {
    type: String,
    default: "提示"
  }
});

const emit = defineEmits(["close"]);

const onClose = () => emit("close");
</script>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 24px;
}

.modal-card {
  background: #ffffff;
  border-radius: 16px;
  width: min(560px, 100%);
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.2);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-header,
.modal-footer {
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.modal-body {
  padding: 0 24px 8px;
  color: #4b5563;
  line-height: 1.6;
}

.icon-button {
  border: none;
  background: transparent;
  font-size: 22px;
  cursor: pointer;
  color: #94a3b8;
}

.primary {
  border: none;
  background: #2563eb;
  color: #fff;
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
}
</style>
