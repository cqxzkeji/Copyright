<template>
  <ModulePanel
    v-model="rows"
    :columns="columns"
    :chart-title="'跨境物流供应链监控'"
    :chart-data="chartData"
    :image="image"
    :form-fields="formFields"
    :progress="progress"
    :notice-text="'物流模块支持运输跟踪、供应链优化和在途预警。'"
  />
</template>

<script setup>
import { ref } from 'vue'
import ModulePanel from '../components/ModulePanel.vue'
import image from '../assets/logistics.svg'
import { generateRows } from './moduleData'

const columns = [
  { key: 'shipment', label: '运单号' },
  { key: 'route', label: '运输线路' },
  { key: 'eta', label: '预计到达' },
  { key: 'status', label: '运输状态' }
]
const formFields = columns
const rows = ref(generateRows('物流', (i) => ({
  shipment: `LOG-${202600 + i}`,
  route: ['深圳-迪拜', '上海-鹿特丹', '广州-新加坡'][i % 3],
  eta: `2026-03-${String((i % 28) + 1).padStart(2, '0')}`,
  status: ['在途', '清关中', '已签收'][i % 3]
})))
const chartData = [
  { label: '准点率', value: 86 },
  { label: '库存周转', value: 72 },
  { label: '异常处理', value: 68 }
]
const progress = [
  { label: '揽收出库', value: 94 },
  { label: '国际运输', value: 71 },
  { label: '末端交付', value: 63 }
]
</script>
