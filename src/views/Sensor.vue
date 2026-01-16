<template>
  <div class="module">
    <div class="module-hero">
      <div class="module-info">
        <h2>钻进感知采集概览</h2>
        <p>实时采集推进力、扭矩、转速等多维数据，稳定感知钻进过程。</p>
        <div class="button-row">
          <button class="primary" @click="openModal('task')">新增采集任务</button>
          <button class="secondary" @click="openModal('progress')">采集中状态</button>
          <button class="ghost" @click="openModal('tip')">查看提示</button>
        </div>
      </div>
      <div class="module-image">
        <img src="../assets/drilling-illustration.svg" alt="钻进传感示意" />
      </div>
    </div>

    <div class="grid grid-3">
      <div class="card metric">
        <h3>实时推进力</h3>
        <p class="value">286 kN</p>
        <span>稳定区间 250-310 kN</span>
      </div>
      <div class="card metric">
        <h3>扭矩波动</h3>
        <p class="value">42.6 kN·m</p>
        <span>波动系数 1.3%</span>
      </div>
      <div class="card metric">
        <h3>转速监测</h3>
        <p class="value">125 rpm</p>
        <span>监测通道 18 路</span>
      </div>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <h3>采集波形趋势</h3>
        <svg viewBox="0 0 500 220" class="chart">
          <defs>
            <linearGradient id="sensorLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#3b82f6" />
              <stop offset="100%" stop-color="#6366f1" />
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            stroke="url(#sensorLine)"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
            :points="trendLine"
          />
          <path d="M10 190 L490 190" stroke="#e2e8f0" stroke-width="2" />
        </svg>
      </div>
      <div class="card">
        <h3>采集记录表</h3>
        <table>
          <thead>
            <tr>
              <th>时间</th>
              <th>推进力</th>
              <th>扭矩</th>
              <th>转速</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.time">
              <td>{{ row.time }}</td>
              <td>{{ row.force }}</td>
              <td>{{ row.torque }}</td>
              <td>{{ row.speed }}</td>
              <td><span :class="['tag', row.statusClass]">{{ row.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal
      :show="modal.type === 'task'"
      title="新增采集任务"
      :on-close="closeModal"
      :on-confirm="submitTask"
    >
      <form class="modal-form">
        <label>
          采集范围
          <select v-model="form.range">
            <option>掌子面 - 300m</option>
            <option>掌子面 - 500m</option>
            <option>掌子面 - 800m</option>
          </select>
        </label>
        <label>
          采样频率
          <input v-model="form.frequency" type="text" placeholder="例如 20 Hz" />
        </label>
        <label>
          数据通道
          <input v-model="form.channel" type="text" placeholder="例如 推进力/扭矩/转速" />
        </label>
      </form>
    </BaseModal>

    <BaseModal
      :show="modal.type === 'progress'"
      title="实时采集中"
      :on-close="closeModal"
      :show-footer="false"
    >
      <div class="progress">
        <div class="progress-bar" :style="{ width: modal.progress + '%' }"></div>
      </div>
      <p>已完成 {{ modal.progress }}%，预计剩余 3 分钟。</p>
    </BaseModal>

    <BaseModal
      :show="modal.type === 'tip'"
      title="传感提示"
      :on-close="closeModal"
      :show-footer="false"
    >
      <ul class="tip-list">
        <li>当前传感器热漂移在安全阈值内。</li>
        <li>建议保持采样频率不低于 20 Hz。</li>
        <li>同步扭矩信号可提升状态识别准确率。</li>
      </ul>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const modal = reactive({
  type: '',
  progress: 68
});

const form = reactive({
  range: '掌子面 - 300m',
  frequency: '20 Hz',
  channel: '推进力/扭矩/转速'
});

const trendLine = '10,160 60,140 110,150 160,120 210,130 260,90 310,110 360,80 410,100 460,70 490,90';

const tableRows = Array.from({ length: 20 }, (_, index) => ({
  time: `09:${index < 10 ? `0${index}` : index}`,
  force: `${260 + index} kN`,
  torque: `${38 + (index % 6)} kN·m`,
  speed: `${120 + (index % 8)} rpm`,
  status: index % 4 === 0 ? '波动' : '稳定',
  statusClass: index % 4 === 0 ? 'warn' : 'ok'
}));

const openModal = (type) => {
  modal.type = type;
};

const closeModal = () => {
  modal.type = '';
};

const submitTask = () => {
  modal.type = 'progress';
  modal.progress = 74;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.module-hero {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  align-items: center;
}

.module-info h2 {
  margin: 0 0 8px;
  color: #1e3a8a;
}

.module-info p {
  margin: 0 0 16px;
  color: #64748b;
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.button-row button {
  border: none;
  border-radius: 12px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
}

button.primary {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
}

button.secondary {
  background: #e0e7ff;
  color: #1e3a8a;
}

button.ghost {
  background: #f1f5f9;
  color: #475569;
}

.module-image img {
  width: 100%;
  max-width: 360px;
  justify-self: center;
}

.metric h3 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #64748b;
}

.metric .value {
  margin: 0 0 6px;
  font-size: 28px;
  font-weight: 600;
  color: #1e293b;
}

.chart {
  width: 100%;
  height: 220px;
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

.tag {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.tag.ok {
  background: #dcfce7;
  color: #166534;
}

.tag.warn {
  background: #fef9c3;
  color: #92400e;
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
  background: linear-gradient(135deg, #3b82f6, #6366f1);
}

.tip-list {
  display: grid;
  gap: 8px;
  padding-left: 16px;
  color: #475569;
}
</style>
