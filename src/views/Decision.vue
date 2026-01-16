<template>
  <div class="module">
    <div class="header">
      <div>
        <h2>智能决策控制</h2>
        <p>根据工况分析结果智能优化钻进参数，提高效率与稳定性。</p>
      </div>
      <div class="button-row">
        <button class="primary" @click="openModal('adjust')">生成优化方案</button>
        <button class="secondary" @click="openModal('progress')">调参执行</button>
        <button class="ghost" @click="openModal('tip')">决策提示</button>
      </div>
    </div>

    <div class="grid grid-3">
      <div class="card metric">
        <h3>目标推进力</h3>
        <p class="value">275 kN</p>
        <span>当前 266 kN</span>
      </div>
      <div class="card metric">
        <h3>目标转速</h3>
        <p class="value">132 rpm</p>
        <span>当前 125 rpm</span>
      </div>
      <div class="card metric">
        <h3>效率提升</h3>
        <p class="value">+8.6%</p>
        <span>预测孔底稳定</span>
      </div>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <h3>参数优化曲线</h3>
        <svg viewBox="0 0 500 220" class="chart">
          <path
            d="M10 160 L70 140 L130 135 L190 120 L250 110 L310 95 L370 85 L430 70 L490 60"
            stroke="#3b82f6"
            stroke-width="4"
            fill="none"
            stroke-linecap="round"
          />
          <path d="M10 190 L490 190" stroke="#e2e8f0" stroke-width="2" />
        </svg>
      </div>
      <div class="card">
        <h3>决策方案列表</h3>
        <table>
          <thead>
            <tr>
              <th>方案编号</th>
              <th>推进力</th>
              <th>转速</th>
              <th>扭矩</th>
              <th>预期效果</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.force }}</td>
              <td>{{ row.speed }}</td>
              <td>{{ row.torque }}</td>
              <td>{{ row.effect }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal
      :show="modal.type === 'adjust'"
      title="生成优化方案"
      :on-close="closeModal"
      :on-confirm="submitAdjust"
    >
      <form class="modal-form">
        <label>
          优化目标
          <select v-model="form.goal">
            <option>提升效率</option>
            <option>抑制振动</option>
            <option>降低扭矩</option>
          </select>
        </label>
        <label>
          优先参数
          <input v-model="form.priority" type="text" placeholder="推进力/转速" />
        </label>
        <label>
          预计周期
          <input v-model="form.window" type="text" placeholder="例如 30 分钟" />
        </label>
      </form>
    </BaseModal>

    <BaseModal
      :show="modal.type === 'progress'"
      title="调参执行进度"
      :on-close="closeModal"
      :show-footer="false"
    >
      <div class="progress">
        <div class="progress-bar" :style="{ width: modal.progress + '%' }"></div>
      </div>
      <p>参数同步中，已完成 {{ modal.progress }}%。</p>
    </BaseModal>

    <BaseModal
      :show="modal.type === 'tip'"
      title="决策提示"
      :on-close="closeModal"
      :show-footer="false"
    >
      <ul class="tip-list">
        <li>优化方案已综合地层硬度与扭矩波动。</li>
        <li>建议在 5 分钟内完成参数同步。</li>
        <li>若振动升高，请启用稳态模式。</li>
      </ul>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const modal = reactive({
  type: '',
  progress: 58
});

const form = reactive({
  goal: '提升效率',
  priority: '推进力/转速',
  window: '30 分钟'
});

const tableRows = Array.from({ length: 20 }, (_, index) => ({
  id: `OPT-${100 + index}`,
  force: `${270 + (index % 6)} kN`,
  speed: `${128 + (index % 5)} rpm`,
  torque: `${40 + (index % 7)} kN·m`,
  effect: index % 3 === 0 ? '效率提升' : '稳定优先'
}));

const openModal = (type) => {
  modal.type = type;
};

const closeModal = () => {
  modal.type = '';
};

const submitAdjust = () => {
  modal.type = 'progress';
  modal.progress = 72;
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
  background: linear-gradient(135deg, #3b82f6, #6366f1);
}

.tip-list {
  display: grid;
  gap: 8px;
  padding-left: 16px;
  color: #475569;
}
</style>
