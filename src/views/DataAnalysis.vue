<template>
  <div class="panel">
    <div class="flex space-between" style="margin-bottom: 12px">
      <div>
        <h2 style="margin: 0">数据统计与分析</h2>
        <p class="page-sub">实时了解装修进度、验收通过率、问题闭环效率</p>
      </div>
      <div class="flex" style="gap: 10px">
        <button @click="exportReport">导出报表</button>
        <button class="secondary" @click="refreshData">刷新图表</button>
      </div>
    </div>

    <div class="metric-grid">
      <div class="metric">
        <p class="page-sub">总体进度</p>
        <h3 style="margin: 4px 0">{{ metrics.progress }}%</h3>
        <div class="progress-bar"><span :style="{ width: `${metrics.progress}%` }"></span></div>
      </div>
      <div class="metric">
        <p class="page-sub">验收通过率</p>
        <h3 style="margin: 4px 0">{{ metrics.passRate }}%</h3>
        <p class="page-sub">{{ metrics.passed }}/{{ metrics.total }} 已通过</p>
      </div>
      <div class="metric">
        <p class="page-sub">整改关闭率</p>
        <h3 style="margin: 4px 0">{{ metrics.closedRate }}%</h3>
        <p class="page-sub">待复验：{{ metrics.pending }} 项</p>
      </div>
      <div class="metric">
        <p class="page-sub">本周新问题</p>
        <h3 style="margin: 4px 0">{{ metrics.newIssues }}</h3>
        <p class="page-sub">重点关注：防水、消防、电气</p>
      </div>
    </div>

    <div class="panel" style="margin-top: 16px">
      <h3 style="margin-top: 0">周度趋势</h3>
      <div class="bar-chart">
        <div v-for="week in chartData" :key="week.label" class="bar" :data-label="week.label" :style="{ height: `${week.value}px` }"></div>
      </div>
      <p class="page-sub">展示近六周的验收完成数量（条）</p>
    </div>

    <ModalDialog
      v-model="showModal"
      :title="modalTitle"
      :message="modalMessage"
      :progress="progress"
    />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const metrics = reactive({
  progress: 62,
  passRate: 88,
  passed: 37,
  total: 42,
  closedRate: 73,
  pending: 6,
  newIssues: 5,
});

const chartData = reactive([
  { label: 'W1', value: 90 },
  { label: 'W2', value: 120 },
  { label: 'W3', value: 80 },
  { label: 'W4', value: 140 },
  { label: 'W5', value: 110 },
  { label: 'W6', value: 160 },
]);

const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const progress = ref(null);

const exportReport = () => {
  modalTitle.value = '导出报表';
  modalMessage.value = '正在生成《装修验收跟踪周报》PDF...';
  progress.value = 0;
  showModal.value = true;
  const timer = setInterval(() => {
    progress.value += 25;
    if (progress.value >= 100) {
      clearInterval(timer);
      modalMessage.value = '导出完成，已保存到文档中心。';
    }
  }, 220);
};

const refreshData = () => {
  modalTitle.value = '刷新图表';
  modalMessage.value = '同步最新进度与问题闭环数据。';
  progress.value = null;
  showModal.value = true;
  metrics.progress = Math.min(100, metrics.progress + 2);
  metrics.newIssues = Math.max(0, metrics.newIssues - 1);
  chartData.push({ label: `W${chartData.length + 1}`, value: 100 + Math.round(Math.random() * 60) });
  if (chartData.length > 6) chartData.shift();
};
</script>
