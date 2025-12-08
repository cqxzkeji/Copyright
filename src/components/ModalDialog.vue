<template>
  <teleport to="body">
    <div v-if="show" class="modal-mask" @click.self="close">
      <div class="modal-window">
        <header class="modal-header">
          <h3 style="margin:0">{{ title }}</h3>
          <button class="button secondary" style="padding:6px 10px" @click="close">关闭</button>
        </header>
        <div class="modal-body">
          <slot />
        </div>
        <div class="modal-actions" v-if="$slots.actions">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  title: String
});
const emit = defineEmits(['close']);
const close = () => emit('close');
</script>
