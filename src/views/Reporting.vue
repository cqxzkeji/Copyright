<template>
  <div class="grid">
    <div class="card">
      <h3>可视化与报告</h3>
      <button class="btn primary" @click="open('monitor')">实时监控面板</button>
      <button class="btn" @click="open('chart')">生成图表</button>
      <button class="btn" @click="open('report')">生成巡检报告</button>
      <button class="btn" @click="open('export')">导出与共享</button>
      <p>提示：{{msg}}</p>
    </div>
    <div class="card table-wrap">
      <h3>报告记录</h3>
      <table><thead><tr><th>报告编号</th><th>日期</th><th>缺陷数</th><th>健康指数</th><th>共享状态</th></tr></thead><tbody><tr v-for="r in rows" :key="r.id"><td>{{r.id}}</td><td>{{r.date}}</td><td>{{r.defect}}</td><td>{{r.health}}</td><td>{{r.share}}</td></tr></tbody></table>
    </div>
  </div>
  <BaseModal v-model="show" :title="title" confirm-text="确认" @confirm="run">
    <label>接收部门<input v-model="dept" placeholder="运维中心" /></label>
    <label>备注<textarea v-model="remark" rows="3"></textarea></label>
    <p>处理进度：{{progress}}%</p><progress :value="progress" max="100"></progress>
    <p>{{msg}}</p>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'
const rows = Array.from({ length: 20 }, (_, i) => ({ id: `REP-${1000 + i}`, date: `2026-02-${String((i % 28) + 1).padStart(2, '0')}`, defect: i % 4, health: `${90 - (i % 7)}%`, share: i % 3 ? '已共享' : '待发送' }))
const show = ref(false); const title = ref(''); const dept = ref('运维中心'); const remark = ref(''); const progress = ref(0); const msg = ref('等待操作')
const names = { monitor: '实时数据监控', chart: '图表展示', report: '巡检结果报告生成', export: '数据导出与共享' }
const open = (k) => { title.value = names[k]; show.value = true; progress.value = 0; msg.value = `请确认${names[k]}配置` }
const run = () => { progress.value = 100; msg.value = `${title.value}已完成，相关人员可在门户查看` }
</script>
