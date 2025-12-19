<template>
  <div class="page">
    <div class="grid cols-3">
      <div class="card stat">
        <h3>本周入档批次</h3>
        <strong>128</strong>
        <span>覆盖 18 个产地</span>
      </div>
      <div class="card stat">
        <h3>主体合规率</h3>
        <strong>98.6%</strong>
        <span>已复核 52 家主体</span>
      </div>
      <div class="card stat">
        <h3>待补充资料</h3>
        <strong>6</strong>
        <span>需完善资质信息</span>
      </div>
    </div>

    <div class="grid cols-2">
      <div class="card">
        <div class="card-header">
          <h3>产地批次入档趋势</h3>
          <div class="actions">
            <button class="btn" @click="openForm('新增产地档案')">新增档案</button>
            <button class="btn secondary" @click="openProgress('批次同步中')">批次更新</button>
            <button class="btn ghost" @click="openInfo('提示')">提示信息</button>
          </div>
        </div>
        <svg viewBox="0 0 320 160" class="chart">
          <polyline
            fill="none"
            stroke="#2f80ed"
            stroke-width="3"
            :points="chartPoints"
          />
          <circle v-for="(point, index) in chartDots" :key="index" :cx="point.x" :cy="point.y" r="4" fill="#56ccf2" />
        </svg>
      </div>
      <div class="card">
        <h3>重点主体档案</h3>
        <ul class="record-list">
          <li v-for="record in highlights" :key="record.name">
            <div>
              <strong>{{ record.name }}</strong>
              <span>{{ record.location }}</span>
            </div>
            <span class="badge">{{ record.level }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="card">
      <h3>产地/主体与批次档案</h3>
      <table class="table">
        <thead>
          <tr>
            <th>批次编号</th>
            <th>产地</th>
            <th>主体</th>
            <th>品类</th>
            <th>入档日期</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in records" :key="row.batch">
            <td>{{ row.batch }}</td>
            <td>{{ row.origin }}</td>
            <td>{{ row.owner }}</td>
            <td>{{ row.category }}</td>
            <td>{{ row.date }}</td>
            <td><span class="badge">{{ row.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="formModal" :title="formTitle" @close="closeForm">
      <form @submit.prevent="submitForm">
        <input v-model="form.batch" placeholder="批次编号" required />
        <input v-model="form.origin" placeholder="产地" required />
        <input v-model="form.owner" placeholder="主体名称" required />
        <input v-model="form.category" placeholder="品类" required />
        <input v-model="form.date" type="date" required />
        <button class="btn" type="submit">提交档案</button>
      </form>
    </Modal>

    <Modal v-if="progressModal" :title="progressTitle" @close="closeProgress">
      <p>正在汇聚最新批次档案数据，请稍候。</p>
      <div class="progress-bar">
        <span :style="{ width: progress + '%' }"></span>
      </div>
      <p>{{ progress }}%</p>
    </Modal>

    <Modal v-if="infoModal" :title="infoTitle" @close="closeInfo">
      <p>提示：请在产地资料更新后 24 小时内完成批次归档。</p>
    </Modal>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import Modal from '../components/Modal.vue'

const records = ref([
  { batch: 'B20240601', origin: '湖南·岳阳', owner: '岳阳稻作合作社', category: '早稻', date: '2024-06-01', status: '已入档' },
  { batch: 'B20240602', origin: '湖北·荆州', owner: '荆州绿禾农场', category: '莲藕', date: '2024-06-02', status: '已入档' },
  { batch: 'B20240603', origin: '广西·桂林', owner: '桂林果蔬联盟', category: '罗汉果', date: '2024-06-03', status: '复核中' },
  { batch: 'B20240604', origin: '云南·红河', owner: '红河鲜蔬基地', category: '番茄', date: '2024-06-04', status: '已入档' },
  { batch: 'B20240605', origin: '新疆·哈密', owner: '哈密果业公司', category: '哈密瓜', date: '2024-06-05', status: '已入档' },
  { batch: 'B20240606', origin: '山东·潍坊', owner: '潍坊蔬菜集团', category: '黄瓜', date: '2024-06-06', status: '待完善' },
  { batch: 'B20240607', origin: '陕西·渭南', owner: '渭南苹果合作社', category: '苹果', date: '2024-06-07', status: '已入档' },
  { batch: 'B20240608', origin: '四川·乐山', owner: '乐山茶园', category: '绿茶', date: '2024-06-08', status: '复核中' },
  { batch: 'B20240609', origin: '江西·赣州', owner: '赣南果蔬公司', category: '脐橙', date: '2024-06-09', status: '已入档' },
  { batch: 'B20240610', origin: '广东·湛江', owner: '湛江水产基地', category: '对虾', date: '2024-06-10', status: '已入档' },
  { batch: 'B20240611', origin: '河北·邯郸', owner: '邯郸粮油基地', category: '小麦', date: '2024-06-11', status: '待完善' }
])

const highlights = ref([
  { name: '湘江生态稻田', location: '湖南·长沙', level: '重点监管' },
  { name: '赣南冷链基地', location: '江西·赣州', level: '核心供应' },
  { name: '陇原高原蔬菜', location: '甘肃·兰州', level: '重点监管' },
  { name: '渤海果蔬联合体', location: '山东·烟台', level: '高质量' }
])

const chartData = ref([38, 42, 35, 48, 52, 47, 60, 58])

const chartPoints = computed(() => {
  return chartData.value
    .map((value, index) => `${index * 45 + 10},${150 - value * 2}`)
    .join(' ')
})

const chartDots = computed(() => {
  return chartData.value.map((value, index) => ({
    x: index * 45 + 10,
    y: 150 - value * 2
  }))
})

const formModal = ref(false)
const progressModal = ref(false)
const infoModal = ref(false)
const formTitle = ref('')
const progressTitle = ref('')
const infoTitle = ref('')

const form = reactive({
  batch: '',
  origin: '',
  owner: '',
  category: '',
  date: ''
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
  records.value.unshift({
    batch: form.batch,
    origin: form.origin,
    owner: form.owner,
    category: form.category,
    date: form.date,
    status: '已入档'
  })
  form.batch = ''
  form.origin = ''
  form.owner = ''
  form.category = ''
  form.date = ''
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
      progress.value = Math.min(progress.value + 12, 100)
      if (progress.value >= 100) {
        clearInterval(timer)
      }
    }, 300)
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

.record-list {
  list-style: none;
  display: grid;
  gap: 14px;
}

.record-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed #e4ecf7;
  padding-bottom: 10px;
}

.record-list span {
  display: block;
  font-size: 12px;
  color: #7a879f;
}
</style>
