<template>
  <div class="page">
    <section class="action-bar">
      <button class="button primary" @click="openModal('params')">系统参数设置</button>
      <button class="button" @click="openModal('schedule')">自动化任务调度</button>
      <button class="button" @click="openModal('backup')">数据备份与恢复</button>
      <button class="button" @click="openModal('upgrade')">系统升级维护</button>
      <button class="button" @click="openModal('feedback')">用户反馈处理</button>
      <button class="button ghost" @click="openModal('progress')">任务进度</button>
    </section>

    <section class="grid">
      <div class="card">
        <h3>运维任务状态</h3>
        <div class="chart">
          <div v-for="item in taskChart" :key="item.label" class="bar">
            <span>{{ item.label }}</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: item.value + '%' }"></div>
            </div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>系统运行摘要</h3>
        <ul class="summary-list">
          <li>备份完成率：{{ summary.backup }}%</li>
          <li>自动化任务：{{ summary.tasks }} 项</li>
          <li>待处理反馈：{{ summary.feedback }} 条</li>
          <li>升级窗口：{{ summary.upgrade }}</li>
          <li>告警事件：{{ summary.alert }} 次</li>
        </ul>
      </div>
    </section>

    <section class="card">
      <div class="table-header">
        <h3>系统维护记录</h3>
        <span>共 {{ records.length }} 条数据</span>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>维护事项</th>
              <th>负责人</th>
              <th>计划时间</th>
              <th>状态</th>
              <th>影响范围</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in records" :key="record.id">
              <td>{{ record.id }}</td>
              <td>{{ record.task }}</td>
              <td>{{ record.owner }}</td>
              <td>{{ record.time }}</td>
              <td>{{ record.status }}</td>
              <td>{{ record.scope }}</td>
              <td>{{ record.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <ModalDialog :show="modalOpen" :title="modalTitle" @close="closeModal">
      <template v-if="activeModal === 'params'">
        <p>调整系统参数并应用到全局。</p>
        <div class="form-grid">
          <label>通知频率<select v-model="form.notify"><option>实时</option><option>每小时</option><option>每日</option></select></label>
          <label>数据保留<select v-model="form.retention"><option>2年</option><option>5年</option><option>永久</option></select></label>
          <label>默认语言<select v-model="form.language"><option>中文</option><option>英文</option></select></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'schedule'">
        <p>配置自动化任务调度规则。</p>
        <div class="form-grid">
          <label>任务类型<select v-model="form.taskType"><option>自动提醒</option><option>报告生成</option><option>监控巡检</option></select></label>
          <label>执行时间<input v-model="form.time" placeholder="08:00" /></label>
          <label>重复周期<select v-model="form.cycle"><option>每日</option><option>每周</option><option>每月</option></select></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'backup'">
        <p>发起数据备份或恢复任务。</p>
        <div class="form-grid">
          <label>备份位置<input v-model="form.location" placeholder="/backup/2024" /></label>
          <label>备份类型<select v-model="form.backupType"><option>全量</option><option>增量</option><option>配置</option></select></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'upgrade'">
        <p>安排系统升级窗口并记录日志。</p>
        <div class="form-grid">
          <label>升级版本<input v-model="form.version" placeholder="v3.2.2" /></label>
          <label>维护窗口<select v-model="form.window"><option>周末夜间</option><option>工作日中午</option><option>节假日</option></select></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'feedback'">
        <p>处理用户反馈并设定优先级。</p>
        <div class="form-grid">
          <label>反馈编号<input v-model="form.feedback" placeholder="FB-2024-01" /></label>
          <label>优先级<select v-model="form.priority"><option>高</option><option>中</option><option>低</option></select></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'progress'">
        <p>系统维护任务正在执行。</p>
        <progress class="progress" :value="progress" max="100"></progress>
        <span>完成度：{{ progress }}%</span>
      </template>
      <template #footer>
        <button class="button ghost" type="button" @click="closeModal">取消</button>
        <button class="button primary" type="button" @click="submitModal">确认</button>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const records = ref([
  { id: 'SC-001', task: '参数安全校验', owner: '刘欣', time: '今日 09:00', status: '已完成', scope: '全系统', note: '通过' },
  { id: 'SC-002', task: '自动提醒任务更新', owner: '王晨', time: '今日 10:00', status: '进行中', scope: '通知中心', note: '等待核验' },
  { id: 'SC-003', task: '备份校验', owner: '孙晴', time: '今日 11:00', status: '已完成', scope: '数据库', note: '成功' },
  { id: 'SC-004', task: '系统升级窗口评估', owner: '杜晨', time: '今日 13:00', status: '待执行', scope: '核心服务', note: '计划中' },
  { id: 'SC-005', task: '日志清理', owner: '彭珊', time: '今日 14:00', status: '已完成', scope: '审计模块', note: '释放空间' },
  { id: 'SC-006', task: '权限策略同步', owner: '郑浩', time: '今日 15:00', status: '进行中', scope: '权限中心', note: '同步中' },
  { id: 'SC-007', task: '备份恢复演练', owner: '李晴', time: '今日 16:00', status: '待执行', scope: '数据库', note: '准备中' },
  { id: 'SC-008', task: '系统健康巡检', owner: '刘欣', time: '昨日 09:00', status: '已完成', scope: '全系统', note: '正常' },
  { id: 'SC-009', task: '报告生成任务调度', owner: '王晨', time: '昨日 10:00', status: '已完成', scope: '报告中心', note: '正常' },
  { id: 'SC-010', task: '用户反馈回访', owner: '孙晴', time: '昨日 11:00', status: '进行中', scope: '服务中心', note: '处理中' },
  { id: 'SC-011', task: '配置备份', owner: '杜晨', time: '昨日 12:00', status: '已完成', scope: '配置中心', note: '成功' },
  { id: 'SC-012', task: '安全补丁验证', owner: '彭珊', time: '昨日 13:00', status: '待执行', scope: '安全模块', note: '评估中' },
  { id: 'SC-013', task: '监控告警升级', owner: '郑浩', time: '昨日 14:00', status: '已完成', scope: '监控中心', note: '完成' },
  { id: 'SC-014', task: '日志归档', owner: '李晴', time: '昨日 15:00', status: '已完成', scope: '审计模块', note: '归档成功' },
  { id: 'SC-015', task: '系统升级预演', owner: '刘欣', time: '昨日 16:00', status: '进行中', scope: '核心服务', note: '稳定' },
  { id: 'SC-016', task: '自动化脚本优化', owner: '王晨', time: '昨日 17:00', status: '待执行', scope: '任务中心', note: '排期中' },
  { id: 'SC-017', task: '备份链路检查', owner: '孙晴', time: '昨日 18:00', status: '已完成', scope: '数据库', note: '正常' },
  { id: 'SC-018', task: '用户反馈复盘', owner: '杜晨', time: '昨日 19:00', status: '进行中', scope: '服务中心', note: '分析中' },
  { id: 'SC-019', task: '接口性能优化', owner: '彭珊', time: '昨日 20:00', status: '待执行', scope: '接口层', note: '排期中' },
  { id: 'SC-020', task: '任务调度策略回滚', owner: '郑浩', time: '昨日 21:00', status: '已完成', scope: '任务中心', note: '完成' },
  { id: 'SC-021', task: '升级日志归档', owner: '李晴', time: '昨日 22:00', status: '已完成', scope: '核心服务', note: '归档' }
])

const taskChart = [
  { label: '已完成', value: 62 },
  { label: '进行中', value: 23 },
  { label: '待执行', value: 15 }
]

const summary = {
  backup: 96,
  tasks: 18,
  feedback: 7,
  upgrade: '本周六 23:00',
  alert: 2
}

const activeModal = ref('')
const modalOpen = computed(() => Boolean(activeModal.value))
const progress = ref(64)

const form = reactive({
  notify: '实时',
  retention: '5年',
  language: '中文',
  taskType: '自动提醒',
  time: '08:00',
  cycle: '每日',
  location: '',
  backupType: '全量',
  version: '',
  window: '周末夜间',
  feedback: '',
  priority: '中'
})

const modalTitle = computed(() => {
  const titles = {
    params: '系统参数设置',
    schedule: '自动化任务调度',
    backup: '数据备份与恢复',
    upgrade: '系统升级与维护日志',
    feedback: '用户反馈与问题处理',
    progress: '维护任务进度'
  }
  return titles[activeModal.value] || ''
})

const openModal = (type) => {
  activeModal.value = type
}

const closeModal = () => {
  activeModal.value = ''
}

const submitModal = () => {
  if (activeModal.value === 'progress') {
    progress.value = Math.min(progress.value + 8, 100)
  }
  closeModal()
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.action-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.button {
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  background: #e2e8f0;
  color: #1f2937;
  cursor: pointer;
}

.button.primary {
  background: #4f46e5;
  color: #fff;
}

.button.ghost {
  background: #dbeafe;
  color: #1d4ed8;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bar {
  display: grid;
  grid-template-columns: 80px 1fr 60px;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}

.bar-track {
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
}

.bar-fill {
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, #38bdf8, #6366f1);
}

.summary-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 14px;
  color: #334155;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.table-wrapper {
  overflow: auto;
}

th,
 td {
  padding: 12px 10px;
  text-align: left;
  font-size: 13px;
  border-bottom: 1px solid #e2e8f0;
}

th {
  background: #f8fafc;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.form-grid input,
.form-grid select {
  padding: 8px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
}

.progress {
  width: 100%;
  height: 18px;
}
</style>
