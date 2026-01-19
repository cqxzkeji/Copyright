<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h2>数据采集与输入</h2>
      </div>
      <div class="toolbar">
        <button type="button" @click="openForm('导入遥感数据', formTemplates.remote)">导入遥感</button>
        <button type="button" @click="openForm('新增GPS采集', formTemplates.gps)">录入GPS</button>
        <button type="button" @click="openForm('批量上传传感器', formTemplates.sensor)">上传传感器</button>
        <button type="button" @click="openProgress('格式校验进度', '正在校验采集数据格式一致性')">格式校验</button>
        <button type="button" @click="openInfo('采集提示', '今日已完成 86% 计划任务，请关注高频区域。')">采集提示</button>
      </div>
    </div>

    <div class="content-grid">
      <div class="card">
        <h3>采集进度图</h3>
        <div class="chart">
          <div v-for="item in captureProgress" :key="item.name" class="bar">
            <span>{{ item.name }}</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: item.value + '%' }"></div>
            </div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>采集设备状态</h3>
        <ul class="status-list">
          <li v-for="device in devices" :key="device.code">
            <div>
              <strong>{{ device.name }}</strong>
              <span>{{ device.code }}</span>
            </div>
            <span :class="['badge', device.status]">{{ device.statusLabel }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="card table-card">
      <h3>采集任务清单（20条）</h3>
      <table>
        <thead>
          <tr>
            <th>任务编号</th>
            <th>数据类型</th>
            <th>区域</th>
            <th>负责人</th>
            <th>采集时间</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>{{ task.id }}</td>
            <td>{{ task.type }}</td>
            <td>{{ task.area }}</td>
            <td>{{ task.owner }}</td>
            <td>{{ task.time }}</td>
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

const captureProgress = [
  { name: '遥感影像', value: 82 },
  { name: '地形测绘', value: 74 },
  { name: '传感器', value: 68 },
  { name: 'GPS轨迹', value: 91 }
];

const devices = [
  { name: '遥感卫星 A1', code: 'RS-01', status: 'active', statusLabel: '正常' },
  { name: '无人机巡检', code: 'UAV-12', status: 'active', statusLabel: '正常' },
  { name: '地面基站', code: 'STA-07', status: 'warning', statusLabel: '待维护' },
  { name: '海洋浮标', code: 'OBS-05', status: 'active', statusLabel: '正常' }
];

const tasks = Array.from({ length: 20 }, (_, index) => {
  const types = ['遥感', '矢量测绘', '传感器', 'GPS'];
  const statuses = [
    { label: '进行中', class: 'processing' },
    { label: '待审核', class: 'pending' },
    { label: '已完成', class: 'done' }
  ];
  const status = statuses[index % statuses.length];
  return {
    id: `CAP-${index + 1}`,
    type: types[index % types.length],
    area: `区域-${String.fromCharCode(65 + (index % 6))}`,
    owner: `采集员${index + 1}`,
    time: `2024-09-${(index % 28) + 1}`,
    status: status.label,
    statusClass: status.class
  };
});

const formTemplates = {
  remote: [
    { label: '数据来源', type: 'text', placeholder: '请输入卫星/平台名称' },
    { label: '覆盖范围', type: 'text', placeholder: '例如：华东区域' },
    { label: '采集分辨率', type: 'select', options: ['0.5m', '1m', '2m'] }
  ],
  gps: [
    { label: '设备编号', type: 'text', placeholder: '例如 GPS-2031' },
    { label: '采集频率', type: 'select', options: ['1s', '5s', '10s'] },
    { label: '任务负责人', type: 'text', placeholder: '请输入负责人姓名' }
  ],
  sensor: [
    { label: '传感器类型', type: 'select', options: ['温湿度', '雨量', '风速'] },
    { label: '上传批次', type: 'text', placeholder: '请输入批次编号' },
    { label: '数据条数', type: 'text', placeholder: '例如 1200' }
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
  modal.message = '请补充采集参数后提交审核。';
};

const openProgress = (title, message) => {
  modal.open = true;
  modal.title = title;
  modal.type = 'progress';
  modal.message = message;
  modal.progress = 64;
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
  background: #e0f2fe;
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
  background: linear-gradient(90deg, #38bdf8, #2563eb);
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

.badge.active {
  background: #dcfce7;
  color: #15803d;
}

.badge.warning {
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
  background: #e0f2fe;
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
  background: linear-gradient(90deg, #60a5fa, #2563eb);
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
  background: #2563eb;
  color: #fff;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
}
</style>
