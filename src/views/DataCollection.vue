<template>
  <LayoutShell>
    <div class="card">
      <div class="section-title">
        <h3>采集通道</h3>
        <div class="toolbar">
          <button @click="openForm('addSensor')">接入新设备</button>
          <button class="secondary" @click="openProgress('collecting')">启动采集</button>
          <button class="outline" @click="openInfo('viewLogs')">查看采集日志</button>
        </div>
      </div>
      <div class="responsive-table">
        <table>
          <thead>
            <tr>
              <th>通道</th>
              <th>协议</th>
              <th>传感器</th>
              <th>频率</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in sensors" :key="row.channel">
              <td>{{ row.channel }}</td>
              <td>{{ row.protocol }}</td>
              <td>{{ row.name }}</td>
              <td>{{ row.frequency }}</td>
              <td><span class="status-pill">{{ row.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="grid">
      <div class="stat-card" v-for="metric in metrics" :key="metric.title">
        <div class="flex-between">
          <h4>{{ metric.title }}</h4>
          <span class="badge">实时</span>
        </div>
        <div class="value">{{ metric.value }}</div>
        <div class="small-text">{{ metric.desc }}</div>
        <div class="progress-container" style="margin-top: 8px;">
          <div class="progress-bar" :style="{ width: metric.progress + '%' }"></div>
        </div>
      </div>
    </div>

    <div v-if="modal.type === 'addSensor'" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>接入新设备</h3>
          <button class="menu-button" @click="closeModal">关闭</button>
        </div>
        <div class="input-group">
          <label>设备名称</label>
          <input v-model="form.name" placeholder="如：仓库温湿度" />
        </div>
        <div class="input-group">
          <label>通讯协议</label>
          <select v-model="form.protocol">
            <option>Modbus</option>
            <option>MQTT</option>
            <option>CoAP</option>
          </select>
        </div>
        <div class="input-group">
          <label>采样频率（秒）</label>
          <input type="number" v-model.number="form.interval" />
        </div>
        <div class="modal-footer">
          <button class="outline" @click="closeModal">取消</button>
          <button class="secondary" @click="saveSensor">保存并校验</button>
        </div>
      </div>
    </div>

    <div v-if="modal.type === 'collecting'" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>采集任务启动</h3>
          <span class="status-pill">进行中</span>
        </div>
        <p>正在推送采集配置到边缘节点，确认进度。</p>
        <div class="progress-container">
          <div class="progress-bar" :style="{ width: modal.progress + '%' }"></div>
        </div>
        <div class="modal-footer">
          <button class="menu-button" @click="closeModal">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="modal.type === 'viewLogs'" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>采集日志</h3>
          <button class="menu-button" @click="closeModal">已阅</button>
        </div>
        <div class="alert">已同步 {{ sensors.length }} 条通道配置，最近 5 分钟无丢包。</div>
        <ul>
          <li v-for="log in logs" :key="log">{{ log }}</li>
        </ul>
      </div>
    </div>
  </LayoutShell>
</template>

<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import LayoutShell from '../components/LayoutShell.vue';

const sensors = Array.from({ length: 20 }).map((_, idx) => ({
  channel: `CH-${(idx + 1).toString().padStart(2, '0')}`,
  protocol: idx % 3 === 0 ? 'MQTT' : idx % 3 === 1 ? 'Modbus' : 'CoAP',
  name: ['温度', '湿度', '气压', '振动'][idx % 4] + `-${idx + 1}`,
  frequency: `${10 + (idx % 5) * 5}s`,
  status: idx % 5 === 0 ? '稳定' : '运行中'
}));

const metrics = [
  { title: '当前带宽', value: '128 Mbps', progress: 70, desc: '采集链路利用率' },
  { title: '数据到达率', value: '99.6%', progress: 96, desc: '过去 10 分钟成功率' },
  { title: '平均延迟', value: '180 ms', progress: 55, desc: '从设备到平台' },
  { title: '在线网关', value: '12 台', progress: 80, desc: '边缘节点在线数量' }
];

const logs = [
  '08:01 边缘网关-01 上报心跳正常。',
  '08:02 采集通道 CH-05 频率调整为 20s。',
  '08:03 MQTT 通道出现 0.2% 丢包，已重传。',
  '08:05 新增传感器 仓库湿度-3 完成握手。',
  '08:06 对时完成，NTP 偏差 12ms。'
];

const modal = reactive({ type: '', progress: 0 });
const form = reactive({ name: '', protocol: 'Modbus', interval: 15 });
let timer;

const openForm = (type) => {
  modal.type = type;
};

const openProgress = (type) => {
  modal.type = type;
  modal.progress = 0;
  timer = setInterval(() => {
    modal.progress = Math.min(100, modal.progress + 10);
    if (modal.progress === 100) {
      clearInterval(timer);
    }
  }, 300);
};

const openInfo = (type) => {
  modal.type = type;
};

const closeModal = () => {
  modal.type = '';
  clearInterval(timer);
};

const saveSensor = () => {
  alert(`已保存 ${form.name || '新设备'} 的接入配置（${form.protocol}/${form.interval}s）`);
  closeModal();
};

onMounted(() => () => clearInterval(timer));
onBeforeUnmount(() => clearInterval(timer));
</script>
