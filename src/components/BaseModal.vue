<template>
  <div class="modal-mask" @click.self="emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="ghost" @click="emit('close')">关闭</button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ""
  }
});

const emit = defineEmits(["close"]);
</script>
