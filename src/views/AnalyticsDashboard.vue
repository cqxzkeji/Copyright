<template>
  <div class="page">
    <div class="grid cols-3">
      <div class="card stat">
        <h3>预警事件</h3>
        <strong>7</strong>
        <span>已处理 5 起</span>
      </div>
      <div class="card stat">
        <h3>供应链效率</h3>
        <strong>89.4%</strong>
        <span>高于目标 4.2%</span>
      </div>
      <div class="card stat">
        <h3>数据采集完整度</h3>
        <strong>97.8%</strong>
        <span>传感器在线 128 台</span>
      </div>
    </div>

    <div class="grid cols-2">
      <div class="card">
        <div class="card-header">
          <h3>监控预警趋势</h3>
          <div class="actions">
            <button class="btn" @click="openForm('新增预警规则')">新增规则</button>
            <button class="btn secondary" @click="openProgress('预警模拟中')">预警模拟</button>
            <button class="btn ghost" @click="openInfo('提示')">提示信息</button>
          </div>
        </div>
        <svg viewBox="0 0 320 160" class="chart">
          <defs>
            <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="#2f80ed" stop-opacity="0.4" />
              <stop offset="100%" stop-color="#2f80ed" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path :d="areaPath" fill="url(#area)" />
          <polyline
            fill="none"
            stroke="#2f80ed"
            stroke-width="3"
            :points="linePoints"
          />
        </svg>
      </div>
      <div class="card">
        <h3>关键指标概览</h3>
        <div class="kpi-list">
          <div v-for="kpi in kpis" :key="kpi.name" class="kpi-item">
            <div>
              <strong>{{ kpi.value }}</strong>
              <span>{{ kpi.name }}</span>
            </div>
            <span class="badge">{{ kpi.trend }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <h3>监控预警与数据分析</h3>
      <table class="table">
        <thead>
          <tr>
            <th>事件编号</th>
            <th>监控维度</th>
            <th>触发条件</th>
            <th>等级</th>
            <th>时间</th>
            <th>处理状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" :key="event.id">
            <td>{{ event.id }}</td>
            <td>{{ event.dimension }}</td>
            <td>{{ event.trigger }}</td>
            <td>{{ event.level }}</td>
            <td>{{ event.time }}</td>
            <td><span class="badge">{{ event.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="formModal" :title="formTitle" @close="closeForm">
      <form @submit.prevent="submitForm">
        <input v-model="form.name" placeholder="规则名称" required />
        <input v-model="form.dimension" placeholder="监控维度" required />
        <input v-model="form.trigger" placeholder="触发条件" required />
        <select v-model="form.level">
          <option value="提示">提示</option>
          <option value="预警">预警</option>
          <option value="严重">严重</option>
        </select>
        <button class="btn" type="submit">保存规则</button>
      </form>
    </Modal>

    <Modal v-if="progressModal" :title="progressTitle" @close="closeProgress">
      <p>正在模拟预警策略，请等待分析完成。</p>
      <div class="progress-bar">
        <span :style="{ width: progress + '%' }"></span>
      </div>
      <p>{{ progress }}%</p>
    </Modal>

    <Modal v-if="infoModal" :title="infoTitle" @close="closeInfo">
      <p>提示：建议关注连续 3 次触发的风险事件。</p>
    </Modal>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import Modal from '../components/Modal.vue'

const events = ref([
  { id: 'A-240601', dimension: '温控', trigger: '库温 > 8℃', level: '预警', time: '2024-06-12 08:30', status: '处理中' },
  { id: 'A-240602', dimension: '运输', trigger: '延误 > 30 分钟', level: '提示', time: '2024-06-12 09:10', status: '已处理' },
  { id: 'A-240603', dimension: '库存', trigger: '库容 > 85%', level: '预警', time: '2024-06-12 09:50', status: '处理中' },
  { id: 'A-240604', dimension: '质检', trigger: '复检批次 >= 3', level: '提示', time: '2024-06-12 10:20', status: '已处理' },
  { id: 'A-240605', dimension: '冷链', trigger: '温差 > 2℃', level: '严重', time: '2024-06-12 11:05', status: '处理中' },
  { id: 'A-240606', dimension: '调度', trigger: '车次不足', level: '预警', time: '2024-06-12 11:40', status: '已处理' },
  { id: 'A-240607', dimension: '产地', trigger: '资料缺失', level: '提示', time: '2024-06-12 12:10', status: '已处理' },
  { id: 'A-240608', dimension: '仓储', trigger: '出库排队 > 15', level: '预警', time: '2024-06-12 12:50', status: '处理中' },
  { id: 'A-240609', dimension: '溯源', trigger: '扫码异常', level: '提示', time: '2024-06-12 13:15', status: '已处理' },
  { id: 'A-240610', dimension: '运输', trigger: '冷链掉线', level: '严重', time: '2024-06-12 13:40', status: '处理中' },
  { id: 'A-240611', dimension: '数据', trigger: '传感器离线 > 5', level: '预警', time: '2024-06-12 14:10', status: '已处理' }
])

const kpis = ref([
  { name: '准时到达率', value: '92.3%', trend: '稳定' },
  { name: '温控合规率', value: '95.8%', trend: '上升' },
  { name: '库存周转天数', value: '4.6 天', trend: '下降' },
  { name: '扫码覆盖率', value: '98.2%', trend: '上升' }
])

const lineData = ref([28, 32, 26, 35, 31, 38, 34, 40])

const linePoints = computed(() => {
  return lineData.value
    .map((value, index) => `${index * 45 + 10},${150 - value * 3}`)
    .join(' ')
})

const areaPath = computed(() => {
  const points = lineData.value.map((value, index) => ({
    x: index * 45 + 10,
    y: 150 - value * 3
  }))
  const start = `M ${points[0].x} 150`
  const line = points.map((point) => `L ${point.x} ${point.y}`).join(' ')
  const end = `L ${points[points.length - 1].x} 150 Z`
  return `${start} ${line} ${end}`
})

const formModal = ref(false)
const progressModal = ref(false)
const infoModal = ref(false)
const formTitle = ref('')
const progressTitle = ref('')
const infoTitle = ref('')

const form = reactive({
  name: '',
  dimension: '',
  trigger: '',
  level: '提示'
})

const progress = ref(0)
let timer = null

const openForm = (title) => {
  formTitle.value = title
  formModal.value = true
}

const closeForm = () => {
  formModal.value = false
}

const submitForm = () => {
  events.value.unshift({
    id: `A-${Math.floor(Math.random() * 900000 + 100000)}`,
    dimension: form.dimension,
    trigger: form.trigger,
    level: form.level,
    time: new Date().toLocaleString('zh-CN', { hour12: false }),
    status: '处理中'
  })
  form.name = ''
  form.dimension = ''
  form.trigger = ''
  form.level = '提示'
  formModal.value = false
}

const openProgress = (title) => {
  progressTitle.value = title
  progressModal.value = true
  progress.value = 0
}

const closeProgress = () => {
  progressModal.value = false
}

const openInfo = (title) => {
  infoTitle.value = title
  infoModal.value = true
}

const closeInfo = () => {
  infoModal.value = false
}

watch(progressModal, (active) => {
  if (active) {
    timer = setInterval(() => {
      progress.value = Math.min(progress.value + 11, 100)
      if (progress.value >= 100) {
        clearInterval(timer)
      }
    }, 240)
  } else if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.stat {
  display: grid;
  gap: 6px;
}

.stat strong {
  font-size: 24px;
}

.stat span {
  color: #7a879f;
  font-size: 13px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chart {
  width: 100%;
  height: 180px;
}

.kpi-list {
  display: grid;
  gap: 12px;
}

.kpi-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f6f9ff;
  padding: 14px;
  border-radius: 12px;
}

.kpi-item span {
  display: block;
  font-size: 12px;
  color: #7a879f;
}
</style>
