<template>
  <div class="module">
    <div class="toolbar">
      <button @click="showForm = true" title="设置指标">设置指标</button>
      <button @click="showProgress = true" title="生成报告">生成报告</button>
      <button @click="showTip = true" title="按钮提示">按钮提示</button>
    </div>
    <SimpleChart title="运输KPI达成率趋势" :values="[42, 48, 55, 58, 64, 70, 74, 79, 84, 88]" />
    <table>
      <thead><tr><th>报告ID</th><th>周期</th><th>准时率</th><th>平均时效</th><th>成本指数</th></tr></thead>
      <tbody><tr v-for="item in rows" :key="item.id"><td>{{ item.id }}</td><td>{{ item.period }}</td><td>{{ item.ontime }}%</td><td>{{ item.time }}</td><td>{{ item.cost }}</td></tr></tbody>
    </table>

    <ModalDialog :visible="showForm" title="设置分析指标" @close="showForm = false">
      <form class="form"><input placeholder="指标名称" /><input placeholder="阈值" /><input placeholder="监控频率" /></form>
    </ModalDialog>
    <ModalDialog :visible="showProgress" title="报告生成完成" @close="showProgress = false"><p>已生成实时报告和历史趋势图，支持导出 PDF/Excel。</p></ModalDialog>
    <ModalDialog :visible="showTip" title="按钮提示" @close="showTip = false"><p>业务指标包括准时率、满载率、异常率、单公里成本等核心项。</p></ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'
import SimpleChart from '../components/SimpleChart.vue'

const rows = Array.from({ length: 20 }, (_, i) => ({
  id: `RP-${6000 + i}`,
  period: `2026-W${(i % 52) + 1}`,
  ontime: 85 + (i % 10),
  time: `${18 - (i % 4)}小时`,
  cost: (0.92 + (i % 7) * 0.03).toFixed(2)
}))

const showForm = ref(false)
const showProgress = ref(false)
const showTip = ref(false)
</script>

<style scoped>
.module { display: grid; gap: 14px; }
.toolbar { display: flex; flex-wrap: wrap; gap: 10px; }
button { border: none; padding: 8px 14px; border-radius: 8px; background: #dff0ff; }
table { width: 100%; border-collapse: collapse; background: #fff; }
th, td { border-bottom: 1px solid #eef4fc; padding: 10px; text-align: left; }
.form { display: grid; gap: 10px; }
input { padding: 10px; border-radius: 8px; border: 1px solid #d4e4fb; }
</style>
