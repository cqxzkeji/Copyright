<template>
  <section class="page">
    <div class="actions card">
      <button @click="open('form')">运输方案配置</button>
      <button @click="open('progress')">计算最优路线</button>
      <button @click="open('info')">按钮提示</button>
    </div>
    <TrendChart :data="trendSeries.map(v => v - 5)" />
    <div class="card table-wrap">
      <table><thead><tr><th>#</th><th>起运仓</th><th>目的地</th><th>物流成本</th><th>时效</th></tr></thead>
      <tbody><tr v-for="r in tradeRows" :key="r.id"><td>{{ r.id }}</td><td>华东{{ (r.id%4)+1 }}仓</td><td>{{ r.market }}</td><td>¥{{ r.logisticsCost }}</td><td>{{ 8 + (r.id % 7) }}天</td></tr></tbody></table>
    </div>
    <ModalDialog v-model="showForm" title="供应链优化表单"><div class="form-grid"><input placeholder="起运仓库" /><input placeholder="目标市场" /><select><option>空运</option><option>海运</option><option>铁路</option></select></div><button>保存方案</button></ModalDialog>
    <ModalDialog v-model="showProgress" title="路线优化进度"><p>正在评估仓储、时效、成本三类指标...</p><progress :value="69" max="100" style="width:100%"/><p>当前完成 69%</p></ModalDialog>
    <ModalDialog v-model="showInfo" title="提示信息"><p>建议在旺季切换“海运+海外仓”组合，整体成本可降低约12%。</p></ModalDialog>
  </section>
</template>
<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';
import TrendChart from '../components/TrendChart.vue';
import { tradeRows, trendSeries } from '../data/mockData';
const showForm = ref(false); const showProgress = ref(false); const showInfo = ref(false);
const open = (t) => { showForm.value = t === 'form'; showProgress.value = t === 'progress'; showInfo.value = t === 'info'; };
</script>
<style scoped>.page{display:grid;gap:12px}.actions{padding:12px;display:flex;gap:10px;flex-wrap:wrap}</style>
