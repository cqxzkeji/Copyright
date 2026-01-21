<template>
  <div class="card">
    <div class="section-title">生产与数据管理</div>
    <div class="actions-row">
      <button class="btn" @click="openForm">新建种植批次</button>
      <button class="btn secondary" @click="openProgress">生成统计报表</button>
      <button class="btn ghost" @click="openInfo">按钮提示</button>
    </div>
    <div class="grid grid-3" style="margin-top: 16px;">
      <div class="metric">
        <h4>当前批次</h4>
        <p>4 个</p>
      </div>
      <div class="metric">
        <h4>累计产量</h4>
        <p>8.2 吨</p>
      </div>
      <div class="metric">
        <h4>合格率</h4>
        <p>97%</p>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top: 20px;">
    <div class="section-title">批次管理列表</div>
    <table class="table">
      <thead>
        <tr>
          <th>批次编号</th>
          <th>区域</th>
          <th>品种</th>
          <th>定植日期</th>
          <th>预计采收</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in batches" :key="item.id">
          <td>{{ item.code }}</td>
          <td>{{ item.zone }}</td>
          <td>{{ item.variety }}</td>
          <td>{{ item.start }}</td>
          <td>{{ item.harvest }}</td>
          <td><span class="badge">{{ item.status }}</span></td>
          <td>
            <button class="btn ghost" @click="openRow(item)">查看</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal :show="showForm" title="新建种植批次" @close="showForm = false">
    <form class="form-grid">
      <div>
        <label>批次名称</label>
        <input v-model="form.name" placeholder="请输入批次名称" />
      </div>
      <div>
        <label>种植区域</label>
        <select v-model="form.zone">
          <option>迷宫A区</option>
          <option>迷宫B区</option>
          <option>高位C区</option>
          <option>高位D区</option>
        </select>
      </div>
      <div>
        <label>品种</label>
        <input v-model="form.variety" placeholder="例如：红颜" />
      </div>
      <div>
        <label>预计采收日期</label>
        <input v-model="form.harvest" placeholder="2024-08-10" />
      </div>
    </form>
    <template #footer>
      <button class="btn secondary" @click="showForm = false">取消</button>
      <button class="btn" @click="saveForm">保存批次</button>
    </template>
  </BaseModal>

  <BaseModal :show="showProgress" title="报表生成进度" @close="closeProgress">
    <p style="margin-bottom: 12px;">正在汇总历史数据与产量统计...</p>
    <div class="progress">
      <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
    </div>
    <p style="margin-top: 12px; color: #5a6b8c;">完成率 {{ progress }}%</p>
    <template #footer>
      <button class="btn" @click="closeProgress">完成</button>
    </template>
  </BaseModal>

  <BaseModal :show="showInfo" title="按钮提示" @close="showInfo = false">
    <p>{{ infoText }}</p>
    <template #footer>
      <button class="btn" @click="showInfo = false">我知道了</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const batches = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  code: `BCH-${String(index + 1).padStart(3, '0')}`,
  zone: index % 2 === 0 ? '迷宫A区' : '高位C区',
  variety: index % 3 === 0 ? '红颜' : '章姬',
  start: `2024-03-${String(index + 1).padStart(2, '0')}`,
  harvest: `2024-07-${String(10 + (index % 10)).padStart(2, '0')}`,
  status: index % 4 === 0 ? '进行中' : '待采收'
}))

const showForm = ref(false)
const showProgress = ref(false)
const showInfo = ref(false)
const infoText = ref('')
const progress = ref(0)
let progressTimer

const form = reactive({
  name: '夏季高位批次',
  zone: '高位C区',
  variety: '红颜',
  harvest: '2024-08-10'
})

const openForm = () => {
  showForm.value = true
}

const saveForm = () => {
  infoText.value = `批次 ${form.name} 已加入 ${form.zone}，预计采收 ${form.harvest}。`
  showForm.value = false
  showInfo.value = true
}

const openProgress = () => {
  showProgress.value = true
  progress.value = 0
  if (progressTimer) clearInterval(progressTimer)
  progressTimer = setInterval(() => {
    progress.value = Math.min(progress.value + 15, 100)
    if (progress.value === 100) clearInterval(progressTimer)
  }, 240)
}

const closeProgress = () => {
  showProgress.value = false
  if (progressTimer) clearInterval(progressTimer)
}

const openInfo = () => {
  infoText.value = '系统自动整理批次与历史数据，生成产量、成本与质量统计。'
  showInfo.value = true
}

const openRow = (item) => {
  infoText.value = `${item.code} 当前状态 ${item.status}，品种 ${item.variety}。`
  showInfo.value = true
}

onBeforeUnmount(() => {
  if (progressTimer) clearInterval(progressTimer)
})
</script>

<style scoped>
.actions-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.metric {
  background: #f7f9ff;
  border-radius: 14px;
  padding: 14px;
}

.metric h4 {
  font-size: 13px;
  color: #5a6b8c;
}

.metric p {
  font-size: 18px;
  font-weight: 700;
  margin-top: 6px;
}
</style>
