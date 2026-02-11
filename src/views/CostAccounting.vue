<script setup>
import { ref } from 'vue'
import SimpleChart from '../components/SimpleChart.vue'

const calcModal = ref(false)
const reportModal = ref(false)
const progressModal = ref(false)
const percent = ref(0)

const list = Array.from({ length: 20 }).map((_, i) => ({
  key: i,
  formula: `CST-${String(i + 1).padStart(3, '0')}`,
  total: (2860 + i * 22).toFixed(0),
  ratio: (1.15 + i * 0.03).toFixed(2),
  roi: `${(8 + (i % 7) * 1.2).toFixed(1)}%`
}))

const columns = [
  { title: '配方编号', dataIndex: 'formula' },
  { title: '吨成本(元)', dataIndex: 'total' },
  { title: '料肉比', dataIndex: 'ratio' },
  { title: '收益率', dataIndex: 'roi' },
  { title: '操作', key: 'action' }
]

const option = {
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: list.slice(0, 10).map(v => v.formula) },
  yAxis: [{ type: 'value', name: '成本' }, { type: 'value', name: '收益率' }],
  series: [
    { type: 'bar', name: '吨成本', data: list.slice(0, 10).map(v => Number(v.total)) },
    { type: 'line', name: '收益率', yAxisIndex: 1, data: list.slice(0, 10).map(v => Number(v.roi.replace('%', ''))) }
  ]
}

const runCalc = () => {
  progressModal.value = true
  percent.value = 0
  const timer = setInterval(() => {
    percent.value += 25
    if (percent.value >= 100) {
      clearInterval(timer)
      progressModal.value = false
      calcModal.value = true
    }
  }, 200)
}
</script>

<template>
  <a-space direction="vertical" style="width:100%" :size="16">
    <a-card title="成本核算与经济分析" :bordered="false">
      <a-space>
        <a-button type="primary" @click="runCalc">重新核算</a-button>
        <a-button @click="reportModal = true">查看报告说明</a-button>
      </a-space>
    </a-card>

    <a-card title="成本与收益图表" :bordered="false">
      <SimpleChart :option="option" />
    </a-card>

    <a-card title="配方成本明细表（20条）" :bordered="false">
      <a-table :columns="columns" :data-source="list" :pagination="{ pageSize: 5 }">
        <template #bodyCell="{ column }">
          <template v-if="column.key === 'action'">
            <a-button size="small" @click="calcModal = true">经济评估</a-button>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model:open="calcModal" title="核算完成" centered>
      <p>当前优选配方：CST-009，吨成本 3040 元，预计净收益提升 12.4%。</p>
      <p>建议结合库存模块自动补货，进一步控制成本波动。</p>
    </a-modal>

    <a-modal v-model:open="reportModal" title="按钮提示信息" :footer="null" centered>
      <p>报告说明：系统将按原料价格、日增重、料肉比自动生成经济效益分析。</p>
      <a-button type="primary" block @click="reportModal = false">确认</a-button>
    </a-modal>

    <a-modal v-model:open="progressModal" :footer="null" :closable="false" title="核算进度" centered>
      <a-progress :percent="percent" status="active" />
    </a-modal>
  </a-space>
</template>
