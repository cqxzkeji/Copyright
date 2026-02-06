<template>
  <section class="page">
    <div class="card">
      <div class="card-header">
        <div>
          <h2>实时分析引擎</h2>
          <p>机器学习与统计模型在实时数据流上的表现。</p>
        </div>
        <div class="actions">
          <button class="primary" @click="openModel">新建分析模型</button>
          <button class="secondary" @click="openTrain">启动训练</button>
          <button class="ghost" @click="openTip">分析提示</button>
        </div>
      </div>
      <div class="kpi">
        <div class="kpi-card">
          <span>异常检测命中率</span>
          <strong>96.4%</strong>
        </div>
        <div class="kpi-card">
          <span>实时特征计算</span>
          <strong>4.2M/s</strong>
        </div>
        <div class="kpi-card">
          <span>趋势预测误差</span>
          <strong>2.8%</strong>
        </div>
      </div>
      <div class="area-chart">
        <div v-for="point in predictionTrend" :key="point.time" class="area-bar">
          <span :style="{ height: point.value + '%' }"></span>
          <label>{{ point.time }}</label>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div>
          <h2>分析任务清单</h2>
          <p>覆盖统计分析、聚类、预测与智能告警的任务。</p>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>任务编号</th>
              <th>任务类型</th>
              <th>模型策略</th>
              <th>运行状态</th>
              <th>最新输出</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in tasks" :key="task.id">
              <td>{{ task.id }}</td>
              <td>{{ task.type }}</td>
              <td>{{ task.strategy }}</td>
              <td><span :class="['badge', task.statusClass]">{{ task.status }}</span></td>
              <td>{{ task.output }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal v-model="showModel" title="新建分析模型" @confirm="saveModel">
      <div class="form-grid">
        <label>
          模型名称
          <input v-model="modelForm.name" placeholder="例如：异常检测-V3" />
        </label>
        <label>
          算法类型
          <select v-model="modelForm.algorithm">
            <option>孤立森林</option>
            <option>LSTM 预测</option>
            <option>贝叶斯分类</option>
          </select>
        </label>
        <label>
          训练样本窗口
          <input v-model="modelForm.window" placeholder="例如：最近 7 天" />
        </label>
      </div>
    </Modal>

    <Modal v-model="showTrain" title="模型训练进度" @confirm="closeTrain">
      <div>
        <div class="progress-label">特征抽取与模型拟合</div>
        <div class="progress-bar"><span :style="{ width: trainProgress + '%' }" /></div>
        <p class="progress-note">预计 90 秒完成最新版本训练。</p>
      </div>
    </Modal>

    <Modal v-model="showTip" title="分析提示" @confirm="closeTip">
      <ul class="tip-list">
        <li>高频异常检测建议使用自适应滑动窗口。</li>
        <li>趋势预测可结合节假日与天气特征。</li>
        <li>模型输出支持实时分级告警。</li>
      </ul>
    </Modal>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue';
import Modal from '../components/Modal.vue';

const showModel = ref(false);
const showTrain = ref(false);
const showTip = ref(false);

const modelForm = reactive({
  name: '',
  algorithm: '孤立森林',
  window: ''
});

const predictionTrend = [
  { time: '09:00', value: 30 },
  { time: '09:20', value: 40 },
  { time: '09:40', value: 48 },
  { time: '10:00', value: 55 },
  { time: '10:20', value: 52 },
  { time: '10:40', value: 60 },
  { time: '11:00', value: 62 },
  { time: '11:20', value: 58 },
  { time: '11:40', value: 66 },
  { time: '12:00', value: 70 }
];

const tasks = Array.from({ length: 20 }, (_, index) => ({
  id: `AN-${2001 + index}`,
  type: index % 2 === 0 ? '异常检测' : '趋势预测',
  strategy: index % 3 === 0 ? '统计分析' : index % 3 === 1 ? '机器学习' : '聚类分析',
  status: index % 4 === 0 ? '待优化' : '运行中',
  statusClass: index % 4 === 0 ? 'warning' : 'success',
  output: index % 2 === 0 ? '风险评分 0.82' : '预测增长 6.2%'
}));

const trainProgress = ref(72);

const openModel = () => {
  showModel.value = true;
};

const openTrain = () => {
  showTrain.value = true;
};

const openTip = () => {
  showTip.value = true;
};

const saveModel = () => {
  showModel.value = false;
};

const closeTrain = () => {
  showTrain.value = false;
};

const closeTip = () => {
  showTip.value = false;
};
</script>

<style scoped>
.page {
  display: grid;
  gap: 24px;
}

.card {
  background: #fff;
  border-radius: 18px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.card-header h2 {
  font-size: 18px;
  margin-bottom: 6px;
}

.card-header p {
  font-size: 13px;
  color: #64748b;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.primary,
.secondary,
.ghost {
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
}

.primary {
  background: #2563eb;
  color: #fff;
}

.secondary {
  background: #e2e8f0;
}

.ghost {
  background: #f8fafc;
  border: 1px dashed #cbd5f5;
}

.kpi {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin: 20px 0;
}

.kpi-card {
  background: #f8fafc;
  border-radius: 14px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  display: grid;
  gap: 6px;
}

.kpi-card span {
  color: #64748b;
  font-size: 13px;
}

.kpi-card strong {
  font-size: 20px;
}

.area-chart {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
  gap: 10px;
  align-items: end;
  height: 200px;
}

.area-bar {
  display: grid;
  gap: 6px;
  justify-items: center;
}

.area-bar span {
  width: 100%;
  border-radius: 12px 12px 6px 6px;
  background: linear-gradient(180deg, #a855f7, #6366f1);
}

.area-bar label {
  font-size: 11px;
  color: #64748b;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}

thead {
  background: #f1f5f9;
}

.badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.success {
  background: #dcfce7;
  color: #15803d;
}

.warning {
  background: #fef9c3;
  color: #a16207;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid label {
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: #475569;
}

.form-grid input,
.form-grid select {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 10px;
}

.progress-label {
  font-weight: 600;
  margin-bottom: 8px;
}

.progress-bar {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6, #6366f1);
}

.progress-note {
  margin-top: 10px;
  font-size: 13px;
  color: #64748b;
}

.tip-list {
  display: grid;
  gap: 8px;
  padding-left: 16px;
  color: #475569;
}
</style>
