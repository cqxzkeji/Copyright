<template>
  <div class="card">
    <div class="flex-between">
      <h2 class="section-title">设备管理</h2>
      <div class="table-actions">
        <button class="btn" @click="openAddModal">新增设备</button>
        <button class="btn secondary" @click="openSyncModal">同步接入</button>
      </div>
    </div>
    <p class="hint">支持 WiFi / 蓝牙接入，列表实时展示设备状态</p>
    <table class="table">
      <thead>
        <tr>
          <th>编号</th>
          <th>设备名称</th>
          <th>接入方式</th>
          <th>状态</th>
          <th>电压(V)</th>
          <th>最近心跳</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="device in devices" :key="device.id">
          <td>{{ device.id }}</td>
          <td>{{ device.name }}</td>
          <td>{{ device.channel }}</td>
          <td>
            <span :class="['badge', statusClass(device.status)]">{{ device.status }}</span>
          </td>
          <td>{{ device.voltage }}</td>
          <td>{{ device.heartbeat }}</td>
          <td class="table-actions">
            <button class="btn" @click="openDetail(device)">详情</button>
            <button class="btn secondary" @click="openRemove(device)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="modal.type" class="modal-backdrop">
    <div class="modal-card">
      <div class="flex-between">
        <h3>{{ modal.title }}</h3>
        <button class="btn secondary" @click="closeModal">关闭</button>
      </div>
      <div v-if="modal.type === 'add'">
        <div class="form-grid">
          <div>
            <label>设备名称</label>
            <input v-model="form.name" class="input" placeholder="如：库房A-01" />
          </div>
          <div>
            <label>接入方式</label>
            <select v-model="form.channel" class="input">
              <option value="WiFi">WiFi</option>
              <option value="蓝牙">蓝牙</option>
            </select>
          </div>
          <div class="full">
            <label>备注</label>
            <input v-model="form.remark" class="input" placeholder="填写位置或责任人" />
          </div>
        </div>
        <div class="flex-between" style="margin-top: 12px;">
          <span class="chip">填写完整后保存</span>
          <button class="btn" @click="submitAdd">保存设备</button>
        </div>
      </div>
      <div v-else-if="modal.type === 'detail'">
        <p>设备：{{ currentDevice.name }}</p>
        <p>接入：{{ currentDevice.channel }} ｜ 状态：{{ currentDevice.status }}</p>
        <p>最近心跳：{{ currentDevice.heartbeat }} ｜ 电压：{{ currentDevice.voltage }} V</p>
        <div class="progress-bar">
          <span :style="{ width: currentDevice.health + '%' }"></span>
        </div>
        <p style="color: var(--muted); margin-top: 6px;">健康度 {{ currentDevice.health }}%</p>
      </div>
      <div v-else-if="modal.type === 'remove'">
        <p>确认删除设备「{{ currentDevice.name }}」吗？操作记录会保留在审计日志。</p>
        <div class="flex-between">
          <button class="btn secondary" @click="closeModal">取消</button>
          <button class="btn" @click="confirmRemove">确认删除</button>
        </div>
      </div>
      <div v-else-if="modal.type === 'sync'">
        <p>正在扫描附近的 WiFi / 蓝牙设备...</p>
        <div class="progress-bar">
          <span :style="{ width: syncPercent + '%' }"></span>
        </div>
        <p style="color: var(--muted);">完成度 {{ syncPercent }}%</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const devices = reactive([
  { id: 'D-001', name: '库房A-01', channel: 'WiFi', status: '在线', voltage: '12.5', heartbeat: '10 秒前', health: 92 },
  { id: 'D-002', name: '库房A-02', channel: '蓝牙', status: '在线', voltage: '12.4', heartbeat: '16 秒前', health: 88 },
  { id: 'D-003', name: '库房B-01', channel: 'WiFi', status: '告警', voltage: '11.6', heartbeat: '25 秒前', health: 65 },
  { id: 'D-004', name: '库房B-02', channel: 'WiFi', status: '在线', voltage: '12.8', heartbeat: '5 秒前', health: 96 },
  { id: 'D-005', name: '库房C-01', channel: '蓝牙', status: '离线', voltage: '0', heartbeat: '2 小时前', health: 30 },
  { id: 'D-006', name: '库房C-02', channel: 'WiFi', status: '在线', voltage: '12.6', heartbeat: '8 秒前', health: 90 },
  { id: 'D-007', name: '库房D-01', channel: 'WiFi', status: '在线', voltage: '12.2', heartbeat: '18 秒前', health: 82 },
  { id: 'D-008', name: '库房D-02', channel: '蓝牙', status: '在线', voltage: '12.5', heartbeat: '21 秒前', health: 84 },
  { id: 'D-009', name: '库房E-01', channel: 'WiFi', status: '在线', voltage: '12.7', heartbeat: '6 秒前', health: 94 },
  { id: 'D-010', name: '库房E-02', channel: 'WiFi', status: '在线', voltage: '12.5', heartbeat: '7 秒前', health: 91 },
  { id: 'D-011', name: '库房F-01', channel: '蓝牙', status: '告警', voltage: '11.8', heartbeat: '32 秒前', health: 70 },
  { id: 'D-012', name: '库房F-02', channel: 'WiFi', status: '在线', voltage: '12.6', heartbeat: '12 秒前', health: 90 },
  { id: 'D-013', name: '库房G-01', channel: 'WiFi', status: '在线', voltage: '12.5', heartbeat: '14 秒前', health: 87 },
  { id: 'D-014', name: '库房G-02', channel: '蓝牙', status: '在线', voltage: '12.4', heartbeat: '28 秒前', health: 83 },
  { id: 'D-015', name: '库房H-01', channel: 'WiFi', status: '离线', voltage: '0', heartbeat: '1 天前', health: 20 },
  { id: 'D-016', name: '库房H-02', channel: 'WiFi', status: '在线', voltage: '12.9', heartbeat: '4 秒前', health: 98 },
  { id: 'D-017', name: '库房I-01', channel: '蓝牙', status: '在线', voltage: '12.3', heartbeat: '35 秒前', health: 81 },
  { id: 'D-018', name: '库房I-02', channel: 'WiFi', status: '在线', voltage: '12.5', heartbeat: '13 秒前', health: 86 },
  { id: 'D-019', name: '库房J-01', channel: 'WiFi', status: '在线', voltage: '12.7', heartbeat: '9 秒前', health: 93 },
  { id: 'D-020', name: '库房J-02', channel: '蓝牙', status: '在线', voltage: '12.6', heartbeat: '17 秒前', health: 89 },
  { id: 'D-021', name: '库房K-01', channel: 'WiFi', status: '在线', voltage: '12.5', heartbeat: '11 秒前', health: 90 },
  { id: 'D-022', name: '库房K-02', channel: '蓝牙', status: '在线', voltage: '12.4', heartbeat: '15 秒前', health: 85 }
]);

const modal = reactive({ type: '', title: '' });
const form = reactive({ name: '', channel: 'WiFi', remark: '' });
const currentDevice = ref({});
const syncPercent = ref(45);

const statusClass = (status) => {
  if (status === '在线') return 'success';
  if (status === '告警') return 'warning';
  return 'danger';
};

const openAddModal = () => {
  modal.type = 'add';
  modal.title = '新增设备';
};

const openDetail = (device) => {
  currentDevice.value = device;
  modal.type = 'detail';
  modal.title = '设备详情';
};

const openRemove = (device) => {
  currentDevice.value = device;
  modal.type = 'remove';
  modal.title = '删除设备';
};

const openSyncModal = () => {
  modal.type = 'sync';
  modal.title = '同步接入进度';
  syncPercent.value = 45;
  const timer = setInterval(() => {
    syncPercent.value = Math.min(100, syncPercent.value + 11);
    if (syncPercent.value >= 100) clearInterval(timer);
  }, 700);
};

const closeModal = () => {
  modal.type = '';
};

const submitAdd = () => {
  const id = `D-${String(devices.length + 1).padStart(3, '0')}`;
  devices.push({
    id,
    name: form.name || `新设备${devices.length + 1}`,
    channel: form.channel,
    status: '在线',
    voltage: '12.5',
    heartbeat: '刚刚',
    health: 88
  });
  closeModal();
};

const confirmRemove = () => {
  const index = devices.findIndex((d) => d.id === currentDevice.value.id);
  if (index !== -1) devices.splice(index, 1);
  closeModal();
};
</script>

<style scoped>
.hint {
  color: var(--muted);
  margin: 6px 0 12px;
}
</style>
