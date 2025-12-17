<template>
  <div class="overlay" v-if="visible" @click.self="onClose">
    <div class="modal">
      <header>
        <h3>{{ title }}</h3>
        <button class="secondary" @click="onClose">关闭</button>
      </header>
      <div>
        <slot />
      </div>
      <footer v-if="showActions">
        <button class="secondary" @click="onClose">取消</button>
        <button @click="primaryAction">确认</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: Boolean,
  title: {
    type: String,
    default: '提示',
  },
  showActions: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'confirm']);

const onClose = () => emit('close');
const primaryAction = () => emit('confirm');
</script>
