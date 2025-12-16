<script setup>
const props = defineProps({
  title: String,
  show: Boolean
});
const emit = defineEmits(['close']);
</script>

<template>
  <div v-if="props.show" class="modal-mask">
    <div class="modal">
      <div class="section-header">
        <h3>{{ props.title }}</h3>
        <button class="ghost" @click="emit('close')">关闭</button>
      </div>
      <slot />
    </div>
  </div>
</template>
