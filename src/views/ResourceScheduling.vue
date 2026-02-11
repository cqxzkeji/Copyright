<script setup>
import ModulePanel from '../components/ModulePanel.vue'
import { buildRows, sampleGallery } from './moduleData'

const config = {
  actions: [
    { label: '配置调度策略', type: 'primary', mode: 'form', tooltip: '设置优先级与阈值规则' },
    { label: '执行负载均衡', type: 'warning', mode: 'progress', tooltip: '动态分配节点计算资源' },
    { label: '调度建议', type: 'info', mode: 'tip', tooltip: '查看当前资源风险提示', tip: '建议将节点A的任务迁移20%至节点C，以避免峰值拥塞。' }
  ],
  tableRows: buildRows('资源调度'),
  chartData: [
    { name: '集群负载', value: 67, color: '#3b82f6' },
    { name: '队列积压', value: 31, color: '#eab308' },
    { name: '可用算力', value: 85, color: '#22c55e' }
  ],
  gallery: sampleGallery
}
</script>

<template>
  <ModulePanel :config="config" />
</template>
