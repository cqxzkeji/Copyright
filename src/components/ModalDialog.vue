<template>
  <teleport to="body">
    <div v-if="open" class="modal-overlay" @click.self="close">
      <div class="modal">
        <header>
          <h3>{{ title }}</h3>
          <button class="secondary-button" type="button" @click="close">关闭</button>
        </header>
        <div>
          <slot />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
const props = defineProps({
  open: Boolean,
  title: String
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>
