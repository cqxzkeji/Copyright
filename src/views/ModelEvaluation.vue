<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>模型评估</h1>
        <p class="muted">对比不同版本模型的效果并生成报告。</p>
      </div>
      <div class="actions">
        <button class="btn" @click="openBatch">批量评估</button>
        <button class="btn secondary" @click="openImport">导入标签</button>
        <button class="btn secondary" @click="openReport">生成报告</button>
      </div>
    </div>

    <div class="section-grid">
      <div class="card">
        <div class="card-head">指标对比</div>
        <div class="bar-chart">
          <div v-for="item in compare" :key="item.label" class="bar" :style="{ height: item.value + 'px' }" :data-label="item.label">
            <div class="badge" style="position: absolute; top: 8px; right: 8px">{{ item.score }}</div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-head">评估结果</div>
        <table class="table">
          <thead>
            <tr><th>模型</th><th>AUC</th><th>F1</th><th>召回</th><th>精度</th><th>备注</th></tr>
          </thead>
          <tbody>
            <tr v-for="row in results" :key="row.name">
              <td>{{ row.name }}</td>
              <td>{{ row.auc }}</td>
              <td>{{ row.f1 }}</td>
              <td>{{ row.recall }}</td>
              <td>{{ row.precision }}</td>
              <td>{{ row.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal v-if="modal.type === 'batch'" title="批量评估" @close="closeModal">
      <form class="form-grid">
        <label>选择模型版本<select><option>v1.3</option><option>v1.4</option><option>v1.5</option></select></label>
        <label>评估集<select><option>验证集A</option><option>验证集B</option><option>线上回放</option></select></label>
        <label>指标<select><option>ROC</option><option>PR</option><option>KS</option></select></label>
      </form>
      <template #footer>
        <button class="btn secondary" @click="closeModal">取消</button>
        <button class="btn" @click="startProgress('批量评估')">开始评估</button>
      </template>
    </BaseModal>

    <BaseModal v-if="modal.type === 'import'" title="导入标签" @close="closeModal">
      <p>支持 CSV 或 Parquet，导入后会自动进行一致性校验。</p>
      <input type="file" />
      <template #footer>
        <button class="btn secondary" @click="closeModal">关闭</button>
        <button class="btn" @click="startProgress('导入标签')">开始导入</button>
      </template>
    </BaseModal>

    <BaseModal v-if="modal.type === 'report'" title="生成报告" @close="closeModal">
      <p>将自动生成包含 PR、ROC、混淆矩阵的评估报告。</p>
      <template #footer>
        <button class="btn secondary" @click="closeModal">关闭</button>
        <button class="btn" @click="startProgress('生成报告')">生成</button>
      </template>
    </BaseModal>

    <BaseModal v-if="modal.type === 'progress'" :title="progressTitle" @close="closeModal">
      <p>请稍候，任务执行中…</p>
      <div class="progress-track"><div class="progress-bar" :style="{ width: progress + '%' }"></div></div>
    </BaseModal>
  </div>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const compare = [
  { label: '版本1.3', value: 120, score: 'AUC 0.94' },
  { label: '版本1.4', value: 135, score: 'AUC 0.96' },
  { label: '版本1.5', value: 140, score: 'AUC 0.97' },
  { label: '回放A', value: 110, score: 'AUC 0.92' },
  { label: '回放B', value: 100, score: 'AUC 0.90' }
];

const results = [
  { name: 'v1.3', auc: 0.94, f1: 0.91, recall: 0.89, precision: 0.92, note: '基线' },
  { name: 'v1.4', auc: 0.96, f1: 0.93, recall: 0.9, precision: 0.95, note: '提升召回' },
  { name: 'v1.5', auc: 0.97, f1: 0.94, recall: 0.91, precision: 0.95, note: '最佳' },
  { name: 'v1.2', auc: 0.92, f1: 0.9, recall: 0.88, precision: 0.91, note: '历史版本' },
  { name: 'v1.1', auc: 0.9, f1: 0.88, recall: 0.85, precision: 0.89, note: '历史版本' },
  { name: 'v1.0', auc: 0.88, f1: 0.86, recall: 0.83, precision: 0.87, note: '首个上线' },
  { name: 'ab-test-A', auc: 0.95, f1: 0.92, recall: 0.9, precision: 0.93, note: '实验A' },
  { name: 'ab-test-B', auc: 0.93, f1: 0.91, recall: 0.88, precision: 0.94, note: '实验B' },
  { name: '线上shadow', auc: 0.91, f1: 0.89, recall: 0.86, precision: 0.91, note: 'shadow' },
  { name: '夜间批次', auc: 0.92, f1: 0.9, recall: 0.87, precision: 0.92, note: '离线' }
];

const modal = reactive({ type: '' });
const progress = ref(0);
const progressTitle = ref('任务');
let timer;

const startProgress = (title) => {
  progressTitle.value = title;
  modal.type = 'progress';
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 18);
    if (progress.value === 100) clearInterval(timer);
  }, 320);
};

const openBatch = () => (modal.type = 'batch');
const openImport = () => (modal.type = 'import');
const openReport = () => (modal.type = 'report');

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

.card-head { font-weight: 700; margin-bottom: 8px; }
.muted { color: #64748b; }
</style>
