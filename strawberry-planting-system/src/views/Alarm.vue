<template>
  <div class="card">
    <div class="section-title">异常预警管理</div>
    <div class="actions-row">
      <button class="btn" @click="openForm">新建预警规则</button>
      <button class="btn secondary" @click="openProgress">批量确认</button>
      <button class="btn ghost" @click="openInfo">按钮提示</button>
    </div>
    <div class="grid grid-3" style="margin-top: 16px;">
      <div class="metric">
        <h4>今日告警</h4>
        <p>6 条</p>
      </div>
      <div class="metric">
        <h4>处理中</h4>
        <p>2 条</p>
      </div>
      <div class="metric">
        <h4>设备异常</h4>
        <p>1 条</p>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top: 20px;">
    <div class="section-title">告警记录</div>
    <table class="table">
      <thead>
        <tr>
          <th>告警编号</th>
          <th>区域</th>
          <th>类型</th>
          <th>等级</th>
          <th>状态</th>
          <th>时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in alarms" :key="item.id">
          <td>{{ item.code }}</td>
          <td>{{ item.zone }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.level }}</td>
          <td><span class="badge">{{ item.status }}</span></td>
          <td>{{ item.time }}</td>
          <td>
            <button class="btn ghost" @click="openRow(item)">处理</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal :show="showForm" title="新建预警规则" @close="showForm = false">
    <form class="form-grid">
      <div>
        <label>规则名称</label>
        <input v-model="form.name" placeholder="请输入规则名称" />
      </div>
      <div>
        <label>监测区域</label>
        <select v-model="form.zone">
          <option>迷宫A区</option>
          <option>迷宫B区</option>
          <option>高位C区</option>
          <option>高位D区</option>
        </select>
      </div>
      <div>
        <label>阈值条件</label>
        <input v-model="form.rule" placeholder="CO₂ > 900ppm" />
      </div>
      <div>
        <label>响应方式</label>
        <input v-model="form.action" placeholder="短信 + 系统通知" />
      </div>
    </form>
    <template #footer>
      <button class="btn secondary" @click="showForm = false">取消</button>
      <button class="btn" @click="saveForm">保存规则</button>
    </template>
  </BaseModal>

  <BaseModal :show="showProgress" title="批量确认进度" @close="closeProgress">
    <p style="margin-bottom: 12px;">正在确认已处理告警，请稍候...</p>
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

const alarms = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  code: `AL-${String(index + 1).padStart(3, '0')}`,
  zone: index % 2 === 0 ? '迷宫B区' : '高位D区',
  type: index % 3 === 0 ? '温度超限' : '设备离线',
  level: index % 2 === 0 ? '高' : '中',
  status: index % 4 === 0 ? '处理中' : '待确认',
  time: `2024-05-1${index % 9} 1${index % 6}:20`
}))

const showForm = ref(false)
const showProgress = ref(false)
const showInfo = ref(false)
const infoText = ref('')
const progress = ref(0)
let progressTimer

const form = reactive({
  name: 'CO₂超限告警',
  zone: '迷宫B区',
  rule: 'CO₂ > 900ppm',
  action: '短信 + 系统通知'
})

const openForm = () => {
  showForm.value = true
}

const saveForm = () => {
  infoText.value = `规则 ${form.name} 已部署到 ${form.zone}。`
  showForm.value = false
  showInfo.value = true
}

const openProgress = () => {
  showProgress.value = true
  progress.value = 0
  if (progressTimer) clearInterval(progressTimer)
  progressTimer = setInterval(() => {
    progress.value = Math.min(progress.value + 14, 100)
    if (progress.value === 100) clearInterval(progressTimer)
  }, 240)
}

const closeProgress = () => {
  showProgress.value = false
  if (progressTimer) clearInterval(progressTimer)
}

const openInfo = () => {
  infoText.value = '告警将记录处理过程并同步设备维护人员。'
  showInfo.value = true
}

const openRow = (item) => {
  infoText.value = `${item.code} 位于 ${item.zone}，当前状态：${item.status}。`
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
