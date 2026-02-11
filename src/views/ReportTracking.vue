<script setup>
import { ref } from 'vue'
import SimpleChart from '../components/SimpleChart.vue'

const reportOpen = ref(false)
const traceOpen = ref(false)
const progressOpen = ref(false)
const percent = ref(0)

const reports = Array.from({ length: 20 }).map((_, i) => ({
  key: i,
  batch: `BT-${String(1000 + i)}`,
  date: `2026-05-${String((i % 28) + 1).padStart(2, '0')}`,
  effect: `${92 - (i % 5)}%`,
  issue: ['无异常', '采食下降', '轻微应激'][i % 3]
}))

const columns = [
  { title: '批次号', dataIndex: 'batch' },
  { title: '执行日期', dataIndex: 'date' },
  { title: '配方达成率', dataIndex: 'effect' },
  { title: '跟踪记录', dataIndex: 'issue' },
  { title: '操作', key: 'action' }
]

const chartOption = {
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: reports.slice(0, 10).map(r => r.batch) },
  yAxis: { type: 'value' },
  series: [{ type: 'line', smooth: true, name: '达成率', data: reports.slice(0, 10).map(r => Number(r.effect.replace('%', ''))) }]
}

const generateReport = () => {
  progressOpen.value = true
  percent.value = 0
  const timer = setInterval(() => {
    percent.value += 25
    if (percent.value >= 100) {
      clearInterval(timer)
      progressOpen.value = false
      reportOpen.value = true
    }
  }, 150)
}
</script>

<template>
  <a-space direction="vertical" style="width:100%" :size="16">
    <a-card title="配方报告与跟踪" :bordered="false">
      <a-space>
        <a-button type="primary" @click="generateReport">生成执行报告</a-button>
        <a-button @click="traceOpen = true">跟踪管理提示</a-button>
      </a-space>
    </a-card>

    <a-card title="执行效果趋势图" :bordered="false">
      <SimpleChart :option="chartOption" />
    </a-card>

    <a-card title="批次执行明细（20条）" :bordered="false">
      <a-table :columns="columns" :data-source="reports" :pagination="{ pageSize: 5 }">
        <template #bodyCell="{ column }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button size="small" @click="reportOpen = true">查看报告</a-button>
              <a-button size="small" type="link" @click="traceOpen = true">改进建议</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model:open="reportOpen" title="执行报告详情" centered>
      <p>本批次采食量稳定，料肉比环比改善 4.2%，无抗策略执行合规率 96%。</p>
      <p>建议对异常日龄增加电解多维与复合益生菌组合。</p>
    </a-modal>

    <a-modal v-model:open="traceOpen" title="按钮提示信息" :footer="null" centered>
      <p>跟踪管理用于持续记录批次表现，便于后续优化配方与饲喂策略。</p>
      <a-button type="primary" block @click="traceOpen = false">关闭</a-button>
    </a-modal>

    <a-modal v-model:open="progressOpen" title="报告生成进度" :footer="null" :closable="false" centered>
      <a-progress :percent="percent" status="active" />
    </a-modal>
  </a-space>
</template>
