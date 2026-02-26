<template>
  <div v-if="modelValue" class="overlay" @click.self="$emit('update:modelValue', false)">
    <div class="modal card">
      <header>
        <h3>{{ title }}</h3>
        <button class="secondary" @click="$emit('update:modelValue', false)">关闭</button>
      </header>
      <div class="body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ modelValue: Boolean, title: String });
defineEmits(['update:modelValue']);
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(9, 36, 73, 0.42);
  display: grid;
  place-items: center;
  z-index: 1200;
  padding: 16px;
}
.modal { width: min(760px, 100%); max-height: 85vh; overflow: auto; }
header { display: flex; justify-content: space-between; padding: 16px; border-bottom: 1px solid #e8f0ff; }
.body { padding: 16px; }
</style>
