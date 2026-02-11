<script setup>
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import SimpleChart from '../components/SimpleChart.vue'

const form = reactive({ formula: 'RCP-003', costLimit: 3.2, strategy: '降低蛋白波动' })
const optimizeOpen = ref(false)
const noteOpen = ref(false)
const loadingOpen = ref(false)
const loading = ref(0)

const rows = Array.from({ length: 20 }).map((_, i) => ({
  key: i,
  ingredient: ['玉米', '豆粕', '麸皮', '石粉', '预混料'][i % 5] + (i + 1),
  before: (4 + (i % 6) * 0.8).toFixed(2),
  after: (3.6 + (i % 6) * 0.75).toFixed(2),
  impact: `${(3 + i % 5)}%`
}))

const columns = [
  { title: '原料', dataIndex: 'ingredient' },
  { title: '优化前成本(元/kg)', dataIndex: 'before' },
  { title: '优化后成本(元/kg)', dataIndex: 'after' },
  { title: '成本改善率', dataIndex: 'impact' },
  { title: '操作', key: 'action' }
]

const option = {
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: rows.slice(0, 10).map(i => i.ingredient) },
  yAxis: { type: 'value' },
  series: [
    { name: '优化前', type: 'line', data: rows.slice(0, 10).map(i => Number(i.before)) },
    { name: '优化后', type: 'line', data: rows.slice(0, 10).map(i => Number(i.after)) }
  ]
}

const startOptimize = () => {
  loadingOpen.value = true
  loading.value = 0
  const timer = setInterval(() => {
    loading.value += 25
    if (loading.value >= 100) {
      clearInterval(timer)
      loadingOpen.value = false
      optimizeOpen.value = true
      message.success('配方优化已完成，预计节省成本5.7%')
    }
  }, 180)
}
</script>

<template>
  <a-space direction="vertical" style="width:100%" :size="16">
    <a-card title="配方优化参数" :bordered="false">
      <a-row :gutter="12">
        <a-col :xs="24" :md="8"><a-input v-model:value="form.formula" addon-before="现有配方" /></a-col>
        <a-col :xs="24" :md="8"><a-input-number v-model:value="form.costLimit" addon-before="成本上限" style="width:100%" /></a-col>
        <a-col :xs="24" :md="8"><a-input v-model:value="form.strategy" addon-before="优化策略" /></a-col>
      </a-row>
      <a-space style="margin-top: 12px">
        <a-button type="primary" @click="startOptimize">执行优化</a-button>
        <a-button @click="noteOpen = true">按钮说明</a-button>
      </a-space>
    </a-card>

    <a-card title="优化前后成本趋势图" :bordered="false">
      <SimpleChart :option="option" />
    </a-card>

    <a-card title="原料成本优化明细（20条）" :bordered="false">
      <a-table :columns="columns" :data-source="rows" :pagination="{ pageSize: 5 }">
        <template #bodyCell="{ column }">
          <template v-if="column.key === 'action'">
            <a-button size="small" @click="optimizeOpen = true">查看建议</a-button>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model:open="optimizeOpen" title="优化建议弹窗" centered>
      <p>建议将豆粕比例下调 1.5%，以发酵蛋白源替代，保持日增重不下降。</p>
      <p>建议启用按批次回测，连续3批稳定后再固化配方。</p>
    </a-modal>

    <a-modal v-model:open="noteOpen" title="按钮提示信息" :footer="null" centered>
      <p>执行优化：启动线性规划并基于历史养殖数据迭代。</p>
      <a-button type="primary" block @click="noteOpen = false">关闭</a-button>
    </a-modal>

    <a-modal v-model:open="loadingOpen" :footer="null" :closable="false" title="优化计算进度" centered>
      <a-progress :percent="loading" status="active" />
    </a-modal>
  </a-space>
</template>
