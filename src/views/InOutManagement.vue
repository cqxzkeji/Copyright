<template>
  <ModulePanel :buttons="buttons" :columns="columns" :table-data="tableData" :chart-options="chartOptions" :form-fields="formFields" />
</template>

<script setup>
import ModulePanel from '../components/ModulePanel.vue'

const buttons = [
  { key: 'inbound', label: '新建入库', type: 'form', tip: '入库单已创建并分配月台。' },
  { key: 'outbound', label: '出库调度', type: 'progress', tip: '出库任务调度完成。' },
  { key: 'sync', label: '数据同步', type: 'info', tip: '入库、出库数据已实时同步。' }
]

const columns = [
  { prop: 'taskId', label: '任务单号' },
  { prop: 'type', label: '类型' },
  { prop: 'dock', label: '月台' },
  { prop: 'status', label: '状态' },
  { prop: 'operator', label: '操作员' }
]

const tableData = Array.from({ length: 22 }, (_, i) => ({
  taskId: `IO-${22000 + i}`,
  type: i % 2 === 0 ? '入库' : '出库',
  dock: `D${(i % 8) + 1}`,
  status: ['待执行', '执行中', '已完成'][i % 3],
  operator: `员工-${(i % 9) + 1}`
}))

const chartOptions = {
  tooltip: { trigger: 'item' },
  legend: { bottom: 0 },
  series: [
    {
      type: 'pie',
      radius: ['45%', '70%'],
      data: [
        { value: 42, name: '入库完成' },
        { value: 31, name: '出库完成' },
        { value: 9, name: '执行中' },
        { value: 4, name: '异常' }
      ]
    }
  ]
}

const formFields = [
  { prop: 'taskId', label: '任务单号' },
  { prop: 'dock', label: '月台编号' },
  { prop: 'expected', label: '预计件数' }
]
</script>
