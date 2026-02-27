<template>
  <ModulePanel
    v-model="rows"
    :columns="columns"
    :chart-title="'合同履约健康度'"
    :chart-data="chartData"
    :image="image"
    :form-fields="formFields"
    :progress="progress"
    :notice-text="'合同模块支持签署、履约跟踪、合规审查与归档。'"
  />
</template>

<script setup>
import { ref } from 'vue'
import ModulePanel from '../components/ModulePanel.vue'
import image from '../assets/contract.svg'
import { generateRows } from './moduleData'

const columns = [
  { key: 'contractNo', label: '合同编号' },
  { key: 'partner', label: '合作方' },
  { key: 'amount', label: '合同金额' },
  { key: 'status', label: '履约状态' }
]
const formFields = columns
const rows = ref(generateRows('合同', (i) => ({
  contractNo: `HT-2026-${String(i).padStart(3, '0')}`,
  partner: `合作企业-${i}`,
  amount: `${(20 + i) * 10000} USD`,
  status: ['执行中', '已完成', '待补充材料'][i % 3]
})))
const chartData = [
  { label: '按期履约', value: 88 },
  { label: '风险条款', value: 23 },
  { label: '归档完整', value: 80 }
]
const progress = [
  { label: '合同签署', value: 95 },
  { label: '履约跟踪', value: 82 },
  { label: '法务审查', value: 74 }
]
</script>
