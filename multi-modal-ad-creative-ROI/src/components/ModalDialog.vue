<template>
  <div class="modal-overlay" role="dialog" aria-modal="true" @click.self="close">
    <div class="modal-body">
      <header style="display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
        <div>
          <h3 style="margin: 0; font-size: 1.1rem;">{{ title }}</h3>
          <p v-if="subtitle" class="helper-text" style="margin: 0.2rem 0 0;">{{ subtitle }}</p>
        </div>
        <button class="secondary-btn" @click="close" aria-label="关闭">关闭</button>
      </header>
      <div style="margin-top: 1rem;">
        <slot />
      </div>
      <footer style="margin-top: 1rem; display: flex; justify-content: flex-end; gap: 0.5rem;">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['close']);
const props = defineProps({
  title: {
    type: String,
    default: '弹窗',
  },
  subtitle: {
    type: String,
    default: '',
  },
});

const close = () => emit('close');
</script>
