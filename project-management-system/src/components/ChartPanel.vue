<template>
  <div ref="chartRef" class="chart"></div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({ option: Object })
const chartRef = ref(null)
let chart

onMounted(() => {
  chart = echarts.init(chartRef.value)
  chart.setOption(props.option)
  window.addEventListener('resize', resize)
})

watch(() => props.option, (next) => chart?.setOption(next, true), { deep: true })

function resize() { chart?.resize() }

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  chart?.dispose()
})
</script>

<style scoped>
.chart { width: 100%; height: 280px; }
</style>
