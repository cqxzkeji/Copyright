<template>
  <ModulePanel :cards="cards" :rows="rows" :actions="actions" :points="points" />
</template>

<script setup>
import ModulePanel from '../components/ModulePanel.vue'
import { createRows } from './moduleData'

const cards = [
  { label: '当日结算金额', value: '¥ 5,620,000' },
  { label: '多币种通道', value: '12 个' },
  { label: '风控预警', value: '3 条' },
]
const actions = [
  { key: 'settle', label: '发起结算' },
  { key: 'fx', label: '汇率锁定' },
  { key: 'risk', label: '风险复核' },
]
const points = [18, 32, 45, 60, 72, 89, 94]
const rows = createRows('支付结算')
</script>
