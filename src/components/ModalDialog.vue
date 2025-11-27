<template>
  <div class="modal-backdrop" @click.self="onClose">
    <div class="modal-card">
      <header style="display: flex; justify-content: space-between; align-items: center; gap: 12px;">
        <div>
          <p style="margin: 0; font-size: 13px; color: #6b7280;">{{ subtitle }}</p>
          <h3 style="margin: 4px 0 0; font-size: 20px;">{{ title }}</h3>
        </div>
        <button aria-label="关闭弹窗" class="secondary-btn" @click="onClose">关闭</button>
      </header>
      <section style="margin-top: 14px;"> <slot /> </section>
      <footer style="margin-top: 16px; display: flex; justify-content: flex-end; gap: 10px;">
        <button class="secondary-btn" @click="onClose">取消</button>
        <button class="primary-btn" @click="onConfirm">确认</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: '操作确认' },
  subtitle: { type: String, default: '请确认信息' },
  onConfirm: { type: Function, default: () => {} },
  onClose: { type: Function, default: () => {} }
});

const onConfirm = () => {
  props.onConfirm();
};

const onClose = () => {
  props.onClose();
};
</script>
