<template>
  <div class="module">
    <header class="panel">
      <div>
        <h3>数据分析与报告</h3>
        <p>聚合检测结果生成趋势分析、健康评分及巡检报告</p>
      </div>
      <div class="flex gap">
        <button @click="openModal('日报生成', '已生成 2024-05-18 巡检日报')">生成日报</button>
        <button @click="startExport">导出报告</button>
      </div>
    </header>
    <section class="grid">
      <div class="card">
        <h4>线路健康评分</h4>
        <MiniChart :values="[85, 86, 84, 88, 90, 91, 93]" />
        <p>本周综合评分 93</p>
      </div>
      <div class="card">
        <h4>灰斑告警趋势</h4>
        <MiniChart :values="[5, 4, 7, 6, 8, 6, 5]" />
        <p>高等级灰斑稳定在 5 起/天</p>
      </div>
    </section>
    <section class="reports">
      <div class="card" v-for="report in reports" :key="report.id">
        <h4>{{ report.title }}</h4>
        <p>{{ report.desc }}</p>
        <button @click="openModal('查看报告', report.desc)">查看</button>
      </div>
    </section>
  </div>
  <BaseModal :show="modal" :title="modalTitle" @close="modal = false">
    <p>{{ modalContent }}</p>
  </BaseModal>
  <BaseModal :show="exportModal" title="导出进度" @close="exportModal = false">
    <p>正在生成 PDF 报告…</p>
    <div class="progress-bar">
      <div class="progress-bar__inner" :style="{ width: exportProgress + '%' }"></div>
    </div>
    <p>{{ exportProgress }}%</p>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import MiniChart from '../components/MiniChart.vue';
import BaseModal from '../components/BaseModal.vue';

const reports = [
  { id: 1, title: '本周趋势分析', desc: '本周灰斑 III 级环比下降 12%' },
  { id: 2, title: '设备健康巡检', desc: '关键传感器 100% 在线，需关注 3 台温度漂移' },
  { id: 3, title: '线路风险研判', desc: '北段 K143+500 至 K145+200 风险指数升高' }
];

const modal = ref(false);
const modalTitle = ref('');
const modalContent = ref('');
const exportModal = ref(false);
const exportProgress = ref(0);

const openModal = (title, content) => {
  modalTitle.value = title;
  modalContent.value = content;
  modal.value = true;
};

const startExport = () => {
  exportModal.value = true;
  exportProgress.value = 0;
  const timer = setInterval(() => {
    exportProgress.value += 25;
    if (exportProgress.value >= 100) {
      exportProgress.value = 100;
      clearInterval(timer);
    }
  }, 300);
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
}

.panel {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.grid .card {
  flex: 1;
  min-width: 240px;
}

.reports {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.reports .card {
  flex: 1;
  min-width: 240px;
}
</style>
