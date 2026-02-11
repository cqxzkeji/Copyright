<script setup>
import { computed, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import SimpleChart from '../components/SimpleChart.vue'

const search = reactive({ species: '肉鸡', stage: '育成期', weight: 2.2, target: '增重优先' })
const recommendVisible = ref(false)
const detailVisible = ref(false)
const progressVisible = ref(false)
const progress = ref(0)
const current = ref({})

const records = Array.from({ length: 20 }).map((_, i) => ({
  key: i + 1,
  code: `RCP-${String(i + 1).padStart(3, '0')}`,
  species: i % 2 ? '肉鸭' : '肉鸡',
  cp: (17 + (i % 4) * 0.8).toFixed(1),
  energy: 2850 + (i % 5) * 40,
  additive: i % 3 ? '酶制剂+益生菌' : '酸化剂+植物提取物',
  fit: ['育雏期', '育成期', '育肥期'][i % 3]
}))

const columns = [
  { title: '配方编号', dataIndex: 'code' },
  { title: '适用动物', dataIndex: 'species' },
  { title: '粗蛋白(%)', dataIndex: 'cp' },
  { title: '代谢能(kcal/kg)', dataIndex: 'energy' },
  { title: '无抗方案', dataIndex: 'additive' },
  { title: '适用阶段', dataIndex: 'fit' },
  { title: '操作', key: 'action' }
]

const chartOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['粗蛋白', '代谢能'] },
  xAxis: { type: 'category', data: records.slice(0, 8).map(r => r.code) },
  yAxis: [{ type: 'value', name: '粗蛋白' }, { type: 'value', name: '代谢能' }],
  series: [
    { type: 'line', name: '粗蛋白', data: records.slice(0, 8).map(r => Number(r.cp)) },
    { type: 'bar', name: '代谢能', yAxisIndex: 1, data: records.slice(0, 8).map(r => r.energy) }
  ]
}))

const runRecommend = () => {
  progressVisible.value = true
  progress.value = 0
  const timer = setInterval(() => {
    progress.value += 20
    if (progress.value >= 100) {
      clearInterval(timer)
      progressVisible.value = false
      recommendVisible.value = true
      message.success('推荐完成，已生成3套候选配方')
    }
  }, 180)
}

const showDetail = (row) => {
  current.value = row
  detailVisible.value = true
}
</script>

<template>
  <a-space direction="vertical" style="width: 100%" :size="16">
    <a-card title="饲料配方推荐条件输入" :bordered="false">
      <a-row :gutter="12">
        <a-col :xs="24" :md="6"><a-input v-model:value="search.species" addon-before="动物种类" /></a-col>
        <a-col :xs="24" :md="6"><a-input v-model:value="search.stage" addon-before="生长阶段" /></a-col>
        <a-col :xs="24" :md="6"><a-input-number v-model:value="search.weight" addon-before="体重(kg)" style="width:100%" /></a-col>
        <a-col :xs="24" :md="6"><a-input v-model:value="search.target" addon-before="目标" /></a-col>
      </a-row>
      <a-space style="margin-top: 12px">
        <a-button type="primary" @click="runRecommend">智能推荐</a-button>
        <a-button @click="recommendVisible = true">查看推荐说明</a-button>
      </a-space>
    </a-card>

    <a-card title="推荐配方营养分布图" :bordered="false">
      <SimpleChart :option="chartOption" />
    </a-card>

    <a-card title="无抗配方库（20条示例数据）" :bordered="false">
      <a-table :columns="columns" :data-source="records" :pagination="{ pageSize: 6 }" :scroll="{ x: 880 }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button size="small" @click="showDetail(record)">详情</a-button>
              <a-button size="small" type="link" @click="recommendVisible = true">应用提示</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model:open="recommendVisible" title="推荐结果与提示" :footer="null" centered>
      <p>系统根据{{ search.species }}-{{ search.stage }}需求，优先推荐低豆粕+酶制剂方案。</p>
      <p>提示：如环境应激较高，建议额外添加植物精油 150g/吨。</p>
      <a-button type="primary" block @click="recommendVisible = false">我知道了</a-button>
    </a-modal>

    <a-modal v-model:open="detailVisible" title="配方详情" centered>
      <a-descriptions bordered :column="1" size="small">
        <a-descriptions-item label="配方编号">{{ current.code }}</a-descriptions-item>
        <a-descriptions-item label="粗蛋白">{{ current.cp }}%</a-descriptions-item>
        <a-descriptions-item label="代谢能">{{ current.energy }} kcal/kg</a-descriptions-item>
        <a-descriptions-item label="无抗策略">{{ current.additive }}</a-descriptions-item>
      </a-descriptions>
    </a-modal>

    <a-modal v-model:open="progressVisible" title="推荐计算中" :footer="null" :closable="false" centered>
      <a-progress :percent="progress" status="active" />
    </a-modal>
  </a-space>
</template>
