<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="btn secondary" @click="$emit('close')">关闭</button>
      </header>
      <div class="modal-body">
        <slot />
      </div>
      <footer v-if="hasFooter" class="modal-footer">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: { type: String, default: '信息' }
});

const slots = useSlots();
const hasFooter = computed(() => Boolean(slots.footer));
</script>

<style scoped>
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.modal-body {
  margin: 16px 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
