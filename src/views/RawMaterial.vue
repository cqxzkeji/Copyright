<template>
  <el-row :gutter="16">
    <el-col :xs="24" :lg="16">
      <el-card>
        <template #header>
          <div class="head">
            <span>原料信息台账</span>
            <div class="btns">
              <el-button type="primary" @click="openForm('新增原料')">新增原料</el-button>
              <el-button @click="openForm('编辑原料')">编辑原料</el-button>
              <el-button type="warning" @click="openTip('供应商报价已同步完成')">同步报价</el-button>
              <el-button type="success" @click="openProgress('导入营养指标中...')">导入指标</el-button>
            </div>
          </div>
        </template>
        <el-table :data="materials" height="520" border>
          <el-table-column prop="name" label="原料" width="120" />
          <el-table-column prop="protein" label="粗蛋白(%)" width="100" />
          <el-table-column prop="energy" label="代谢能(kcal/kg)" width="140" />
          <el-table-column prop="price" label="单价(元/吨)" width="120" />
          <el-table-column prop="supplier" label="供应商" />
          <el-table-column prop="stock" label="库存(吨)" width="90" />
          <el-table-column label="操作" width="170" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="openTip(`已查看 ${row.name} 详情`)">查看</el-button>
              <el-button size="small" type="danger" @click="openTip(`已标记 ${row.name} 为停用`)">停用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :xs="24" :lg="8">
      <el-card>
        <div ref="chartRef" style="height: 300px"></div>
      </el-card>
      <el-card style="margin-top: 16px">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="原料总数">{{ materials.length }}</el-descriptions-item>
          <el-descriptions-item label="高蛋白原料">8项</el-descriptions-item>
          <el-descriptions-item label="本月均价">3126 元/吨</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-col>
  </el-row>

  <el-dialog v-model="formDialog" :title="dialogTitle" width="520" :close-on-click-modal="false">
    <el-form label-width="100px">
      <el-form-item label="原料名称"><el-input v-model="form.name" /></el-form-item>
      <el-form-item label="粗蛋白"><el-input v-model="form.protein" /></el-form-item>
      <el-form-item label="代谢能"><el-input v-model="form.energy" /></el-form-item>
      <el-form-item label="单价"><el-input v-model="form.price" /></el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="formDialog = false">取消</el-button>
      <el-button type="primary" @click="openTip(`${dialogTitle}已保存`)">保存</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="tipDialog" title="系统提示" width="420" :close-on-click-modal="false">
    <p>{{ tipText }}</p>
    <template #footer><el-button type="primary" @click="tipDialog = false">我知道了</el-button></template>
  </el-dialog>

  <el-dialog v-model="progressDialog" title="执行进度" width="420" :close-on-click-modal="false">
    <p>{{ progressText }}</p>
    <el-progress :percentage="progress" :stroke-width="16" status="success" />
    <template #footer><el-button type="primary" @click="progressDialog = false">关闭</el-button></template>
  </el-dialog>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const materials = Array.from({ length: 22 }).map((_, i) => ({
  name: `原料${i + 1}`,
  protein: (12 + (i % 8) * 2).toFixed(1),
  energy: 2700 + (i % 5) * 110,
  price: 2400 + i * 55,
  supplier: `供应商${(i % 6) + 1}`,
  stock: 20 + (i % 9) * 8
}))

const chartRef = ref()
const formDialog = ref(false)
const tipDialog = ref(false)
const progressDialog = ref(false)
const dialogTitle = ref('')
const tipText = ref('')
const progressText = ref('')
const progress = ref(0)
const form = ref({ name: '', protein: '', energy: '', price: '' })

const openForm = (title) => { dialogTitle.value = title; formDialog.value = true }
const openTip = (text) => { tipText.value = text; tipDialog.value = true; formDialog.value = false }
const openProgress = async (text) => {
  progressText.value = text
  progress.value = 0
  progressDialog.value = true
  for (let i = 1; i <= 5; i += 1) {
    await new Promise((r) => setTimeout(r, 120))
    progress.value = i * 20
  }
}

onMounted(() => {
  const chart = echarts.init(chartRef.value)
  chart.setOption({
    title: { text: '主要原料价格分布', left: 'center' },
    tooltip: {},
    xAxis: { type: 'category', data: ['玉米', '豆粕', '麦麸', '鱼粉', '发酵料'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [2850, 3980, 2560, 9120, 4350], itemStyle: { color: '#6fa8dc' } }]
  })
  nextTick(() => window.addEventListener('resize', () => chart.resize()))
})
</script>

<style scoped>
.head { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; }
.btns { display: flex; gap: 8px; flex-wrap: wrap; }
</style>
