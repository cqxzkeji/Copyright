<template>
  <div class="page">
    <section class="action-bar">
      <button class="button primary" @click="openModal('stats')">数据统计</button>
      <button class="button" @click="openModal('trend')">趋势分析</button>
      <button class="button" @click="openModal('value')">市场价值分析</button>
      <button class="button" @click="openModal('report')">报告导出</button>
      <button class="button" @click="openModal('risk')">风险预警</button>
      <button class="button ghost" @click="openModal('progress')">预测进度</button>
    </section>

    <section class="grid">
      <div class="card">
        <h3>商标与版权趋势</h3>
        <div class="trend-chart">
          <div v-for="item in trendData" :key="item.month" class="trend-item">
            <div class="trend-bar" :style="{ height: item.value + '%' }"></div>
            <span>{{ item.month }}</span>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>指标摘要</h3>
        <ul class="summary-list">
          <li>资产总量：{{ summary.total }} 件</li>
          <li>本月新增：{{ summary.new }} 件</li>
          <li>价值提升：{{ summary.value }}%</li>
          <li>预警风险：{{ summary.risk }} 项</li>
          <li>报告待导出：{{ summary.reports }} 份</li>
        </ul>
      </div>
    </section>

    <section class="card">
      <div class="table-header">
        <h3>统计分析结果</h3>
        <span>共 {{ tableData.length }} 条数据</span>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>指标名称</th>
              <th>统计维度</th>
              <th>当前值</th>
              <th>环比变化</th>
              <th>风险等级</th>
              <th>建议动作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableData" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.metric }}</td>
              <td>{{ row.dimension }}</td>
              <td>{{ row.value }}</td>
              <td>{{ row.change }}</td>
              <td>{{ row.risk }}</td>
              <td>{{ row.action }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <ModalDialog :show="modalOpen" :title="modalTitle" @close="closeModal">
      <template v-if="activeModal === 'stats'">
        <p>选择统计范围并生成数据快照。</p>
        <div class="form-grid">
          <label>统计范围<select v-model="form.scope"><option>全部资产</option><option>商标</option><option>版权</option></select></label>
          <label>统计周期<select v-model="form.range"><option>本月</option><option>本季度</option><option>本年度</option></select></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'trend'">
        <p>设定趋势预测模型。</p>
        <div class="form-grid">
          <label>预测周期<select v-model="form.forecast"><option>3个月</option><option>6个月</option><option>12个月</option></select></label>
          <label>模型类型<select v-model="form.model"><option>平滑趋势</option><option>季节性</option><option>机器学习</option></select></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'value'">
        <p>分析商标与版权市场价值。</p>
        <div class="form-grid">
          <label>评估方法<select v-model="form.method"><option>收益法</option><option>市场法</option><option>成本法</option></select></label>
          <label>目标行业<input v-model="form.industry" placeholder="科技/文创" /></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'report'">
        <p>选择报告模板并导出。</p>
        <div class="form-grid">
          <label>报告模板<select v-model="form.template"><option>综合报告</option><option>风险报告</option><option>投资报告</option></select></label>
          <label>导出格式<select v-model="form.format"><option>PDF</option><option>Excel</option><option>在线链接</option></select></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'risk'">
        <p>配置风险评估与预警通知。</p>
        <div class="form-grid">
          <label>预警阈值<select v-model="form.threshold"><option>中风险</option><option>高风险</option><option>极高风险</option></select></label>
          <label>通知方式<select v-model="form.notify"><option>邮件</option><option>短信</option><option>企业微信</option></select></label>
        </div>
      </template>
      <template v-else-if="activeModal === 'progress'">
        <p>趋势预测模型正在运算。</p>
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

const trendData = [
  { month: '1月', value: 40 },
  { month: '2月', value: 48 },
  { month: '3月', value: 55 },
  { month: '4月', value: 60 },
  { month: '5月', value: 62 },
  { month: '6月', value: 68 },
  { month: '7月', value: 72 },
  { month: '8月', value: 66 },
  { month: '9月', value: 70 },
  { month: '10月', value: 76 },
  { month: '11月', value: 80 },
  { month: '12月', value: 84 }
]

const summary = {
  total: 864,
  new: 42,
  value: 18,
  risk: 6,
  reports: 5
}

const tableData = ref([
  { id: 'DA-001', metric: '商标存量', dimension: '按行业', value: '356件', change: '+4%', risk: '低', action: '保持监控' },
  { id: 'DA-002', metric: '版权存量', dimension: '按类别', value: '508件', change: '+3%', risk: '低', action: '优化分类' },
  { id: 'DA-003', metric: '商标新增', dimension: '按区域', value: '26件', change: '+8%', risk: '中', action: '扩大登记' },
  { id: 'DA-004', metric: '版权新增', dimension: '按团队', value: '16件', change: '+5%', risk: '低', action: '强化产出' },
  { id: 'DA-005', metric: '价值提升指数', dimension: '综合', value: '78分', change: '+6%', risk: '低', action: '维持投入' },
  { id: 'DA-006', metric: '续展风险', dimension: '按到期日', value: '9件', change: '+2%', risk: '中', action: '提前续展' },
  { id: 'DA-007', metric: '侵权预警', dimension: '电商渠道', value: '4件', change: '-1%', risk: '中', action: '加密监控' },
  { id: 'DA-008', metric: '授权收入', dimension: '按产品', value: '¥120万', change: '+10%', risk: '低', action: '拓展合作' },
  { id: 'DA-009', metric: '商标活跃度', dimension: '按业务线', value: '82%', change: '+3%', risk: '低', action: '持续维护' },
  { id: 'DA-010', metric: '版权交易量', dimension: '按区域', value: '12件', change: '+4%', risk: '中', action: '优化合同' },
  { id: 'DA-011', metric: '市场估值', dimension: '科技行业', value: '¥3200万', change: '+12%', risk: '低', action: '持续评估' },
  { id: 'DA-012', metric: '法律风险', dimension: '争议案件', value: '3件', change: '+1%', risk: '高', action: '立即处理' },
  { id: 'DA-013', metric: '品牌热度', dimension: '社交媒体', value: '74分', change: '+5%', risk: '低', action: '加强传播' },
  { id: 'DA-014', metric: '登记效率', dimension: '办理周期', value: '18天', change: '-2%', risk: '低', action: '流程优化' },
  { id: 'DA-015', metric: '续展完成率', dimension: '按部门', value: '88%', change: '+4%', risk: '低', action: '目标跟进' },
  { id: 'DA-016', metric: '侵权处理时效', dimension: '按案件', value: '6天', change: '-1%', risk: '中', action: '提升响应' },
  { id: 'DA-017', metric: '外部授权', dimension: '合作伙伴', value: '14件', change: '+6%', risk: '低', action: '加强审核' },
  { id: 'DA-018', metric: '资产价值波动', dimension: '季度', value: '±5%', change: '+1%', risk: '中', action: '稳定策略' },
  { id: 'DA-019', metric: '预警命中率', dimension: '监控模型', value: '91%', change: '+2%', risk: '低', action: '更新模型' },
  { id: 'DA-020', metric: '报告产出', dimension: '团队', value: '23份', change: '+7%', risk: '低', action: '保持输出' },
  { id: 'DA-021', metric: '授权满意度', dimension: '客户反馈', value: '95%', change: '+1%', risk: '低', action: '加强服务' }
])

const activeModal = ref('')
const modalOpen = computed(() => Boolean(activeModal.value))
const progress = ref(52)

const form = reactive({
  scope: '全部资产',
  range: '本季度',
  forecast: '6个月',
  model: '平滑趋势',
  method: '收益法',
  industry: '',
  template: '综合报告',
  format: 'PDF',
  threshold: '中风险',
  notify: '邮件'
})

const modalTitle = computed(() => {
  const titles = {
    stats: '商标与版权数据统计',
    trend: '趋势分析与预测',
    value: '市场价值分析',
    report: '定期报告生成与导出',
    risk: '风险评估与预警',
    progress: '预测进度'
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
    progress.value = Math.min(progress.value + 14, 100)
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

.trend-chart {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 10px;
  align-items: end;
  height: 200px;
}

.trend-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
}

.trend-bar {
  width: 100%;
  border-radius: 10px 10px 4px 4px;
  background: linear-gradient(180deg, #facc15, #fb7185);
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
