<template>
  <div class="page">
    <section class="panel">
      <div class="panel-header">
        <h2>智能报告中心</h2>
        <div class="actions">
          <button class="btn" type="button" @click="openReport">生成报告</button>
          <button class="btn primary" type="button" @click="openDashboard">刷新仪表盘</button>
          <button class="btn ghost" type="button" @click="openNotice">发布提醒</button>
        </div>
      </div>
      <div class="dashboard">
        <div class="metric" v-for="item in metrics" :key="item.title">
          <div class="metric-title">{{ item.title }}</div>
          <div class="metric-value">{{ item.value }}</div>
          <div class="metric-note">{{ item.note }}</div>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h2>报告输出记录</h2>
        <div class="tag">最近 30 天</div>
      </div>
      <div class="chart">
        <div class="line" v-for="point in reportTrend" :key="point.day" :style="{ height: point.value + '%' }">
          <span>{{ point.day }}</span>
        </div>
      </div>
      <div class="table">
        <div class="table-row table-head">
          <span>报告编号</span>
          <span>类型</span>
          <span>覆盖模块</span>
          <span>负责人</span>
          <span>生成时间</span>
          <span>状态</span>
        </div>
        <div v-for="row in reports" :key="row.id" class="table-row">
          <span>{{ row.id }}</span>
          <span>{{ row.type }}</span>
          <span>{{ row.scope }}</span>
          <span>{{ row.owner }}</span>
          <span>{{ row.time }}</span>
          <span>{{ row.status }}</span>
        </div>
      </div>
    </section>

    <BaseModal
      :open="modal.report"
      title="生成智能报告"
      primary-text="立即生成"
      @close="closeModals"
      @confirm="confirmReport"
    >
      <label class="field">
        报告类型
        <select v-model="reportForm.type">
          <option>销售预测分析</option>
          <option>技术标准更新</option>
          <option>客户需求洞察</option>
        </select>
      </label>
      <label class="field">
        时间范围
        <input v-model="reportForm.range" type="text" placeholder="2024年Q2" />
      </label>
      <label class="field">
        输出格式
        <select v-model="reportForm.format">
          <option>PDF</option>
          <option>Excel</option>
          <option>在线链接</option>
        </select>
      </label>
    </BaseModal>

    <BaseModal
      :open="modal.dashboard"
      title="仪表盘刷新中"
      :show-footer="false"
      @close="closeModals"
    >
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <div>数据同步进度：{{ progress }}%</div>
      <button class="btn primary" type="button" @click="finishDashboard">完成刷新</button>
    </BaseModal>

    <BaseModal
      :open="modal.notice"
      title="发布提示"
      primary-text="确认发布"
      @close="closeModals"
      @confirm="closeModals"
    >
      <p>将通知销售与技术团队：本周预测需求上升 15%。</p>
      <p>系统已准备推送通知与邮件提醒。</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const metrics = [
  { title: '本周报告生成', value: '18 份', note: '覆盖 5 大模块' },
  { title: '数据同步频次', value: '每 30 分钟', note: 'ERP/CRM 共享' },
  { title: '风险提示', value: '7 条', note: '材料供应预警' },
  { title: '可视化仪表盘', value: '实时刷新', note: '支持跨端查看' }
]

const reportTrend = [
  { day: '周一', value: 40 },
  { day: '周二', value: 55 },
  { day: '周三', value: 68 },
  { day: '周四', value: 62 },
  { day: '周五', value: 78 },
  { day: '周六', value: 85 },
  { day: '周日', value: 70 }
]

const reports = [
  { id: 'RP-24001', type: '销售预测', scope: '销售分析', owner: '陈萍', time: '2024-06-01', status: '已发布' },
  { id: 'RP-24002', type: '标准更新', scope: '技术标准', owner: '刘伟', time: '2024-06-02', status: '已发布' },
  { id: 'RP-24003', type: '客户洞察', scope: '需求分析', owner: '赵凯', time: '2024-06-03', status: '已发布' },
  { id: 'RP-24004', type: '逆向推导', scope: '模型算法', owner: '王楠', time: '2024-06-04', status: '已发布' },
  { id: 'RP-24005', type: '销售预测', scope: '销售分析', owner: '周敏', time: '2024-06-05', status: '已发布' },
  { id: 'RP-24006', type: '趋势专题', scope: '可视化', owner: '孙杰', time: '2024-06-06', status: '已发布' },
  { id: 'RP-24007', type: '客户洞察', scope: '需求分析', owner: '郑蕾', time: '2024-06-07', status: '已发布' },
  { id: 'RP-24008', type: '标准更新', scope: '技术标准', owner: '秦俊', time: '2024-06-08', status: '已发布' },
  { id: 'RP-24009', type: '销售预测', scope: '销售分析', owner: '宋婷', time: '2024-06-09', status: '已发布' },
  { id: 'RP-24010', type: '逆向推导', scope: '模型算法', owner: '朱哲', time: '2024-06-10', status: '已发布' },
  { id: 'RP-24011', type: '趋势专题', scope: '可视化', owner: '沈毅', time: '2024-06-11', status: '已发布' },
  { id: 'RP-24012', type: '客户洞察', scope: '需求分析', owner: '冯柳', time: '2024-06-12', status: '已发布' },
  { id: 'RP-24013', type: '标准更新', scope: '技术标准', owner: '杜晨', time: '2024-06-13', status: '已发布' },
  { id: 'RP-24014', type: '销售预测', scope: '销售分析', owner: '顾宁', time: '2024-06-14', status: '已发布' },
  { id: 'RP-24015', type: '客户洞察', scope: '需求分析', owner: '任洋', time: '2024-06-15', status: '已发布' },
  { id: 'RP-24016', type: '趋势专题', scope: '可视化', owner: '文彬', time: '2024-06-16', status: '已发布' },
  { id: 'RP-24017', type: '逆向推导', scope: '模型算法', owner: '王峥', time: '2024-06-17', status: '已发布' },
  { id: 'RP-24018', type: '标准更新', scope: '技术标准', owner: '严峰', time: '2024-06-18', status: '已发布' },
  { id: 'RP-24019', type: '销售预测', scope: '销售分析', owner: '戴宁', time: '2024-06-19', status: '已发布' },
  { id: 'RP-24020', type: '客户洞察', scope: '需求分析', owner: '江澜', time: '2024-06-20', status: '已发布' },
  { id: 'RP-24021', type: '逆向推导', scope: '模型算法', owner: '卢琳', time: '2024-06-21', status: '已发布' },
  { id: 'RP-24022', type: '趋势专题', scope: '可视化', owner: '徐峰', time: '2024-06-22', status: '已发布' }
]

const modal = reactive({
  report: false,
  dashboard: false,
  notice: false
})

const reportForm = reactive({
  type: '销售预测分析',
  range: '',
  format: 'PDF'
})

const progress = ref(44)
let timer

const openReport = () => {
  modal.report = true
}

const openDashboard = () => {
  modal.dashboard = true
  progress.value = 44
  clearInterval(timer)
  timer = setInterval(() => {
    progress.value = Math.min(progress.value + 13, 100)
    if (progress.value === 100) {
      clearInterval(timer)
    }
  }, 360)
}

const openNotice = () => {
  modal.notice = true
}

const closeModals = () => {
  modal.report = false
  modal.dashboard = false
  modal.notice = false
}

const confirmReport = () => {
  closeModals()
}

const finishDashboard = () => {
  progress.value = 100
}
</script>

<style scoped>
.page {
  display: grid;
  gap: 24px;
}

.panel {
  background: #ffffff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(148, 163, 184, 0.16);
  display: grid;
  gap: 16px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  cursor: pointer;
}

.btn.primary {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
}

.btn.ghost {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #2563eb;
}

.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.metric {
  background: #f8fafc;
  border-radius: 14px;
  padding: 16px;
}

.metric-title {
  font-size: 13px;
  color: #64748b;
}

.metric-value {
  font-size: 22px;
  font-weight: 700;
  margin: 8px 0;
}

.metric-note {
  font-size: 12px;
  color: #94a3b8;
}

.chart {
  height: 180px;
  display: flex;
  align-items: flex-end;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
}

.line {
  flex: 1;
  background: linear-gradient(180deg, #86efac, #22c55e);
  border-radius: 10px 10px 4px 4px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  color: #ffffff;
  font-size: 12px;
  padding-bottom: 6px;
}

.table {
  display: grid;
  gap: 8px;
}

.table-row {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 13px;
}

.table-head {
  background: #e2e8f0;
  font-weight: 600;
}

.tag {
  background: #dbeafe;
  color: #1d4ed8;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.field {
  display: grid;
  gap: 6px;
}

input,
select {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 10px;
  background: #f8fafc;
}

.progress {
  width: 100%;
  background: #e2e8f0;
  border-radius: 999px;
  height: 12px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #2563eb);
  transition: width 0.3s ease;
}
</style>
