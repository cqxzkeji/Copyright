<script setup>
import ModulePanel from '../components/ModulePanel.vue'
import { buildRows, sampleGallery } from './moduleData'

const config = {
  actions: [
    { label: '新建生成任务', type: 'primary', mode: 'form', tooltip: '配置GAN/VAE参数后创建任务' },
    { label: '启动图像优化', type: 'success', mode: 'progress', tooltip: '根据风格参数优化图像质量' },
    { label: '输出质量报告', type: 'info', mode: 'tip', tooltip: '查看分辨率和噪点分析', tip: '质量报告已生成：清晰度92%，风格一致性89%。' }
  ],
  tableRows: buildRows('图像生成'),
  chartData: [
    { name: 'GPU利用率', value: 82, color: '#2563eb' },
    { name: '风格匹配度', value: 74, color: '#f59e0b' },
    { name: '质量评分', value: 91, color: '#10b981' }
  ],
  gallery: sampleGallery
}
</script>

<template>
  <ModulePanel :config="config" />
</template>
