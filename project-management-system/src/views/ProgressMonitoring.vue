<template>
  <section>
    <div class="toolbar">
      <button class="btn" @click="openProgress">更新进度</button>
      <button class="btn light" @click="openRisk">风险评估</button>
      <button class="btn light" @click="notify">触发预警</button>
    </div>
    <div class="grid-2">
      <div class="card"><ChartPanel :option="chartOption" /></div>
      <div class="card"><ChartPanel :option="riskOption" /></div>
    </div>
    <div class="table-wrap" style="margin-top:14px;">
      <table>
        <thead><tr><th>任务编号</th><th>里程碑</th><th>进度(%)</th><th>风险级别</th><th>状态</th></tr></thead>
        <tbody><tr v-for="row in rows" :key="row.id"><td>{{ row.id }}</td><td>{{ row.milestone }}</td><td>{{ row.progress }}</td><td>{{ row.risk }}</td><td>{{ row.status }}</td></tr></tbody>
      </table>
    </div>
    <ModalDialog :visible="showProgress" title="进度条弹窗" :showConfirm="false" @close="showProgress=false">
      <p>本周项目推进：{{ progress }}%</p>
      <div class="bar"><div class="fill" :style="{ width: progress + '%' }"></div></div>
    </ModalDialog>
    <ModalDialog :visible="showRisk" title="风险评估表单" @close="showRisk=false" @confirm="confirmRisk">
      <div class="form-grid">
        <label>风险项<input v-model="form.item" /></label>
        <label>概率<select v-model="form.rate"><option>低</option><option>中</option><option>高</option></select></label>
        <label>影响程度<select v-model="form.effect"><option>一般</option><option>重要</option><option>严重</option></select></label>
        <label>应对策略<input v-model="form.action" /></label>
      </div>
    </ModalDialog>
    <ModalDialog :visible="showTip" title="提示信息" :showConfirm="false" @close="showTip=false"><p>{{ tip }}</p></ModalDialog>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { progressRows as rows } from '../data/mock'
import ModalDialog from '../components/ModalDialog.vue'
import ChartPanel from '../components/ChartPanel.vue'

const showProgress = ref(false)
const showRisk = ref(false)
const showTip = ref(false)
const progress = ref(68)
const tip = ref('')
const form = ref({ item: '', rate: '中', effect: '重要', action: '' })
const chartOption = { xAxis: { type: 'category', data: ['周1', '周2', '周3', '周4'] }, yAxis: { type: 'value' }, series: [{ type: 'line', data: [42, 56, 68, 79], areaStyle: { color: '#dceaff' }, lineStyle: { color: '#2d7ef7' } }] }
const riskOption = { tooltip: {}, series: [{ type: 'pie', radius: '60%', data: [{ value: 11, name: '低风险' }, { value: 8, name: '中风险' }, { value: 5, name: '高风险' }] }] }

function openProgress() { progress.value = 50 + Math.floor(Math.random() * 45); showProgress.value = true }
function openRisk() { showRisk.value = true }
function confirmRisk() { showRisk.value = false; tip.value = '风险评估已归档并同步预警策略。'; showTip.value = true }
function notify() { tip.value = '已向项目负责人、PMO和财务专员发送预警通知。'; showTip.value = true }
</script>

<style scoped>
.bar { height: 14px; background: #e7efff; border-radius: 999px; }
.fill { height: 100%; background: linear-gradient(90deg,#5fb2ff,#2d7ef7); border-radius: 999px; }
</style>
