<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h2>数据分析与处理</h2>
      </div>
      <div class="toolbar">
        <button type="button" @click="openForm('缓冲区分析', formTemplates.buffer)">缓冲分析</button>
        <button type="button" @click="openForm('叠加分析', formTemplates.overlay)">叠加分析</button>
        <button type="button" @click="openForm('空间插值', formTemplates.interpolate)">空间插值</button>
        <button type="button" @click="openProgress('最短路径计算', '正在计算网络最短路径')">最短路径</button>
        <button type="button" @click="openInfo('分析提示', '最新分析结果已同步至决策模块。')">分析提示</button>
      </div>
    </div>

    <div class="content-grid">
      <div class="card">
        <h3>分析任务分布</h3>
        <div class="chart">
          <div v-for="item in analysisStats" :key="item.name" class="bar">
            <span>{{ item.name }}</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: item.value + '%' }"></div>
            </div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>算法运行状态</h3>
        <ul class="status-list">
          <li v-for="algo in algorithms" :key="algo.name">
            <div>
              <strong>{{ algo.name }}</strong>
              <span>{{ algo.detail }}</span>
            </div>
            <span :class="['badge', algo.status]">{{ algo.label }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="card table-card">
      <h3>分析任务记录（20条）</h3>
      <table>
        <thead>
          <tr>
            <th>任务编号</th>
            <th>分析类型</th>
            <th>范围</th>
            <th>耗时</th>
            <th>负责人</th>
            <th>结果状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>{{ task.id }}</td>
            <td>{{ task.type }}</td>
            <td>{{ task.scope }}</td>
            <td>{{ task.duration }}</td>
            <td>{{ task.owner }}</td>
            <td>
              <span :class="['tag', task.statusClass]">{{ task.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :show="modal.open" :title="modal.title" @close="closeModal">
      <div v-if="modal.type === 'form'" class="form-grid">
        <label v-for="field in modal.fields" :key="field.label">
          {{ field.label }}
          <input v-if="field.type === 'text'" type="text" :placeholder="field.placeholder" />
          <select v-else>
            <option v-for="option in field.options" :key="option">{{ option }}</option>
          </select>
        </label>
        <p class="form-tip">{{ modal.message }}</p>
      </div>
      <div v-else-if="modal.type === 'progress'" class="progress-panel">
        <p>{{ modal.message }}</p>
        <div class="progress-track">
          <div class="progress-bar" :style="{ width: modal.progress + '%' }"></div>
        </div>
        <small>当前完成度：{{ modal.progress }}%</small>
      </div>
      <div v-else>
        <p>{{ modal.message }}</p>
      </div>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">关闭</button>
        <button class="primary" type="button" @click="closeModal">确认</button>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const analysisStats = [
  { name: '缓冲区', value: 48 },
  { name: '叠加分析', value: 66 },
  { name: '空间插值', value: 53 },
  { name: '最短路径', value: 72 }
];

const algorithms = [
  { name: '空间索引', detail: '平均响应 120ms', status: 'good', label: '稳定' },
  { name: '网络分析', detail: '峰值 8k 请求', status: 'good', label: '正常' },
  { name: '插值模型', detail: '误差 3.2%', status: 'warn', label: '提醒' },
  { name: '统计引擎', detail: '等待队列 2', status: 'good', label: '正常' }
];

const tasks = Array.from({ length: 20 }, (_, index) => {
  const types = ['缓冲区', '叠加分析', '空间插值', '最短路径'];
  const statuses = [
    { label: '成功', class: 'done' },
    { label: '处理中', class: 'processing' },
    { label: '待复核', class: 'pending' }
  ];
  const status = statuses[index % statuses.length];
  return {
    id: `ANA-${index + 100}`,
    type: types[index % types.length],
    scope: `范围-${index % 5 + 1}`,
    duration: `${(index % 8) + 2} 分钟`,
    owner: `分析员${index + 1}`,
    status: status.label,
    statusClass: status.class
  };
});

const formTemplates = {
  buffer: [
    { label: '缓冲半径', type: 'text', placeholder: '例如 500m' },
    { label: '目标图层', type: 'select', options: ['道路', '河流', '建筑'] },
    { label: '输出字段', type: 'text', placeholder: '请输入输出字段' }
  ],
  overlay: [
    { label: '主图层', type: 'select', options: ['土地利用', '行政区划', '保护区'] },
    { label: '叠加图层', type: 'select', options: ['人口密度', '道路密度', '风险区'] },
    { label: '输出格式', type: 'select', options: ['矢量', '栅格'] }
  ],
  interpolate: [
    { label: '插值模型', type: 'select', options: ['IDW', '克里金', '样条'] },
    { label: '采样点数', type: 'text', placeholder: '例如 120' },
    { label: '输出分辨率', type: 'text', placeholder: '例如 30m' }
  ]
};

const modal = reactive({
  open: false,
  title: '',
  message: '',
  type: 'info',
  fields: [],
  progress: 0
});

const openForm = (title, fields) => {
  modal.open = true;
  modal.title = title;
  modal.type = 'form';
  modal.fields = fields;
  modal.message = '请确认分析参数并提交运行。';
};

const openProgress = (title, message) => {
  modal.open = true;
  modal.title = title;
  modal.type = 'progress';
  modal.message = message;
  modal.progress = 71;
};

const openInfo = (title, message) => {
  modal.open = true;
  modal.title = title;
  modal.type = 'info';
  modal.message = message;
};

const closeModal = () => {
  modal.open = false;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.module-header h2 {
  font-size: 22px;
  margin-bottom: 6px;
}

.module-header p {
  color: #64748b;
}

.toolbar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.toolbar button {
  border: none;
  background: #dbeafe;
  color: #1d4ed8;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.card h3 {
  margin-bottom: 12px;
}

.chart {
  display: grid;
  gap: 12px;
}

.bar {
  display: grid;
  gap: 6px;
}

.bar span {
  color: #475569;
  font-size: 13px;
}

.bar-track {
  width: 100%;
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #3b82f6);
}

.status-list {
  list-style: none;
  display: grid;
  gap: 10px;
}

.status-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 12px;
  background: #f8fafc;
}

.status-list span {
  color: #64748b;
  font-size: 12px;
}

.badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.badge.good {
  background: #dcfce7;
  color: #15803d;
}

.badge.warn {
  background: #fef9c3;
  color: #a16207;
}

.table-card {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

th {
  background: #f8fafc;
  color: #475569;
}

.tag {
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
}

.tag.processing {
  background: #dbeafe;
  color: #1d4ed8;
}

.tag.pending {
  background: #fef9c3;
  color: #a16207;
}

.tag.done {
  background: #dcfce7;
  color: #15803d;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid label {
  display: grid;
  gap: 6px;
  font-size: 14px;
  color: #475569;
}

.form-grid input,
.form-grid select {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #cbd5f5;
}

.form-tip {
  font-size: 13px;
  color: #64748b;
}

.progress-panel {
  display: grid;
  gap: 10px;
}

.progress-track {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #3b82f6);
}

.ghost {
  border: none;
  background: #e2e8f0;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.primary {
  border: none;
  background: #3b82f6;
  color: #fff;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
}
</style>
