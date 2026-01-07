<template>
  <div class="modal-backdrop" role="dialog" aria-modal="true">
    <div class="modal">
      <header>
        <h4>{{ title }}</h4>
        <button class="btn ghost" type="button" @click="$emit('close')">关闭</button>
      </header>
      <div class="modal-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
});

defineEmits(['close']);
</script>
