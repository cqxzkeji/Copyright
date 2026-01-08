<template>
  <div class="modal-overlay" @click.self="onClose">
    <div class="modal">
      <header>{{ title }}</header>
      <div>
        <slot />
      </div>
      <footer class="actions">
        <slot name="footer">
          <button class="primary-btn" type="button" @click="onClose">确认</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "提示"
  }
});

const emit = defineEmits(["close"]);

const onClose = () => emit("close");
</script>
