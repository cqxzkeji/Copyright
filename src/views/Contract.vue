<template>
  <ModulePanel :cards="cards" :rows="rows" :actions="actions" :points="points" />
</template>

<script setup>
import ModulePanel from '../components/ModulePanel.vue'
import { createRows } from './moduleData'

const cards = [
  { label: '待签约合同', value: '19 份' },
  { label: '履约中合同', value: '53 份' },
  { label: '即将到期', value: '8 份' },
]
const actions = [
  { key: 'new-contract', label: '新建合同' },
  { key: 'track', label: '履约跟踪' },
  { key: 'archive', label: '合同归档' },
]
const points = [10, 22, 48, 66, 73, 80, 90]
const rows = createRows('合同协议')
</script>
