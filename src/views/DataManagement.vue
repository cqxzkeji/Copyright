<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h2>数据存储与管理</h2>
      </div>
      <div class="toolbar">
        <button type="button" @click="openForm('创建数据集', formTemplates.create)">创建数据集</button>
        <button type="button" @click="openForm('数据备份计划', formTemplates.backup)">备份计划</button>
        <button type="button" @click="openProgress('索引重建', '正在重建空间索引与元数据目录')">索引重建</button>
        <button type="button" @click="openForm('访问权限管理', formTemplates.access)">权限管理</button>
        <button type="button" @click="openInfo('安全提示', '本周已完成 3 次脱敏审计。')">安全提示</button>
      </div>
    </div>

    <div class="content-grid">
      <div class="card">
        <h3>存储使用率</h3>
        <div class="chart">
          <div v-for="item in storageUsage" :key="item.name" class="bar">
            <span>{{ item.name }}</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: item.value + '%' }"></div>
            </div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>数据库健康度</h3>
        <ul class="health-list">
          <li v-for="health in healthChecks" :key="health.item">
            <div>
              <strong>{{ health.item }}</strong>
              <span>{{ health.detail }}</span>
            </div>
            <span :class="['badge', health.status]">{{ health.label }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="card table-card">
      <h3>数据集清单（20条）</h3>
      <table>
        <thead>
          <tr>
            <th>数据集</th>
            <th>类型</th>
            <th>大小</th>
            <th>更新时间</th>
            <th>负责人</th>
            <th>安全级别</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="dataset in datasets" :key="dataset.name">
            <td>{{ dataset.name }}</td>
            <td>{{ dataset.type }}</td>
            <td>{{ dataset.size }}</td>
            <td>{{ dataset.updated }}</td>
            <td>{{ dataset.owner }}</td>
            <td>
              <span :class="['tag', dataset.levelClass]">{{ dataset.level }}</span>
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

const storageUsage = [
  { name: '矢量库', value: 72 },
  { name: '栅格库', value: 64 },
  { name: '遥感影像', value: 81 },
  { name: '时序数据', value: 55 }
];

const healthChecks = [
  { item: '索引一致性', detail: '最近1小时更新', status: 'good', label: '健康' },
  { item: '备份链路', detail: '双活同步', status: 'good', label: '正常' },
  { item: '访问审计', detail: '2条告警待处理', status: 'warn', label: '提醒' },
  { item: '存储节点', detail: '节点扩容中', status: 'good', label: '正常' }
];

const datasets = Array.from({ length: 20 }, (_, index) => {
  const types = ['矢量', '栅格', '遥感', '三维'];
  const levels = [
    { label: '公开', class: 'open' },
    { label: '内部', class: 'internal' },
    { label: '敏感', class: 'sensitive' }
  ];
  const level = levels[index % levels.length];
  return {
    name: `数据集-${index + 1}`,
    type: types[index % types.length],
    size: `${(index + 3) * 1.8} GB`,
    updated: `2024-09-${(index % 28) + 1}`,
    owner: `管理员${index + 1}`,
    level: level.label,
    levelClass: level.class
  };
});

const formTemplates = {
  create: [
    { label: '数据集名称', type: 'text', placeholder: '例如：城市道路矢量' },
    { label: '数据类型', type: 'select', options: ['矢量', '栅格', '三维'] },
    { label: '存储节点', type: 'select', options: ['节点A', '节点B', '节点C'] }
  ],
  backup: [
    { label: '备份频率', type: 'select', options: ['每日', '每周', '每月'] },
    { label: '目标存储', type: 'text', placeholder: '输入对象存储位置' },
    { label: '保留周期', type: 'text', placeholder: '例如 30 天' }
  ],
  access: [
    { label: '授权对象', type: 'text', placeholder: '用户或部门名称' },
    { label: '权限级别', type: 'select', options: ['只读', '可编辑', '管理员'] },
    { label: '过期时间', type: 'text', placeholder: '例如 2024-12-31' }
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
  modal.message = '请完善存储管理配置后提交审批。';
};

const openProgress = (title, message) => {
  modal.open = true;
  modal.title = title;
  modal.type = 'progress';
  modal.message = message;
  modal.progress = 58;
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
  background: #ede9fe;
  color: #6d28d9;
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
  background: linear-gradient(90deg, #a78bfa, #6366f1);
}

.health-list {
  list-style: none;
  display: grid;
  gap: 10px;
}

.health-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 12px;
  background: #f8fafc;
}

.health-list span {
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

.tag.open {
  background: #e0f2fe;
  color: #1d4ed8;
}

.tag.internal {
  background: #ede9fe;
  color: #6d28d9;
}

.tag.sensitive {
  background: #fee2e2;
  color: #b91c1c;
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
  background: linear-gradient(90deg, #a78bfa, #6366f1);
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
  background: #6366f1;
  color: #fff;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
}
</style>
