<template>
  <ModulePanel :cards="cards" :rows="rows" :actions="actions" :points="points" />
</template>

<script setup>
import ModulePanel from '../components/ModulePanel.vue'
import { createRows } from './moduleData'

const cards = [
  { label: '在途订单', value: '211 单' },
  { label: '平均运输时效', value: '6.2 天' },
  { label: '异常节点', value: '5 个' },
]
const actions = [
  { key: 'track', label: '运输跟踪' },
  { key: 'optimize', label: '路径优化' },
  { key: 'inventory', label: '库存协同' },
]
const points = [20, 30, 35, 55, 65, 84, 92]
const rows = createRows('物流供应链')
</script>
