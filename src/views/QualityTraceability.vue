<template>
  <div class="page">
    <div class="grid cols-3">
      <div class="card stat">
        <h3>今日质检批次</h3>
        <strong>37</strong>
        <span>合格率 96.2%</span>
      </div>
      <div class="card stat">
        <h3>溯源码调用</h3>
        <strong>5,820</strong>
        <span>环比增长 12%</span>
      </div>
      <div class="card stat">
        <h3>异常复检</h3>
        <strong>4</strong>
        <span>已锁定供应链节点</span>
      </div>
    </div>

    <div class="grid cols-2">
      <div class="card">
        <div class="card-header">
          <h3>质检通过率趋势</h3>
          <div class="actions">
            <button class="btn" @click="openForm('新增质检记录')">新增质检</button>
            <button class="btn secondary" @click="openProgress('溯源核验中')">溯源核验</button>
            <button class="btn ghost" @click="openInfo('提示')">提示信息</button>
          </div>
        </div>
        <svg viewBox="0 0 320 160" class="chart">
          <polyline
            fill="none"
            stroke="#9b51e0"
            stroke-width="3"
            :points="chartPoints"
          />
          <circle v-for="(point, index) in chartDots" :key="index" :cx="point.x" :cy="point.y" r="4" fill="#f2c94c" />
        </svg>
      </div>
      <div class="card">
        <h3>重点溯源提示</h3>
        <ul class="trace-list">
          <li v-for="trace in traceNotes" :key="trace.code">
            <div>
              <strong>{{ trace.code }}</strong>
              <span>{{ trace.note }}</span>
            </div>
            <span class="badge">{{ trace.level }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="card">
      <h3>质量检测与溯源追踪</h3>
      <table class="table">
        <thead>
          <tr>
            <th>检测编号</th>
            <th>批次</th>
            <th>指标</th>
            <th>结果</th>
            <th>检测时间</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in inspections" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.batch }}</td>
            <td>{{ item.metric }}</td>
            <td>{{ item.result }}</td>
            <td>{{ item.time }}</td>
            <td><span class="badge">{{ item.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="formModal" :title="formTitle" @close="closeForm">
      <form @submit.prevent="submitForm">
        <input v-model="form.id" placeholder="检测编号" required />
        <input v-model="form.batch" placeholder="批次" required />
        <input v-model="form.metric" placeholder="检测指标" required />
        <input v-model="form.result" placeholder="结果" required />
        <input v-model="form.time" type="datetime-local" required />
        <button class="btn" type="submit">提交检测</button>
      </form>
    </Modal>

    <Modal v-if="progressModal" :title="progressTitle" @close="closeProgress">
      <p>正在调用全链溯源数据，请等待核验完成。</p>
      <div class="progress-bar">
        <span :style="{ width: progress + '%' }"></span>
      </div>
      <p>{{ progress }}%</p>
    </Modal>

    <Modal v-if="infoModal" :title="infoTitle" @close="closeInfo">
      <p>提示：异常批次请立即发起复检并锁定库存。</p>
    </Modal>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import Modal from '../components/Modal.vue'

const inspections = ref([
  { id: 'Q-240601', batch: 'B20240601', metric: '农残', result: '合格', time: '2024-06-12 08:40', status: '已发布' },
  { id: 'Q-240602', batch: 'B20240602', metric: '重金属', result: '合格', time: '2024-06-12 09:10', status: '已发布' },
  { id: 'Q-240603', batch: 'B20240603', metric: '糖度', result: '达标', time: '2024-06-12 10:05', status: '已发布' },
  { id: 'Q-240604', batch: 'B20240604', metric: '微生物', result: '合格', time: '2024-06-12 11:20', status: '已发布' },
  { id: 'Q-240605', batch: 'B20240605', metric: '水分', result: '偏低', time: '2024-06-12 12:15', status: '复检中' },
  { id: 'Q-240606', batch: 'B20240606', metric: '外观', result: '合格', time: '2024-06-12 13:40', status: '已发布' },
  { id: 'Q-240607', batch: 'B20240607', metric: '农残', result: '合格', time: '2024-06-12 14:10', status: '已发布' },
  { id: 'Q-240608', batch: 'B20240608', metric: '茶多酚', result: '达标', time: '2024-06-12 15:30', status: '已发布' },
  { id: 'Q-240609', batch: 'B20240609', metric: '糖度', result: '合格', time: '2024-06-12 16:00', status: '已发布' },
  { id: 'Q-240610', batch: 'B20240610', metric: '盐度', result: '合格', time: '2024-06-12 16:40', status: '已发布' },
  { id: 'Q-240611', batch: 'B20240611', metric: '水分', result: '偏高', time: '2024-06-12 17:15', status: '复检中' }
])

const traceNotes = ref([
  { code: 'B20240605', note: '水分偏低已通知产地', level: '复检' },
  { code: 'B20240611', note: '水分偏高需核实仓储', level: '复检' },
  { code: 'B20240603', note: '溯源链路已补齐', level: '已处理' },
  { code: 'B20240609', note: '扫码热度提升', level: '关注' }
])

const chartData = ref([92, 96, 94, 97, 95, 93, 98, 96])

const chartPoints = computed(() => {
  return chartData.value
    .map((value, index) => `${index * 45 + 10},${150 - value}`)
    .join(' ')
})

const chartDots = computed(() => {
  return chartData.value.map((value, index) => ({
    x: index * 45 + 10,
    y: 150 - value
  }))
})

const formModal = ref(false)
const progressModal = ref(false)
const infoModal = ref(false)
const formTitle = ref('')
const progressTitle = ref('')
const infoTitle = ref('')

const form = reactive({
  id: '',
  batch: '',
  metric: '',
  result: '',
  time: ''
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
  inspections.value.unshift({
    id: form.id,
    batch: form.batch,
    metric: form.metric,
    result: form.result,
    time: form.time.replace('T', ' '),
    status: '已发布'
  })
  form.id = ''
  form.batch = ''
  form.metric = ''
  form.result = ''
  form.time = ''
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
      progress.value = Math.min(progress.value + 14, 100)
      if (progress.value >= 100) {
        clearInterval(timer)
      }
    }, 260)
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

.trace-list {
  list-style: none;
  display: grid;
  gap: 14px;
}

.trace-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed #e4ecf7;
  padding-bottom: 10px;
}

.trace-list span {
  display: block;
  font-size: 12px;
  color: #7a879f;
}
</style>
