<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>数据预处理</h1>
        <p class="muted">管理数据清洗、特征生成、缺失修复流程。</p>
      </div>
      <div class="actions">
        <button class="btn" @click="openClean">数据清洗</button>
        <button class="btn secondary" @click="openFeature">特征生成</button>
        <button class="btn secondary" @click="openImpute">缺失修复</button>
      </div>
    </div>

    <div class="section-grid">
      <div class="card">
        <div class="card-head">字段缺失情况</div>
        <div class="bar-chart">
          <div v-for="item in missing" :key="item.label" class="bar" :style="{ height: item.value + 'px' }" :data-label="item.label">
            <div class="badge" style="position: absolute; top: 8px; right: 8px">{{ item.rate }}</div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-head">数据质量记录</div>
        <table class="table">
          <thead>
            <tr><th>批次</th><th>样本量</th><th>缺失率</th><th>异常率</th><th>特征数</th><th>操作人</th></tr>
          </thead>
          <tbody>
            <tr v-for="row in records" :key="row.batch">
              <td>{{ row.batch }}</td>
              <td>{{ row.size }}</td>
              <td>{{ row.missing }}</td>
              <td>{{ row.outlier }}</td>
              <td>{{ row.features }}</td>
              <td>{{ row.owner }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal v-if="modal.type === 'clean'" title="数据清洗配置" @close="closeModal">
      <form class="form-grid">
        <label>去重策略<select><option>主键去重</option><option>hash 去重</option></select></label>
        <label>异常检测<select><option>z-score</option><option>IQR</option><option>孤立森林</option></select></label>
        <label>过滤规则<input placeholder="age < 120 & click > 0" /></label>
      </form>
      <template #footer>
        <button class="btn secondary" @click="closeModal">取消</button>
        <button class="btn" @click="startProgress('数据清洗')">执行</button>
      </template>
    </BaseModal>

    <BaseModal v-if="modal.type === 'feature'" title="特征生成" @close="closeModal">
      <form class="form-grid">
        <label>选择模板<select><option>时间窗口</option><option>统计聚合</option><option>序列Embedding</option></select></label>
        <label>目标字段<input placeholder="target_feature" /></label>
        <label>窗口长度<input type="number" value="30" /></label>
      </form>
      <template #footer>
        <button class="btn secondary" @click="closeModal">关闭</button>
        <button class="btn" @click="startProgress('特征生成')">生成</button>
      </template>
    </BaseModal>

    <BaseModal v-if="modal.type === 'impute'" title="缺失修复" @close="closeModal">
      <form class="form-grid">
        <label>修复策略<select><option>均值填充</option><option>回归预测</option><option>KNN</option></select></label>
        <label>字段<select><option>age</option><option>amount</option><option>uv</option></select></label>
        <label>阈值<input type="number" value="0.05" step="0.01" /></label>
      </form>
      <template #footer>
        <button class="btn secondary" @click="closeModal">取消</button>
        <button class="btn" @click="startProgress('缺失修复')">执行</button>
      </template>
    </BaseModal>

    <BaseModal v-if="modal.type === 'progress'" :title="progressTitle" @close="closeModal">
      <p>预处理任务运行中…</p>
      <div class="progress-track"><div class="progress-bar" :style="{ width: progress + '%' }"></div></div>
    </BaseModal>
  </div>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const missing = [
  { label: 'age', value: 120, rate: '3.2%' },
  { label: 'amount', value: 95, rate: '2.1%' },
  { label: 'country', value: 80, rate: '1.5%' },
  { label: 'device', value: 70, rate: '1.0%' },
  { label: 'language', value: 60, rate: '0.8%' }
];

const records = ref([
  { batch: 'batch-201', size: '120k', missing: '0.8%', outlier: '0.3%', features: 320, owner: 'Lynn' },
  { batch: 'batch-202', size: '130k', missing: '0.9%', outlier: '0.2%', features: 330, owner: 'Zhang' },
  { batch: 'batch-203', size: '140k', missing: '0.7%', outlier: '0.25%', features: 335, owner: 'Li' },
  { batch: 'batch-204', size: '150k', missing: '0.6%', outlier: '0.3%', features: 340, owner: 'Chen' },
  { batch: 'batch-205', size: '160k', missing: '0.5%', outlier: '0.22%', features: 345, owner: 'Sun' },
  { batch: 'batch-206', size: '170k', missing: '0.4%', outlier: '0.2%', features: 350, owner: 'Wang' },
  { batch: 'batch-207', size: '180k', missing: '0.45%', outlier: '0.28%', features: 352, owner: 'Lin' },
  { batch: 'batch-208', size: '190k', missing: '0.55%', outlier: '0.35%', features: 355, owner: 'An' },
  { batch: 'batch-209', size: '200k', missing: '0.52%', outlier: '0.27%', features: 360, owner: 'Dai' },
  { batch: 'batch-210', size: '210k', missing: '0.48%', outlier: '0.3%', features: 365, owner: 'Xu' }
]);

const modal = reactive({ type: '' });
const progress = ref(0);
const progressTitle = ref('任务');
const activeTask = ref('');
let timer;

const startProgress = (title) => {
  activeTask.value = title;
  progressTitle.value = title;
  modal.type = 'progress';
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 17);
    if (progress.value === 100) {
      clearInterval(timer);
      setTimeout(() => finalizeTask(title), 320);
    }
  }, 320);
};

const finalizeTask = (title) => {
  const id = records.value.length + 201;
  const entry = {
    batch: `batch-${id}`,
    size: `${120 + (records.value.length + 1) * 10}k`,
    missing: `${(Math.random() * 0.6 + 0.2).toFixed(2)}%`,
    outlier: `${(Math.random() * 0.2 + 0.1).toFixed(2)}%`,
    features: 320 + records.value.length * 5,
    owner: title
  };
  records.value.unshift(entry);
  modal.type = 'progress';
  activeTask.value = '';
};

const openClean = () => (modal.type = 'clean');
const openFeature = () => (modal.type = 'feature');
const openImpute = () => (modal.type = 'impute');

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
