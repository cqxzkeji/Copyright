<script setup>
import ModulePanel from '../components/ModulePanel.vue'
import { buildRows, sampleGallery } from './moduleData'

const config = {
  actions: [
    { label: '设置告警规则', type: 'primary', mode: 'form', tooltip: '设置超时、失败率告警阈值' },
    { label: '生成监控报告', type: 'success', mode: 'progress', tooltip: '统计任务和资源趋势' },
    { label: '发送告警演练', type: 'danger', mode: 'tip', tooltip: '模拟告警通知流程', tip: '告警演练已触发，短信与邮件通知均成功送达。' }
  ],
  tableRows: buildRows('进度监控'),
  chartData: [
    { name: '任务成功率', value: 94, color: '#16a34a' },
    { name: '平均耗时达标', value: 76, color: '#f97316' },
    { name: '告警处理率', value: 83, color: '#0284c7' }
  ],
  gallery: sampleGallery
}
</script>

<template>
  <ModulePanel :config="config" />
</template>
