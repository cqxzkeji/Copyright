<template>
  <ModulePanel :buttons="buttons" :columns="columns" :table-data="tableData" :chart-options="chartOptions" :form-fields="formFields" />
</template>

<script setup>
import ModulePanel from '../components/ModulePanel.vue'

const buttons = [
  { key: 'rule', label: '新增预警规则', type: 'form', tip: '风险预警规则已启用。' },
  { key: 'mark', label: '标记异常任务', type: 'form', tip: '异常任务标记成功。' },
  { key: 'handle', label: '自动处理异常', type: 'progress', tip: '异常事件自动处理完成。' }
]

const columns = [
  { prop: 'alertId', label: '预警编号' },
  { prop: 'level', label: '风险等级' },
  { prop: 'scene', label: '场景' },
  { prop: 'task', label: '关联任务' },
  { prop: 'status', label: '处理状态' }
]

const tableData = Array.from({ length: 23 }, (_, i) => ({
  alertId: `ALT-${5200 + i}`,
  level: ['高', '中', '低'][i % 3],
  scene: ['库存不足', '超时出库', '订单阻塞', '设备故障'][i % 4],
  task: `TASK-${8800 + i}`,
  status: ['待处理', '处理中', '已关闭'][i % 3]
}))

const chartOptions = {
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['库存风险', '流程风险', '订单风险', '设备风险'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [16, 11, 9, 6], itemStyle: { color: '#f56c6c' } }]
}

const formFields = [
  { prop: 'ruleName', label: '规则名称' },
  { prop: 'level', label: '风险等级' },
  { prop: 'action', label: '处理策略' }
]
</script>
