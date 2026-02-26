<template>
  <section class="page">
    <div class="actions card">
      <button @click="open('form')">新建合规检查单</button>
      <button @click="open('progress')">执行法规比对</button>
      <button @click="open('info')">按钮提示</button>
    </div>
    <TrendChart :data="trendSeries.map(v => v - 18)" />
    <div class="card table-wrap">
      <table><thead><tr><th>#</th><th>国家/地区</th><th>认证要求</th><th>税率</th><th>状态</th></tr></thead>
      <tbody><tr v-for="r in tradeRows" :key="r.id"><td>{{ r.id }}</td><td>{{ r.market }}</td><td>CE/FCC/{{ r.id % 2 ? 'RoHS' : 'REACH' }}</td><td>{{ 5 + (r.id % 6) }}%</td><td>{{ r.compliance }}</td></tr></tbody></table>
    </div>
    <ModalDialog v-model="showForm" title="合规性检查表单"><div class="form-grid"><input placeholder="产品名称" /><input placeholder="HS编码" /><select><option>欧盟</option><option>北美</option><option>东盟</option></select></div><button>提交检查</button></ModalDialog>
    <ModalDialog v-model="showProgress" title="检查进度"><p>法规条款匹配与历史记录核对中...</p><progress :value="81" max="100" style="width:100%"/><p>当前完成 81%</p></ModalDialog>
    <ModalDialog v-model="showInfo" title="提示信息"><p>请优先处理“待补件”状态条目，避免清关延误。</p></ModalDialog>
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
