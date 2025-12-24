<template>
  <div class="toast" v-if="visible">
    <span>🔔 {{ message }}</span>
    <button class="btn secondary" @click="$emit('close')">知道了</button>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
  message: { type: String, default: '' }
});
</script>
