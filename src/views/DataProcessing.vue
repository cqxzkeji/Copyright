<script setup>
import ModulePanel from '../components/ModulePanel.vue'
import { buildRows, sampleGallery } from './moduleData'

const config = {
  actions: [
    { label: '创建采集计划', type: 'primary', mode: 'form', tooltip: '录入来源渠道与采样频次' },
    { label: '运行清洗流程', type: 'success', mode: 'progress', tooltip: '去重、补全与格式统一' },
    { label: '查看数据健康度', type: 'info', mode: 'tip', tooltip: '检查数据完整性与合规性', tip: '数据健康度：96%，缺失值比例0.8%，已自动修复。' }
  ],
  tableRows: buildRows('数据处理'),
  chartData: [
    { name: '采集完成率', value: 88, color: '#4f46e5' },
    { name: '清洗通过率', value: 93, color: '#0ea5e9' },
    { name: '格式标准化', value: 79, color: '#84cc16' }
  ],
  gallery: sampleGallery
}
</script>

<template>
  <ModulePanel :config="config" />
</template>
