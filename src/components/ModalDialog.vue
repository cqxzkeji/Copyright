<template>
  <div v-if="open" class="modal-overlay" @click.self="close">
    <div class="modal">
      <header>
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="close">×</button>
      </header>
      <div>
        <slot />
      </div>
      <footer style="margin-top: 12px; display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap;">
        <button class="ghost" @click="close">关闭</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' }
});

const emit = defineEmits(['close']);
const close = () => emit('close');
</script>
