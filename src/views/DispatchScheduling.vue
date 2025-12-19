<template>
  <div class="page">
    <div class="grid cols-3">
      <div class="card stat">
        <h3>在途车辆</h3>
        <strong>42</strong>
        <span>覆盖 9 条干线</span>
      </div>
      <div class="card stat">
        <h3>今日协同任务</h3>
        <strong>86</strong>
        <span>调度完成率 93%</span>
      </div>
      <div class="card stat">
        <h3>冷链占比</h3>
        <strong>64%</strong>
        <span>温控报警 2 起</span>
      </div>
    </div>

    <div class="grid cols-2">
      <div class="card">
        <div class="card-header">
          <h3>运输协同负载</h3>
          <div class="actions">
            <button class="btn" @click="openForm('新增调度任务')">新增调度</button>
            <button class="btn secondary" @click="openProgress('任务派车中')">派车进度</button>
            <button class="btn ghost" @click="openInfo('提示')">提示信息</button>
          </div>
        </div>
        <svg viewBox="0 0 320 160" class="chart">
          <rect
            v-for="(value, index) in chartData"
            :key="index"
            :x="index * 28 + 10"
            :y="150 - value"
            width="18"
            :height="value"
            rx="6"
            fill="#56ccf2"
          />
        </svg>
      </div>
      <div class="card">
        <h3>线路协同提醒</h3>
        <ul class="alert-list">
          <li v-for="alert in alerts" :key="alert.route">
            <div>
              <strong>{{ alert.route }}</strong>
              <span>{{ alert.note }}</span>
            </div>
            <span class="badge">{{ alert.level }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="card">
      <h3>调度与运输协同清单</h3>
      <table class="table">
        <thead>
          <tr>
            <th>任务编号</th>
            <th>出发地</th>
            <th>目的地</th>
            <th>车辆</th>
            <th>预计到达</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>{{ task.id }}</td>
            <td>{{ task.from }}</td>
            <td>{{ task.to }}</td>
            <td>{{ task.vehicle }}</td>
            <td>{{ task.arrival }}</td>
            <td><span class="badge">{{ task.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="formModal" :title="formTitle" @close="closeForm">
      <form @submit.prevent="submitForm">
        <input v-model="form.id" placeholder="任务编号" required />
        <input v-model="form.from" placeholder="出发地" required />
        <input v-model="form.to" placeholder="目的地" required />
        <input v-model="form.vehicle" placeholder="车辆/班次" required />
        <input v-model="form.arrival" type="datetime-local" required />
        <button class="btn" type="submit">确认派车</button>
      </form>
    </Modal>

    <Modal v-if="progressModal" :title="progressTitle" @close="closeProgress">
      <p>正在分配车辆与路线，请等待调度完成。</p>
      <div class="progress-bar">
        <span :style="{ width: progress + '%' }"></span>
      </div>
      <p>{{ progress }}%</p>
    </Modal>

    <Modal v-if="infoModal" :title="infoTitle" @close="closeInfo">
      <p>提示：高温路段建议增加冷链车辆协同。</p>
    </Modal>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import Modal from '../components/Modal.vue'

const tasks = ref([
  { id: 'T-240601', from: '湖南·岳阳', to: '湖北·武汉', vehicle: '冷链车 A12', arrival: '2024-06-13 18:30', status: '在途' },
  { id: 'T-240602', from: '广西·桂林', to: '广东·佛山', vehicle: '厢式车 B07', arrival: '2024-06-13 16:20', status: '待发车' },
  { id: 'T-240603', from: '山东·潍坊', to: '天津·静海', vehicle: '冷链车 C09', arrival: '2024-06-13 20:00', status: '在途' },
  { id: 'T-240604', from: '云南·红河', to: '重庆·渝北', vehicle: '厢式车 D02', arrival: '2024-06-14 09:30', status: '已完成' },
  { id: 'T-240605', from: '陕西·渭南', to: '河南·郑州', vehicle: '冷链车 A04', arrival: '2024-06-13 22:00', status: '在途' },
  { id: 'T-240606', from: '江西·赣州', to: '上海·嘉定', vehicle: '冷链车 F11', arrival: '2024-06-14 05:00', status: '在途' },
  { id: 'T-240607', from: '新疆·哈密', to: '甘肃·兰州', vehicle: '冷链车 H08', arrival: '2024-06-15 12:00', status: '待发车' },
  { id: 'T-240608', from: '河北·邯郸', to: '北京·通州', vehicle: '厢式车 K03', arrival: '2024-06-13 14:30', status: '已完成' },
  { id: 'T-240609', from: '四川·乐山', to: '浙江·杭州', vehicle: '冷链车 J06', arrival: '2024-06-14 11:20', status: '在途' },
  { id: 'T-240610', from: '广东·湛江', to: '福建·泉州', vehicle: '水产冷链 Z01', arrival: '2024-06-13 19:40', status: '在途' },
  { id: 'T-240611', from: '湖北·荆州', to: '湖南·长沙', vehicle: '厢式车 M09', arrival: '2024-06-13 17:00', status: '待发车' }
])

const alerts = ref([
  { route: '桂林-佛山', note: '高速限行已调整', level: '需确认' },
  { route: '乐山-杭州', note: '冷链补给点不足', level: '风险' },
  { route: '赣州-上海', note: '夜间停车位紧张', level: '关注' },
  { route: '潍坊-天津', note: '温控偏差 1.5℃', level: '预警' }
])

const chartData = ref([80, 90, 65, 75, 110, 92, 70, 88, 96, 78])

const formModal = ref(false)
const progressModal = ref(false)
const infoModal = ref(false)
const formTitle = ref('')
const progressTitle = ref('')
const infoTitle = ref('')

const form = reactive({
  id: '',
  from: '',
  to: '',
  vehicle: '',
  arrival: ''
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
  tasks.value.unshift({
    id: form.id,
    from: form.from,
    to: form.to,
    vehicle: form.vehicle,
    arrival: form.arrival.replace('T', ' '),
    status: '待发车'
  })
  form.id = ''
  form.from = ''
  form.to = ''
  form.vehicle = ''
  form.arrival = ''
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
      progress.value = Math.min(progress.value + 10, 100)
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

.alert-list {
  list-style: none;
  display: grid;
  gap: 14px;
}

.alert-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed #e4ecf7;
  padding-bottom: 10px;
}

.alert-list span {
  display: block;
  font-size: 12px;
  color: #7a879f;
}
</style>
