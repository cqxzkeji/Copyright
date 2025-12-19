<template>
  <div class="page">
    <div class="grid cols-3">
      <div class="card stat">
        <h3>库容占用率</h3>
        <strong>71%</strong>
        <span>在库 18,200 吨</span>
      </div>
      <div class="card stat">
        <h3>今日入库</h3>
        <strong>46</strong>
        <span>主要为蔬果类</span>
      </div>
      <div class="card stat">
        <h3>出库排队</h3>
        <strong>19</strong>
        <span>待调度车辆 8 台</span>
      </div>
    </div>

    <div class="grid cols-2">
      <div class="card">
        <div class="card-header">
          <h3>库位温湿度趋势</h3>
          <div class="actions">
            <button class="btn" @click="openForm('新增出入库单')">新增出入库</button>
            <button class="btn secondary" @click="openProgress('库存盘点中')">库存盘点</button>
            <button class="btn ghost" @click="openInfo('提示')">提示信息</button>
          </div>
        </div>
        <svg viewBox="0 0 320 160" class="chart">
          <polyline
            fill="none"
            stroke="#27ae60"
            stroke-width="3"
            :points="chartPoints"
          />
          <polyline
            fill="none"
            stroke="#2f80ed"
            stroke-width="3"
            :points="humidityPoints"
          />
        </svg>
      </div>
      <div class="card">
        <h3>库区作业分布</h3>
        <div class="zone-grid">
          <div v-for="zone in zones" :key="zone.name" class="zone-card">
            <strong>{{ zone.name }}</strong>
            <span>{{ zone.task }}</span>
            <div class="badge">{{ zone.level }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <h3>仓储库存与出入库流转</h3>
      <table class="table">
        <thead>
          <tr>
            <th>单号</th>
            <th>仓库</th>
            <th>品类</th>
            <th>数量</th>
            <th>入/出库</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in inventory" :key="item.code">
            <td>{{ item.code }}</td>
            <td>{{ item.warehouse }}</td>
            <td>{{ item.category }}</td>
            <td>{{ item.amount }}</td>
            <td>{{ item.type }}</td>
            <td><span class="badge">{{ item.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="formModal" :title="formTitle" @close="closeForm">
      <form @submit.prevent="submitForm">
        <input v-model="form.code" placeholder="单号" required />
        <input v-model="form.warehouse" placeholder="仓库" required />
        <input v-model="form.category" placeholder="品类" required />
        <input v-model="form.amount" placeholder="数量" required />
        <select v-model="form.type">
          <option value="入库">入库</option>
          <option value="出库">出库</option>
        </select>
        <button class="btn" type="submit">提交单据</button>
      </form>
    </Modal>

    <Modal v-if="progressModal" :title="progressTitle" @close="closeProgress">
      <p>正在执行库内盘点与通道复核。</p>
      <div class="progress-bar">
        <span :style="{ width: progress + '%' }"></span>
      </div>
      <p>{{ progress }}%</p>
    </Modal>

    <Modal v-if="infoModal" :title="infoTitle" @close="closeInfo">
      <p>提示：高湿库区建议优先出库易损品类。</p>
    </Modal>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import Modal from '../components/Modal.vue'

const inventory = ref([
  { code: 'W-240601', warehouse: '华中一号仓', category: '早稻', amount: '120 吨', type: '入库', status: '已完成' },
  { code: 'W-240602', warehouse: '华中一号仓', category: '莲藕', amount: '80 吨', type: '入库', status: '待质检' },
  { code: 'W-240603', warehouse: '华南冷链仓', category: '哈密瓜', amount: '45 吨', type: '出库', status: '装车中' },
  { code: 'W-240604', warehouse: '华东集配仓', category: '脐橙', amount: '90 吨', type: '入库', status: '已完成' },
  { code: 'W-240605', warehouse: '华北转运仓', category: '小麦', amount: '150 吨', type: '入库', status: '已完成' },
  { code: 'W-240606', warehouse: '西南冷链仓', category: '番茄', amount: '68 吨', type: '出库', status: '待装车' },
  { code: 'W-240607', warehouse: '华中一号仓', category: '黄瓜', amount: '52 吨', type: '入库', status: '已完成' },
  { code: 'W-240608', warehouse: '华东集配仓', category: '绿茶', amount: '30 吨', type: '出库', status: '已完成' },
  { code: 'W-240609', warehouse: '华南冷链仓', category: '对虾', amount: '22 吨', type: '入库', status: '待质检' },
  { code: 'W-240610', warehouse: '华北转运仓', category: '苹果', amount: '74 吨', type: '出库', status: '装车中' },
  { code: 'W-240611', warehouse: '西南冷链仓', category: '蔬菜礼包', amount: '40 吨', type: '入库', status: '已完成' }
])

const zones = ref([
  { name: 'A区冷藏', task: '水果类入库', level: '高频' },
  { name: 'B区恒温', task: '粮油补货', level: '稳定' },
  { name: 'C区冷链', task: '水产出库', level: '紧急' },
  { name: 'D区加工', task: '预包装分拣', level: '正常' }
])

const temperature = ref([62, 58, 64, 70, 66, 68, 65, 63])
const humidity = ref([48, 52, 56, 50, 58, 54, 49, 53])

const chartPoints = computed(() => {
  return temperature.value
    .map((value, index) => `${index * 45 + 10},${150 - value}`)
    .join(' ')
})

const humidityPoints = computed(() => {
  return humidity.value
    .map((value, index) => `${index * 45 + 10},${150 - value}`)
    .join(' ')
})

const formModal = ref(false)
const progressModal = ref(false)
const infoModal = ref(false)
const formTitle = ref('')
const progressTitle = ref('')
const infoTitle = ref('')

const form = reactive({
  code: '',
  warehouse: '',
  category: '',
  amount: '',
  type: '入库'
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
  inventory.value.unshift({
    code: form.code,
    warehouse: form.warehouse,
    category: form.category,
    amount: form.amount,
    type: form.type,
    status: '待质检'
  })
  form.code = ''
  form.warehouse = ''
  form.category = ''
  form.amount = ''
  form.type = '入库'
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
      progress.value = Math.min(progress.value + 15, 100)
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

.zone-grid {
  display: grid;
  gap: 12px;
}

.zone-card {
  background: #f7faff;
  padding: 14px;
  border-radius: 12px;
  display: grid;
  gap: 6px;
}

.zone-card span {
  font-size: 12px;
  color: #7a879f;
}
</style>
