<template>
  <div>
    <div class="card header-card">
      <div>
        <h2>数据采集与传感器接入</h2>
        <p>统一网关接入雷达、摄像头、RSU，按需加载模块资源。</p>
      </div>
      <div class="btn-group">
        <button class="primary-btn" @click="showAddModal = true">新增传感器</button>
        <button class="primary-btn" @click="startAcquisition">开始采集</button>
        <button class="primary-btn" @click="showSyncModal = true">同步校验</button>
      </div>
    </div>

    <div class="card">
      <h3>接入设备列表</h3>
      <table>
        <thead>
          <tr>
            <th>设备ID</th>
            <th>类型</th>
            <th>协议</th>
            <th>带宽(Mbps)</th>
            <th>帧率</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sensor in sensors" :key="sensor.id">
            <td>{{ sensor.id }}</td>
            <td>{{ sensor.type }}</td>
            <td>{{ sensor.protocol }}</td>
            <td>{{ sensor.bandwidth }}</td>
            <td>{{ sensor.fps }}</td>
            <td><span class="chip">{{ sensor.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <h3>实时吞吐</h3>
      <div class="chart-row">
        <div v-for="point in throughput" :key="point.label" class="chart-bar" :style="{ height: point.value + 'px' }" :title="point.label + ' - ' + point.value + 'MB/s'"></div>
      </div>
    </div>

    <div v-if="showAddModal" class="modal-backdrop" @click.self="showAddModal = false">
      <div class="modal-content">
        <h3>新增传感器</h3>
        <div class="form-grid">
          <label>设备ID</label>
          <input v-model="newSensor.id" placeholder="如 RSU-12" />
          <label>类型</label>
          <input v-model="newSensor.type" placeholder="摄像头/雷达" />
          <label>协议</label>
          <input v-model="newSensor.protocol" placeholder="RTSP / CAN / TCP" />
          <label>带宽(Mbps)</label>
          <input v-model.number="newSensor.bandwidth" type="number" />
          <label>帧率</label>
          <input v-model="newSensor.fps" placeholder="30fps" />
          <label>状态</label>
          <input v-model="newSensor.status" placeholder="在线" />
        </div>
        <div class="btn-row">
          <button class="primary-btn" @click="appendSensor">保存</button>
          <button class="secondary" @click="showAddModal = false">取消</button>
        </div>
      </div>
    </div>

    <div v-if="showSyncModal" class="modal-backdrop" @click.self="showSyncModal = false">
      <div class="modal-content">
        <h3>同步校验</h3>
        <p>自动检测时钟、网络时延与对时偏差。</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: syncProgress + '%' }"></div>
        </div>
        <p v-if="syncProgress === 100">同步完成：已对齐到主时钟。</p>
        <button class="primary-btn" @click="syncSensors">重新校验</button>
      </div>
    </div>

    <div v-if="showAcquisitionModal" class="modal-backdrop" @click.self="showAcquisitionModal = false">
      <div class="modal-content">
        <h3>采集启动</h3>
        <p>正在启动边缘采集节点...</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: acquireProgress + '%' }"></div>
        </div>
        <p v-if="acquireProgress === 100">已锁定所有传感器并推流。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const sensors = ref([
  { id: 'RSU-01', type: '毫米波雷达', protocol: 'CAN', bandwidth: 42, fps: '20', status: '在线' },
  { id: 'CAM-02', type: '4K 摄像头', protocol: 'RTSP', bandwidth: 120, fps: '30', status: '在线' },
  { id: 'LID-03', type: '激光雷达', protocol: 'TCP', bandwidth: 95, fps: '10', status: '校准中' },
  { id: 'MIC-04', type: '声学阵列', protocol: 'UDP', bandwidth: 18, fps: '48kHz', status: '在线' },
  { id: 'RSU-05', type: '毫米波雷达', protocol: 'CAN', bandwidth: 50, fps: '20', status: '在线' },
  { id: 'CAM-06', type: '2K 摄像头', protocol: 'RTSP', bandwidth: 60, fps: '25', status: '在线' },
  { id: 'RSU-07', type: '毫米波雷达', protocol: 'CAN', bandwidth: 46, fps: '20', status: '离线' },
  { id: 'LID-08', type: '激光雷达', protocol: 'TCP', bandwidth: 105, fps: '15', status: '在线' },
  { id: 'RSU-09', type: '毫米波雷达', protocol: 'CAN', bandwidth: 48, fps: '20', status: '在线' },
  { id: 'CAM-10', type: '4K 摄像头', protocol: 'RTSP', bandwidth: 115, fps: '30', status: '在线' },
  { id: 'MIC-11', type: '声学阵列', protocol: 'UDP', bandwidth: 20, fps: '48kHz', status: '在线' },
  { id: 'CAM-12', type: '鱼眼摄像头', protocol: 'RTSP', bandwidth: 70, fps: '25', status: '在线' }
]);

const throughput = ref([
  { label: '雷达', value: 60 },
  { label: '摄像头', value: 110 },
  { label: '激光雷达', value: 140 },
  { label: '声学', value: 45 },
  { label: '融合流', value: 130 }
]);

const newSensor = reactive({ id: '', type: '', protocol: '', bandwidth: 40, fps: '20', status: '在线' });
const showAddModal = ref(false);
const showSyncModal = ref(false);
const showAcquisitionModal = ref(false);
const syncProgress = ref(40);
const acquireProgress = ref(0);
let acquireTimer;

const appendSensor = () => {
  if (!newSensor.id || !newSensor.type) return;
  sensors.value.push({ ...newSensor });
  Object.assign(newSensor, { id: '', type: '', protocol: '', bandwidth: 40, fps: '20', status: '在线' });
  showAddModal.value = false;
};

const syncSensors = () => {
  syncProgress.value = 0;
  const timer = setInterval(() => {
    if (syncProgress.value >= 100) {
      clearInterval(timer);
    } else {
      syncProgress.value += 20;
    }
  }, 200);
};

const startAcquisition = () => {
  showAcquisitionModal.value = true;
  acquireProgress.value = 0;
  acquireTimer = setInterval(() => {
    if (acquireProgress.value >= 100) {
      clearInterval(acquireTimer);
    } else {
      acquireProgress.value += 25;
    }
  }, 250);
};
</script>

<style scoped>
.header-card {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.btn-group {
  display: flex;
  gap: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 12px 0;
}

.btn-row {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.secondary {
  background: #e5e7eb;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
}
</style>
