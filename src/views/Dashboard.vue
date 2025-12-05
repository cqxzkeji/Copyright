<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>数据可视化与监控</h1>
        <p class="muted">总览训练、评估与优化指标，便于快速跳转到具体模块。</p>
      </div>
      <div class="actions">
        <button class="btn" @click="openSync">同步最新结果</button>
        <button class="btn secondary" @click="openNotice">平台公告</button>
      </div>
    </div>

    <div class="section-grid">
      <div class="card">
        <div class="card-head">最近模型指标</div>
        <div class="bar-chart">
          <div v-for="item in metricBars" :key="item.label" class="bar" :style="{ height: item.value + 'px' }" :data-label="item.label">
            <div class="badge" style="position: absolute; top: 8px; right: 8px">{{ item.score }}</div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-head">训练作业</div>
        <table class="table">
          <thead>
            <tr><th>作业</th><th>耗时</th><th>状态</th><th>触发</th></tr>
          </thead>
          <tbody>
            <tr v-for="job in jobs" :key="job.name">
              <td>{{ job.name }}</td>
              <td>{{ job.time }}</td>
              <td><span class="tag">{{ job.status }}</span></td>
              <td>{{ job.trigger }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card" style="margin-top: 16px">
      <div class="card-head">数据集监控</div>
      <table class="table">
        <thead>
          <tr><th>数据集</th><th>样本量</th><th>缺失率</th><th>漂移评分</th><th>操作</th></tr>
        </thead>
        <tbody>
          <tr v-for="dataset in datasets" :key="dataset.name">
            <td>{{ dataset.name }}</td>
            <td>{{ dataset.size }}</td>
            <td>{{ dataset.missing }}</td>
            <td>{{ dataset.drift }}</td>
            <td>
              <button class="btn secondary" @click="openDataset(dataset)">查看</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-if="modal.type === 'sync'" title="同步结果" @close="closeModal">
      <p>正在拉取最新模型指标与数据集状态…</p>
      <div class="progress-track"><div class="progress-bar" :style="{ width: progress + '%' }"></div></div>
    </BaseModal>

    <BaseModal v-if="modal.type === 'notice'" title="平台公告" @close="closeModal">
      <p>1. 新增超参自动搜索策略。</p>
      <p>2. 评估模块支持批量对比。</p>
    </BaseModal>

    <BaseModal v-if="modal.type === 'dataset'" :title="`数据集：${selectedDataset?.name}`" @close="closeModal">
      <p>样本分布、缺失率、漂移信息已同步，可跳转到数据预处理模块修复质量问题。</p>
      <div class="progress-track"><div class="progress-bar" :style="{ width: progress + '%' }"></div></div>
    </BaseModal>
  </div>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const metricBars = ref([
  { label: '准确率', value: 120, score: '0.94' },
  { label: '召回率', value: 105, score: '0.90' },
  { label: 'F1', value: 112, score: '0.92' },
  { label: 'AUC', value: 130, score: '0.96' },
  { label: '延迟(ms)', value: 90, score: '18' },
  { label: '吞吐(QPS)', value: 140, score: '3.1k' }
]);

const jobs = ref([
  { name: '训练-051', time: '34m', status: '已完成', trigger: '自动' },
  { name: '训练-052', time: '41m', status: '排队', trigger: '手动' },
  { name: '训练-053', time: '29m', status: '运行中', trigger: 'Webhook' },
  { name: '训练-054', time: '30m', status: '已完成', trigger: '手动' },
  { name: '训练-055', time: '33m', status: '运行中', trigger: '定时' }
]);

const datasets = reactive([
  { name: '用户行为-5月', size: '1.2M', missing: '0.6%', drift: '3.1%' },
  { name: '交易日志-样本1', size: '820k', missing: '0.4%', drift: '1.2%' },
  { name: 'IoT 设备流', size: '2.3M', missing: '0.9%', drift: '5.0%' },
  { name: '客服对话', size: '300k', missing: '0.3%', drift: '0.8%' },
  { name: '风控信号', size: '650k', missing: '1.1%', drift: '4.3%' },
  { name: '广告曝光', size: '1.7M', missing: '0.7%', drift: '2.4%' },
  { name: '点击率样本', size: '940k', missing: '0.5%', drift: '1.6%' },
  { name: '多语言日志', size: '410k', missing: '0.9%', drift: '3.8%' },
  { name: '监控指标', size: '2.9M', missing: '0.2%', drift: '1.1%' },
  { name: 'A/B实验', size: '510k', missing: '0.4%', drift: '0.9%' }
]);

const modal = reactive({ type: '' });
const progress = ref(0);
const selectedDataset = ref(null);
const activeTask = ref('');
let timer;

const startProgress = (task) => {
  activeTask.value = task;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 12);
    if (progress.value === 100) {
      clearInterval(timer);
      setTimeout(finishTask, 360);
    }
  }, 350);
};

const openSync = () => {
  modal.type = 'sync';
  startProgress('sync');
};

const openNotice = () => {
  modal.type = 'notice';
};

const openDataset = (dataset) => {
  selectedDataset.value = dataset;
  modal.type = 'dataset';
  startProgress('dataset');
};

const closeModal = () => {
  modal.type = '';
  clearInterval(timer);
};

const finishTask = () => {
  if (activeTask.value === 'sync') {
    metricBars.value = metricBars.value.map((bar) => ({
      ...bar,
      score: bar.label.includes('延迟') ? `${Number(bar.score) - 1}` : bar.score,
      value: bar.value + (bar.label.includes('延迟') ? -4 : 6)
    }));
    jobs.value.unshift({ name: '训练-刷新', time: '17m', status: '已完成', trigger: '同步' });
  }
  if (activeTask.value === 'dataset' && selectedDataset.value) {
    selectedDataset.value.drift = `${Math.max(0, Number(selectedDataset.value.drift.replace('%', '')) - 0.5).toFixed(1)}%`;
  }
  activeTask.value = '';
};

onBeforeUnmount(() => clearInterval(timer));
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.card-head {
  font-weight: 700;
  margin-bottom: 8px;
}

.muted {
  color: #64748b;
}
</style>
