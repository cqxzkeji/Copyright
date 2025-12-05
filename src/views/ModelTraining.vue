<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>模型训练</h1>
        <p class="muted">配置训练任务、查看近期训练记录。</p>
      </div>
      <div class="actions">
        <button class="btn" @click="openTrainForm">新建训练</button>
        <button class="btn secondary" @click="openUpload">上传训练数据</button>
        <button class="btn secondary" @click="openLog">查看日志</button>
      </div>
    </div>

    <div class="section-grid">
      <div class="card">
        <div class="card-head">损失下降趋势</div>
        <div class="bar-chart">
          <div v-for="step in lossTrend" :key="step.label" class="bar" :style="{ height: step.value + 'px' }" :data-label="step.label">
            <div class="badge" style="position: absolute; top: 8px; right: 8px">{{ step.loss }}</div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-head">训练记录</div>
        <table class="table">
          <thead>
            <tr><th>任务</th><th>学习率</th><th>批大小</th><th>轮数</th><th>最佳指标</th></tr>
          </thead>
          <tbody>
            <tr v-for="item in trainings" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.lr }}</td>
              <td>{{ item.batch }}</td>
              <td>{{ item.epoch }}</td>
              <td>{{ item.metric }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal v-if="modal.type === 'train'" title="新建训练任务" @close="closeModal">
      <form class="form-grid">
        <label>模型名称<input v-model="form.model" placeholder="Transformer-Base" /></label>
        <label>学习率<input v-model="form.lr" type="number" step="0.0001" /></label>
        <label>批大小<input v-model="form.batch" type="number" /></label>
        <label>训练轮数<input v-model="form.epoch" type="number" /></label>
      </form>
      <template #footer>
        <button class="btn secondary" @click="closeModal">取消</button>
        <button class="btn" @click="startTraining">开始训练</button>
      </template>
    </BaseModal>

    <BaseModal v-if="modal.type === 'upload'" title="上传训练数据" @close="closeModal">
      <p>选择数据分片或增量样本，上传后会自动校验并触发预处理。</p>
      <input type="file" />
      <template #footer>
        <button class="btn secondary" @click="closeModal">关闭</button>
        <button class="btn" @click="startProgress('uploading')">开始上传</button>
      </template>
    </BaseModal>

    <BaseModal v-if="modal.type === 'log'" title="实时日志" @close="closeModal">
      <p>最近 50 条日志片段：</p>
      <ul>
        <li v-for="log in recentLogs" :key="log">{{ log }}</li>
      </ul>
    </BaseModal>

    <BaseModal v-if="modal.type === 'progress'" :title="progressTitle" @close="closeModal">
      <p>任务进行中，请勿关闭页面。</p>
      <div class="progress-track"><div class="progress-bar" :style="{ width: progress + '%' }"></div></div>
    </BaseModal>
  </div>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const lossTrend = [
  { label: 'Step 1', value: 140, loss: '1.2' },
  { label: 'Step 2', value: 120, loss: '0.9' },
  { label: 'Step 3', value: 90, loss: '0.6' },
  { label: 'Step 4', value: 75, loss: '0.45' },
  { label: 'Step 5', value: 60, loss: '0.33' },
  { label: 'Step 6', value: 55, loss: '0.30' }
];

const trainings = [
  { name: 'Run-040', lr: '3e-4', batch: 128, epoch: 10, metric: 'AUC 0.94' },
  { name: 'Run-041', lr: '2e-4', batch: 256, epoch: 12, metric: 'AUC 0.95' },
  { name: 'Run-042', lr: '1e-4', batch: 128, epoch: 15, metric: 'F1 0.92' },
  { name: 'Run-043', lr: '1.5e-4', batch: 64, epoch: 20, metric: 'AUC 0.93' },
  { name: 'Run-044', lr: '3e-4', batch: 96, epoch: 16, metric: 'Acc 0.90' },
  { name: 'Run-045', lr: '2.5e-4', batch: 192, epoch: 14, metric: 'AUC 0.96' },
  { name: 'Run-046', lr: '3.5e-4', batch: 64, epoch: 12, metric: 'Acc 0.91' },
  { name: 'Run-047', lr: '1.8e-4', batch: 160, epoch: 18, metric: 'F1 0.93' },
  { name: 'Run-048', lr: '2.2e-4', batch: 224, epoch: 12, metric: 'AUC 0.95' },
  { name: 'Run-049', lr: '2.0e-4', batch: 256, epoch: 10, metric: 'Acc 0.92' }
];

const recentLogs = Array.from({ length: 10 }, (_, i) => `训练日志片段 ${i + 1}`);

const modal = reactive({ type: '' });
const progress = ref(0);
const progressTitle = ref('任务进行中');
const form = reactive({ model: '', lr: '0.0003', batch: '128', epoch: '12' });
let timer;

const openTrainForm = () => {
  modal.type = 'train';
};

const openUpload = () => {
  modal.type = 'upload';
};

const openLog = () => {
  modal.type = 'log';
};

const startProgress = (title) => {
  progressTitle.value = title === 'uploading' ? '上传数据' : '训练任务';
  modal.type = 'progress';
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 15);
    if (progress.value === 100) {
      clearInterval(timer);
    }
  }, 300);
};

const startTraining = () => startProgress('training');

const closeModal = () => {
  modal.type = '';
  clearInterval(timer);
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

.muted { color: #64748b; }
</style>
