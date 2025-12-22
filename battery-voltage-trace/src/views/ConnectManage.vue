<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2>WiFi / 蓝牙接入</h2>
        <p>管理蓄电池终端的无线接入配置与实时连接质量</p>
      </div>
      <div class="action-group">
        <button class="primary" @click="openModal('scan')">扫描接入</button>
        <button class="secondary" @click="openModal('config')">配网设置</button>
        <button class="secondary" @click="openModal('security')">安全校验</button>
      </div>
    </div>

    <div class="stats">
      <div class="card">
        <h3>WiFi 在线</h3>
        <strong>{{ wifiOnline }}</strong>
        <span>信号稳定 98%</span>
      </div>
      <div class="card">
        <h3>蓝牙在线</h3>
        <strong>{{ btOnline }}</strong>
        <span>长连接 6 台</span>
      </div>
      <div class="card">
        <h3>接入成功率</h3>
        <strong>96%</strong>
        <span>24 小时内</span>
      </div>
    </div>

    <div class="layout">
      <div class="panel">
        <h3>接入记录</h3>
        <table>
          <thead>
            <tr>
              <th>终端编号</th>
              <th>类型</th>
              <th>信号强度</th>
              <th>网络</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in connections" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.signal }} dBm</td>
              <td>{{ item.network }}</td>
              <td>
                <span class="tag" :class="item.statusClass">{{ item.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="panel">
        <h3>接入拓扑示意</h3>
        <div class="chart-box">
          <svg viewBox="0 0 320 200" class="chart">
            <rect x="0" y="0" width="320" height="200" rx="16" fill="#f4f7ff" />
            <circle cx="160" cy="80" r="26" fill="#5b74ff" opacity="0.9" />
            <circle cx="80" cy="150" r="18" fill="#7fb0ff" />
            <circle cx="240" cy="150" r="18" fill="#7fb0ff" />
            <circle cx="40" cy="70" r="14" fill="#c7d5ff" />
            <circle cx="280" cy="70" r="14" fill="#c7d5ff" />
            <line x1="160" y1="80" x2="80" y2="150" stroke="#a9b9ff" stroke-width="3" />
            <line x1="160" y1="80" x2="240" y2="150" stroke="#a9b9ff" stroke-width="3" />
            <line x1="160" y1="80" x2="40" y2="70" stroke="#a9b9ff" stroke-width="2" />
            <line x1="160" y1="80" x2="280" y2="70" stroke="#a9b9ff" stroke-width="2" />
          </svg>
          <div class="legend">
            <div>
              <span class="dot"></span>
              无线网关与终端连接状态
            </div>
            <p>建议对北侧蓝牙节点进行信号优化。</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="modal.visible" class="modal-backdrop">
      <div class="modal">
        <header>
          <h3>{{ modal.title }}</h3>
          <button class="close" @click="closeModal">×</button>
        </header>
        <div class="modal-body">
          <form v-if="modal.type === 'config'" @submit.prevent="applyConfig">
            <label>
              WiFi SSID
              <input v-model="configForm.ssid" required />
            </label>
            <label>
              密钥
              <input v-model="configForm.key" required type="password" />
            </label>
            <label>
              蓝牙广播名
              <input v-model="configForm.btName" required />
            </label>
            <div class="modal-actions">
              <button class="secondary" type="button" @click="closeModal">取消</button>
              <button class="primary" type="submit">保存配置</button>
            </div>
          </form>

          <div v-else-if="modal.type === 'scan'" class="tip-box">
            <p>已发现 4 台可接入终端，是否立即授权接入？</p>
            <div class="modal-actions">
              <button class="secondary" @click="closeModal">稍后</button>
              <button class="primary" @click="confirmScan">授权接入</button>
            </div>
          </div>

          <div v-else class="progress-box">
            <p>正在校验接入安全性，请稍候。</p>
            <div class="progress">
              <div class="progress-bar" :style="{ width: progress + '%' }"></div>
            </div>
            <div class="progress-text">已完成 {{ progress }}%</div>
            <button class="primary" @click="closeModal" :disabled="progress < 100">完成</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';

const connections = ref([
  { id: 'DV-1001', type: 'WiFi', signal: -41, network: 'BatteryNet-01', status: '在线', statusClass: 'ok' },
  { id: 'DV-1002', type: '蓝牙', signal: -52, network: 'BLE-North', status: '在线', statusClass: 'ok' },
  { id: 'DV-1003', type: 'WiFi', signal: -67, network: 'BatteryNet-02', status: '弱信号', statusClass: 'warn' },
  { id: 'DV-1004', type: 'WiFi', signal: -45, network: 'BatteryNet-01', status: '在线', statusClass: 'ok' },
  { id: 'DV-1005', type: '蓝牙', signal: -60, network: 'BLE-East', status: '在线', statusClass: 'ok' },
  { id: 'DV-1006', type: 'WiFi', signal: -58, network: 'BatteryNet-03', status: '在线', statusClass: 'ok' },
  { id: 'DV-1007', type: '蓝牙', signal: -71, network: 'BLE-West', status: '弱信号', statusClass: 'warn' },
  { id: 'DV-1008', type: 'WiFi', signal: -49, network: 'BatteryNet-02', status: '在线', statusClass: 'ok' },
  { id: 'DV-1009', type: 'WiFi', signal: -55, network: 'BatteryNet-01', status: '在线', statusClass: 'ok' },
  { id: 'DV-1010', type: '蓝牙', signal: -63, network: 'BLE-South', status: '在线', statusClass: 'ok' }
]);

const configForm = reactive({
  ssid: 'BatteryNet-01',
  key: 'battery@2024',
  btName: 'Battery-BLE-Core'
});

const modal = reactive({
  visible: false,
  type: 'scan',
  title: ''
});

const progress = ref(0);
let timer;

const wifiOnline = computed(() => connections.value.filter((item) => item.type === 'WiFi' && item.status === '在线').length);
const btOnline = computed(() => connections.value.filter((item) => item.type === '蓝牙' && item.status === '在线').length);

const openModal = (type) => {
  modal.visible = true;
  modal.type = type;
  modal.title = type === 'scan' ? '扫描接入终端' : type === 'config' ? '无线配网设置' : '安全校验进度';
};

const closeModal = () => {
  modal.visible = false;
  progress.value = 0;
  clearInterval(timer);
};

const confirmScan = () => {
  connections.value.unshift({
    id: 'DV-NEW',
    type: 'WiFi',
    signal: -40,
    network: configForm.ssid,
    status: '在线',
    statusClass: 'ok'
  });
  closeModal();
};

const applyConfig = () => {
  closeModal();
};

watch(
  () => modal.type,
  (value) => {
    if (value === 'security' && modal.visible) {
      progress.value = 0;
      clearInterval(timer);
      timer = setInterval(() => {
        progress.value = Math.min(progress.value + 20, 100);
        if (progress.value >= 100) {
          clearInterval(timer);
        }
      }, 300);
    }
  }
);
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.page-header h2 {
  margin: 0 0 6px;
}

.page-header p {
  margin: 0;
  color: #6f7b94;
}

.action-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.primary,
.secondary {
  border: none;
  border-radius: 12px;
  padding: 10px 18px;
  cursor: pointer;
  font-size: 14px;
}

.primary {
  background: linear-gradient(135deg, #7fb0ff, #5b74ff);
  color: #fff;
}

.secondary {
  background: #f1f5ff;
  color: #3a4a70;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.card {
  background: #fff;
  padding: 18px;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(31, 42, 68, 0.08);
}

.card h3 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #7d8aa5;
}

.card strong {
  font-size: 24px;
}

.card span {
  display: block;
  color: #98a3ba;
  margin-top: 6px;
}

.layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

.panel {
  background: #fff;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(31, 42, 68, 0.08);
}

.panel h3 {
  margin-top: 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  text-align: left;
  padding: 10px 6px;
  border-bottom: 1px solid #eef1f6;
}

.tag {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.tag.ok {
  background: #e7f8ef;
  color: #1c7a4d;
}

.tag.warn {
  background: #fff4e5;
  color: #c57600;
}

.chart-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart {
  width: 100%;
}

.legend {
  font-size: 13px;
  color: #7d8aa5;
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #7fb0ff;
  margin-right: 6px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.modal {
  background: #fff;
  width: min(480px, 92vw);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 20px 40px rgba(31, 42, 68, 0.2);
}

.modal header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close {
  border: none;
  background: transparent;
  font-size: 24px;
  cursor: pointer;
}

.modal-body {
  margin-top: 16px;
}

.modal-body form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-body input {
  border: 1px solid #d9e1f0;
  border-radius: 10px;
  padding: 8px 10px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
}

.progress {
  background: #f0f3fa;
  border-radius: 999px;
  height: 12px;
  overflow: hidden;
  margin: 16px 0;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(135deg, #7fb0ff, #5b74ff);
  transition: width 0.4s ease;
}

.progress-text {
  color: #6f7b94;
  margin-bottom: 12px;
}

@media (max-width: 1100px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
