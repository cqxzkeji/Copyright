<template>
  <BaseModal :model-value="modelValue" title="进度跟踪" @update:modelValue="emitClose">
    <p v-if="message" class="modal-message">{{ message }}</p>
    <div class="form-grid">
      <div v-for="item in progresses" :key="item.label">
        <div class="section-header">
          <strong>{{ item.label }}</strong>
          <span>{{ item.value }}%</span>
        </div>
        <div class="progress-track">
          <div class="bar" :style="{ width: `${item.value}%` }"></div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue';

const props = defineProps({
  modelValue: Boolean,
  message: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['update:modelValue']);

const progresses = [
  { label: '作业计划下发', value: 82 },
  { label: '设备确认就绪', value: 74 },
  { label: '现场执行反馈', value: 63 },
  { label: '异常处理闭环', value: 58 }
];

const emitClose = (val) => emit('update:modelValue', val);
</script>
