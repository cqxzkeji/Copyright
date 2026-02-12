<template>
  <el-row :gutter="16">
    <el-col :xs="24" :lg="15">
      <el-card>
        <template #header>
          <div class="head">
            <span>成本核算清单</span>
            <div>
              <el-button type="primary" @click="calc">重新核算</el-button>
              <el-button @click="dialog=true">利润试算</el-button>
              <el-button type="success" @click="openTip('本月成本报表已导出')">导出报表</el-button>
            </div>
          </div>
        </template>
        <el-table :data="rows" border height="480">
          <el-table-column prop="batch" label="批次" width="120" />
          <el-table-column prop="tonCost" label="吨料成本" />
          <el-table-column prop="ratio" label="原料占比" />
          <el-table-column prop="profit" label="预计利润" />
          <el-table-column label="操作" width="120"><template #default="{row}"><el-button size="small" @click="openTip(`${row.batch} 明细已打开`)">明细</el-button></template></el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :xs="24" :lg="9">
      <el-card><div ref="lineRef" style="height:320px"></div></el-card>
      <el-card style="margin-top:16px"><el-progress :percentage="79" status="success" /><p>本月成本控制达成率</p></el-card>
    </el-col>
  </el-row>

  <el-dialog v-model="dialog" title="利润试算" width="420" :close-on-click-modal="false">
    <el-form label-width="110px">
      <el-form-item label="销售单价"><el-input v-model="price" /></el-form-item>
      <el-form-item label="预估销量"><el-input v-model="amount" /></el-form-item>
    </el-form>
    <template #footer><el-button @click="dialog=false">取消</el-button><el-button type="primary" @click="openTip(`预计利润 ${(price*amount*0.18).toFixed(0)} 元`)">计算</el-button></template>
  </el-dialog>
  <el-dialog v-model="progressDialog" title="核算进度" width="380" :close-on-click-modal="false"><el-progress :percentage="progress" /><template #footer><el-button type="primary" @click="progressDialog=false">关闭</el-button></template></el-dialog>
  <el-dialog v-model="tipDialog" title="提示" width="360" :close-on-click-modal="false"><p>{{tip}}</p><template #footer><el-button type="primary" @click="tipDialog=false">确定</el-button></template></el-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
const lineRef = ref()
const dialog = ref(false)
const progressDialog = ref(false)
const tipDialog = ref(false)
const progress = ref(0)
const tip = ref('')
const price = ref(4200)
const amount = ref(180)

const rows = Array.from({ length: 20 }).map((_, i) => ({
  batch: `BATCH-${String(i + 1).padStart(3, '0')}`,
  tonCost: `${3250 + i * 18} 元`,
  ratio: `${(72 + (i % 8)).toFixed(1)}%`,
  profit: `${(780 + i * 20)} 元/吨`
}))

const openTip = (t) => { tip.value = t; tipDialog.value = true; dialog.value = false }
const calc = async () => {
  progressDialog.value = true
  progress.value = 0
  for (let i = 1; i <= 10; i++) { await new Promise((r) => setTimeout(r, 70)); progress.value = i * 10 }
}

onMounted(() => {
  const c = echarts.init(lineRef.value)
  c.setOption({
    title: { text: '近6月吨料成本趋势', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
    yAxis: { type: 'value' },
    series: [{ type: 'line', data: [3380, 3330, 3290, 3360, 3315, 3278], smooth: true }]
  })
})
</script>

<style scoped>.head{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;}</style>
