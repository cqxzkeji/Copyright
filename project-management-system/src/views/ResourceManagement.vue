<template>
  <section>
    <div class="toolbar">
      <button class="btn" @click="open('申请资源')">申请资源</button>
      <button class="btn light" @click="open('分配资源')">分配资源</button>
      <button class="btn light" @click="open('设备调度')">设备调度</button>
    </div>
    <div class="card"><ChartPanel :option="chartOption" /></div>
    <div class="table-wrap" style="margin-top:14px;">
      <table>
        <thead><tr><th>编号</th><th>类型</th><th>明细</th><th>已使用(%)</th><th>剩余(%)</th></tr></thead>
        <tbody><tr v-for="row in rows" :key="row.id"><td>{{ row.id }}</td><td>{{ row.type }}</td><td>{{ row.detail }}</td><td>{{ row.used }}</td><td>{{ row.remain }}</td></tr></tbody>
      </table>
    </div>
    <ModalDialog :visible="showForm" :title="title" @close="showForm=false" @confirm="confirm">
      <div class="form-grid">
        <label>资源类型<select v-model="form.type"><option>资金</option><option>人力</option><option>设备</option></select></label>
        <label>数量/金额<input v-model="form.amount" /></label>
        <label>使用部门<input v-model="form.dept" /></label>
        <label>预期周期<input v-model="form.period" /></label>
      </div>
    </ModalDialog>
    <ModalDialog :visible="showTip" title="按钮提示" :showConfirm="false" @close="showTip=false"><p>{{ tip }}</p></ModalDialog>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { resourceRows as rows } from '../data/mock'
import ModalDialog from '../components/ModalDialog.vue'
import ChartPanel from '../components/ChartPanel.vue'

const showForm = ref(false)
const showTip = ref(false)
const title = ref('')
const tip = ref('')
const form = ref({ type: '资金', amount: '', dept: '', period: '' })
const chartOption = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['已分配', '待分配'] },
  xAxis: { type: 'category', data: ['资金', '人力', '设备', '场地', '服务'] },
  yAxis: { type: 'value' },
  series: [
    { name: '已分配', type: 'bar', data: [85, 71, 63, 56, 48], itemStyle: { color: '#2d7ef7' } },
    { name: '待分配', type: 'bar', data: [15, 29, 37, 44, 52], itemStyle: { color: '#96bfff' } }
  ]
}
function open(name) { title.value = name; showForm.value = true }
function confirm() { showForm.value = false; tip.value = `${title.value}已提交并进入审批流程。`; showTip.value = true }
</script>
