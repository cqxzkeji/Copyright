<template>
  <div class="dashboard">
    <section class="kpi-grid">
      <div class="kpi-card" v-for="kpi in kpis" :key="kpi.label">
        <p class="kpi-label">{{ kpi.label }}</p>
        <h2>{{ kpi.value }}</h2>
        <span class="kpi-trend">{{ kpi.trend }}</span>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>项目健康趋势</h3>
          <p>近六周项目健康评分趋势。</p>
        </div>
        <div class="panel-actions">
          <button class="ghost-btn" @click="openRefresh">刷新指标</button>
          <button class="primary-btn" @click="openExport">导出报表</button>
        </div>
      </div>
      <div class="chart">
        <div v-for="bar in chartData" :key="bar.week" class="bar-item">
          <div class="bar" :style="{ height: bar.score + '%' }"></div>
          <span>{{ bar.week }}</span>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>项目执行清单</h3>
          <p>已同步的重点项目进展与风险等级。</p>
        </div>
        <button class="primary-btn" @click="openCreate">新增项目</button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>项目编号</th>
              <th>项目名称</th>
              <th>负责人</th>
              <th>阶段</th>
              <th>进度</th>
              <th>风险等级</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableData" :key="row.code">
              <td>{{ row.code }}</td>
              <td>{{ row.name }}</td>
              <td>{{ row.owner }}</td>
              <td>{{ row.stage }}</td>
              <td>{{ row.progress }}%</td>
              <td>
                <span :class="['risk-tag', row.risk]">{{ row.riskLabel }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <ModalBase :show="showCreate" title="新增项目" @close="showCreate = false">
      <div class="form-grid">
        <label>
          项目名称
          <input v-model="createForm.name" placeholder="请输入项目名称" />
        </label>
        <label>
          负责人
          <input v-model="createForm.owner" placeholder="请输入负责人" />
        </label>
        <label>
          计划周期
          <select v-model="createForm.cycle">
            <option>8 周</option>
            <option>12 周</option>
            <option>16 周</option>
          </select>
        </label>
        <label>
          风险级别
          <select v-model="createForm.risk">
            <option>低</option>
            <option>中</option>
            <option>高</option>
          </select>
        </label>
        <label class="full">
          项目描述
          <textarea v-model="createForm.desc" rows="3" placeholder="请输入项目目标与交付"></textarea>
        </label>
      </div>
      <template #footer>
        <button class="ghost-btn" @click="showCreate = false">取消</button>
        <button class="primary-btn" @click="submitCreate">保存</button>
      </template>
    </ModalBase>

    <ModalBase :show="showExport" title="导出报表" @close="showExport = false">
      <p>请选择需要导出的内容，系统将生成 PDF 报告。</p>
      <div class="form-grid">
        <label class="full">
          报告范围
          <select v-model="exportForm.scope">
            <option>本周全部项目</option>
            <option>高风险项目</option>
            <option>指定业务线</option>
          </select>
        </label>
        <label>
          业务线
          <input v-model="exportForm.line" placeholder="例如：数字化运营" />
        </label>
        <label>
          接收邮箱
          <input v-model="exportForm.email" placeholder="负责人邮箱" />
        </label>
      </div>
      <template #footer>
        <button class="ghost-btn" @click="showExport = false">取消</button>
        <button class="primary-btn" @click="confirmExport">确认导出</button>
      </template>
    </ModalBase>

    <ModalBase :show="showRefresh" title="指标刷新进度" @close="showRefresh = false">
      <p>正在同步最新监控数据，请稍候。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: refreshProgress + '%' }"></div>
      </div>
      <p class="muted">同步进度：{{ refreshProgress }}%</p>
      <template #footer>
        <button class="ghost-btn" @click="showRefresh = false">稍后再看</button>
        <button class="primary-btn" @click="increaseProgress">继续同步</button>
      </template>
    </ModalBase>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalBase from '../components/ModalBase.vue'

const kpis = [
  { label: '本周新增项目', value: '18', trend: '↑ 12%' },
  { label: '资源利用率', value: '87%', trend: '↑ 3%' },
  { label: '高风险预警', value: '5', trend: '↓ 2' },
  { label: '预算执行率', value: '92%', trend: '↑ 4%' }
]

const chartData = [
  { week: 'W1', score: 62 },
  { week: 'W2', score: 74 },
  { week: 'W3', score: 68 },
  { week: 'W4', score: 80 },
  { week: 'W5', score: 73 },
  { week: 'W6', score: 85 }
]

const tableData = [
  { code: 'PRJ-001', name: '智慧工厂升级', owner: '王晨', stage: '执行', progress: 78, risk: 'low', riskLabel: '低' },
  { code: 'PRJ-002', name: '供应链协同平台', owner: '刘洋', stage: '执行', progress: 64, risk: 'medium', riskLabel: '中' },
  { code: 'PRJ-003', name: '客户画像优化', owner: '李玥', stage: '规划', progress: 35, risk: 'low', riskLabel: '低' },
  { code: 'PRJ-004', name: '云资源整合', owner: '陈曦', stage: '执行', progress: 58, risk: 'high', riskLabel: '高' },
  { code: 'PRJ-005', name: '数据中台迭代', owner: '张航', stage: '收尾', progress: 92, risk: 'low', riskLabel: '低' },
  { code: 'PRJ-006', name: '设备预测维护', owner: '宋佳', stage: '执行', progress: 70, risk: 'medium', riskLabel: '中' },
  { code: 'PRJ-007', name: '智慧园区建设', owner: '林涛', stage: '执行', progress: 61, risk: 'medium', riskLabel: '中' },
  { code: 'PRJ-008', name: '营销自动化', owner: '杨雪', stage: '规划', progress: 28, risk: 'low', riskLabel: '低' },
  { code: 'PRJ-009', name: '供应商风险评估', owner: '高宁', stage: '执行', progress: 55, risk: 'high', riskLabel: '高' },
  { code: 'PRJ-010', name: '移动办公升级', owner: '丁宁', stage: '执行', progress: 63, risk: 'low', riskLabel: '低' },
  { code: 'PRJ-011', name: '制造质量追溯', owner: '沈敏', stage: '执行', progress: 59, risk: 'medium', riskLabel: '中' },
  { code: 'PRJ-012', name: '客服智能化', owner: '谢雨', stage: '规划', progress: 42, risk: 'low', riskLabel: '低' },
  { code: 'PRJ-013', name: '项目成本优化', owner: '郭杰', stage: '执行', progress: 66, risk: 'medium', riskLabel: '中' },
  { code: 'PRJ-014', name: '设备数字孪生', owner: '邹欣', stage: '执行', progress: 51, risk: 'high', riskLabel: '高' },
  { code: 'PRJ-015', name: '智慧仓储建设', owner: '叶凡', stage: '执行', progress: 73, risk: 'medium', riskLabel: '中' },
  { code: 'PRJ-016', name: '内部流程再造', owner: '戴琪', stage: '规划', progress: 33, risk: 'low', riskLabel: '低' },
  { code: 'PRJ-017', name: '数据安全强化', owner: '周博', stage: '执行', progress: 69, risk: 'medium', riskLabel: '中' },
  { code: 'PRJ-018', name: '财务共享升级', owner: '尹芳', stage: '执行', progress: 57, risk: 'low', riskLabel: '低' },
  { code: 'PRJ-019', name: 'AI 质检平台', owner: '向前', stage: '执行', progress: 62, risk: 'medium', riskLabel: '中' },
  { code: 'PRJ-020', name: '安全合规审计', owner: '段楠', stage: '执行', progress: 47, risk: 'high', riskLabel: '高' },
  { code: 'PRJ-021', name: '综合能源管理', owner: '吴越', stage: '规划', progress: 25, risk: 'low', riskLabel: '低' },
  { code: 'PRJ-022', name: '智能排产优化', owner: '陆阳', stage: '执行', progress: 60, risk: 'medium', riskLabel: '中' }
]

const showCreate = ref(false)
const showExport = ref(false)
const showRefresh = ref(false)
const refreshProgress = ref(42)

const createForm = ref({
  name: '',
  owner: '',
  cycle: '12 周',
  risk: '中',
  desc: ''
})

const exportForm = ref({
  scope: '本周全部项目',
  line: '数字化运营',
  email: 'owner@company.com'
})

const openCreate = () => {
  showCreate.value = true
}

const submitCreate = () => {
  showCreate.value = false
}

const openExport = () => {
  showExport.value = true
}

const confirmExport = () => {
  showExport.value = false
}

const openRefresh = () => {
  showRefresh.value = true
}

const increaseProgress = () => {
  refreshProgress.value = Math.min(100, refreshProgress.value + 15)
}
</script>

<style scoped>
.dashboard {
  display: grid;
  gap: 20px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.kpi-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
}

.kpi-label {
  color: #64748b;
  font-size: 13px;
}

.kpi-card h2 {
  margin: 8px 0;
  font-size: 28px;
}

.kpi-trend {
  color: #16a34a;
  font-size: 12px;
}

.panel {
  background: #ffffff;
  border-radius: 18px;
  padding: 20px;
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

.chart {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  height: 180px;
  padding: 10px 0;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.bar {
  width: 100%;
  border-radius: 12px;
  background: linear-gradient(180deg, #60a5fa, #38bdf8);
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

thead {
  background: #f1f5f9;
  color: #475569;
}

th,
td {
  padding: 10px 12px;
  text-align: left;
}

tr:nth-child(even) {
  background: #f8fafc;
}

.risk-tag {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.risk-tag.low {
  background: #dcfce7;
  color: #15803d;
}

.risk-tag.medium {
  background: #fef9c3;
  color: #a16207;
}

.risk-tag.high {
  background: #fee2e2;
  color: #b91c1c;
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
</style>
