<template>
  <div v-if="show" class="modal-mask" role="dialog" aria-modal="true">
    <div class="modal">
      <header>{{ title }}</header>
      <div>
        <slot />
      </div>
      <footer>
        <slot name="footer">
          <button class="action-button secondary" type="button" @click="close">取消</button>
          <button class="action-button" type="button" @click="close">确认</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  title: {
    type: String,
    default: '提示'
  }
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>
