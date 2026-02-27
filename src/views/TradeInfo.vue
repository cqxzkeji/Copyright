<template>
  <ModulePanel
    v-model="rows"
    :columns="columns"
    :chart-title="'国际贸易信息热度'"
    :chart-data="chartData"
    :image="image"
    :form-fields="formFields"
    :progress="progress"
    :notice-text="'贸易信息按钮用于采集、编辑与导出政策、需求及物流数据。'"
  />
</template>

<script setup>
import { ref } from 'vue'
import ModulePanel from '../components/ModulePanel.vue'
import image from '../assets/trade.svg'
import { generateRows } from './moduleData'

const columns = [
  { key: 'policy', label: '政策主题' },
  { key: 'country', label: '国家/地区' },
  { key: 'demand', label: '市场需求' },
  { key: 'logistics', label: '物流状态' }
]
const formFields = columns
const rows = ref(generateRows('贸易', (i) => ({
  policy: `政策更新-${i}`,
  country: ['东盟', '欧盟', '中东', '拉美'][i % 4],
  demand: `${70 + (i % 25)}指数`,
  logistics: ['正常', '延迟', '高峰预警'][i % 3]
})))
const chartData = [
  { label: '政策变化', value: 82 },
  { label: '需求增长', value: 73 },
  { label: '物流稳定', value: 69 }
]
const progress = [
  { label: '信息采集', value: 90 },
  { label: '数据清洗', value: 76 },
  { label: '归档发布', value: 66 }
]
</script>
