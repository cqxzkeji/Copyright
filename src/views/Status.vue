<template>
  <div class="module">
    <div class="header">
      <div>
        <h2>状态识别分析</h2>
        <p>自动识别不同地层与钻进工况，判断状态变化并输出可信度。</p>
      </div>
      <div class="button-row">
        <button class="primary" @click="openModal('analyze')">启动识别</button>
        <button class="secondary" @click="openModal('progress')">分析进度</button>
        <button class="ghost" @click="openModal('tip')">识别说明</button>
      </div>
    </div>

    <div class="grid grid-3">
      <div class="card summary">
        <h3>当前地层</h3>
        <p class="value">砂岩-粘土互层</p>
        <span>识别可信度 92%</span>
      </div>
      <div class="card summary">
        <h3>钻进状态</h3>
        <p class="value">稳定推进</p>
        <span>状态持续 38 min</span>
      </div>
      <div class="card summary">
        <h3>异常分布</h3>
        <p class="value">轻微卡阻</p>
        <span>风险等级 II</span>
      </div>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <h3>识别置信度趋势</h3>
        <svg viewBox="0 0 500 220" class="chart">
          <path
            d="M10 180 L60 150 L110 160 L160 120 L210 110 L260 100 L310 90 L360 70 L410 85 L460 60"
            stroke="#6366f1"
            stroke-width="4"
            fill="none"
            stroke-linecap="round"
          />
          <path d="M10 190 L490 190" stroke="#e2e8f0" stroke-width="2" />
        </svg>
      </div>
      <div class="card">
        <h3>状态识别记录</h3>
        <table>
          <thead>
            <tr>
              <th>时段</th>
              <th>地层类型</th>
              <th>状态</th>
              <th>可信度</th>
              <th>建议</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.time">
              <td>{{ row.time }}</td>
              <td>{{ row.layer }}</td>
              <td>{{ row.status }}</td>
              <td>{{ row.confidence }}</td>
              <td>{{ row.tip }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal
      :show="modal.type === 'analyze'"
      title="启动状态识别"
      :on-close="closeModal"
      :on-confirm="submitAnalyze"
    >
      <form class="modal-form">
        <label>
          识别时段
          <input v-model="form.window" type="text" placeholder="例如 09:00-10:00" />
        </label>
        <label>
          模型版本
          <select v-model="form.model">
            <option>V3.2 智能模型</option>
            <option>V3.1 稳态模型</option>
          </select>
        </label>
        <label>
          输出内容
          <input v-model="form.output" type="text" placeholder="地层类型/状态/可信度" />
        </label>
      </form>
    </BaseModal>

    <BaseModal
      :show="modal.type === 'progress'"
      title="识别进度"
      :on-close="closeModal"
      :show-footer="false"
    >
      <div class="progress">
        <div class="progress-bar" :style="{ width: modal.progress + '%' }"></div>
      </div>
      <p>当前识别批次完成 {{ modal.progress }}%，请保持数据通道稳定。</p>
    </BaseModal>

    <BaseModal
      :show="modal.type === 'tip'"
      title="识别说明"
      :on-close="closeModal"
      :show-footer="false"
    >
      <ul class="tip-list">
        <li>识别模型融合了 14 路实时信号。</li>
        <li>建议在异常波动时开启高频采样。</li>
        <li>可信度低于 80% 时需人工复核。</li>
      </ul>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const modal = reactive({
  type: '',
  progress: 52
});

const form = reactive({
  window: '09:00-10:00',
  model: 'V3.2 智能模型',
  output: '地层类型/状态/可信度'
});

const tableRows = Array.from({ length: 20 }, (_, index) => ({
  time: `第${index + 1}段`,
  layer: index % 3 === 0 ? '砂岩' : index % 3 === 1 ? '粉砂岩' : '粘土',
  status: index % 4 === 0 ? '轻微卡阻' : '稳定推进',
  confidence: `${88 + (index % 8)}%`,
  tip: index % 4 === 0 ? '建议减速' : '保持参数'
}));

const openModal = (type) => {
  modal.type = type;
};

const closeModal = () => {
  modal.type = '';
};

const submitAnalyze = () => {
  modal.type = 'progress';
  modal.progress = 66;
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

.summary h3 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #64748b;
}

.summary .value {
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
