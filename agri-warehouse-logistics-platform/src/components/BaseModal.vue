<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal">
      <header>
        <h3>{{ title }}</h3>
        <button class="ghost-btn" @click="close">关闭</button>
      </header>
      <div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>
