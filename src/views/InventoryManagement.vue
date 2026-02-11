<script setup>
import { reactive, ref } from 'vue'
import SimpleChart from '../components/SimpleChart.vue'

const stockForm = reactive({ material: '', qty: 0, supplier: '' })
const stockOpen = ref(false)
const warningOpen = ref(false)
const progressOpen = ref(false)
const progress = ref(0)

const data = Array.from({ length: 20 }).map((_, i) => ({
  key: i,
  material: ['玉米', '豆粕', '麸皮', '石粉', '发酵饲料'][i % 5],
  stock: 28 + i * 3,
  safe: 45,
  cycle: `${3 + (i % 6)}天`
}))

const columns = [
  { title: '原料', dataIndex: 'material' },
  { title: '当前库存(吨)', dataIndex: 'stock' },
  { title: '安全库存(吨)', dataIndex: 'safe' },
  { title: '预计可用周期', dataIndex: 'cycle' },
  { title: '操作', key: 'action' }
]

const option = {
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: data.slice(0, 10).map(i => `${i.material}${i.key + 1}`) },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: data.slice(0, 10).map(i => i.stock), name: '库存' }]
}

const addStock = () => {
  progressOpen.value = true
  progress.value = 0
  const timer = setInterval(() => {
    progress.value += 20
    if (progress.value >= 100) {
      clearInterval(timer)
      progressOpen.value = false
      stockOpen.value = true
    }
  }, 120)
}
</script>

<template>
  <a-space direction="vertical" style="width:100%" :size="16">
    <a-card title="库存管理操作" :bordered="false">
      <a-row :gutter="12">
        <a-col :xs="24" :md="8"><a-input v-model:value="stockForm.material" addon-before="原料" placeholder="请输入原料" /></a-col>
        <a-col :xs="24" :md="8"><a-input-number v-model:value="stockForm.qty" addon-before="数量(吨)" style="width:100%" /></a-col>
        <a-col :xs="24" :md="8"><a-input v-model:value="stockForm.supplier" addon-before="供应商" /></a-col>
      </a-row>
      <a-space style="margin-top:12px">
        <a-button type="primary" @click="addStock">登记入库</a-button>
        <a-button @click="warningOpen = true">低库存预警说明</a-button>
      </a-space>
    </a-card>

    <a-card title="库存分布图" :bordered="false">
      <SimpleChart :option="option" />
    </a-card>

    <a-card title="库存明细（20条）" :bordered="false">
      <a-table :columns="columns" :data-source="data" :pagination="{ pageSize: 5 }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button size="small" @click="stockOpen = true">补货建议</a-button>
              <a-button size="small" type="link" @click="stockForm.material = record.material; warningOpen = true">阈值提示</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model:open="stockOpen" title="库存变更结果" centered>
      <p>入库成功：{{ stockForm.material || '原料' }} {{ stockForm.qty || 0 }} 吨。</p>
      <p>系统建议：下一次补货在 2 天后执行，避免断料风险。</p>
    </a-modal>

    <a-modal v-model:open="warningOpen" title="库存预警提示" :footer="null" centered>
      <p>当库存低于安全库存时，系统会推送自动补货建议并生成采购单模板。</p>
      <a-button type="primary" block @click="warningOpen = false">知道了</a-button>
    </a-modal>

    <a-modal v-model:open="progressOpen" title="库存处理进度" :footer="null" :closable="false" centered>
      <a-progress :percent="progress" status="active" />
    </a-modal>
  </a-space>
</template>
