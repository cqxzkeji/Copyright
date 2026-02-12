<template>
  <el-row :gutter="16">
    <el-col :xs="24" :lg="12"><el-card><div ref="pieRef" style="height:300px"></div></el-card></el-col>
    <el-col :xs="24" :lg="12"><el-card><div ref="barRef" style="height:300px"></div></el-card></el-col>
  </el-row>
  <el-card style="margin-top:16px">
    <template #header>
      <div class="head">
        <span>经营分析报表</span>
        <div>
          <el-button type="primary" @click="open('生成月报任务已提交')">生成月报</el-button>
          <el-button @click="open('同比分析图已更新')">同比分析</el-button>
          <el-button type="success" @click="open('报表已分享给管理层')">报表分享</el-button>
        </div>
      </div>
    </template>
    <el-table :data="report" border>
      <el-table-column prop="month" label="月份" />
      <el-table-column prop="conversion" label="料肉比" />
      <el-table-column prop="cost" label="单只成本(元)" />
      <el-table-column prop="profit" label="净利润(万元)" />
    </el-table>
  </el-card>

  <el-dialog v-model="tipDialog" title="操作提示" width="360" :close-on-click-modal="false"><p>{{tip}}</p><template #footer><el-button type="primary" @click="tipDialog=false">关闭</el-button></template></el-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
const pieRef = ref()
const barRef = ref()
const tipDialog = ref(false)
const tip = ref('')
const open = (t) => { tip.value = t; tipDialog.value = true }

const report = [
  { month: '1月', conversion: 1.62, cost: 16.4, profit: 22.1 },
  { month: '2月', conversion: 1.59, cost: 16.1, profit: 23.4 },
  { month: '3月', conversion: 1.57, cost: 15.9, profit: 24.0 },
  { month: '4月', conversion: 1.55, cost: 15.7, profit: 24.7 },
  { month: '5月', conversion: 1.54, cost: 15.4, profit: 25.2 },
  { month: '6月', conversion: 1.52, cost: 15.2, profit: 25.9 }
]

onMounted(() => {
  echarts.init(pieRef.value).setOption({
    title: { text: '配方效果占比', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [{ type: 'pie', radius: '55%', data: [{ name: '增重提升', value: 35 }, { name: '死亡率下降', value: 20 }, { name: '药费下降', value: 25 }, { name: '料比优化', value: 20 }] }]
  })
  echarts.init(barRef.value).setOption({
    title: { text: '利润趋势', left: 'center' },
    xAxis: { type: 'category', data: report.map((r) => r.month) },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: report.map((r) => r.profit), itemStyle: { color: '#91cc75' } }]
  })
})
</script>

<style scoped>.head{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;}</style>
