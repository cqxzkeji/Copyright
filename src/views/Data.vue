<template>
  <div class="module">
    <div class="header">
      <div>
        <h2>监控展示与管理</h2>
        <p>可视化展示钻进状态，支持数据存储与统计分析。</p>
      </div>
      <div class="button-row">
        <button class="primary" @click="openModal('report')">生成报表</button>
        <button class="secondary" @click="openModal('progress')">存储进度</button>
        <button class="ghost" @click="openModal('tip')">管理提示</button>
      </div>
    </div>

    <div class="grid grid-3">
      <div class="card metric">
        <h3>今日钻进量</h3>
        <p class="value">128 m</p>
        <span>同比 +12%</span>
      </div>
      <div class="card metric">
        <h3>数据入库率</h3>
        <p class="value">99.2%</p>
        <span>丢包率 0.3%</span>
      </div>
      <div class="card metric">
        <h3>在线节点</h3>
        <p class="value">42</p>
        <span>分布式采集</span>
      </div>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <h3>监控看板</h3>
        <div class="dashboard-grid">
          <div class="monitor">
            <span>推进力峰值</span>
            <strong>310 kN</strong>
          </div>
          <div class="monitor">
            <span>扭矩峰值</span>
            <strong>48 kN·m</strong>
          </div>
          <div class="monitor">
            <span>平均转速</span>
            <strong>126 rpm</strong>
          </div>
          <div class="monitor">
            <span>稳定时长</span>
            <strong>5.2 h</strong>
          </div>
        </div>
        <svg viewBox="0 0 500 180" class="chart">
          <path
            d="M10 140 L70 120 L130 125 L190 110 L250 90 L310 105 L370 80 L430 70 L490 60"
            stroke="#22c55e"
            stroke-width="4"
            fill="none"
            stroke-linecap="round"
          />
          <path d="M10 160 L490 160" stroke="#e2e8f0" stroke-width="2" />
        </svg>
      </div>
      <div class="card">
        <h3>数据档案表</h3>
        <table>
          <thead>
            <tr>
              <th>日期</th>
              <th>里程</th>
              <th>数据量</th>
              <th>分析报告</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.date">
              <td>{{ row.date }}</td>
              <td>{{ row.distance }}</td>
              <td>{{ row.volume }}</td>
              <td>{{ row.report }}</td>
              <td>{{ row.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal
      :show="modal.type === 'report'"
      title="生成数据报表"
      :on-close="closeModal"
      :on-confirm="submitReport"
    >
      <form class="modal-form">
        <label>
          报表类型
          <select v-model="form.type">
            <option>日报</option>
            <option>周报</option>
            <option>月报</option>
          </select>
        </label>
        <label>
          统计区间
          <input v-model="form.range" type="text" placeholder="例如 2024-04-01 至 2024-04-07" />
        </label>
        <label>
          输出格式
          <select v-model="form.format">
            <option>PDF</option>
            <option>Excel</option>
            <option>HTML</option>
          </select>
        </label>
      </form>
    </BaseModal>

    <BaseModal
      :show="modal.type === 'progress'"
      title="存储进度"
      :on-close="closeModal"
      :show-footer="false"
    >
      <div class="progress">
        <div class="progress-bar" :style="{ width: modal.progress + '%' }"></div>
      </div>
      <p>数据归档进行中，已完成 {{ modal.progress }}%。</p>
    </BaseModal>

    <BaseModal
      :show="modal.type === 'tip'"
      title="管理提示"
      :on-close="closeModal"
      :show-footer="false"
    >
      <ul class="tip-list">
        <li>建议每班次进行一次数据归档。</li>
        <li>报表生成后自动同步云端。</li>
        <li>数据异常将推送至监控中心。</li>
      </ul>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const modal = reactive({
  type: '',
  progress: 69
});

const form = reactive({
  type: '日报',
  range: '2024-04-01 至 2024-04-07',
  format: 'PDF'
});

const tableRows = Array.from({ length: 20 }, (_, index) => ({
  date: `2024-04-${String(index + 1).padStart(2, '0')}`,
  distance: `${120 + index} m`,
  volume: `${3.1 + index * 0.1} GB`,
  report: index % 2 === 0 ? '已生成' : '待生成',
  status: index % 3 === 0 ? '已归档' : '处理中'
}));

const openModal = (type) => {
  modal.type = type;
};

const closeModal = () => {
  modal.type = '';
};

const submitReport = () => {
  modal.type = 'progress';
  modal.progress = 81;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.header h2 {
  margin: 0 0 6px;
  color: #1e3a8a;
}

.header p {
  margin: 0;
  color: #64748b;
}

.button-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.button-row button {
  border: none;
  border-radius: 12px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
}

button.primary {
  background: linear-gradient(135deg, #22c55e, #14b8a6);
  color: white;
}

button.secondary {
  background: #dcfce7;
  color: #166534;
}

button.ghost {
  background: #f1f5f9;
  color: #475569;
}

.metric h3 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #64748b;
}

.metric .value {
  margin: 0 0 6px;
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}

.monitor {
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px;
  display: grid;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
}

.monitor strong {
  font-size: 16px;
  color: #1e293b;
}

.chart {
  width: 100%;
  height: 180px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  padding: 10px 8px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}

th {
  color: #64748b;
  font-weight: 600;
}

.modal-form {
  display: grid;
  gap: 12px;
}

.modal-form input,
.modal-form select {
  width: 100%;
  border: 1px solid #cbd5f5;
  border-radius: 10px;
  padding: 10px 12px;
  margin-top: 6px;
  background: #f8fafc;
}

.progress {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  margin-bottom: 12px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(135deg, #22c55e, #14b8a6);
}

.tip-list {
  display: grid;
  gap: 8px;
  padding-left: 16px;
  color: #475569;
}
</style>
