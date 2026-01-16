<template>
  <teleport to="body">
    <div v-if="open" class="modal-backdrop" @click.self="emit('close')">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">{{ title }}</div>
          <button class="button-ghost" type="button" @click="emit('close')">关闭</button>
        </div>
        <div>
          <slot />
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <slot name="footer">
            <button class="button-secondary" type="button" @click="emit('close')">取消</button>
            <button class="button-primary" type="button" @click="emit('confirm')">确认</button>
          </slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
const props = defineProps({
  open: Boolean,
  title: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close', 'confirm']);
</script>
