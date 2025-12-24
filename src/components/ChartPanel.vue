<template>
  <div class="card">
    <div class="section-title">
      <h3>{{ title }}</h3>
      <span class="badge">{{ subtitle }}</span>
    </div>
    <div class="chart-placeholder">
      <span
        v-for="(value, index) in heights"
        :key="index"
        :style="{ height: `${value}%` }"
        :title="labels[index]"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: String,
  subtitle: String,
  labels: { type: Array, default: () => [] },
  values: { type: Array, default: () => [] }
});

const heights = computed(() => {
  const max = Math.max(...props.values, 1);
  return props.values.map((value) => Math.round((value / max) * 100));
});
</script>
