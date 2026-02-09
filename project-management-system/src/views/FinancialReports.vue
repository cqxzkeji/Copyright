<template>
  <section>
    <div class="toolbar">
      <button class="btn" @click="open('录入预算')">录入预算</button>
      <button class="btn light" @click="open('登记支出')">登记支出</button>
      <button class="btn light" @click="generate">生成报告</button>
    </div>
    <div class="grid-2">
      <div class="card"><ChartPanel :option="lineOption" /></div>
      <div class="card"><ChartPanel :option="pieOption" /></div>
    </div>
    <div class="table-wrap" style="margin-top:14px;">
      <table>
        <thead><tr><th>科目编号</th><th>预算科目</th><th>预算(万元)</th><th>支出(万元)</th><th>差额(万元)</th></tr></thead>
        <tbody><tr v-for="row in rows" :key="row.id"><td>{{ row.id }}</td><td>{{ row.item }}</td><td>{{ row.budget }}</td><td>{{ row.expense }}</td><td>{{ row.variance }}</td></tr></tbody>
      </table>
    </div>
    <ModalDialog :visible="showForm" :title="title" @close="showForm=false" @confirm="confirm">
      <div class="form-grid">
        <label>科目名称<input v-model="form.item" /></label>
        <label>金额<input v-model="form.amount" /></label>
        <label>时间<input type="date" v-model="form.date" /></label>
        <label>备注<input v-model="form.note" /></label>
      </div>
    </ModalDialog>
    <ModalDialog :visible="showTip" title="提示信息" :showConfirm="false" @close="showTip=false"><p>{{ tip }}</p></ModalDialog>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { financialRows as rows } from '../data/mock'
import ModalDialog from '../components/ModalDialog.vue'
import ChartPanel from '../components/ChartPanel.vue'

const showForm = ref(false)
const showTip = ref(false)
const title = ref('')
const tip = ref('')
const form = ref({ item: '', amount: '', date: '', note: '' })
const lineOption = { xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] }, yAxis: { type: 'value' }, series: [{ type: 'line', data: [28, 33, 38, 45, 43, 49], smooth: true, lineStyle: { color: '#2d7ef7' } }] }
const pieOption = { series: [{ type: 'pie', radius: ['42%', '72%'], data: [{ value: 48, name: '研发投入' }, { value: 26, name: '市场推广' }, { value: 15, name: '设备采购' }, { value: 11, name: '运营管理' }] }] }

function open(name) { title.value = name; showForm.value = true }
function confirm() { showForm.value = false; tip.value = `${title.value}提交成功，财务台账已更新。`; showTip.value = true }
function generate() { tip.value = '已生成财务分析报告（预算执行、偏差与趋势预测）。'; showTip.value = true }
</script>
