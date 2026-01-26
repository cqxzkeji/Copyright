<template>
  <teleport to="body">
    <div v-if="open" class="modal-mask" @click.self="onClose">
      <div class="modal-card" :style="{ width }">
        <div class="modal-header">
          <h3>{{ title }}</h3>
          <button class="text" type="button" @click="onClose">关闭</button>
        </div>
        <div class="modal-body">
          <slot />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  open: {
    type: Boolean,
    default: false
  },
  width: {
    type: String,
    default: '520px'
  }
});

const emit = defineEmits(['close']);

const onClose = () => {
  emit('close');
};
</script>
