<template>
  <LayoutShell>
    <div class="card">
      <div class="section-title">
        <h3>设备列表</h3>
        <div class="toolbar">
          <button @click="openForm('add')">新增设备</button>
          <button class="secondary" @click="openProgress('upgrade')">固件升级</button>
          <button class="outline" @click="openProgress('diagnose')">故障诊断</button>
        </div>
      </div>
      <div class="responsive-table">
        <table>
          <thead>
            <tr>
              <th>设备</th>
              <th>类型</th>
              <th>位置</th>
              <th>版本</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="device in devices" :key="device.name">
              <td>{{ device.name }}</td>
              <td>{{ device.type }}</td>
              <td>{{ device.location }}</td>
              <td>{{ device.version }}</td>
              <td><span class="status-pill">{{ device.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="grid">
      <div class="stat-card" v-for="stat in deviceStats" :key="stat.title">
        <div class="flex-between">
          <h4>{{ stat.title }}</h4>
          <span class="badge">维护</span>
        </div>
        <div class="value">{{ stat.value }}</div>
        <div class="progress-container" style="margin-top: 8px;">
          <div class="progress-bar" :style="{ width: stat.progress + '%' }"></div>
        </div>
        <div class="small-text">{{ stat.desc }}</div>
      </div>
    </div>

    <div v-if="modal.type === 'add'" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>新增设备</h3>
          <button class="menu-button" @click="closeModal">关闭</button>
        </div>
        <div class="input-group">
          <label>设备名称</label>
          <input v-model="form.name" placeholder="如：振动-主泵" />
        </div>
        <div class="input-group">
          <label>类型</label>
          <select v-model="form.type">
            <option>传感器</option>
            <option>网关</option>
            <option>控制器</option>
          </select>
        </div>
        <div class="input-group">
          <label>安装位置</label>
          <input v-model="form.location" placeholder="生产线 A" />
        </div>
        <div class="modal-footer">
          <button class="outline" @click="closeModal">取消</button>
          <button class="secondary" @click="saveDevice">保存</button>
        </div>
      </div>
    </div>

    <div v-if="modal.type === 'upgrade'" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>固件升级</h3>
          <span class="status-pill">推送中</span>
        </div>
        <p>正在批量分发升级包到在线设备。</p>
        <div class="progress-container">
          <div class="progress-bar" :style="{ width: modal.progress + '%' }"></div>
        </div>
      </div>
    </div>

    <div v-if="modal.type === 'diagnose'" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>故障诊断</h3>
          <button class="menu-button" @click="closeModal">完成</button>
        </div>
        <p>正在执行连通性、CPU 与磁盘健康检查。</p>
        <div class="progress-container">
          <div class="progress-bar" :style="{ width: modal.progress + '%' }"></div>
        </div>
      </div>
    </div>
  </LayoutShell>
</template>

<script setup>
import { reactive } from 'vue';
import LayoutShell from '../components/LayoutShell.vue';

const devices = Array.from({ length: 20 }).map((_, idx) => ({
  name: `设备-${(idx + 1).toString().padStart(2, '0')}`,
  type: idx % 3 === 0 ? '传感器' : idx % 3 === 1 ? '网关' : '控制器',
  location: ['仓库', '生产线A', '生产线B', '实验室'][idx % 4],
  version: `v1.${idx % 6}.${idx % 3}`,
  status: idx % 5 === 0 ? '维护中' : '在线'
}));

const deviceStats = [
  { title: '在线率', value: '96.8%', progress: 96, desc: '过去 24h' },
  { title: '升级成功率', value: '99.1%', progress: 99, desc: '批量升级' },
  { title: '故障自愈', value: '87%', progress: 87, desc: '自动重试' }
];

const modal = reactive({ type: '', progress: 0 });
const form = reactive({ name: '', type: '传感器', location: '' });
let timer;

const openForm = (type) => (modal.type = type);

const openProgress = (type) => {
  modal.type = type;
  modal.progress = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    modal.progress = Math.min(100, modal.progress + 18);
    if (modal.progress >= 100) clearInterval(timer);
  }, 300);
};

const saveDevice = () => {
  alert(`已添加 ${form.name || '新设备'}，类型 ${form.type}，位置 ${form.location}`);
  modal.type = '';
};

const closeModal = () => {
  modal.type = '';
  clearInterval(timer);
};
</script>
