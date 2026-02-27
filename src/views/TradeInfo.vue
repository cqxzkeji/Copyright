<template>
  <ModulePanel :cards="cards" :rows="rows" :actions="actions" :points="points" />
</template>

<script setup>
import ModulePanel from '../components/ModulePanel.vue'
import { createRows } from './moduleData'

const cards = [
  { label: '政策更新', value: '42 条' },
  { label: '市场需求线索', value: '128 条' },
  { label: '物流快讯', value: '67 条' },
]
const actions = [
  { key: 'collect', label: '新增信息采集' },
  { key: 'classify', label: '智能归类' },
  { key: 'publish', label: '发布订阅提醒' },
]
const points = [15, 40, 62, 34, 70, 88, 96]
const rows = createRows('贸易信息')
</script>
