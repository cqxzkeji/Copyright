<template>
  <ModulePanel
    v-model="rows"
    :columns="columns"
    :chart-title="'市场趋势与机会指数'"
    :chart-data="chartData"
    :image="image"
    :form-fields="formFields"
    :progress="progress"
    :notice-text="'市场分析模块支持趋势预测、竞争分析与机会评估。'"
  />
</template>

<script setup>
import { ref } from 'vue'
import ModulePanel from '../components/ModulePanel.vue'
import image from '../assets/market.svg'
import { generateRows } from './moduleData'

const columns = [
  { key: 'region', label: '目标市场' },
  { key: 'trend', label: '趋势值' },
  { key: 'competitor', label: '竞争强度' },
  { key: 'opportunity', label: '机会评级' }
]
const formFields = columns
const rows = ref(generateRows('市场', (i) => ({
  region: ['中东', '北美', '东南亚', '非洲'][i % 4],
  trend: `${60 + (i % 35)}`,
  competitor: ['低', '中', '高'][i % 3],
  opportunity: ['A', 'B', 'C'][i % 3]
})))
const chartData = [
  { label: '需求景气', value: 84 },
  { label: '竞争压力', value: 52 },
  { label: '机会评分', value: 77 }
]
const progress = [
  { label: '数据建模', value: 88 },
  { label: '趋势预测', value: 78 },
  { label: '策略输出', value: 64 }
]
</script>
