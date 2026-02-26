<template>
  <section class="page">
    <img src="../assets/trade-illustration.svg" alt="market" class="hero card" />
    <div class="actions card">
      <button @click="open('form')">新增监测任务</button>
      <button @click="open('progress')">启动实时抓取</button>
      <button @click="open('info')">按钮提示</button>
    </div>
    <TrendChart :data="trendSeries" />
    <div class="card table-wrap">
      <table><thead><tr><th>#</th><th>区域</th><th>品类</th><th>需求变化</th><th>竞争热度</th></tr></thead>
        <tbody><tr v-for="r in tradeRows" :key="r.id"><td>{{ r.id }}</td><td>{{ r.market }}</td><td>{{ r.product }}</td><td>{{ r.demand }}</td><td>{{ r.risk }}</td></tr></tbody></table>
    </div>

    <ModalDialog v-model="showForm" title="市场监测任务表单">
      <div class="form-grid"><input placeholder="目标市场" /><input placeholder="监测品类" /><input type="date" /><select><option>每天</option><option>每周</option></select></div>
      <p>提交后系统会自动创建市场监测任务。</p><button>保存任务</button>
    </ModalDialog>
    <ModalDialog v-model="showProgress" title="数据抓取进度">
      <p>渠道接入、清洗、聚合进行中...</p><progress :value="74" max="100" style="width:100%"></progress><p>当前完成 74%</p>
    </ModalDialog>
    <ModalDialog v-model="showInfo" title="提示信息"><p>你点击了按钮提示：可切换区域筛选以查看细分商机。</p></ModalDialog>
  </section>
</template>
<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';
import TrendChart from '../components/TrendChart.vue';
import { tradeRows, trendSeries } from '../data/mockData';
const showForm = ref(false); const showProgress = ref(false); const showInfo = ref(false);
const open = (type) => { showForm.value = type === 'form'; showProgress.value = type === 'progress'; showInfo.value = type === 'info'; };
</script>
<style scoped>
.page { display: grid; gap: 12px; }
.hero { width: 100%; height: 180px; object-fit: cover; }
.actions { padding: 12px; display: flex; gap: 10px; flex-wrap: wrap; }
</style>
