<template>
  <div v-if="modelValue" class="modal-backdrop" @click.self="emit('update:modelValue', false)">
    <div class="modal-panel">
      <header class="section-header" style="margin-bottom: 12px;">
        <div>
          <p class="badge" style="background:#fef9c3;color:#92400e;">操作提示</p>
          <h3 style="margin:6px 0 0;font-size:18px;">{{ title }}</h3>
        </div>
        <button class="secondary-btn" @click="emit('update:modelValue', false)">关闭</button>
      </header>
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '' }
});

const emit = defineEmits(['update:modelValue']);
</script>
