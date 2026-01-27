<template>
  <div class="modal-backdrop" @click.self="onClose">
    <div class="modal" role="dialog" aria-modal="true">
      <header>
        <h3>{{ title }}</h3>
        <button class="ghost" @click="onClose">关闭</button>
      </header>
      <section>
        <slot />
      </section>
      <footer v-if="showFooter">
        <button class="ghost" @click="onClose">取消</button>
        <button @click="onConfirm">确认</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  showFooter: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(["close", "confirm"]);

const onClose = () => emit("close");
const onConfirm = () => emit("confirm");
</script>
