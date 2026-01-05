<template>
  <div class="modal-backdrop" v-if="modelValue">
    <div class="modal-card" role="dialog" aria-modal="true">
      <header class="flex" style="justify-content: space-between; align-items: center;">
        <div>
          <div class="label">{{ subTitle }}</div>
          <h3>{{ title }}</h3>
        </div>
        <button class="ghost-btn" @click="$emit('update:modelValue', false)">关闭</button>
      </header>
      <div class="modal-body">
        <slot />
      </div>
      <div class="modal-actions">
        <button class="ghost-btn" @click="$emit('update:modelValue', false)">取消</button>
        <button class="primary-btn" @click="onConfirm">确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '操作确认' },
  subTitle: { type: String, default: '请确认操作信息' }
});

const emit = defineEmits(['update:modelValue', 'confirm']);
const onConfirm = () => {
  emit('confirm');
  emit('update:modelValue', false);
};
</script>
