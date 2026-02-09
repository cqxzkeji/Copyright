<template>
  <section>
    <div class="toolbar">
      <button class="btn" @click="openForm('create')">新建项目</button>
      <button class="btn light" @click="openForm('plan')">设定计划</button>
      <button class="btn light" @click="openProgress">查看执行进度</button>
    </div>
    <div class="grid-2">
      <div class="card"><ChartPanel :option="chartOption" /></div>
      <div class="card">
        <h4>阶段目标概览</h4>
        <p>项目启动、验证、迭代、交付四阶段目标已配置，支持时间轴动态调整。</p>
      </div>
    </div>
    <div class="table-wrap" style="margin-top:14px;">
      <table>
        <thead><tr><th>项目编号</th><th>项目名称</th><th>负责人</th><th>目标完成率</th><th>截止日期</th></tr></thead>
        <tbody><tr v-for="row in rows" :key="row.id"><td>{{ row.id }}</td><td>{{ row.name }}</td><td>{{ row.owner }}</td><td>{{ row.target }}</td><td>{{ row.deadline }}</td></tr></tbody>
      </table>
    </div>
    <ModalDialog :visible="showModal" :title="modalTitle" @close="showModal=false" @confirm="submit">
      <div class="form-grid">
        <label>名称<input v-model="form.name" /></label>
        <label>负责人<input v-model="form.owner" /></label>
        <label>目标<input v-model="form.target" /></label>
        <label>截止时间<input type="date" v-model="form.deadline" /></label>
      </div>
    </ModalDialog>
    <ModalDialog :visible="showProgress" title="执行进度" :showConfirm="false" @close="showProgress=false">
      <p>当前阶段完成度：{{ progress }}%</p>
      <div class="bar"><div class="fill" :style="{ width: progress + '%' }"></div></div>
    </ModalDialog>
    <ModalDialog :visible="showTip" title="按钮提示" :showConfirm="false" @close="showTip=false"><p>{{ tip }}</p></ModalDialog>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { projectRows as rows } from '../data/mock'
import ModalDialog from '../components/ModalDialog.vue'
import ChartPanel from '../components/ChartPanel.vue'

const showModal = ref(false)
const showProgress = ref(false)
const showTip = ref(false)
const modalTitle = ref('')
const tip = ref('')
const progress = ref(76)
const form = ref({ name: '', owner: '', target: '', deadline: '' })
const chartOption = {
  tooltip: {},
  xAxis: { type: 'category', data: ['启动', '需求', '开发', '测试', '上线'] },
  yAxis: { type: 'value' },
  series: [{ type: 'line', smooth: true, data: [15, 35, 62, 81, 96], areaStyle: { color: '#cfe2ff' }, lineStyle: { color: '#2d7ef7' } }]
}
function openForm(type) {
  modalTitle.value = type === 'create' ? '创建项目' : '设定计划'
  showModal.value = true
}
function submit() { showModal.value = false; tip.value = '操作成功，已写入项目计划。'; showTip.value = true }
function openProgress() { progress.value = 60 + Math.floor(Math.random() * 30); showProgress.value = true }
</script>

<style scoped>
.bar { height: 14px; background: #e7efff; border-radius: 999px; }
.fill { height: 100%; background: linear-gradient(90deg,#4e9bff,#2d7ef7); border-radius: 999px; }
</style>
