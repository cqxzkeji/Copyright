<template>
  <ModulePanel :buttons="buttons" :columns="columns" :table-data="tableData" :chart-options="chartOptions" :form-fields="formFields" />
</template>

<script setup>
import ModulePanel from '../components/ModulePanel.vue'

const buttons = [
  { key: 'sync', label: '库存同步', type: 'progress', tip: '库存数据同步任务已加入队列。' },
  { key: 'warn', label: '设置预警', type: 'form', tip: '预警阈值设置成功。' },
  { key: 'audit', label: '库存盘点', type: 'info', tip: '盘点任务已安排至今日夜班。' }
]

const columns = [
  { prop: 'sku', label: 'SKU编码' },
  { prop: 'name', label: '货品名称' },
  { prop: 'area', label: '库区' },
  { prop: 'stock', label: '实时库存' },
  { prop: 'safe', label: '安全库存' }
]

const tableData = Array.from({ length: 24 }, (_, i) => ({
  sku: `SKU-${1000 + i}`,
  name: `标准件-${i + 1}`,
  area: `A-${(i % 6) + 1}`,
  stock: 120 + i * 8,
  safe: 100 + (i % 5) * 10
}))

const chartOptions = {
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
  yAxis: { type: 'value' },
  series: [{ data: [520, 600, 650, 590, 720, 760, 810], type: 'line', smooth: true, areaStyle: {} }]
}

const formFields = [
  { prop: 'sku', label: 'SKU编码' },
  { prop: 'threshold', label: '预警阈值' },
  { prop: 'owner', label: '负责人' }
]
</script>
