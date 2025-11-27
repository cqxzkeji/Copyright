<template>
  <div class="light-card module-card">
    <div class="card-header">
      <div>
        <h3>设备管理</h3>
        <p>查看探测器、主机、网关等设备状态，支持新增与巡检。</p>
      </div>
      <div class="flex-row">
        <button class="secondary-btn" @click="openAdd">新增设备</button>
        <button class="primary-btn" @click="startMaintenance">巡检计划</button>
      </div>
    </div>

    <table class="table" aria-label="device table">
      <thead>
        <tr>
          <th>名称</th>
          <th>类型</th>
          <th>位置</th>
          <th>状态</th>
          <th>上次巡检</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="device in devices" :key="device.name">
          <td>{{ device.name }}</td>
          <td>{{ device.type }}</td>
          <td>{{ device.location }}</td>
          <td><span :class="['status-pill', device.status === '在线' ? 'success' : 'danger']">{{ device.status }}</span></td>
          <td>{{ device.lastCheck }}</td>
          <td>
            <button class="secondary-btn" @click="ping(device)">测试</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="notice">巡检计划将展示进度，新增设备和测试按钮都会弹出相应提示。</div>
  </div>

  <div v-if="adding" class="modal-backdrop" @click.self="adding = false">
    <div class="modal">
      <h3>新增设备</h3>
      <div class="form-row">
        <label>名称 <input v-model="form.name" placeholder="烟感#15" /></label>
        <label>类型
          <select v-model="form.type">
            <option>烟感</option>
            <option>温感</option>
            <option>摄像机</option>
          </select>
        </label>
        <label>位置 <input v-model="form.location" placeholder="A3 楼梯间" /></label>
      </div>
      <footer>
        <button class="secondary-btn" @click="adding = false">取消</button>
        <button class="primary-btn" @click="saveDevice">保存</button>
      </footer>
    </div>
  </div>

  <div v-if="maintaining" class="modal-backdrop" @click.self="maintaining = false">
    <div class="modal">
      <h3>巡检计划执行</h3>
      <p>正在轮询各设备心跳与传感值。</p>
      <div class="progress-bar">
        <div class="progress-bar-inner" :style="{ width: maintainProgress + '%' }"></div>
      </div>
      <p style="text-align:right;margin-top:8px;">{{ maintainProgress }}%</p>
      <footer>
        <button class="primary-btn" @click="maintaining = false">后台执行</button>
      </footer>
    </div>
  </div>

  <div v-if="testTarget" class="modal-backdrop" @click.self="testTarget = null">
    <div class="modal">
      <h3>测试结果</h3>
      <p>{{ testTarget.name }}：{{ testTarget.status }} | 信号正常，数据延迟 40ms。</p>
      <footer>
        <button class="primary-btn" @click="testTarget = null">关闭</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const devices = reactive([
  { name: '烟感#01', type: '烟感', location: 'A1 楼梯间', status: '在线', lastCheck: '今天 08:00' },
  { name: '温感#04', type: '温感', location: 'B2 配电室', status: '在线', lastCheck: '今天 07:40' },
  { name: '主机#A', type: '报警主机', location: '监控室', status: '在线', lastCheck: '昨天 20:00' },
  { name: '摄像机#12', type: '摄像机', location: 'C5 走廊', status: '离线', lastCheck: '昨天 18:00' },
  { name: '温感#11', type: '温感', location: '地下车库', status: '在线', lastCheck: '今天 08:20' }
]);

const adding = ref(false);
const maintaining = ref(false);
const maintainProgress = ref(0);
const testTarget = ref(null);
const form = reactive({ name: '', type: '烟感', location: '' });

const openAdd = () => {
  adding.value = true;
};

const saveDevice = () => {
  devices.unshift({ ...form, status: '在线', lastCheck: '刚刚' });
  Object.assign(form, { name: '', type: '烟感', location: '' });
  adding.value = false;
};

const startMaintenance = () => {
  maintaining.value = true;
  maintainProgress.value = 0;
  const timer = setInterval(() => {
    maintainProgress.value = Math.min(100, maintainProgress.value + 20);
    if (maintainProgress.value >= 100) {
      clearInterval(timer);
      devices.forEach((d) => {
        d.lastCheck = '刚刚';
        d.status = '在线';
      });
    }
  }, 300);
};

const ping = (device) => {
  testTarget.value = { ...device, status: device.status === '离线' ? '已恢复' : '在线' };
};
</script>

<style scoped>
.module-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
