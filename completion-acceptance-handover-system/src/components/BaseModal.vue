<template>
  <teleport to="body">
    <div v-if="open" class="modal-backdrop" @click.self="close">
      <div class="modal-card" role="dialog" aria-modal="true">
        <header class="modal-header">
          <div>
            <p class="modal-title">{{ title }}</p>
            <p v-if="subtitle" class="modal-subtitle">{{ subtitle }}</p>
          </div>
          <button class="btn ghost" type="button" @click="close">关闭</button>
        </header>
        <section class="modal-body">
          <slot />
        </section>
        <footer class="modal-footer">
          <slot name="footer">
            <button class="btn primary" type="button" @click="close">确认</button>
          </slot>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
defineProps({
  open: Boolean,
  title: String,
  subtitle: String
});

const emit = defineEmits(["close"]);

const close = () => emit("close");
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 50;
}

.modal-card {
  width: min(720px, 100%);
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.2);
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 22px;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.modal-subtitle {
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
}

.modal-body {
  display: grid;
  gap: 12px;
  color: #1f2937;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
