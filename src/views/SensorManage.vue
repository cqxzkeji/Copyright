<template>
  <div class="grid" style="gap:16px;">
    <div class="card">
      <div class="toolbar" style="justify-content: space-between;">
        <div>
          <h3 class="section-title">传感器接入与管理</h3>
          <p class="muted">统一管理激光雷达、毫米波雷达、超声波雷达及摄像头接入、检测与参数。</p>
        </div>
        <div class="toolbar">
          <button class="btn" @click="scanDevices">扫描设备</button>
          <button class="btn secondary" @click="openConfig = true">参数配置</button>
          <button class="btn ghost" @click="openStatus = true">状态刷新</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>序号</th>
            <th>名称</th>
            <th>类型</th>
            <th>IP/接口</th>
            <th>状态</th>
            <th>频率</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="device in devices" :key="device.id">
            <td>{{ device.id }}</td>
            <td>{{ device.name }}</td>
            <td>{{ device.type }}</td>
            <td>{{ device.endpoint }}</td>
            <td><span class="badge" :class="device.statusClass">{{ device.status }}</span></td>
            <td>{{ device.freq }} Hz</td>
            <td>
              <div class="toolbar">
                <button class="btn secondary" @click="openDetail(device)">在线检测</button>
                <button class="btn ghost" @click="openAssign(device)">绑定车辆</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fit,minmax(240px,1fr));">
      <div class="card" v-for="block in summaries" :key="block.title">
        <div class="toolbar" style="justify-content: space-between;">
          <h4 class="section-title">{{ block.title }}</h4>
          <span class="badge info">{{ block.tag }}</span>
        </div>
        <p class="muted">{{ block.desc }}</p>
        <div class="progress-track" style="margin:10px 0;">
          <div class="progress-bar" :style="{ width: block.progress + '%' }"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-weight:700;">
          <span>{{ block.progress }}%</span>
          <span>{{ block.note }}</span>
        </div>
      </div>
    </div>

    <ModalDialog :open="showScan" @close="showScan = false" @confirm="showScan = false">
      <template #title><h3 style="margin:0;">扫描结果</h3></template>
      <p style="margin:0 0 8px;">已发现 {{ scanResult.length }} 台传感器，支持一键接入。</p>
      <ul style="margin:0;padding-left:18px;color:var(--muted);">
        <li v-for="item in scanResult" :key="item">{{ item }}</li>
      </ul>
    </ModalDialog>

    <ModalDialog :open="openConfig" @close="openConfig = false" @confirm="saveConfig">
      <template #title><h3 style="margin:0;">基础参数配置</h3></template>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;">
        <label class="input-row">采样频率<input v-model.number="config.freq" type="number" min="1" />Hz</label>
        <label class="input-row">点云密度<input v-model.number="config.points" type="number" min="16" /></label>
        <label class="input-row">工作模式<select v-model="config.mode"><option>标准</option><option>低功耗</option><option>高精度</option></select></label>
        <label class="input-row">通信安全<select v-model="config.security"><option>WPA2</option><option>WPA3</option><option>有线隔离</option></select></label>
      </div>
    </ModalDialog>

    <ModalDialog :open="openStatus" @close="openStatus = false" @confirm="openStatus = false">
      <template #title><h3 style="margin:0;">状态监控</h3></template>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;">
        <div class="card" v-for="device in devices.slice(0,4)" :key="device.name">
          <h4 style="margin:0 0 6px;">{{ device.name }}</h4>
          <p class="muted">{{ device.type }} · {{ device.endpoint }}</p>
          <div class="progress-track" style="margin:8px 0;">
            <div class="progress-bar" :style="{ width: device.health + '%' }"></div>
          </div>
          <div style="display:flex;justify-content:space-between;font-weight:600;">
            <span>健康度</span>
            <span>{{ device.health }}%</span>
          </div>
        </div>
      </div>
    </ModalDialog>

    <ModalDialog :open="showDetail" @close="showDetail = false" @confirm="showDetail = false">
      <template #title><h3 style="margin:0;">在线检测</h3></template>
      <p style="margin:0 0 8px;">{{ currentDevice?.name }} 当前回传信号。</p>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;">
        <div class="card">
          <strong>距离</strong>
          <p class="muted">{{ currentDevice?.distance }} m</p>
        </div>
        <div class="card">
          <strong>角度</strong>
          <p class="muted">{{ currentDevice?.angle }}°</p>
        </div>
        <div class="card">
          <strong>转速</strong>
          <p class="muted">{{ currentDevice?.speed }} Hz</p>
        </div>
      </div>
    </ModalDialog>

    <ModalDialog :open="showAssign" @close="showAssign = false" @confirm="showAssign = false">
      <template #title><h3 style="margin:0;">绑定车辆</h3></template>
      <div class="input-row">
        <label>车辆编号<input v-model="assignForm.vehicle" placeholder="如：VN-203" /></label>
        <label>安装位置<select v-model="assignForm.position"><option>车头</option><option>车尾</option><option>左侧</option><option>右侧</option></select></label>
      </div>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const devices = reactive(Array.from({ length: 22 }).map((_, idx) => {
  const types = ['激光雷达', '毫米波雷达', '超声波雷达', '摄像头'];
  const status = ['在线', '维护', '离线'];
  const statusClass = ['success', 'warning', 'danger'];
  return {
    id: idx + 1,
    name: `设备-${idx + 1}`,
    type: types[idx % types.length],
    endpoint: idx % 2 === 0 ? `192.168.1.${idx + 10}` : `CAN-${100 + idx}`,
    status: status[idx % status.length],
    statusClass: statusClass[idx % statusClass.length],
    freq: 10 + (idx % 5) * 5,
    health: 60 + (idx % 5) * 8,
    distance: (5 + (idx % 4) * 2).toFixed(1),
    angle: 20 + (idx % 6) * 5,
    speed: 8 + (idx % 3) * 2
  };
}));

const summaries = [
  { title: '接入成功率', tag: '实时', progress: 92, note: '稳定连接', desc: '设备扫描与握手成功情况' },
  { title: '配置同步率', tag: '自动', progress: 88, note: '已同步', desc: '参数下发与校验结果' },
  { title: '信号质量', tag: '监控', progress: 81, note: '良好', desc: 'RSSI/回波质量实时监控' },
  { title: '异常处置', tag: '工单', progress: 64, note: '4 条未闭环', desc: '自动生成的异常处置工单' }
];

const showScan = ref(false);
const openConfig = ref(false);
const openStatus = ref(false);
const showDetail = ref(false);
const showAssign = ref(false);
const currentDevice = ref();
const assignForm = reactive({ vehicle: '', position: '车头' });
const scanResult = ['LD-201 激光雷达', 'CAM-01 前视摄像头', 'MM-88 毫米波雷达', 'US-06 超声波雷达'];
const config = reactive({ freq: 20, points: 64, mode: '高精度', security: 'WPA3' });

const scanDevices = () => {
  showScan.value = true;
};
const openDetail = (device) => {
  currentDevice.value = device;
  showDetail.value = true;
};
const openAssign = (device) => {
  assignForm.vehicle = '';
  assignForm.position = '车头';
  currentDevice.value = device;
  showAssign.value = true;
};
const saveConfig = () => {
  openConfig.value = false;
};
</script>

<style scoped>
.muted { color: var(--muted); margin: 4px 0 0; }
</style>
