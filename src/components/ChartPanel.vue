<template>
  <div class="chart-card">
    <div class="chart-header flex-between">
      <div>
        <p class="muted">{{ subtitle }}</p>
        <h3>{{ title }}</h3>
      </div>
      <slot name="actions" />
    </div>
    <canvas ref="canvasRef" height="120"></canvas>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { Chart } from 'chart.js/auto';

const props = defineProps({
  title: String,
  subtitle: String,
  config: Object
});

const canvasRef = ref(null);
let chartInstance;

const buildChart = () => {
  if (chartInstance) chartInstance.destroy();
  if (canvasRef.value) {
    chartInstance = new Chart(canvasRef.value, props.config);
  }
};

onMounted(buildChart);
watch(() => props.config, buildChart, { deep: true });
onBeforeUnmount(() => chartInstance?.destroy());
</script>

<style scoped>
.chart-card {
  background: var(--panel);
  padding: 16px;
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(30, 64, 175, 0.08);
}

.chart-header h3 {
  margin: 4px 0 0;
}
</style>
