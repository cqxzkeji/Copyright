<template>
  <div class="panel-grid">
    <div class="card">
      <header class="card__header">
        <div>
          <p class="eyebrow">实时姿态</p>
          <h3>六轴关节指令</h3>
        </div>
        <div class="chip">姿态闭环</div>
      </header>
      <div class="chart">
        <svg viewBox="0 0 300 120" preserveAspectRatio="none">
          <polyline :points="chartPoints" fill="none" stroke="#2d9cdb" stroke-width="3" />
          <polyline :points="loadPoints" fill="none" stroke="#2abf77" stroke-width="3" />
        </svg>
        <div class="legend">
          <span class="legend__item"><span class="dot" style="background:#2d9cdb" />关节角度</span>
          <span class="legend__item"><span class="dot" style="background:#2abf77" />负载比例</span>
        </div>
      </div>
      <div class="buttons">
        <button @click="openProgress('控制启动中', 74)">启动轨迹</button>
        <button class="ghost" @click="showStop = true">急停释放</button>
        <button class="ghost" @click="showUpload = true">队列上传</button>
      </div>
    </div>

    <div class="card">
      <header class="card__header">
        <div>
          <p class="eyebrow">执行状态</p>
          <h3>关节工况表</h3>
        </div>
        <div class="chip ghost">刷新秒级</div>
      </header>
      <table class="data-table">
        <thead>
          <tr>
            <th>关节</th><th>角度(°)</th><th>扭矩(N·m)</th><th>温度(℃)</th><th>振动(mm/s)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="joint in joints" :key="joint.name">
            <td>{{ joint.name }}</td>
            <td>{{ joint.angle }}</td>
            <td>{{ joint.torque }}</td>
            <td>{{ joint.temp }}</td>
            <td>{{ joint.vibration }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ModalDialog
    :show="showStop"
    title="急停确认"
    primary-text="确认解除"
    @close="showStop = false"
    @confirm="handleStop"
  >
    <p>解除急停后，机械臂将进入受控低速模式，请确认现场安全。</p>
  </ModalDialog>

  <ModalDialog
    :show="showUpload"
    title="上传执行队列"
    primary-text="上传并校验"
    @close="showUpload = false"
    @confirm="handleUpload"
  >
    <form class="form">
      <label>队列名称<input v-model="uploadForm.name" placeholder="如：焊接-夜班" /></label>
      <label>执行循环次数<input v-model.number="uploadForm.loop" type="number" min="1" /></label>
      <label>优先级<select v-model="uploadForm.priority"><option>高</option><option>中</option><option>低</option></select></label>
    </form>
  </ModalDialog>

  <ModalDialog
    :show="progress.show"
    :title="progress.title"
    :show-footer="false"
    @close="progress.show = false"
  >
    <p class="muted">正在调度控制器资源，请稍候…</p>
    <div class="progress">
      <div class="progress__bar" :style="{ width: progress.value + '%' }"></div>
    </div>
  </ModalDialog>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const joints = [
  { name: 'J1', angle: '12.4', torque: '22.1', temp: '42.6', vibration: '0.5' },
  { name: 'J2', angle: '-5.8', torque: '18.6', temp: '40.1', vibration: '0.8' },
  { name: 'J3', angle: '34.2', torque: '25.4', temp: '45.2', vibration: '1.1' },
  { name: 'J4', angle: '48.9', torque: '28.0', temp: '47.5', vibration: '0.9' },
  { name: 'J5', angle: '-12.6', torque: '16.8', temp: '39.9', vibration: '0.6' },
  { name: 'J6', angle: '6.4', torque: '14.5', temp: '38.7', vibration: '0.4' }
]

const angleSeries = [10, 32, 46, 38, 52, 64]
const loadSeries = [20, 26, 34, 28, 40, 48]

const chartPoints = computed(() => angleSeries.map((v, i) => `${(i / 5) * 300},${120 - v}`).join(' '))
const loadPoints = computed(() => loadSeries.map((v, i) => `${(i / 5) * 300},${120 - v}`).join(' '))

const showStop = ref(false)
const showUpload = ref(false)
const uploadForm = reactive({ name: '通用装配', loop: 3, priority: '中' })
const progress = reactive({ show: false, title: '控制启动中', value: 0 })

const openProgress = (title, value) => {
  progress.title = title
  progress.value = value
  progress.show = true
  setTimeout(() => (progress.value = 100), 600)
}

const handleStop = () => {
  showStop.value = false
  openProgress('解除急停，恢复伺服', 35)
}

const handleUpload = () => {
  showUpload.value = false
  openProgress(`上传 ${uploadForm.name}`, 55)
}
</script>

<style scoped>
.panel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.eyebrow {
  color: var(--primary);
  letter-spacing: 0.06em;
  font-weight: 700;
}

.chip {
  padding: 6px 10px;
  border-radius: 10px;
  background: #eaf7ff;
  color: #2d9cdb;
  font-weight: 700;
}

.chip.ghost {
  background: #f1f4f9;
  color: #4a5568;
}

.chart {
  background: #f9fbff;
  border: 1px dashed var(--border);
  border-radius: 12px;
  padding: 10px;
}

svg {
  width: 100%;
  height: 120px;
}

.legend {
  display: flex;
  gap: 16px;
  padding: 6px 4px 0;
  color: var(--muted);
  font-size: 13px;
}

.legend__item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.legend__item .dot {
  width: 12px;
  height: 12px;
  border-radius: 6px;
}

.buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.buttons button {
  flex: 1;
  border: none;
  border-radius: 12px;
  padding: 10px 12px;
  font-weight: 700;
  cursor: pointer;
  background: linear-gradient(135deg, var(--primary), var(--primary-strong));
  color: #fff;
}

.buttons .ghost {
  background: #eef2f7;
  color: #1b2a3c;
  border: 1px solid var(--border);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  border-bottom: 1px solid var(--border);
  padding: 10px 8px;
  text-align: left;
}

.data-table tbody tr:hover {
  background: #f9fbff;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 600;
  color: #1b2a3c;
}

.form input,
.form select {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px;
}

.progress {
  height: 12px;
  border-radius: 12px;
  background: #eef2f7;
  overflow: hidden;
}

.progress__bar {
  height: 100%;
  background: linear-gradient(135deg, var(--primary), var(--success));
  transition: width 0.6s ease;
}

.muted {
  color: var(--muted);
}
</style>
