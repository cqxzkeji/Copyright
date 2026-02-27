<template>
  <ModulePanel :buttons="buttons" :columns="columns" :table-data="tableData" :chart-options="chartOptions" :form-fields="formFields" />
</template>

<script setup>
import ModulePanel from '../components/ModulePanel.vue'

const buttons = [
  { key: 'trace', label: '状态追踪', type: 'info', tip: '订单状态已刷新到最新节点。' },
  { key: 'dispatch', label: '自动调度', type: 'progress', tip: '调度策略执行完成。' },
  { key: 'manual', label: '人工干预', type: 'form', tip: '人工干预工单已提交。' }
]

const columns = [
  { prop: 'orderId', label: '订单号' },
  { prop: 'customer', label: '客户' },
  { prop: 'priority', label: '优先级' },
  { prop: 'status', label: '处理状态' },
  { prop: 'eta', label: '预计完成' }
]

const tableData = Array.from({ length: 25 }, (_, i) => ({
  orderId: `ORD-${32000 + i}`,
  customer: `客户-${(i % 12) + 1}`,
  priority: ['高', '中', '低'][i % 3],
  status: ['待拣货', '拣货中', '待发运', '已完成'][i % 4],
  eta: `2026-03-${String((i % 28) + 1).padStart(2, '0')} 16:00`
}))

const chartOptions = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['新增订单', '完成订单'] },
  xAxis: { type: 'category', data: ['1时', '4时', '8时', '12时', '16时', '20时'] },
  yAxis: { type: 'value' },
  series: [
    { name: '新增订单', type: 'bar', data: [120, 132, 101, 134, 90, 230] },
    { name: '完成订单', type: 'bar', data: [80, 90, 88, 110, 105, 180] }
  ]
}

const formFields = [
  { prop: 'orderId', label: '订单号' },
  { prop: 'reason', label: '干预原因' },
  { prop: 'assignee', label: '处理人' }
]
</script>
