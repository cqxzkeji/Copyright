<template>
  <div class="card chart">
    <div v-for="(v, idx) in data" :key="idx" class="bar-item">
      <div class="bar" :style="{ height: `${(v / max) * 150 + 20}px` }"></div>
      <span>{{ idx + 1 }}月</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({ data: { type: Array, required: true } });
const max = computed(() => Math.max(...props.data));
</script>

<style scoped>
.chart { padding: 16px; display: flex; gap: 10px; align-items: flex-end; overflow-x: auto; }
.bar-item { min-width: 42px; text-align: center; }
.bar { border-radius: 8px 8px 3px 3px; background: linear-gradient(180deg, #66b8ff, #357cff); }
span { font-size: 12px; color: #456; }
</style>
