<template>
  <section class="page">
    <div class="grid">
      <div class="card">
        <div class="card-header">
          <div>
            <h2>实时采集概览</h2>
            <p>多源数据接入、预处理与格式转换进度。</p>
          </div>
          <div class="actions">
            <button class="primary" @click="openForm">新增接入源</button>
            <button class="secondary" @click="openProgress">启动预处理</button>
            <button class="ghost" @click="openTip">提示说明</button>
          </div>
        </div>
        <div class="metrics">
          <div class="metric">
            <span>当前接入通道</span>
            <strong>128</strong>
          </div>
          <div class="metric">
            <span>实时吞吐量</span>
            <strong>6.8M/s</strong>
          </div>
          <div class="metric">
            <span>格式转换成功率</span>
            <strong>99.1%</strong>
          </div>
        </div>
        <div class="chart">
          <div v-for="item in streamTrend" :key="item.time" class="bar">
            <span :style="{ height: item.value + '%' }"></span>
            <label>{{ item.time }}</label>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <div>
            <h2>接入源状态表</h2>
            <p>展示各类数据源的实时连接与预处理状态。</p>
          </div>
        </div>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>编号</th>
                <th>数据源</th>
                <th>类型</th>
                <th>连接状态</th>
                <th>每秒条数</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in tableData" :key="row.id">
                <td>{{ row.id }}</td>
                <td>{{ row.source }}</td>
                <td>{{ row.type }}</td>
                <td><span :class="['badge', row.status === '正常' ? 'success' : 'warning']">{{ row.status }}</span></td>
                <td>{{ row.rate }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <Modal v-model="showForm" title="新增接入源配置" @confirm="saveForm">
      <div class="form-grid">
        <label>
          数据源名称
          <input v-model="form.source" placeholder="如：传感器集群-A" />
        </label>
        <label>
          协议类型
          <select v-model="form.protocol">
            <option>MQTT</option>
            <option>HTTP</option>
            <option>TCP</option>
            <option>日志采集</option>
          </select>
        </label>
        <label>
          采集频率
          <input v-model="form.frequency" placeholder="例如：50ms" />
        </label>
      </div>
    </Modal>

    <Modal v-model="showProgress" title="预处理任务进度" @confirm="closeProgress">
      <div>
        <div class="progress-label">清洗与格式转换</div>
        <div class="progress-bar"><span :style="{ width: progress + '%' }" /></div>
        <p class="progress-note">正在执行字段映射、异常剔除与数据压缩。</p>
      </div>
    </Modal>

    <Modal v-model="showTip" title="接入提示信息" @confirm="closeTip">
      <ul class="tip-list">
        <li>建议为高并发数据源开启批量缓存模式。</li>
        <li>同类协议通道可合并以减少连接成本。</li>
        <li>实时预处理支持字段级脱敏与统一编码。</li>
      </ul>
    </Modal>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue';
import Modal from '../components/Modal.vue';

const showForm = ref(false);
const showProgress = ref(false);
const showTip = ref(false);
const progress = ref(72);

const form = reactive({
  source: '',
  protocol: 'MQTT',
  frequency: ''
});

const streamTrend = [
  { time: '09:00', value: 35 },
  { time: '09:10', value: 42 },
  { time: '09:20', value: 48 },
  { time: '09:30', value: 52 },
  { time: '09:40', value: 60 },
  { time: '09:50', value: 58 },
  { time: '10:00', value: 66 },
  { time: '10:10', value: 72 },
  { time: '10:20', value: 68 },
  { time: '10:30', value: 75 }
];

const tableData = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  source: `数据源-${String(index + 1).padStart(2, '0')}`,
  type: index % 2 === 0 ? '传感器' : '日志',
  status: index % 5 === 0 ? '波动' : '正常',
  rate: `${(3200 + index * 80).toLocaleString()} 条/s`
}));

const openForm = () => {
  showForm.value = true;
};

const openProgress = () => {
  showProgress.value = true;
};

const openTip = () => {
  showTip.value = true;
};

const saveForm = () => {
  showForm.value = false;
};

const closeProgress = () => {
  showProgress.value = false;
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

.grid {
  display: grid;
  gap: 24px;
}

.card {
  background: #ffffff;
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
  color: #64748b;
  font-size: 13px;
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
  color: #0f172a;
}

.ghost {
  background: #f8fafc;
  color: #1f2937;
  border: 1px dashed #cbd5f5;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin: 20px 0;
}

.metric {
  background: #f8fafc;
  padding: 16px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  display: grid;
  gap: 6px;
}

.metric span {
  color: #64748b;
  font-size: 13px;
}

.metric strong {
  font-size: 20px;
}

.chart {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
  gap: 12px;
  align-items: end;
  height: 200px;
  padding-top: 12px;
}

.bar {
  display: grid;
  gap: 8px;
  justify-items: center;
}

.bar span {
  width: 100%;
  border-radius: 10px 10px 6px 6px;
  background: linear-gradient(180deg, #38bdf8, #2563eb);
  display: block;
}

.bar label {
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

thead {
  background: #f1f5f9;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
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
  background: linear-gradient(90deg, #22c55e, #16a34a);
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
