<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h2>应用与决策支持</h2>
      </div>
      <div class="toolbar">
        <button type="button" @click="openForm('实时监控配置', formTemplates.monitor)">实时监控</button>
        <button type="button" @click="openForm('灾害预测模拟', formTemplates.disaster)">灾害预测</button>
        <button type="button" @click="openForm('城市规划方案', formTemplates.plan)">城市规划</button>
        <button type="button" @click="openProgress('交通管理优化', '正在生成交通优化策略')">交通管理</button>
        <button type="button" @click="openInfo('决策提示', '最新预警已推送至应急指挥中心。')">决策提示</button>
      </div>
    </div>

    <div class="content-grid">
      <div class="card">
        <h3>预警响应指数</h3>
        <div class="chart">
          <div v-for="item in responseStats" :key="item.name" class="bar">
            <span>{{ item.name }}</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: item.value + '%' }"></div>
            </div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>行业场景状态</h3>
        <ul class="status-list">
          <li v-for="sector in sectors" :key="sector.name">
            <div>
              <strong>{{ sector.name }}</strong>
              <span>{{ sector.detail }}</span>
            </div>
            <span :class="['badge', sector.status]">{{ sector.label }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="card table-card">
      <h3>决策场景清单（20条）</h3>
      <table>
        <thead>
          <tr>
            <th>场景编号</th>
            <th>应用领域</th>
            <th>监测区域</th>
            <th>负责人</th>
            <th>更新时间</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="scenario in scenarios" :key="scenario.id">
            <td>{{ scenario.id }}</td>
            <td>{{ scenario.domain }}</td>
            <td>{{ scenario.area }}</td>
            <td>{{ scenario.owner }}</td>
            <td>{{ scenario.updated }}</td>
            <td>
              <span :class="['tag', scenario.statusClass]">{{ scenario.status }}</span>
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

const responseStats = [
  { name: '灾害预警', value: 82 },
  { name: '城市运行', value: 76 },
  { name: '交通管理', value: 69 },
  { name: '农业监测', value: 61 }
];

const sectors = [
  { name: '应急指挥', detail: '在线指挥 6 个现场', status: 'good', label: '运行中' },
  { name: '交通管理', detail: '高峰拥堵指数 2.1', status: 'warn', label: '关注' },
  { name: '农业监测', detail: '作物长势稳定', status: 'good', label: '正常' },
  { name: '环保监控', detail: '空气质量优良', status: 'good', label: '正常' }
];

const scenarios = Array.from({ length: 20 }, (_, index) => {
  const domains = ['应急', '城市', '交通', '农业', '环保'];
  const statuses = [
    { label: '运行中', class: 'running' },
    { label: '待发布', class: 'pending' },
    { label: '已归档', class: 'archived' }
  ];
  const status = statuses[index % statuses.length];
  return {
    id: `DEC-${index + 1}`,
    domain: domains[index % domains.length],
    area: `片区-${index % 7 + 1}`,
    owner: `指挥员${index + 1}`,
    updated: `2024-09-${(index % 28) + 1}`,
    status: status.label,
    statusClass: status.class
  };
});

const formTemplates = {
  monitor: [
    { label: '监控主题', type: 'text', placeholder: '例如 城市运行态势' },
    { label: '刷新频率', type: 'select', options: ['实时', '30秒', '1分钟'] },
    { label: '告警阈值', type: 'text', placeholder: '例如 80' }
  ],
  disaster: [
    { label: '灾害类型', type: 'select', options: ['洪涝', '地震', '台风'] },
    { label: '模拟周期', type: 'text', placeholder: '例如 48 小时' },
    { label: '影响范围', type: 'text', placeholder: '请输入行政区划' }
  ],
  plan: [
    { label: '规划主题', type: 'text', placeholder: '例如 城市更新' },
    { label: '方案版本', type: 'select', options: ['V1.0', 'V2.0', 'V3.0'] },
    { label: '审批单位', type: 'text', placeholder: '请输入单位名称' }
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
  modal.message = '请补充业务参数并提交审批。';
};

const openProgress = (title, message) => {
  modal.open = true;
  modal.title = title;
  modal.type = 'progress';
  modal.message = message;
  modal.progress = 63;
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
  background: #fde68a;
  color: #92400e;
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
  background: linear-gradient(90deg, #fbbf24, #f97316);
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

.tag.running {
  background: #dcfce7;
  color: #15803d;
}

.tag.pending {
  background: #fef9c3;
  color: #a16207;
}

.tag.archived {
  background: #e2e8f0;
  color: #475569;
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
  background: linear-gradient(90deg, #fbbf24, #f97316);
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
  background: #f59e0b;
  color: #fff;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
}
</style>
