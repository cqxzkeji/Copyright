<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>超参数调优</h1>
        <p class="muted">管理搜索空间、查看试验结果并导出最佳参数。</p>
      </div>
      <div class="actions">
        <button class="btn" @click="openSearch">启动搜索</button>
        <button class="btn secondary" @click="openSpace">导入搜索空间</button>
        <button class="btn secondary" @click="openExport">保存最佳参数</button>
      </div>
    </div>

    <div class="section-grid">
      <div class="card">
        <div class="card-head">最优指标分布</div>
        <div class="bar-chart">
          <div v-for="row in bestMetrics" :key="row.label" class="bar" :style="{ height: row.value + 'px' }" :data-label="row.label">
            <div class="badge" style="position: absolute; top: 8px; right: 8px">{{ row.score }}</div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-head">搜索结果</div>
        <table class="table">
          <thead>
            <tr><th>试验</th><th>学习率</th><th>dropout</th><th>batch</th><th>score</th><th>备注</th></tr>
          </thead>
          <tbody>
            <tr v-for="trial in trials" :key="trial.name">
              <td>{{ trial.name }}</td>
              <td>{{ trial.lr }}</td>
              <td>{{ trial.dropout }}</td>
              <td>{{ trial.batch }}</td>
              <td>{{ trial.score }}</td>
              <td>{{ trial.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal v-if="modal.type === 'search'" title="启动超参搜索" @close="closeModal">
      <form class="form-grid">
        <label>算法<select v-model="searchForm.strategy"><option>贝叶斯优化</option><option>随机搜索</option><option>网格搜索</option></select></label>
        <label>试验数<input v-model="searchForm.trials" type="number" /></label>
        <label>并发数<input v-model="searchForm.parallel" type="number" /></label>
      </form>
      <template #footer>
        <button class="btn secondary" @click="closeModal">取消</button>
        <button class="btn" @click="startProgress('超参搜索')">开始</button>
      </template>
    </BaseModal>

    <BaseModal v-if="modal.type === 'space'" title="导入搜索空间" @close="closeModal">
      <p>上传 JSON 或 YAML 描述的搜索空间。</p>
      <input type="file" />
      <template #footer>
        <button class="btn secondary" @click="closeModal">关闭</button>
        <button class="btn" @click="startProgress('导入搜索空间')">导入</button>
      </template>
    </BaseModal>

    <BaseModal v-if="modal.type === 'export'" title="保存最佳参数" @close="closeModal">
      <p>将当前最优参数保存为训练预设，支持导出 JSON。</p>
      <template #footer>
        <button class="btn secondary" @click="closeModal">取消</button>
        <button class="btn" @click="startProgress('保存最佳参数')">保存</button>
      </template>
    </BaseModal>

    <BaseModal v-if="modal.type === 'progress'" :title="progressTitle" @close="closeModal">
      <p>任务执行中，请稍候。</p>
      <div class="progress-track"><div class="progress-bar" :style="{ width: progress + '%' }"></div></div>
    </BaseModal>
  </div>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const bestMetrics = [
  { label: 'AUC', value: 135, score: '0.964' },
  { label: 'F1', value: 125, score: '0.934' },
  { label: 'Recall', value: 115, score: '0.91' },
  { label: 'Precision', value: 120, score: '0.94' },
  { label: 'Latency', value: 90, score: '19ms' }
];

const trials = [
  { name: 'trial-101', lr: '2e-4', dropout: 0.1, batch: 128, score: 0.964, note: '最佳' },
  { name: 'trial-102', lr: '3e-4', dropout: 0.15, batch: 96, score: 0.957, note: '次优' },
  { name: 'trial-103', lr: '1e-4', dropout: 0.2, batch: 64, score: 0.949, note: '提升召回' },
  { name: 'trial-104', lr: '2.5e-4', dropout: 0.12, batch: 160, score: 0.951, note: '稳定' },
  { name: 'trial-105', lr: '1.8e-4', dropout: 0.18, batch: 128, score: 0.953, note: '平衡' },
  { name: 'trial-106', lr: '2.2e-4', dropout: 0.14, batch: 192, score: 0.947, note: '吞吐高' },
  { name: 'trial-107', lr: '3.2e-4', dropout: 0.16, batch: 64, score: 0.942, note: '学习率偏高' },
  { name: 'trial-108', lr: '2.1e-4', dropout: 0.17, batch: 256, score: 0.945, note: 'batch大' },
  { name: 'trial-109', lr: '2.3e-4', dropout: 0.1, batch: 128, score: 0.955, note: '稳健' },
  { name: 'trial-110', lr: '2.0e-4', dropout: 0.13, batch: 144, score: 0.952, note: '耗时低' }
];

const modal = reactive({ type: '' });
const progress = ref(0);
const progressTitle = ref('任务');
const searchForm = reactive({ strategy: '贝叶斯优化', trials: 50, parallel: 4 });
let timer;

const startProgress = (title) => {
  progressTitle.value = title;
  modal.type = 'progress';
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 14);
    if (progress.value === 100) clearInterval(timer);
  }, 300);
};

const openSearch = () => (modal.type = 'search');
const openSpace = () => (modal.type = 'space');
const openExport = () => (modal.type = 'export');

const closeModal = () => {
  modal.type = '';
  clearInterval(timer);
};

onBeforeUnmount(() => clearInterval(timer));
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 16px; }
.card-head { font-weight: 700; margin-bottom: 8px; }
.muted { color: #64748b; }
</style>
