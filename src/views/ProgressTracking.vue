<template>
  <div class="module">
    <div class="header">
      <div>
        <h3>再开发过程进度追踪</h3>
        <p class="muted">关键节点进度实时更新，延误自动预警</p>
      </div>
      <div class="actions">
        <button class="primary-btn" @click="openUpdateModal">更新进度</button>
        <button class="secondary-btn" @click="openWarning">查看预警</button>
      </div>
    </div>

    <div class="card">
      <div class="card-head">
        <strong>关键节点看板</strong>
        <span class="badge" style="background:#dcfce7">已跟踪 {{ nodes.length }} 项</span>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>项目</th>
            <th>节点</th>
            <th>计划日期</th>
            <th>实际完成</th>
            <th>进度</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="node in nodes" :key="node.project + node.title">
            <td>{{ node.project }}</td>
            <td>{{ node.title }}</td>
            <td>{{ node.plan }}</td>
            <td>{{ node.actual || '进行中' }}</td>
            <td>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: node.progress + '%', background: progressColor(node.progress) }"></div>
              </div>
              <small class="muted">{{ node.progress }}%</small>
            </td>
            <td class="table-actions">
              <button class="secondary-btn" @click="openUpdateModal(node)">填报</button>
              <button class="primary-btn" @click="openReminder(node)">提醒</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card-grid">
      <div class="card">
        <div class="card-head">
          <strong>进度预警</strong>
          <button class="secondary-btn" @click="openWarning">发送预警</button>
        </div>
        <ul class="doc-list">
          <li v-for="warn in warnings" :key="warn.title">
            <div>
              <div class="doc-title">{{ warn.title }}</div>
              <div class="muted">{{ warn.msg }}</div>
            </div>
            <button class="primary-btn" @click="openReminder(warn)">催办</button>
          </li>
        </ul>
      </div>
      <div class="card">
        <div class="card-head">
          <strong>进度条形图</strong>
        </div>
        <div class="chart">
          <div v-for="node in nodes" :key="node.title" class="bar-row">
            <span>{{ node.project }}</span>
            <div class="bar-shell">
              <div class="bar-fill" :style="{ width: node.progress + '%', background: progressColor(node.progress) }"></div>
            </div>
            <span class="muted">{{ node.progress }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showUpdate" class="modal-mask" @click.self="showUpdate=false">
      <div class="modal-container">
        <div class="modal-header">
          <span>更新进度</span>
          <button class="secondary-btn" @click="showUpdate=false">关闭</button>
        </div>
        <label>项目<select v-model="updateForm.project" class="input">
          <option v-for="node in nodes" :key="node.project">{{ node.project }}</option>
        </select></label>
        <label>节点名称<input v-model="updateForm.title" class="input" /></label>
        <label>当前进度<input type="number" v-model.number="updateForm.progress" class="input" min="0" max="100" /></label>
        <button class="primary-btn" style="margin-top:12px" @click="saveUpdate">提交更新</button>
      </div>
    </div>

    <div v-if="showInfo" class="modal-mask" @click.self="showInfo=false">
      <div class="modal-container">
        <div class="modal-header">
          <span>提醒信息</span>
          <button class="secondary-btn" @click="showInfo=false">关闭</button>
        </div>
        <p class="muted">{{ infoMsg }}</p>
        <div class="progress-bar" style="margin-top:10px">
          <div class="progress-fill" style="width:70%"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const nodes = reactive([
  { project: '滨江活力更新单元', title: '控规批前公示', plan: '2024-06-15', actual: '', progress: 68 },
  { project: '轨交枢纽综合体', title: '施工图审查', plan: '2024-06-08', actual: '2024-05-30', progress: 92 },
  { project: '老城肌理修复', title: '资金拨付批次2', plan: '2024-06-20', actual: '', progress: 40 },
  { project: '智慧生态科创谷', title: '桩基完成', plan: '2024-06-05', actual: '2024-05-25', progress: 100 },
  { project: '滨水居住品质提升', title: '安置补偿签约', plan: '2024-06-30', actual: '', progress: 25 }
])

const warnings = reactive([
  { title: '老城肌理修复 节点延误', msg: '资金拨付批次2落后计划 8 天，请财审与项目公司对齐付款。' },
  { title: '滨水居住品质提升 节点风险', msg: '安置签约完成率仅 25%，需安排街道集中签约周。' },
  { title: '轨交枢纽综合体 资料缺失', msg: '施工图审查补充消防专项意见尚未上传。' }
])

const showUpdate = ref(false)
const showInfo = ref(false)
const infoMsg = ref('')
const updateForm = reactive({ project: '滨江活力更新单元', title: '控规批前公示', progress: 60 })

const openUpdateModal = (node) => {
  showUpdate.value = true
  if (node) {
    updateForm.project = node.project
    updateForm.title = node.title
    updateForm.progress = node.progress
  }
}

const progressColor = (value) => (value >= 80 ? '#22c55e' : value >= 50 ? '#f59e0b' : '#ef4444')

const saveUpdate = () => {
  showUpdate.value = false
  infoMsg.value = `${updateForm.project} 的节点已更新为 ${updateForm.progress}%，自动同步至周报。`
  showInfo.value = true
}

const openReminder = (node) => {
  infoMsg.value = `已向 ${node.project || node.title} 责任单位推送催办提醒。`
  showInfo.value = true
}

const openWarning = () => {
  infoMsg.value = '已汇总预警，推送至项目群并同步短信。'
  showInfo.value = true
}
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.actions {
  display: flex;
  gap: 10px;
}

.chart {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bar-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  align-items: center;
  gap: 10px;
}

.bar-shell {
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
  width: 100%;
  height: 12px;
}

.bar-fill {
  height: 100%;
}
</style>
