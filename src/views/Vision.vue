<template>
  <div class="grid" style="grid-template-columns: 2fr 1fr; align-items: start;">
    <div class="card">
      <div class="flex-between">
        <h3>视觉接入与标定</h3>
        <div class="flex">
          <button @click="openCamera = true">接入相机</button>
          <button @click="openCalib = true">标定参数</button>
          <button @click="openOverlay = true">坐标转换</button>
        </div>
      </div>
      <div class="camera-view">
        <div class="video-placeholder">实时视频流（演示）</div>
        <div class="overlay">
          <div v-for="marker in markers" :key="marker.id" class="marker" :style="{ left: marker.x + '%', top: marker.y + '%' }">
            {{ marker.label }}
          </div>
        </div>
      </div>
    </div>
    <div class="grid" style="gap: 12px">
      <div class="card">
        <div class="flex-between">
          <h4>相机列表</h4>
          <button @click="openCapture = true">截图检测</button>
        </div>
        <ul>
          <li v-for="cam in cameras" :key="cam.name" class="flex-between" style="padding: 6px 0;">
            <span>{{ cam.name }} ({{ cam.res }})</span>
            <span :class="cam.state === '运行' ? 'status-ok' : 'status-warn'">{{ cam.state }}</span>
          </li>
        </ul>
      </div>
      <div class="card">
        <div class="flex-between">
          <h4>标定记录</h4>
          <button @click="openReproject = true">重投影检查</button>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>时间</th>
              <th>相机</th>
              <th>误差</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in calibLogs" :key="item.time">
              <td>{{ item.time }}</td>
              <td>{{ item.camera }}</td>
              <td>{{ item.error }} px</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div v-if="openCamera" class="modal-overlay" @click.self="openCamera = false">
    <div class="modal">
      <h3>相机接入</h3>
      <label>IP 地址<input v-model="cameraForm.ip" placeholder="192.168.1.50" /></label>
      <label>分辨率<select v-model="cameraForm.res"><option>1920x1080</option><option>1280x720</option></select></label>
      <label>帧率<input v-model="cameraForm.fps" type="number" /></label>
      <div class="flex-between" style="margin-top: 10px">
        <span class="tag">自动曝光</span>
        <button @click="addCamera">接入</button>
      </div>
    </div>
  </div>

  <div v-if="openCalib" class="modal-overlay" @click.self="openCalib = false">
    <div class="modal">
      <h3>标定参数</h3>
      <label>棋盘格尺寸<input v-model="calibForm.grid" placeholder="0.025m" /></label>
      <label>采集张数<input v-model="calibForm.count" type="number" /></label>
      <div class="flex-between" style="margin-top: 10px">
        <span class="badge">外参联动 IMU</span>
        <button @click="applyCalib">开始标定</button>
      </div>
    </div>
  </div>

  <div v-if="openOverlay" class="modal-overlay" @click.self="openOverlay = false">
    <div class="modal">
      <h3>坐标转换</h3>
      <p>对齐相机坐标到机器人基坐标，启用视觉伺服闭环。</p>
      <label>基坐标<select v-model="overlayForm.base"><option>机身中心</option><option>足端平均</option></select></label>
      <label>对齐精度<select v-model="overlayForm.precision"><option>2mm</option><option>5mm</option><option>1cm</option></select></label>
      <div class="flex-between" style="margin-top: 10px">
        <span>{{ overlayForm.base }} | 精度 {{ overlayForm.precision }}</span>
        <button @click="applyOverlay">执行对齐</button>
      </div>
    </div>
  </div>

  <div v-if="openCapture" class="modal-overlay" @click.self="openCapture = false">
    <div class="modal">
      <h3>截图检测</h3>
      <p>捕获当前帧并运行目标检测。</p>
      <div class="progress-bar" style="margin-top: 10px">
        <div class="progress-inner" :style="{ width: captureProgress + '%' }"></div>
      </div>
      <div class="flex-between" style="margin-top: 10px">
        <span>{{ captureProgress }}%</span>
        <button @click="runCapture">开始</button>
      </div>
    </div>
  </div>

  <div v-if="openReproject" class="modal-overlay" @click.self="openReproject = false">
    <div class="modal">
      <h3>重投影检查</h3>
      <p>计算重投影误差，验证标定质量。</p>
      <ul>
        <li v-for="item in calibLogs" :key="item.time">{{ item.camera }} - 误差 {{ item.error }} px</li>
      </ul>
      <button style="margin-top: 10px" @click="openReproject = false">关闭</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const markers = ref([
  { id: 1, label: '目标 A', x: 30, y: 40 },
  { id: 2, label: '目标 B', x: 60, y: 55 },
  { id: 3, label: '步态参考', x: 45, y: 30 }
]);

const cameras = ref([
  { name: '相机-前左', res: '1920x1080', state: '运行' },
  { name: '相机-前右', res: '1920x1080', state: '运行' },
  { name: '相机-顶部', res: '1280x720', state: '调试' }
]);

const calibLogs = ref([
  { time: '10:00:12', camera: '相机-前左', error: 0.8 },
  { time: '10:02:10', camera: '相机-前右', error: 0.9 },
  { time: '10:05:02', camera: '相机-顶部', error: 1.2 }
]);

const cameraForm = reactive({ ip: '192.168.1.50', res: '1920x1080', fps: 30 });
const calibForm = reactive({ grid: '0.025m', count: 12 });
const overlayForm = reactive({ base: '机身中心', precision: '2mm' });
const captureProgress = ref(0);

const openCamera = ref(false);
const openCalib = ref(false);
const openOverlay = ref(false);
const openCapture = ref(false);
const openReproject = ref(false);

const addCamera = () => {
  cameras.value.push({ name: `相机-${cameras.value.length + 1}`, res: cameraForm.res, state: '运行' });
  openCamera.value = false;
};

const applyCalib = () => {
  calibLogs.value.push({ time: '10:10:00', camera: '新标定', error: 0.7 });
  openCalib.value = false;
};

const applyOverlay = () => {
  alert(`对齐到 ${overlayForm.base}，精度 ${overlayForm.precision}`);
  openOverlay.value = false;
};

const runCapture = () => {
  captureProgress.value = 100;
};
</script>

<style scoped>
.camera-view {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
  min-height: 320px;
}

.video-placeholder {
  background: linear-gradient(135deg, #e3f2fd, #fdf7e3);
  height: 320px;
  display: grid;
  place-items: center;
  color: #0b3a75;
  font-weight: 700;
}

.overlay {
  position: absolute;
  inset: 0;
}

.marker {
  position: absolute;
  transform: translate(-50%, -50%);
  background: rgba(30, 136, 229, 0.85);
  color: #fff;
  padding: 6px 10px;
  border-radius: 8px;
  font-weight: 700;
}
</style>
