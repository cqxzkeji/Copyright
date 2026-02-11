<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  option: {
    type: Object,
    required: true
  },
  height: {
    type: String,
    default: '320px'
  }
})

const chartRef = ref()
let chartInstance

const renderChart = () => {
  if (!chartRef.value) return
  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }
  chartInstance.setOption(props.option, true)
}

const onResize = () => chartInstance?.resize()

onMounted(() => {
  renderChart()
  window.addEventListener('resize', onResize)
})

watch(() => props.option, renderChart, { deep: true })

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  chartInstance?.dispose()
})
</script>

<template>
  <div ref="chartRef" :style="{ width: '100%', height }" />
</template>
