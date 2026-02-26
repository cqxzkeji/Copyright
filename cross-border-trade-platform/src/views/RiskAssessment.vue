<template>
  <section class="page">
    <div class="actions card">
      <button @click="open('form')">风险模型参数配置</button>
      <button @click="open('progress')">生成风险预警</button>
      <button @click="open('info')">按钮提示</button>
    </div>
    <TrendChart :data="trendSeries.map(v => v - 10)" />
    <div class="card table-wrap">
      <table><thead><tr><th>#</th><th>市场</th><th>政策风险</th><th>汇率</th><th>贸易壁垒</th></tr></thead>
      <tbody><tr v-for="r in tradeRows" :key="r.id"><td>{{ r.id }}</td><td>{{ r.market }}</td><td>{{ r.risk }}</td><td>{{ r.exchange }}</td><td>{{ r.compliance }}</td></tr></tbody></table>
    </div>
    <ModalDialog v-model="showForm" title="风险评估参数表单"><div class="form-grid"><input placeholder="目标国家" /><input placeholder="汇率波动阈值" /><input placeholder="关税变化阈值" /></div><button>更新模型</button></ModalDialog>
    <ModalDialog v-model="showProgress" title="风险分析进度"><p>正在汇总政策、汇率与关税数据...</p><progress :value="62" max="100" style="width:100%"/><p>当前完成 62%</p></ModalDialog>
    <ModalDialog v-model="showInfo" title="提示信息"><p>建议配置自动预警阈值，降低突发风险损失。</p></ModalDialog>
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
