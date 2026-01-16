<template>
  <div class="module">
    <div class="header">
      <div>
        <h2>风险预警防护</h2>
        <p>对异常工况进行预警，辅助安全控制与故障防范。</p>
      </div>
      <div class="button-row">
        <button class="primary" @click="openModal('alert')">发布预警</button>
        <button class="secondary" @click="openModal('progress')">处置进度</button>
        <button class="ghost" @click="openModal('tip')">防护提示</button>
      </div>
    </div>

    <div class="grid grid-3">
      <div class="card alert">
        <h3>当前预警</h3>
        <p class="value">2 条</p>
        <span>一级预警 1，二级预警 1</span>
      </div>
      <div class="card alert">
        <h3>风险指数</h3>
        <p class="value">0.42</p>
        <span>趋势下降 5%</span>
      </div>
      <div class="card alert">
        <h3>安全阈值</h3>
        <p class="value">95%</p>
        <span>系统自检正常</span>
      </div>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <h3>风险变化曲线</h3>
        <svg viewBox="0 0 500 220" class="chart">
          <path
            d="M10 170 L70 160 L130 140 L190 150 L250 130 L310 120 L370 100 L430 110 L490 90"
            stroke="#f97316"
            stroke-width="4"
            fill="none"
            stroke-linecap="round"
          />
          <path d="M10 190 L490 190" stroke="#e2e8f0" stroke-width="2" />
        </svg>
      </div>
      <div class="card">
        <h3>预警事件清单</h3>
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>异常类型</th>
              <th>风险等级</th>
              <th>处置状态</th>
              <th>责任人</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.type }}</td>
              <td>{{ row.level }}</td>
              <td>{{ row.status }}</td>
              <td>{{ row.owner }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal
      :show="modal.type === 'alert'"
      title="发布预警通知"
      :on-close="closeModal"
      :on-confirm="submitAlert"
    >
      <form class="modal-form">
        <label>
          预警类型
          <select v-model="form.type">
            <option>卡钻风险</option>
            <option>扭矩突增</option>
            <option>地层突变</option>
          </select>
        </label>
        <label>
          风险等级
          <select v-model="form.level">
            <option>一级</option>
            <option>二级</option>
            <option>三级</option>
          </select>
        </label>
        <label>
          通知对象
          <input v-model="form.receiver" type="text" placeholder="安全员/现场负责人" />
        </label>
      </form>
    </BaseModal>

    <BaseModal
      :show="modal.type === 'progress'"
      title="处置进度"
      :on-close="closeModal"
      :show-footer="false"
    >
      <div class="progress">
        <div class="progress-bar" :style="{ width: modal.progress + '%' }"></div>
      </div>
      <p>应急处置已完成 {{ modal.progress }}%，实时跟踪中。</p>
    </BaseModal>

    <BaseModal
      :show="modal.type === 'tip'"
      title="防护提示"
      :on-close="closeModal"
      :show-footer="false"
    >
      <ul class="tip-list">
        <li>启用自动减速后需监测扭矩 5 分钟。</li>
        <li>一级预警建议安排现场复核。</li>
        <li>风险指数高于 0.6 请立即停钻。</li>
      </ul>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const modal = reactive({
  type: '',
  progress: 43
});

const form = reactive({
  type: '卡钻风险',
  level: '一级',
  receiver: '安全员/现场负责人'
});

const tableRows = Array.from({ length: 20 }, (_, index) => ({
  id: `WARN-${200 + index}`,
  type: index % 3 === 0 ? '卡钻风险' : index % 3 === 1 ? '扭矩突增' : '地层突变',
  level: index % 4 === 0 ? '一级' : index % 4 === 1 ? '二级' : '三级',
  status: index % 2 === 0 ? '处理中' : '已确认',
  owner: index % 2 === 0 ? '安全员' : '值班长'
}));

const openModal = (type) => {
  modal.type = type;
};

const closeModal = () => {
  modal.type = '';
};

const submitAlert = () => {
  modal.type = 'progress';
  modal.progress = 61;
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
  background: linear-gradient(135deg, #f97316, #facc15);
  color: white;
}

button.secondary {
  background: #ffedd5;
  color: #9a3412;
}

button.ghost {
  background: #f1f5f9;
  color: #475569;
}

.alert h3 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #64748b;
}

.alert .value {
  margin: 0 0 6px;
  font-size: 20px;
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
  background: linear-gradient(135deg, #f97316, #facc15);
}

.tip-list {
  display: grid;
  gap: 8px;
  padding-left: 16px;
  color: #475569;
}
</style>
