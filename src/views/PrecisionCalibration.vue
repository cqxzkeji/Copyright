<template>
  <div class="card" style="display: grid; gap: 14px;">
    <header style="display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap;">
      <div>
        <h3 style="margin: 0;">精度校准</h3>
        <p class="muted" style="margin: 4px 0 0;">激光、刀具与平台均可独立校准，结果实时入库</p>
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="primary-btn" @click="showCalibrate = true">启动校准</button>
        <button class="secondary-btn" @click="showReport = true">查看报告</button>
      </div>
    </header>
    <div class="grid responsive-grid" style="grid-template-columns: 1.4fr 1fr;">
      <div class="card">
        <h4 style="margin: 0 0 8px;">偏移记录</h4>
        <table class="table">
          <thead>
            <tr>
              <th>轴/模块</th>
              <th>偏移(μm)</th>
              <th>趋势</th>
              <th>时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in offsets" :key="item.axis">
              <td>{{ item.axis }}</td>
              <td>{{ item.offset }}</td>
              <td>{{ item.trend }}</td>
              <td>{{ item.time }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card">
        <h4 style="margin: 0 0 8px;">平台平面度</h4>
        <svg viewBox="0 0 200 160" style="width: 100%; height: auto;">
          <rect x="10" y="20" width="180" height="120" rx="12" fill="#eef2ff" />
          <polyline
            :points="heatPoints"
            fill="rgba(78,168,222,0.15)"
            stroke="#4ea8de"
            stroke-width="3"
          />
        </svg>
        <p class="muted">蓝色区域表示平台高度波动，偏差小于 20 μm。</p>
      </div>
    </div>
    <div class="card">
      <h4 style="margin: 0 0 8px;">校准项</h4>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
        <div v-for="item in calibrations" :key="item.name" class="stat">
          <small>{{ item.name }}</small>
          <strong>{{ item.value }}</strong>
          <button class="secondary-btn" @click="openAdjust(item.name)">微调</button>
        </div>
      </div>
    </div>

    <div v-if="showCalibrate" class="modal-backdrop" @click.self="showCalibrate = false">
      <div class="modal-card">
        <h3>启动校准</h3>
        <p class="muted">选择需要同步校准的轴与模块，执行过程自动生成报告。</p>
        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
          <label class="field">
            <span>轴向</span>
            <select v-model="form.axis">
              <option>X 轴</option>
              <option>Y 轴</option>
              <option>Z 轴</option>
            </select>
          </label>
          <label class="field">
            <span>模块</span>
            <select v-model="form.module">
              <option>激光头</option>
              <option>切割刀具</option>
              <option>平台对位</option>
            </select>
          </label>
        </div>
        <div style="margin-top: 12px; display: flex; justify-content: flex-end; gap: 8px;">
          <button class="secondary-btn" @click="showCalibrate = false">取消</button>
          <button class="primary-btn" @click="startCalibration">开始校准</button>
        </div>
      </div>
    </div>

    <div v-if="showAdjust" class="modal-backdrop" @click.self="showAdjust = false">
      <div class="modal-card">
        <h3>{{ adjustTarget }}微调</h3>
        <label class="field">
          <span>偏移量 (μm)</span>
          <input v-model="adjustValue" type="number" step="0.1" />
        </label>
        <div style="margin-top: 12px; display: flex; justify-content: flex-end; gap: 8px;">
          <button class="secondary-btn" @click="showAdjust = false">取消</button>
          <button class="primary-btn" @click="applyAdjust">应用</button>
        </div>
      </div>
    </div>

    <div v-if="showReport" class="modal-backdrop" @click.self="showReport = false">
      <div class="modal-card">
        <h3>校准报告</h3>
        <p class="muted">最近 5 次校准平均偏差 6.2 μm，已满足设备标准。</p>
        <button class="primary-btn" @click="showReport = false">关闭</button>
      </div>
    </div>

    <div v-if="showProgress" class="modal-backdrop">
      <div class="modal-card">
        <h3>执行校准</h3>
        <p class="muted">正在测量反射信号与位移传感器读数...</p>
        <div class="progress" style="margin-top: 10px;">
          <span :style="{ width: progress + '%' }"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';

const offsets = [
  { axis: 'X 轴', offset: 8.4, trend: '稳定', time: '09:12' },
  { axis: 'Y 轴', offset: 10.1, trend: '下降', time: '09:14' },
  { axis: 'Z 轴', offset: 6.8, trend: '稳定', time: '09:18' },
  { axis: '激光头', offset: 5.2, trend: '轻微上升', time: '09:21' },
  { axis: '平台', offset: 12.6, trend: '下降', time: '09:24' },
  { axis: '刀具', offset: 9.1, trend: '稳定', time: '09:30' }
];

const calibrations = [
  { name: '激光焦点', value: '±4.2 μm' },
  { name: '刀具偏置', value: '±6.1 μm' },
  { name: '平台水平', value: '±12 μm' },
  { name: '气体喷嘴', value: '±2.5 μm' },
  { name: '摄像对位', value: '±1.8 μm' }
];

const showCalibrate = ref(false);
const showReport = ref(false);
const showAdjust = ref(false);
const showProgress = ref(false);
const progress = ref(0);
const adjustTarget = ref('');
const adjustValue = ref(0);
const form = reactive({ axis: 'X 轴', module: '激光头' });

const startCalibration = () => {
  showCalibrate.value = false;
  showProgress.value = true;
  progress.value = 10;
  const timer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer);
      showProgress.value = false;
      showReport.value = true;
    } else {
      progress.value += 18;
    }
  }, 280);
};

const openAdjust = (target) => {
  adjustTarget.value = target;
  showAdjust.value = true;
};

const applyAdjust = () => {
  showAdjust.value = false;
};

const heatPoints = computed(() => {
  const values = [
    [20, 120],
    [50, 90],
    [90, 110],
    [130, 80],
    [170, 100]
  ];
  return values.map(([x, y]) => `${x},${y}`).join(' ');
});
</script>
