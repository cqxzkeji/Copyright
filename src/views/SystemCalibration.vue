<template>
  <div class="grid grid-2">
    <div class="card">
      <h3>自检与校准状态</h3>
      <div class="grid grid-3">
        <div>
          <p class="tag">硬件自检</p>
          <h2>{{ stats.hardware }}%</h2>
        </div>
        <div>
          <p class="tag">软件自检</p>
          <h2>{{ stats.software }}%</h2>
        </div>
        <div>
          <p class="tag">传感器校准</p>
          <h2>{{ stats.sensor }}%</h2>
        </div>
      </div>
      <svg width="100%" height="130" viewBox="0 0 420 130" role="img" style="margin-top: 12px;">
        <circle cx="80" cy="80" r="40" fill="#bbdefb" />
        <circle cx="200" cy="60" r="40" fill="#c8e6c9" />
        <circle cx="320" cy="90" r="40" fill="#ffe0b2" />
      </svg>
    </div>
    <div class="card">
      <h3>自检操作</h3>
      <p>定期执行硬件与软件自检，校准传感器确保检测精度。</p>
      <div style="margin-top: 16px;">
        <button class="primary" type="button" @click="startCheck">执行自检</button>
        <button class="secondary" type="button" @click="openCalibration">校准传感器</button>
        <button class="ghost" type="button" @click="openSchedule">设置计划</button>
      </div>
      <div class="card" style="margin-top: 16px; background: #f7f9ff;">
        <h4>最近自检结果</h4>
        <ul>
          <li v-for="item in recent" :key="item.id">{{ item.time }} - {{ item.desc }}</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="card">
    <h3>自检与校准日志</h3>
    <table class="table">
      <thead>
        <tr>
          <th>编号</th>
          <th>设备</th>
          <th>类型</th>
          <th>执行人</th>
          <th>时间</th>
          <th>结果</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td>{{ row.id }}</td>
          <td>{{ row.device }}</td>
          <td>{{ row.type }}</td>
          <td>{{ row.owner }}</td>
          <td>{{ row.time }}</td>
          <td><span class="badge" :class="row.badge">{{ row.result }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-if="showCheck" title="自检进度" @close="closeCheck">
    <p>系统正在执行硬件与软件自检流程。</p>
    <div class="progress" style="margin-top: 12px;">
      <span :style="{ width: checkProgress + '%' }"></span>
    </div>
    <p style="margin-top: 8px;">当前进度：{{ checkProgress }}%</p>
    <template #footer>
      <button class="secondary" type="button" @click="closeCheck">后台执行</button>
    </template>
  </BaseModal>

  <BaseModal v-if="showCalibration" title="传感器校准" @close="showCalibration = false">
    <div class="form-grid">
      <div>
        <label>校准设备</label>
        <select v-model="calibrationForm.device">
          <option>电池温度传感器</option>
          <option>电流采样模块</option>
          <option>电压采集模块</option>
        </select>
      </div>
      <div>
        <label>校准模式</label>
        <select v-model="calibrationForm.mode">
          <option>自动校准</option>
          <option>手动校准</option>
        </select>
      </div>
      <div>
        <label>目标偏差(%)</label>
        <input v-model="calibrationForm.offset" type="number" />
      </div>
    </div>
    <template #footer>
      <button class="primary" type="button" @click="submitCalibration">开始校准</button>
    </template>
  </BaseModal>

  <BaseModal v-if="showSchedule" title="自检计划" @close="showSchedule = false">
    <div class="form-grid">
      <div>
        <label>执行周期</label>
        <select v-model="scheduleForm.cycle">
          <option>每日 02:00</option>
          <option>每周一 03:00</option>
          <option>每月首日 04:00</option>
        </select>
      </div>
      <div>
        <label>通知负责人</label>
        <input v-model="scheduleForm.owner" type="text" />
      </div>
      <div>
        <label>提醒方式</label>
        <input v-model="scheduleForm.channel" type="text" />
      </div>
    </div>
    <template #footer>
      <button class="primary" type="button" @click="saveSchedule">保存计划</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const stats = reactive({
  hardware: 98,
  software: 96,
  sensor: 94
});

const recent = [
  { id: 1, time: '07:30', desc: '硬件自检完成，未发现异常' },
  { id: 2, time: '07:40', desc: '电压采集模块校准完成' }
];

const rows = Array.from({ length: 20 }, (_, index) => {
  const id = index + 1;
  const resultOptions = ['通过', '需复检', '失败'];
  const badges = ['success', 'warning', 'danger'];
  const resultIndex = index % 3;
  return {
    id: `C-${String(id).padStart(3, '0')}`,
    device: ['温度传感器', '电流模块', '电压模块', '控制主机'][index % 4],
    type: index % 2 === 0 ? '自检' : '校准',
    owner: ['张工', '李工', '王工'][index % 3],
    time: `2024-10-${String((index % 20) + 1).padStart(2, '0')} 0${(index % 9) + 1}:00`,
    result: resultOptions[resultIndex],
    badge: badges[resultIndex]
  };
});

const showCheck = ref(false);
const showCalibration = ref(false);
const showSchedule = ref(false);
const checkProgress = ref(0);
let timer;

const calibrationForm = reactive({
  device: '电池温度传感器',
  mode: '自动校准',
  offset: 0.3
});

const scheduleForm = reactive({
  cycle: '每日 02:00',
  owner: '巡检负责人-周敏',
  channel: '邮件 + 系统通知'
});

const startCheck = () => {
  showCheck.value = true;
  checkProgress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    if (checkProgress.value >= 100) {
      clearInterval(timer);
      return;
    }
    checkProgress.value += 12;
  }, 260);
};

const closeCheck = () => {
  showCheck.value = false;
  clearInterval(timer);
};

const openCalibration = () => {
  showCalibration.value = true;
};

const openSchedule = () => {
  showSchedule.value = true;
};

const submitCalibration = () => {
  showCalibration.value = false;
  showSchedule.value = true;
};

const saveSchedule = () => {
  showSchedule.value = false;
};
</script>
