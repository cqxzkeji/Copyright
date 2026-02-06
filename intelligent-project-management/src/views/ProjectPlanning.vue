<template>
  <div class="module">
    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>自动排期与优先级建议</h3>
          <p>基于历史交付与资源负载的智能排期结果。</p>
        </div>
        <div class="panel-actions">
          <button class="ghost-btn" @click="openSchedule">自动排期</button>
          <button class="primary-btn" @click="openTask">新增任务</button>
        </div>
      </div>
      <div class="timeline">
        <div v-for="item in schedule" :key="item.name" class="timeline-item">
          <div class="badge">{{ item.week }}</div>
          <div>
            <h4>{{ item.name }}</h4>
            <p>{{ item.desc }}</p>
          </div>
          <span class="priority">优先级：{{ item.priority }}</span>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>风险预警清单</h3>
          <p>系统实时监控的排期风险。</p>
        </div>
        <button class="outline-btn" @click="openRisk">生成预警</button>
      </div>
      <ul class="alert-list">
        <li v-for="alert in alerts" :key="alert.title">
          <span>{{ alert.title }}</span>
          <span class="tag">{{ alert.level }}</span>
        </li>
      </ul>
    </section>

    <ModalBase :show="showSchedule" title="智能排期模拟" @close="showSchedule = false">
      <p>请选择排期策略，系统将自动生成里程碑计划。</p>
      <div class="form-grid">
        <label>
          排期策略
          <select v-model="scheduleForm.strategy">
            <option>资源均衡</option>
            <option>最短工期</option>
            <option>风险最小</option>
          </select>
        </label>
        <label>
          关键里程碑数量
          <input type="number" v-model="scheduleForm.milestones" />
        </label>
      </div>
      <div class="progress">
        <div class="progress-bar" :style="{ width: scheduleProgress + '%' }"></div>
      </div>
      <p class="muted">模拟进度：{{ scheduleProgress }}%</p>
      <template #footer>
        <button class="ghost-btn" @click="showSchedule = false">取消</button>
        <button class="primary-btn" @click="advanceSchedule">继续</button>
      </template>
    </ModalBase>

    <ModalBase :show="showTask" title="新增任务" @close="showTask = false">
      <div class="form-grid">
        <label>
          任务名称
          <input v-model="taskForm.name" placeholder="请输入任务名称" />
        </label>
        <label>
          负责人
          <input v-model="taskForm.owner" placeholder="请输入负责人" />
        </label>
        <label>
          优先级
          <select v-model="taskForm.priority">
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select>
        </label>
        <label>
          预计周期
          <input v-model="taskForm.cycle" placeholder="例如：3 周" />
        </label>
        <label class="full">
          依赖说明
          <textarea v-model="taskForm.desc" rows="3" placeholder="填写关键依赖"></textarea>
        </label>
      </div>
      <template #footer>
        <button class="ghost-btn" @click="showTask = false">取消</button>
        <button class="primary-btn" @click="saveTask">保存任务</button>
      </template>
    </ModalBase>

    <ModalBase :show="showRisk" title="排期风险预警" @close="showRisk = false">
      <p>系统检测到以下潜在风险点，请及时处理。</p>
      <ul class="risk-list">
        <li v-for="risk in risks" :key="risk">{{ risk }}</li>
      </ul>
      <template #footer>
        <button class="primary-btn" @click="showRisk = false">确认</button>
      </template>
    </ModalBase>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalBase from '../components/ModalBase.vue'

const schedule = [
  { week: '第1周', name: '需求冻结', desc: '完成需求梳理与评审', priority: '高' },
  { week: '第2周', name: '排期评审', desc: '确定里程碑与资源清单', priority: '高' },
  { week: '第3周', name: '原型验收', desc: '完成原型设计与关键评审', priority: '中' },
  { week: '第4周', name: '开发冲刺', desc: '关键模块开发与联调', priority: '中' }
]

const alerts = [
  { title: '资源占用冲突：数据平台组', level: '高' },
  { title: '需求变更未确认：AI 质检', level: '中' },
  { title: '关键节点缺少评审：流程再造', level: '中' }
]

const risks = ['关键资源冲突导致里程碑延迟', '供应商交付节点未对齐', '跨部门审批节奏偏慢']

const showSchedule = ref(false)
const showTask = ref(false)
const showRisk = ref(false)
const scheduleProgress = ref(45)

const scheduleForm = ref({
  strategy: '资源均衡',
  milestones: 6
})

const taskForm = ref({
  name: '',
  owner: '',
  priority: '高',
  cycle: '2 周',
  desc: ''
})

const openSchedule = () => {
  showSchedule.value = true
}

const advanceSchedule = () => {
  scheduleProgress.value = Math.min(100, scheduleProgress.value + 18)
}

const openTask = () => {
  showTask.value = true
}

const saveTask = () => {
  showTask.value = false
}

const openRisk = () => {
  showRisk.value = true
}
</script>

<style scoped>
.module {
  display: grid;
  gap: 20px;
}

.panel {
  background: #fff;
  padding: 20px;
  border-radius: 18px;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.panel-header h3 {
  font-size: 18px;
}

.panel-header p {
  color: #64748b;
  font-size: 13px;
}

.panel-actions {
  display: flex;
  gap: 10px;
}

.timeline {
  display: grid;
  gap: 14px;
}

.timeline-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 14px;
  align-items: center;
}

.badge {
  background: #dbeafe;
  color: #1d4ed8;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
}

.priority {
  color: #0284c7;
  font-size: 13px;
}

.alert-list {
  display: grid;
  gap: 10px;
}

.alert-list li {
  display: flex;
  justify-content: space-between;
  padding: 10px 12px;
  background: #f1f5f9;
  border-radius: 10px;
  font-size: 13px;
}

.tag {
  background: #fee2e2;
  color: #b91c1c;
  padding: 2px 8px;
  border-radius: 999px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #475569;
}

.form-grid input,
.form-grid select,
.form-grid textarea {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.form-grid .full {
  grid-column: 1 / -1;
}

.primary-btn {
  background: #2563eb;
  color: #fff;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 13px;
}

.ghost-btn {
  background: #e0f2fe;
  color: #0369a1;
  padding: 8px 14px;
  border-radius: 10px;
}

.outline-btn {
  border: 1px solid #cbd5f5;
  color: #1d4ed8;
  padding: 8px 14px;
  border-radius: 10px;
  background: #ffffff;
}

.progress {
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
  margin: 12px 0 8px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #34d399);
}

.muted {
  color: #64748b;
  font-size: 13px;
}

.risk-list {
  display: grid;
  gap: 8px;
  color: #475569;
}

@media (max-width: 768px) {
  .timeline-item {
    grid-template-columns: 1fr;
  }
}
</style>
