<template>
  <teleport to="body">
    <div v-if="modelValue" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal-body">
        <div class="modal-title">
          <h3>{{ title }}</h3>
          <button class="pill-btn" @click="$emit('update:modelValue', false)">关闭</button>
        </div>
        <p class="modal-message">{{ message }}</p>
        <div v-if="progress !== null" class="progress-bar">
          <span :style="{ width: `${progress}%` }"></span>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '提示' },
  message: { type: String, default: '' },
  progress: { type: Number, default: null },
});

defineEmits(['update:modelValue']);
</script>
