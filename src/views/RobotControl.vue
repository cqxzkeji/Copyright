<template>
  <div class="grid" style="grid-template-columns: 2fr 1fr;align-items: start;">
    <div class="card">
      <div class="flex-between">
        <div>
          <h2>关节状态表</h2>
          <small>实时采样自传感总线 · 最近 200ms 刷新</small>
        </div>
        <div class="grid" style="grid-template-columns: repeat(auto-fit,minmax(120px,1fr));gap:8px;min-width:240px;">
          <button @click="openModal('selfCheck')">执行自检</button>
          <button @click="openModal('calibration')" style="background:var(--secondary);box-shadow:0 10px 25px rgba(34,197,94,0.25);">标定参数</button>
          <button @click="openModal('stop')" style="background:var(--accent);box-shadow:0 10px 25px rgba(249,115,22,0.25);">安全停机</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>关节</th>
            <th>扭矩(N·m)</th>
            <th>温度(℃)</th>
            <th>振动(mm/s)</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="joint in joints" :key="joint.name">
            <td>{{ joint.name }}</td>
            <td>{{ joint.torque }}</td>
            <td>{{ joint.temp }}</td>
            <td>{{ joint.vibration }}</td>
            <td>
              <span class="badge" :class="joint.status === '稳定' ? 'tag-green' : 'tag-orange'">{{ joint.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="flex-between">
        <h2>执行器负载曲线</h2>
        <small>5 维协同工况</small>
      </div>
      <div class="chart">
        <div v-for="point in loadCurve" :key="point.label" class="bar-group">
          <div class="bar" :style="{ height: point.value + '%'}"></div>
          <span class="bar-label">{{ point.label }}</span>
        </div>
      </div>
      <div class="flex-between" style="margin-top:12px;">
        <div>
          <div class="highlight">{{ stabilityIndex }}%</div>
          <small>稳定性指数</small>
        </div>
        <div>
          <div class="highlight">{{ surgeMargin }}%</div>
          <small>冗余裕度</small>
        </div>
      </div>
    </div>
  </div>

  <BaseModal :show="showModal === 'calibration'" title="标定参数" @close="closeModal">
    <p>请填写零位、柔顺及限位策略，提交后立即下发控制总线。</p>
    <div class="grid" style="grid-template-columns: repeat(auto-fit,minmax(180px,1fr));gap:12px;">
      <div>
        <label>零位偏移(°)</label>
        <input v-model="calibration.zero" type="number" />
      </div>
      <div>
        <label>柔顺系数</label>
        <input v-model="calibration.compliance" type="number" step="0.01" />
      </div>
      <div>
        <label>速度上限(°/s)</label>
        <input v-model="calibration.speed" type="number" />
      </div>
    </div>
    <template #footer>
      <button @click="saveCalibration">提交并下发</button>
    </template>
  </BaseModal>

  <BaseModal :show="showModal === 'selfCheck'" title="自动自检" @close="closeModal">
    <p>正在执行力矩、编码器、视觉基准多通道自检，预计 8 秒完成。</p>
    <div class="progress" style="margin:12px 0;">
      <div class="progress-bar" :style="{ width: selfCheckProgress + '%' }"></div>
    </div>
    <template #footer>
      <button @click="startSelfCheck" :disabled="selfCheckProgress < 100" style="background:var(--secondary);box-shadow:none;">重检</button>
    </template>
  </BaseModal>

  <BaseModal :show="showModal === 'stop'" title="安全停机确认" @close="closeModal">
    <p>确认后将进入力控松弛与制动模式，所有轨迹任务暂停。</p>
    <template #footer>
      <button @click="closeModal" style="background:#e2e8f0;color:#0f172a;box-shadow:none;">取消</button>
      <button @click="confirmStop" style="background:var(--accent);">立即停机</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const showModal = ref('')
const selfCheckProgress = ref(42)
const stabilityIndex = 97.4
const surgeMargin = 12.3

const joints = ref([
  { name: 'J1-旋转', torque: '18.2', temp: '51.3', vibration: '0.12', status: '稳定' },
  { name: 'J2-俯仰', torque: '15.7', temp: '48.1', vibration: '0.18', status: '稳定' },
  { name: 'J3-肘部', torque: '12.5', temp: '46.0', vibration: '0.21', status: '稳定' },
  { name: 'J4-腕偏', torque: '9.9', temp: '44.5', vibration: '0.15', status: '稳定' },
  { name: 'J5-腕转', torque: '6.3', temp: '43.1', vibration: '0.19', status: '预警' }
])

const loadCurve = ref([
  { label: '基座', value: 72 },
  { label: '关节1', value: 64 },
  { label: '关节2', value: 58 },
  { label: '末端', value: 46 },
  { label: '夹爪', value: 54 }
])

const calibration = ref({
  zero: 0.3,
  compliance: 0.82,
  speed: 120
})

const openModal = (key) => {
  showModal.value = key
  if (key === 'selfCheck') startSelfCheck()
}

const closeModal = () => {
  showModal.value = ''
}

const startSelfCheck = () => {
  selfCheckProgress.value = 0
  const timer = setInterval(() => {
    selfCheckProgress.value += 14
    if (selfCheckProgress.value >= 100) {
      selfCheckProgress.value = 100
      clearInterval(timer)
    }
  }, 400)
}

const saveCalibration = () => {
  alert(`零位:${calibration.value.zero}°, 柔顺:${calibration.value.compliance}, 速度:${calibration.value.speed}°/s 已下发`) // 提示信息弹窗
  closeModal()
}

const confirmStop = () => {
  alert('已进入安全停机流程，保持制动与力控松弛。')
  closeModal()
}
</script>

<style scoped>
.chart {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.bar-group {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bar {
  width: 100%;
  min-height: 120px;
  background: linear-gradient(180deg, rgba(59, 130, 246, 0.8), rgba(34, 197, 94, 0.8));
  border-radius: 10px;
  align-self: stretch;
  transition: height 0.3s ease;
}

.bar-label {
  font-weight: 700;
  color: #0f172a;
}
</style>
