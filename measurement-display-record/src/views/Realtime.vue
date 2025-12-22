<template>
  <div class="grid two">
    <div class="card">
      <div class="section-title">实时曲线</div>
      <div class="chart">
        <svg viewBox="0 0 400 200" preserveAspectRatio="none">
          <polyline
            :points="chartPoints"
            fill="none"
            stroke="#1b5cff"
            stroke-width="3"
          />
          <polyline
            :points="warningPoints"
            fill="none"
            stroke="#4ad0ff"
            stroke-width="2"
            stroke-dasharray="6 6"
          />
        </svg>
      </div>
      <div class="grid three" style="margin-top: 16px;">
        <div class="kpi">
          <span>温度</span>
          <strong>24.6 ℃</strong>
        </div>
        <div class="kpi">
          <span>湿度</span>
          <strong>58 %</strong>
        </div>
        <div class="kpi">
          <span>压力</span>
          <strong>101.3 kPa</strong>
        </div>
      </div>
      <div style="margin-top: 16px; display:flex; gap: 12px; flex-wrap: wrap;">
        <button class="primary-btn" @click="openForm">配置阈值</button>
        <button class="secondary-btn" @click="openProgress">校准传感器</button>
        <button class="secondary-btn" @click="openTip">采样提示</button>
      </div>
    </div>

    <div class="card">
      <div class="section-title">实时数据列表</div>
      <table class="table">
        <thead>
          <tr>
            <th>时间</th>
            <th>温度(℃)</th>
            <th>湿度(%)</th>
            <th>压力(kPa)</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in rows" :key="item.time">
            <td>{{ item.time }}</td>
            <td>{{ item.temp }}</td>
            <td>{{ item.humidity }}</td>
            <td>{{ item.pressure }}</td>
            <td><span class="badge" :class="item.statusClass">{{ item.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <teleport to="body">
    <div v-if="formVisible" class="modal-backdrop">
      <div class="modal">
        <h3>阈值配置</h3>
        <div class="form-field">
          <label>温度上限</label>
          <input v-model="form.temp" placeholder="例如 30" />
        </div>
        <div class="form-field">
          <label>湿度上限</label>
          <input v-model="form.humidity" placeholder="例如 70" />
        </div>
        <div class="form-field">
          <label>压力下限</label>
          <input v-model="form.pressure" placeholder="例如 100" />
        </div>
        <div class="modal-actions">
          <button class="secondary-btn" @click="formVisible = false">取消</button>
          <button class="primary-btn" @click="saveThreshold">保存</button>
        </div>
      </div>
    </div>

    <div v-if="progressVisible" class="modal-backdrop">
      <div class="modal">
        <h3>传感器校准</h3>
        <p>正在执行自动校准流程，请保持设备稳定。</p>
        <div class="progress-bar">
          <span :style="{ width: `${progress}%` }"></span>
        </div>
        <div class="modal-actions">
          <button class="secondary-btn" @click="progressVisible = false">停止</button>
        </div>
      </div>
    </div>

    <div v-if="tipVisible" class="modal-backdrop">
      <div class="modal">
        <h3>采样提示</h3>
        <p>建议采样周期保持在 5-10 秒，确保曲线平稳。</p>
        <div class="modal-actions">
          <button class="primary-btn" @click="tipVisible = false">知道了</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';

const rows = ref([
  { time: '09:01:12', temp: 24.5, humidity: 58, pressure: 101.2, status: '正常', statusClass: 'success' },
  { time: '09:01:24', temp: 24.6, humidity: 59, pressure: 101.3, status: '正常', statusClass: 'success' },
  { time: '09:01:36', temp: 24.7, humidity: 57, pressure: 101.2, status: '正常', statusClass: 'success' },
  { time: '09:01:48', temp: 24.8, humidity: 56, pressure: 101.1, status: '正常', statusClass: 'success' },
  { time: '09:02:00', temp: 25.0, humidity: 58, pressure: 101.3, status: '正常', statusClass: 'success' },
  { time: '09:02:12', temp: 25.2, humidity: 60, pressure: 101.4, status: '注意', statusClass: 'warning' },
  { time: '09:02:24', temp: 25.1, humidity: 59, pressure: 101.3, status: '正常', statusClass: 'success' },
  { time: '09:02:36', temp: 24.9, humidity: 58, pressure: 101.2, status: '正常', statusClass: 'success' },
  { time: '09:02:48', temp: 24.7, humidity: 57, pressure: 101.2, status: '正常', statusClass: 'success' },
  { time: '09:03:00', temp: 24.6, humidity: 58, pressure: 101.3, status: '正常', statusClass: 'success' }
]);

const formVisible = ref(false);
const progressVisible = ref(false);
const tipVisible = ref(false);
const progress = ref(45);

const form = reactive({
  temp: '30',
  humidity: '70',
  pressure: '100'
});

const openForm = () => {
  formVisible.value = true;
};

const openProgress = () => {
  progressVisible.value = true;
  progress.value = 45;
};

const openTip = () => {
  tipVisible.value = true;
};

const saveThreshold = () => {
  formVisible.value = false;
};

const chartPoints = computed(() => {
  const values = rows.value.map((row) => row.temp);
  return values.map((value, index) => {
    const x = (index / (values.length - 1)) * 400;
    const y = 180 - (value - 24) * 20;
    return `${x},${y}`;
  }).join(' ');
});

const warningPoints = computed(() => {
  const values = rows.value.map((row) => row.humidity);
  return values.map((value, index) => {
    const x = (index / (values.length - 1)) * 400;
    const y = 180 - (value - 55) * 5;
    return `${x},${y}`;
  }).join(' ');
});
</script>
