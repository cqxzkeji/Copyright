<template>
  <section class="page">
    <div class="actions card">
      <button @click="open('form')">导出报表设置</button>
      <button @click="open('progress')">生成综合报告</button>
      <button @click="open('info')">按钮提示</button>
    </div>
    <TrendChart :data="trendSeries" />
    <div class="card table-wrap">
      <table><thead><tr><th>#</th><th>报告类型</th><th>关键指标</th><th>更新时间</th><th>状态</th></tr></thead>
      <tbody><tr v-for="r in tradeRows" :key="r.id"><td>{{ r.id }}</td><td>{{ ['市场','风险','供应链'][r.id % 3] }}报告</td><td>指数 {{ 80 + r.id }}</td><td>2026-0{{ (r.id % 9) + 1 }}-{{ (r.id % 27) + 1 }}</td><td>{{ r.id % 2 ? '已发布' : '草稿' }}</td></tr></tbody></table>
    </div>
    <ModalDialog v-model="showForm" title="报告导出表单"><div class="form-grid"><select><option>PDF</option><option>Excel</option></select><input type="date" /><select><option>市场分析</option><option>风险分析</option><option>供应链效率</option></select></div><button>确认导出</button></ModalDialog>
    <ModalDialog v-model="showProgress" title="报告生成进度"><p>系统正在整合实时监测和历史分析数据...</p><progress :value="88" max="100" style="width:100%"/><p>当前完成 88%</p></ModalDialog>
    <ModalDialog v-model="showInfo" title="提示信息"><p>点击“生成综合报告”后可在30秒内收到下载通知。</p></ModalDialog>
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
