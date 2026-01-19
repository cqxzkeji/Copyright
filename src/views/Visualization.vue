<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h2>可视化与展示</h2>
      </div>
      <div class="toolbar">
        <button type="button" @click="openForm('地图渲染设置', formTemplates.render)">渲染设置</button>
        <button type="button" @click="openForm('创建3D场景', formTemplates.scene)">3D场景</button>
        <button type="button" @click="openProgress('地图导出', '正在生成高清地图与报告')">导出地图</button>
        <button type="button" @click="openForm('图层过滤器', formTemplates.filter)">图层过滤</button>
        <button type="button" @click="openInfo('展示提示', '大屏模式已同步至会议室终端。')">展示提示</button>
      </div>
    </div>

    <div class="content-grid">
      <div class="card">
        <h3>渲染性能</h3>
        <div class="chart">
          <div v-for="item in renderStats" :key="item.name" class="bar">
            <span>{{ item.name }}</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: item.value + '%' }"></div>
            </div>
            <strong>{{ item.value }} FPS</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>展示终端状态</h3>
        <ul class="status-list">
          <li v-for="terminal in terminals" :key="terminal.name">
            <div>
              <strong>{{ terminal.name }}</strong>
              <span>{{ terminal.detail }}</span>
            </div>
            <span :class="['badge', terminal.status]">{{ terminal.label }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="card table-card">
      <h3>地图图层清单（20条）</h3>
      <table>
        <thead>
          <tr>
            <th>图层名称</th>
            <th>类型</th>
            <th>数据来源</th>
            <th>更新时间</th>
            <th>可见状态</th>
            <th>渲染模式</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="layer in layers" :key="layer.name">
            <td>{{ layer.name }}</td>
            <td>{{ layer.type }}</td>
            <td>{{ layer.source }}</td>
            <td>{{ layer.updated }}</td>
            <td>
              <span :class="['tag', layer.visibilityClass]">{{ layer.visibility }}</span>
            </td>
            <td>{{ layer.mode }}</td>
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

const renderStats = [
  { name: '二维底图', value: 54 },
  { name: '矢量渲染', value: 62 },
  { name: '三维建筑', value: 45 },
  { name: '实时轨迹', value: 58 }
];

const terminals = [
  { name: '指挥大厅大屏', detail: '1920x1080 / 60fps', status: 'good', label: '在线' },
  { name: '移动端驾驶舱', detail: '同步中', status: 'good', label: '在线' },
  { name: '会议室终端', detail: '4K 输出', status: 'warn', label: '待更新' },
  { name: 'WEB 端', detail: '活跃用户 128', status: 'good', label: '稳定' }
];

const layers = Array.from({ length: 20 }, (_, index) => {
  const types = ['底图', '矢量', '栅格', '三维'];
  const visibility = [
    { label: '显示', class: 'visible' },
    { label: '半透明', class: 'semi' },
    { label: '隐藏', class: 'hidden' }
  ];
  const status = visibility[index % visibility.length];
  return {
    name: `图层-${index + 1}`,
    type: types[index % types.length],
    source: `数据源-${index % 6 + 1}`,
    updated: `2024-09-${(index % 28) + 1}`,
    visibility: status.label,
    visibilityClass: status.class,
    mode: index % 2 === 0 ? '矢量渲染' : '栅格渲染'
  };
});

const formTemplates = {
  render: [
    { label: '渲染主题', type: 'select', options: ['清爽浅色', '城市夜景', '科技蓝'] },
    { label: '地图缩放级别', type: 'text', placeholder: '例如 12' },
    { label: '刷新频率', type: 'select', options: ['实时', '5秒', '15秒'] }
  ],
  scene: [
    { label: '场景名称', type: 'text', placeholder: '例如：智慧园区' },
    { label: '建筑模型', type: 'select', options: ['LOD1', 'LOD2', 'LOD3'] },
    { label: '光照模式', type: 'select', options: ['日间', '夜间', '动态'] }
  ],
  filter: [
    { label: '过滤字段', type: 'select', options: ['高度', '类别', '更新时间'] },
    { label: '阈值条件', type: 'text', placeholder: '例如 > 50' },
    { label: '输出图层', type: 'text', placeholder: '请输入输出名称' }
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
  modal.message = '请更新展示参数并保存配置。';
};

const openProgress = (title, message) => {
  modal.open = true;
  modal.title = title;
  modal.type = 'progress';
  modal.message = message;
  modal.progress = 69;
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
  background: #ccfbf1;
  color: #0f766e;
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
  background: linear-gradient(90deg, #34d399, #14b8a6);
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

.tag.visible {
  background: #dcfce7;
  color: #15803d;
}

.tag.semi {
  background: #fef9c3;
  color: #a16207;
}

.tag.hidden {
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
  background: linear-gradient(90deg, #34d399, #14b8a6);
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
  background: #14b8a6;
  color: #fff;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
}
</style>
