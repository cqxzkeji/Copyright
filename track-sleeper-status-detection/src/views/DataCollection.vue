<template>
  <div class="grid">
    <section class="card">
      <div class="section-title">
        <h3>传感器设备概览</h3>
        <div class="tag-row">
          <span class="pill">实时采集</span>
          <span class="pill">五线监测</span>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>编号</th>
            <th>位置</th>
            <th>状态</th>
            <th>采样频率</th>
            <th>噪声水平</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in sensors" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.location }}</td>
            <td><span :class="['badge', item.badge]">{{ item.state }}</span></td>
            <td>{{ item.rate }} Hz</td>
            <td>{{ item.noise }} dB</td>
          </tr>
        </tbody>
      </table>
      <div class="actions-row">
        <button @click="showAdd = true">新增传感器</button>
        <button @click="startScan">启动自检</button>
        <button @click="showMaint = true">维护计划</button>
        <button @click="openHint">按钮提示</button>
      </div>
    </section>

    <section class="card">
      <div class="section-title">
        <h3>环境采集窗口</h3>
        <button @click="toggleStream">{{ streaming ? '停止采集' : '开始采集' }}</button>
      </div>
      <div class="chart">
        <div v-for="point in streamData" :key="point.label" class="chart-bar" :style="{ height: point.value + '%' }">
          {{ point.label }}
        </div>
      </div>
      <p class="note">采集窗口实时刷新，示意值用于校准波形强度。</p>
    </section>
  </div>

  <div v-if="showAdd" class="modal-backdrop" @click.self="showAdd = false">
    <div class="modal">
      <h3>新增传感器</h3>
      <div class="form-grid">
        <input v-model="form.location" class="input" placeholder="安装位置" />
        <input v-model.number="form.rate" type="number" class="input" placeholder="采样频率 Hz" />
        <input v-model="form.type" class="input" placeholder="类型：加速度/位移" />
      </div>
      <div class="actions-row">
        <button @click="submitSensor">保存</button>
        <button @click="showAdd = false" class="ghost">取消</button>
      </div>
    </div>
  </div>

  <div v-if="showMaint" class="modal-backdrop" @click.self="showMaint = false">
    <div class="modal">
      <h3>维护计划</h3>
      <ul>
        <li v-for="(task, idx) in maint" :key="idx">{{ task }}</li>
      </ul>
      <div class="progress-bar">
        <div class="fill" :style="{ width: maintProgress + '%' }"></div>
      </div>
      <p>进度 {{ maintProgress }}%</p>
      <div class="actions-row">
        <button @click="advanceMaint">推进进度</button>
        <button @click="showMaint = false" class="ghost">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="scanModal" class="modal-backdrop" @click.self="scanModal = false">
    <div class="modal">
      <h3>自检运行中</h3>
      <div class="progress-bar">
        <div class="fill" :style="{ width: scanProgress + '%' }"></div>
      </div>
      <p>信号链路检测：{{ scanProgress }}%</p>
      <div class="actions-row">
        <button @click="incrementScan">刷新进度</button>
        <button @click="scanModal = false" class="ghost">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const sensors = ref([
  { id: 'A-01', location: '道岔 12#', state: '稳定', badge: 'success', rate: 1200, noise: 12 },
  { id: 'A-02', location: '隧道口 5m', state: '轻微漂移', badge: 'warning', rate: 900, noise: 15 },
  { id: 'A-03', location: '桥梁跨中', state: '需维护', badge: 'danger', rate: 800, noise: 22 },
  { id: 'B-01', location: '正线 320km', state: '稳定', badge: 'success', rate: 1000, noise: 11 },
  { id: 'B-02', location: '道心 45m', state: '稳定', badge: 'success', rate: 950, noise: 13 },
]);

const streamData = ref([
  { label: 'X', value: 76 },
  { label: 'Y', value: 62 },
  { label: 'Z', value: 88 },
  { label: '温度', value: 45 },
  { label: '湿度', value: 55 },
]);

const showAdd = ref(false);
const showMaint = ref(false);
const scanModal = ref(false);
const streaming = ref(false);
const scanProgress = ref(12);
const maintProgress = ref(35);
const form = reactive({ location: '', rate: 800, type: '加速度' });
const maint = ref(['更换 03# 传感器防护罩', '检查采样线束', '升级边缘节点固件', '校准温湿度探头']);

const startScan = () => {
  scanModal.value = true;
  scanProgress.value = 12;
};

const incrementScan = () => {
  scanProgress.value = Math.min(100, scanProgress.value + 22);
};

const submitSensor = () => {
  sensors.value.push({
    id: `N-${String(sensors.value.length + 1).padStart(2, '0')}`,
    location: form.location || '未知位置',
    state: '稳定',
    badge: 'success',
    rate: form.rate,
    noise: 10,
  });
  showAdd.value = false;
};

const advanceMaint = () => {
  maintProgress.value = Math.min(100, maintProgress.value + 20);
};

const toggleStream = () => {
  streaming.value = !streaming.value;
  if (streaming.value) {
    streamData.value = streamData.value.map((item) => ({ ...item, value: Math.min(95, item.value + 5) }));
  }
};

const openHint = () => {
  alert('按钮提示：请确保新增设备位置唯一且完成标定。');
};
</script>

<style scoped>
.grid {
  display: grid;
  gap: 14px;
}

.actions-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.note {
  color: #6b7280;
  margin-top: 6px;
}

.ghost {
  background: #eef2f7;
  color: #1f2937;
  box-shadow: none;
}
</style>
