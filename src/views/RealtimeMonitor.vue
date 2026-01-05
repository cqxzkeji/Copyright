<template>
  <div class="grid" style="gap:16px;">
    <div class="card">
      <div class="toolbar" style="justify-content: space-between;">
        <div>
          <h3 class="section-title">实时数据采集与显示</h3>
          <p class="muted">视频、点云、距离/角度/转速等信息实时展示，多窗口同步。</p>
        </div>
        <div class="toolbar">
          <button class="btn" @click="toggleMonitoring">{{ monitoring ? '暂停监控' : '开始监控' }}</button>
          <button class="btn secondary" @click="showCapture = true">截图保存</button>
          <button class="btn ghost" @click="showOverlay = true">窗口布局</button>
        </div>
      </div>
      <div class="grid" style="grid-template-columns: repeat(auto-fit,minmax(280px,1fr));">
        <div v-for="feed in feeds" :key="feed.title" class="card video-box">
          <div class="video-header">{{ feed.title }}</div>
          <div class="video-body image-body">
            <img
              v-if="!feed.error"
              :src="feed.src"
              :alt="feed.title"
              loading="lazy"
              @error="feed.error = true"
            />
            <div v-else class="video-fallback">{{ feed.fallback }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid" style="grid-template-columns:1.2fr 1fr;gap:16px;">
      <div class="card">
        <div class="toolbar" style="justify-content: space-between;">
          <h4 class="section-title">实时曲线</h4>
          <button class="btn ghost" @click="showTrend = true">趋势预览</button>
        </div>
        <svg viewBox="0 0 400 160" style="width:100%;height:auto;">
          <polyline :points="linePoints" fill="none" stroke="#2b7de9" stroke-width="3" />
          <polyline :points="linePoints2" fill="none" stroke="#17a85f" stroke-width="3" />
        </svg>
        <div class="toolbar" style="justify-content: space-between;">
          <span class="badge info">距离/角度双曲线</span>
          <span class="muted">共 {{ chartData.length }} 个节点</span>
        </div>
      </div>
      <div class="card">
        <div class="toolbar" style="justify-content: space-between;">
          <h4 class="section-title">实时指标</h4>
          <button class="btn secondary" @click="showIndicators = true">刷新指标</button>
        </div>
        <ul style="margin:0;padding-left:18px;">
          <li v-for="item in indicators" :key="item.label" style="margin:6px 0;">
            <strong>{{ item.label }}：</strong> {{ item.value }}
          </li>
        </ul>
        <div class="progress-track" style="margin-top:12px;">
          <div class="progress-bar" :style="{ width: latency + '%' }"></div>
        </div>
        <p class="muted">延迟：{{ latency }} ms</p>
      </div>
    </div>

    <div class="card">
      <div class="toolbar" style="justify-content: space-between;">
        <h4 class="section-title">实时记录表（20+ 条）</h4>
        <button class="btn ghost" @click="showRecordHint = true">表格提示</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>时间</th>
            <th>窗口</th>
            <th>距离(m)</th>
            <th>角度(°)</th>
            <th>转速(Hz)</th>
            <th>亮度</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in realtimeRows" :key="row.time + row.window">
            <td>{{ row.time }}</td>
            <td>{{ row.window }}</td>
            <td>{{ row.distance }}</td>
            <td>{{ row.angle }}</td>
            <td>{{ row.speed }}</td>
            <td>{{ row.brightness }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ProgressModal :open="showMonitor" :progress="monitorProgress" title="监控状态" subtitle="采集进度" @close="showMonitor = false" @confirm="showMonitor = false" />
    <ModalDialog :open="showCapture" @close="showCapture = false" @confirm="showCapture = false">
      <template #title><h3 style="margin:0;">截图保存</h3></template>
      <p style="margin:0 0 8px;">已对当前三路窗口执行截图，保存至 /capture/2024-05/。</p>
    </ModalDialog>
    <ModalDialog :open="showOverlay" @close="showOverlay = false" @confirm="showOverlay = false">
      <template #title><h3 style="margin:0;">多窗口布局</h3></template>
      <div class="chip-list">
        <span class="chip">前视 + 点云</span>
        <span class="chip">四分屏</span>
        <span class="chip">雷达占比放大</span>
      </div>
    </ModalDialog>
    <ModalDialog :open="showTrend" @close="showTrend = false" @confirm="showTrend = false">
      <template #title><h3 style="margin:0;">趋势预览</h3></template>
      <p class="muted">基于最近 60 秒的距离/角度数据拟合，曲线峰值 {{ Math.max(...chartData) }}。</p>
    </ModalDialog>
    <ModalDialog :open="showIndicators" @close="showIndicators = false" @confirm="showIndicators = false">
      <template #title><h3 style="margin:0;">指标刷新</h3></template>
      <p>已刷新实时指标，延迟、帧率和数据吞吐量恢复正常。</p>
    </ModalDialog>
    <ModalDialog :open="showRecordHint" @close="showRecordHint = false" @confirm="showRecordHint = false">
      <template #title><h3 style="margin:0;">表格提示</h3></template>
      <p>表格包含至少 20 条数据，可按窗口或时间筛选，支持导出。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import cameraFeed from '../assets/camera-feed.svg';
import pointcloudView from '../assets/pointcloud-view.svg';
import radarView from '../assets/radar-view.svg';
import ModalDialog from '../components/ModalDialog.vue';
import ProgressModal from '../components/ProgressModal.vue';

const monitoring = ref(false);
const showMonitor = ref(false);
const showCapture = ref(false);
const showOverlay = ref(false);
const showTrend = ref(false);
const showIndicators = ref(false);
const showRecordHint = ref(false);
const monitorProgress = ref(10);
const latency = ref(32);

const feeds = reactive([
  { title: '前视摄像头', src: cameraFeed, fallback: '视频流加载失败', error: false },
  { title: '点云窗口', src: pointcloudView, fallback: '点云占位图', error: false },
  { title: '毫米波雷达', src: radarView, fallback: '距离 & 角度占位图', error: false }
]);

const chartData = reactive(Array.from({ length: 10 }).map((_, i) => 10 + (Math.sin(i) + 1) * 30));
const chartData2 = reactive(chartData.map((v, i) => v - i * 2 + 8));
const linePoints = computed(() => chartData.map((v, i) => `${i * 40},${160 - v}`).join(' '));
const linePoints2 = computed(() => chartData2.map((v, i) => `${i * 40},${160 - v}`).join(' '));

const indicators = reactive([
  { label: '视频帧率', value: '29 fps' },
  { label: '点云吞吐', value: '3.1 MB/s' },
  { label: '雷达距离', value: '48 m' },
  { label: '角度偏差', value: '±0.6°' }
]);

const realtimeRows = reactive(Array.from({ length: 22 }).map((_, i) => ({
  time: `10:${(i + 10).toString().padStart(2, '0')}:12`,
  window: ['前视', '点云', '雷达'][i % 3],
  distance: (18 + i * 0.4).toFixed(1),
  angle: (i * 2.1).toFixed(1),
  speed: (12 + (i % 5)).toFixed(1),
  brightness: `${60 + (i % 8) * 4}%`
})));

const toggleMonitoring = () => {
  monitoring.value = !monitoring.value;
  showMonitor.value = true;
  monitorProgress.value = monitoring.value ? 70 : 15;
};
</script>

<style scoped>
.video-box {
  min-height: 180px;
}

.video-header {
  font-weight: 700;
  margin-bottom: 10px;
}

.video-body {
  height: 120px;
  border-radius: 10px;
  border: 1px dashed var(--primary);
  background: linear-gradient(135deg, #f3f8ff, #fff);
  display: grid;
  place-items: center;
  color: var(--primary);
  font-weight: 700;
}

.image-body {
  padding: 8px;
  border: 1px solid #e2e8f0;
  background: #fff;
}

.image-body img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: inset 0 0 0 1px #e0e7ff;
}

.video-fallback {
  color: var(--muted);
}

.muted { color: var(--muted); margin: 4px 0 0; }
</style>
