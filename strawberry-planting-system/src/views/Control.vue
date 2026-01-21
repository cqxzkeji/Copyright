<template>
  <div class="card">
    <div class="section-title">智能联动控制策略</div>
    <div class="actions-row">
      <button class="btn" @click="openForm">新增联动策略</button>
      <button class="btn secondary" @click="openProgress">执行分区联动</button>
      <button class="btn ghost" @click="openInfo">按钮提示</button>
    </div>
    <div class="grid grid-3" style="margin-top: 16px;">
      <div class="metric">
        <h4>通风设备</h4>
        <p>已启用 12 台</p>
      </div>
      <div class="metric">
        <h4>补光设备</h4>
        <p>计划开启 8 组</p>
      </div>
      <div class="metric">
        <h4>灌溉施肥</h4>
        <p>执行中 4 区</p>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top: 20px;">
    <div class="section-title">联动策略列表</div>
    <table class="table">
      <thead>
        <tr>
          <th>策略编号</th>
          <th>区域</th>
          <th>触发条件</th>
          <th>执行设备</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in strategies" :key="item.id">
          <td>{{ item.code }}</td>
          <td>{{ item.zone }}</td>
          <td>{{ item.rule }}</td>
          <td>{{ item.device }}</td>
          <td><span class="badge">{{ item.status }}</span></td>
          <td>
            <button class="btn ghost" @click="openRow(item)">查看</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal :show="showForm" title="新增联动策略" @close="showForm = false">
    <form class="form-grid">
      <div>
        <label>策略名称</label>
        <input v-model="form.name" placeholder="请输入策略名称" />
      </div>
      <div>
        <label>执行区域</label>
        <select v-model="form.zone">
          <option>迷宫A区</option>
          <option>迷宫B区</option>
          <option>高位C区</option>
          <option>高位D区</option>
        </select>
      </div>
      <div>
        <label>触发条件</label>
        <input v-model="form.rule" placeholder="温度>24℃ 或 湿度<60%" />
      </div>
      <div>
        <label>执行设备</label>
        <input v-model="form.device" placeholder="通风 + 喷淋 + 补光" />
      </div>
    </form>
    <template #footer>
      <button class="btn secondary" @click="showForm = false">取消</button>
      <button class="btn" @click="saveForm">保存策略</button>
    </template>
  </BaseModal>

  <BaseModal :show="showProgress" title="执行联动进度" @close="closeProgress">
    <p style="margin-bottom: 12px;">正在同步各区域设备状态...</p>
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

const strategies = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  code: `CTL-${String(index + 1).padStart(3, '0')}`,
  zone: index % 2 === 0 ? '迷宫B区' : '高位D区',
  rule: index % 3 === 0 ? '温度>24℃' : '湿度<62%',
  device: index % 2 === 0 ? '通风 + 喷雾' : '补光 + 滴灌',
  status: index % 4 === 0 ? '待执行' : '运行中'
}))

const showForm = ref(false)
const showProgress = ref(false)
const showInfo = ref(false)
const infoText = ref('')
const progress = ref(0)
let progressTimer

const form = reactive({
  name: '高温联动策略',
  zone: '迷宫B区',
  rule: '温度>24℃',
  device: '通风 + 喷雾'
})

const openForm = () => {
  showForm.value = true
}

const saveForm = () => {
  infoText.value = `策略 ${form.name} 已应用至 ${form.zone}`
  showForm.value = false
  showInfo.value = true
}

const openProgress = () => {
  showProgress.value = true
  progress.value = 0
  if (progressTimer) clearInterval(progressTimer)
  progressTimer = setInterval(() => {
    progress.value = Math.min(progress.value + 10, 100)
    if (progress.value === 100) clearInterval(progressTimer)
  }, 280)
}

const closeProgress = () => {
  showProgress.value = false
  if (progressTimer) clearInterval(progressTimer)
}

const openInfo = () => {
  infoText.value = '系统将根据阈值自动联动通风、补光、灌溉与施肥设备。'
  showInfo.value = true
}

const openRow = (item) => {
  infoText.value = `${item.code} 在 ${item.zone} 触发条件：${item.rule}。`
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
