<template>
  <div v-if="show" class="modal-mask" @click.self="onClose">
    <div class="modal-container">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="btn secondary" @click="onClose">关闭</button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
      <div class="modal-footer">
        <slot name="footer">
          <button class="btn secondary" @click="onClose">返回</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close']);
const onClose = () => emit('close');
</script>
