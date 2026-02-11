<script setup>
import ModulePanel from '../components/ModulePanel.vue'
import { buildRows, sampleGallery } from './moduleData'

const config = {
  actions: [
    { label: '创建同步计划', type: 'primary', mode: 'form', tooltip: '配置云端与社媒目标平台' },
    { label: '执行跨端同步', type: 'success', mode: 'progress', tooltip: '将图像资产同步到多平台' },
    { label: '查看传播结果', type: 'info', mode: 'tip', tooltip: '查看渠道触达与完成率', tip: '传播结果：云存储同步100%，社交媒体发布成功率97%。' }
  ],
  tableRows: buildRows('跨平台发布'),
  chartData: [
    { name: '云端同步率', value: 97, color: '#0ea5e9' },
    { name: '社媒发布率', value: 87, color: '#a855f7' },
    { name: '传播计划达成', value: 81, color: '#22c55e' }
  ],
  gallery: sampleGallery
}
</script>

<template>
  <ModulePanel :config="config" />
</template>
