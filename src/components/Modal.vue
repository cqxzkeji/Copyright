<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">{{ title }}</h3>
        <button class="btn secondary" @click="emit('close')">关闭</button>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup>
import { toRefs } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: ''
  }
});

const { title } = toRefs(props);
const emit = defineEmits(['close']);
</script>

<style scoped>
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.modal-title {
  margin: 0;
}
</style>
