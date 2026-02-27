<template>
  <ModulePanel :buttons="buttons" :columns="columns" :table-data="tableData" :chart-options="chartOptions" :form-fields="formFields" />
</template>

<script setup>
import ModulePanel from '../components/ModulePanel.vue'

const buttons = [
  { key: 'daily', label: '生成日报', type: 'progress', tip: '日报已生成并推送。' },
  { key: 'weekly', label: '生成周报', type: 'progress', tip: '周报已生成并推送。' },
  { key: 'custom', label: '自定义报表', type: 'form', tip: '自定义报表任务已创建。' }
]

const columns = [
  { prop: 'date', label: '日期' },
  { prop: 'inbound', label: '入库量' },
  { prop: 'outbound', label: '出库量' },
  { prop: 'efficiency', label: '作业效率(%)' },
  { prop: 'delay', label: '延迟率(%)' }
]

const tableData = Array.from({ length: 30 }, (_, i) => ({
  date: `2026-02-${String((i % 28) + 1).padStart(2, '0')}`,
  inbound: 200 + (i % 7) * 14,
  outbound: 185 + (i % 6) * 12,
  efficiency: 90 + (i % 5),
  delay: (2 + (i % 4) * 0.6).toFixed(1)
}))

const chartOptions = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['效率', '延迟率'] },
  xAxis: { type: 'category', data: ['第1周', '第2周', '第3周', '第4周'] },
  yAxis: [{ type: 'value' }, { type: 'value' }],
  series: [
    { name: '效率', type: 'line', data: [91, 93, 94, 95], yAxisIndex: 0, smooth: true },
    { name: '延迟率', type: 'line', data: [3.2, 2.9, 2.5, 2.1], yAxisIndex: 1, smooth: true }
  ]
}

const formFields = [
  { prop: 'reportName', label: '报表名称' },
  { prop: 'range', label: '统计周期' },
  { prop: 'receiver', label: '接收人' }
]
</script>
