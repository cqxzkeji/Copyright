<template>
  <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));">
    <div class="card">
      <div class="section-head">数据统计</div>
      <table class="table">
        <thead>
          <tr>
            <th>类别</th>
            <th>数量</th>
            <th>准确率</th>
            <th>召回率</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in stats" :key="row.label">
            <td>{{ row.label }}</td>
            <td>{{ row.count }}</td>
            <td>{{ row.acc }}</td>
            <td>{{ row.rec }}</td>
          </tr>
        </tbody>
      </table>
      <div class="actions" style="margin-top: 0.75rem;">
        <button class="btn" @click="simulateRefresh">刷新数据</button>
        <button class="btn secondary" @click="showFilter = true">筛选</button>
      </div>
    </div>
    <div class="card">
      <div class="section-head">KPI 面板</div>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));">
        <div class="metric">
          <div class="label">平均耗时</div>
          <div class="value">{{ kpi.latency }} ms</div>
        </div>
        <div class="metric">
          <div class="label">吞吐量</div>
          <div class="value">{{ kpi.throughput }} fps</div>
        </div>
        <div class="metric">
          <div class="label">GPU 利用率</div>
          <div class="value">{{ kpi.gpu }}%</div>
        </div>
        <div class="metric">
          <div class="label">缓存命中</div>
          <div class="value">{{ kpi.cache }}%</div>
        </div>
      </div>
      <div class="progress-row">
        <div class="label">训练进度</div>
        <div class="progress-bar">
          <div class="fill" :style="{ width: kpi.training + '%' }"></div>
        </div>
        <small class="muted">{{ kpi.training }}%</small>
      </div>
      <div class="actions" style="margin-top: 0.75rem;">
        <button class="btn" @click="runBenchmark">运行评测</button>
        <button class="btn secondary" @click="showReport = true">生成报告</button>
      </div>
    </div>
  </div>

  <ModalDialog v-model="showFilter" title="筛选数据" confirm-text="应用" @confirm="applyFilter">
    <div class="form-row two-col">
      <div>
        <label>最小准确率</label>
        <input v-model.number="filter.acc" class="input" />
      </div>
      <div>
        <label>最小召回率</label>
        <input v-model.number="filter.rec" class="input" />
      </div>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showReport" title="生成报告" confirm-text="生成" @confirm="generateReport">
    <p>报告会整合分析曲线与指标表格。</p>
    <div class="progress-bar" style="margin-top: 0.75rem;">
      <div class="fill" :style="{ width: reportProgress + '%' }"></div>
    </div>
    <small class="muted">生成进度：{{ reportProgress }}%</small>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const stats = ref([
  { label: '肿瘤', count: 120, acc: 0.93, rec: 0.9 },
  { label: '炎症', count: 98, acc: 0.89, rec: 0.85 },
  { label: '正常', count: 205, acc: 0.95, rec: 0.94 },
  { label: '结节', count: 56, acc: 0.87, rec: 0.83 },
  { label: '纤维化', count: 44, acc: 0.9, rec: 0.88 },
  { label: '坏死', count: 39, acc: 0.85, rec: 0.81 },
  { label: '梗死', count: 41, acc: 0.88, rec: 0.82 },
  { label: '脂肪变性', count: 63, acc: 0.9, rec: 0.86 },
  { label: '退行性变', count: 58, acc: 0.86, rec: 0.8 },
  { label: '炎症后修复', count: 77, acc: 0.92, rec: 0.87 },
  { label: '其他', count: 32, acc: 0.8, rec: 0.78 }
]);
const kpi = reactive({ latency: 34, throughput: 56, gpu: 72, cache: 88, training: 42 });
const showFilter = ref(false);
const filter = reactive({ acc: 0.85, rec: 0.8 });
const showReport = ref(false);
const reportProgress = ref(20);

const simulateRefresh = () => {
  stats.value = stats.value.map((row) => ({ ...row, acc: Number((row.acc + 0.01).toFixed(2)) }));
};

const applyFilter = () => {
  stats.value = stats.value.filter((row) => row.acc >= filter.acc && row.rec >= filter.rec);
  showFilter.value = false;
};

const runBenchmark = () => {
  kpi.latency = Math.max(20, kpi.latency - 2);
  kpi.throughput += 2;
  kpi.training = Math.min(100, kpi.training + 5);
};

const generateReport = () => {
  reportProgress.value = Math.min(100, reportProgress.value + 25);
};
</script>

<style scoped>
.section-head {
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.metric {
  background: #f8fafc;
  border-radius: 12px;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
}

.label {
  color: #475569;
  font-size: 0.95rem;
}

.value {
  font-size: 1.2rem;
  font-weight: 800;
  color: #0ea5e9;
}

.progress-row {
  display: grid;
  grid-template-columns: 120px 1fr 60px;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
}

.muted {
  color: #6b7280;
}
</style>
