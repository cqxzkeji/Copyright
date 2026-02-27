<template>
  <ModulePanel :cards="cards" :rows="rows" :actions="actions" :points="points" />
</template>

<script setup>
import ModulePanel from '../components/ModulePanel.vue'
import { createRows } from './moduleData'

const cards = [
  { label: '机会市场', value: '14 个' },
  { label: '竞争对手动态', value: '36 条' },
  { label: '策略建议', value: '21 条' },
]
const actions = [
  { key: 'forecast', label: '趋势预测' },
  { key: 'compare', label: '竞争分析' },
  { key: 'evaluate', label: '机会评估' },
]
const points = [12, 36, 52, 58, 74, 82, 98]
const rows = createRows('市场分析')
</script>
