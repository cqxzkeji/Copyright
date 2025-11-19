<template>
  <div ref="chartEl" class="chart"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import * as echarts from 'echarts';

const chartEl = ref(null);
let chartInstance;

const render = () => {
  if (!chartInstance) {
    chartInstance = echarts.init(chartEl.value);
  }
  chartInstance.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      boundaryGap: false
    },
    yAxis: { type: 'value' },
    series: [
      {
        data: [120, 160, 140, 180, 210, 170, 200],
        type: 'line',
        areaStyle: { color: 'rgba(59,130,246,0.2)' },
        smooth: true
      }
    ],
    grid: { left: 32, right: 12, top: 20, bottom: 24 }
  });
};

onMounted(() => {
  render();
  window.addEventListener('resize', render);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', render);
  chartInstance?.dispose();
});
</script>

<style scoped>
.chart {
  width: 100%;
  min-height: 220px;
}
</style>
