<template>
  <div class="card">
    <div class="flex-between">
      <div>
        <h3 class="section-title">设备管理</h3>
        <p style="color: var(--muted);">冷机、传感器、车载终端的全生命周期管理</p>
      </div>
      <div class="chip-row">
        <button class="btn" @click="modals.add=true">添加设备</button>
        <button class="btn secondary" @click="modals.check=true">检测固件</button>
        <button class="btn light" @click="modals.maintain=true">派发维护</button>
      </div>
    </div>

    <div class="summary-grid" style="margin-top: 12px;">
      <div class="summary-card" v-for="stat in stats" :key="stat.title">
        <h4>{{ stat.title }}</h4>
        <div class="flex-between">
          <strong>{{ stat.value }}</strong>
          <span class="status" :class="stat.level">{{ stat.state }}</span>
        </div>
        <div class="progress" style="margin-top: 8px;"><span :style="{ width: stat.progress }"></span></div>
      </div>
    </div>

    <div class="card" style="margin-top: 16px;">
      <div class="flex-between">
        <p class="section-title">设备列表</p>
        <span class="badge">数据不少于 10 条</span>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>设备编号</th>
            <th>类型</th>
            <th>车辆</th>
            <th>固件</th>
            <th>电量</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="device in devices" :key="device.id">
            <td>{{ device.id }}</td>
            <td>{{ device.type }}</td>
            <td>{{ device.truck }}</td>
            <td>{{ device.firmware }}</td>
            <td>{{ device.power }}</td>
            <td><span class="status" :class="device.level">{{ device.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="grid" style="margin-top: 16px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
      <div class="card" v-for="item in inspections" :key="item.title" style="padding: 12px;">
        <div class="flex-between">
          <div>
            <h4 style="margin: 0;">{{ item.title }}</h4>
            <p style="margin: 4px 0 0; color: var(--muted);">{{ item.desc }}</p>
          </div>
          <span class="tag">{{ item.cycle }}</span>
        </div>
        <p style="margin: 10px 0 4px; font-weight: 700;">完成度</p>
        <div class="progress"><span :style="{ width: item.progress }"></span></div>
      </div>
    </div>
  </div>

  <ModalDialog :visible="modals.add" title="添加设备" helper="录入设备信息" @close="modals.add=false" @confirm="modals.add=false">
    <div class="form-grid">
      <div class="form-group">
        <label>设备类型</label>
        <select>
          <option>温度传感器</option>
          <option>湿度传感器</option>
          <option>冷机控制器</option>
          <option>车载终端</option>
        </select>
      </div>
      <div class="form-group">
        <label>设备编号</label>
        <input placeholder="SN-123456" />
      </div>
      <div class="form-group">
        <label>绑定车辆</label>
        <input placeholder="粤A1023" />
      </div>
    </div>
  </ModalDialog>

  <ModalDialog :visible="modals.check" title="检测固件" helper="OTA 检测中" @close="modals.check=false" @confirm="modals.check=false">
    <p>对所有在线设备执行 OTA 版本检测。</p>
    <div class="progress" style="margin-top: 8px;"><span style="width: 61%"></span></div>
  </ModalDialog>

  <ModalDialog :visible="modals.maintain" title="派发维护" helper="任务会推送到维护工程师" @close="modals.maintain=false" @confirm="modals.maintain=false">
    <p>选择需要维护的设备类型并安排上门时间。</p>
  </ModalDialog>
</template>

<script setup>
import { reactive } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const modals = reactive({ add: false, check: false, maintain: false });

const stats = [
  { title: '在线设备', value: '126', state: '稳定', progress: '82%', level: 'safe' },
  { title: '需维护', value: '6', state: '处理中', progress: '38%', level: 'warn' },
  { title: '固件最新', value: '92%', state: '良好', progress: '74%', level: 'safe' }
];

const devices = [
  { id: 'SN-1023', type: '温度传感器', truck: '粤A1023', firmware: 'v1.2.1', power: '86%', status: '在线', level: 'safe' },
  { id: 'SN-1156', type: '湿度传感器', truck: '粤B5521', firmware: 'v1.2.1', power: '79%', status: '在线', level: 'safe' },
  { id: 'SN-1188', type: '冷机控制器', truck: '湘A2311', firmware: 'v1.0.9', power: '63%', status: '需升级', level: 'warn' },
  { id: 'SN-1270', type: '车载终端', truck: '皖A8121', firmware: 'v1.1.3', power: '91%', status: '在线', level: 'safe' },
  { id: 'SN-1310', type: '温度传感器', truck: '苏B3321', firmware: 'v1.2.1', power: '74%', status: '在线', level: 'safe' },
  { id: 'SN-1355', type: '冷机控制器', truck: '皖K2190', firmware: 'v1.0.8', power: '58%', status: '巡检', level: 'warn' },
  { id: 'SN-1412', type: '温度传感器', truck: '沪C8831', firmware: 'v1.2.1', power: '80%', status: '在线', level: 'safe' },
  { id: 'SN-1502', type: '湿度传感器', truck: '浙B7721', firmware: 'v1.1.8', power: '67%', status: '在线', level: 'safe' },
  { id: 'SN-1528', type: '车载终端', truck: '浙C5121', firmware: 'v1.1.3', power: '73%', status: '在线', level: 'safe' },
  { id: 'SN-1621', type: '冷机控制器', truck: '粤E3123', firmware: 'v1.0.7', power: '55%', status: '需升级', level: 'warn' },
  { id: 'SN-1705', type: '温度传感器', truck: '皖A1911', firmware: 'v1.2.1', power: '84%', status: '在线', level: 'safe' }
];

const inspections = [
  { title: '冷机巡检', desc: '压缩机、蒸发器全面巡检', cycle: '月度', progress: '64%' },
  { title: '传感器校准', desc: '温湿度双因子校准', cycle: '季度', progress: '52%' },
  { title: '终端安全检查', desc: 'SIM、信号、定位检测', cycle: '月度', progress: '71%' }
];
</script>
