<template>
  <section>
    <div class="toolbar">
      <button class="btn" @click="open('新增成员')">新增成员</button>
      <button class="btn light" @click="open('分配任务')">分配任务</button>
      <button class="btn light" @click="open('协作会议')">协作会议</button>
    </div>
    <div class="card"><ChartPanel :option="chartOption" /></div>
    <div class="table-wrap" style="margin-top:14px;">
      <table>
        <thead><tr><th>成员编号</th><th>姓名</th><th>角色</th><th>任务</th><th>完成度</th></tr></thead>
        <tbody><tr v-for="row in rows" :key="row.id"><td>{{ row.id }}</td><td>{{ row.name }}</td><td>{{ row.role }}</td><td>{{ row.task }}</td><td>{{ row.completion }}</td></tr></tbody>
      </table>
    </div>
    <ModalDialog :visible="showForm" :title="title" @close="showForm=false" @confirm="confirm">
      <div class="form-grid">
        <label>成员/任务<input v-model="form.target" /></label>
        <label>责任角色<input v-model="form.role" /></label>
        <label>优先级<select v-model="form.priority"><option>高</option><option>中</option><option>低</option></select></label>
        <label>截止日期<input type="date" v-model="form.date" /></label>
      </div>
    </ModalDialog>
    <ModalDialog :visible="showTip" title="按钮提示" :showConfirm="false" @close="showTip=false"><p>{{ tip }}</p></ModalDialog>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { teamRows as rows } from '../data/mock'
import ModalDialog from '../components/ModalDialog.vue'
import ChartPanel from '../components/ChartPanel.vue'

const showForm = ref(false)
const showTip = ref(false)
const title = ref('')
const tip = ref('')
const form = ref({ target: '', role: '', priority: '中', date: '' })
const chartOption = {
  tooltip: {},
  xAxis: { type: 'category', data: ['产品', '研发', '测试', '运营', '财务'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [93, 86, 78, 69, 75], itemStyle: { color: '#62a6ff' } }]
}

function open(name) { title.value = name; showForm.value = true }
function confirm() { showForm.value = false; tip.value = `${title.value}操作已完成并同步给团队成员。`; showTip.value = true }
</script>
