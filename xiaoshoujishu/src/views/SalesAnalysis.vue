<template>
  <div class="page">
    <section class="summary-grid">
      <div class="card">
        <div class="card-title">本月销售额</div>
        <div class="card-value">¥ 28,450,000</div>
        <div class="card-foot">同比 +12.4%</div>
      </div>
      <div class="card">
        <div class="card-title">重点行业需求</div>
        <div class="card-value">装备制造 · 38%</div>
        <div class="card-foot">高端轴承需求持续增长</div>
      </div>
      <div class="card">
        <div class="card-title">预测准确率</div>
        <div class="card-value">92.6%</div>
        <div class="card-foot">滚动训练 24 周</div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h2>销售趋势预测</h2>
        <div class="actions">
          <button class="btn" type="button" @click="openImport">导入数据</button>
          <button class="btn primary" type="button" @click="openForecast">生成预测</button>
          <button class="btn ghost" type="button" @click="openExport">导出报告</button>
        </div>
      </div>
      <div class="chart">
        <div
          v-for="item in trendData"
          :key="item.month"
          class="bar"
          :style="{ height: item.value + '%' }"
        >
          <span>{{ item.month }}</span>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h2>历史订单明细</h2>
        <div class="tag">共 {{ orders.length }} 条</div>
      </div>
      <div class="table">
        <div class="table-row table-head">
          <span>订单编号</span>
          <span>客户</span>
          <span>产品</span>
          <span>吨位</span>
          <span>成交金额</span>
          <span>预测趋势</span>
        </div>
        <div v-for="row in orders" :key="row.id" class="table-row">
          <span>{{ row.id }}</span>
          <span>{{ row.client }}</span>
          <span>{{ row.product }}</span>
          <span>{{ row.weight }}</span>
          <span>{{ row.amount }}</span>
          <span>{{ row.trend }}</span>
        </div>
      </div>
    </section>

    <BaseModal
      :open="modal.import"
      title="导入销售数据"
      primary-text="确认导入"
      @close="closeModals"
      @confirm="confirmImport"
    >
      <label class="field">
        数据来源
        <select v-model="importForm.source">
          <option>ERP系统</option>
          <option>Excel上传</option>
          <option>CRM同步</option>
        </select>
      </label>
      <label class="field">
        时间范围
        <input v-model="importForm.range" type="text" placeholder="2024年01月 - 2024年06月" />
      </label>
      <label class="field">
        描述
        <textarea v-model="importForm.note" rows="3" placeholder="填写批次说明" />
      </label>
    </BaseModal>

    <BaseModal
      :open="modal.forecast"
      title="销售预测进度"
      :show-footer="false"
      @close="closeModals"
    >
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <div>正在训练趋势模型：{{ progress }}%</div>
      <button class="btn primary" type="button" @click="finishForecast">完成并查看结果</button>
    </BaseModal>

    <BaseModal
      :open="modal.export"
      title="导出提示"
      primary-text="立即下载"
      @close="closeModals"
      @confirm="confirmExport"
    >
      <p>系统将生成包含销售趋势与预测结论的分析报告。</p>
      <p>格式：PDF / Excel，预计耗时 10 秒。</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const trendData = [
  { month: '1月', value: 42 },
  { month: '2月', value: 48 },
  { month: '3月', value: 55 },
  { month: '4月', value: 63 },
  { month: '5月', value: 70 },
  { month: '6月', value: 78 },
  { month: '7月', value: 75 },
  { month: '8月', value: 82 }
]

const orders = [
  { id: 'SO-24001', client: '华东轴承', product: 'GCr15', weight: '1200t', amount: '¥3,200万', trend: '上行' },
  { id: 'SO-24002', client: '北方能源', product: '35CrMo', weight: '860t', amount: '¥1,980万', trend: '稳定' },
  { id: 'SO-24003', client: '南海装备', product: '42CrMo', weight: '920t', amount: '¥2,350万', trend: '上行' },
  { id: 'SO-24004', client: '中联风电', product: '20CrMnTi', weight: '600t', amount: '¥1,460万', trend: '上行' },
  { id: 'SO-24005', client: '衡山机械', product: '40Cr', weight: '780t', amount: '¥1,720万', trend: '稳定' },
  { id: 'SO-24006', client: '远航造船', product: 'Q345D', weight: '1500t', amount: '¥3,980万', trend: '上行' },
  { id: 'SO-24007', client: '华南重工', product: '34CrNiMo6', weight: '540t', amount: '¥1,560万', trend: '回落' },
  { id: 'SO-24008', client: '青岛工具', product: '65Mn', weight: '430t', amount: '¥920万', trend: '稳定' },
  { id: 'SO-24009', client: '合肥汽车', product: '20MnSi', weight: '680t', amount: '¥1,280万', trend: '上行' },
  { id: 'SO-24010', client: '江淮传动', product: '38CrMoAl', weight: '370t', amount: '¥860万', trend: '稳定' },
  { id: 'SO-24011', client: '盛京轨道', product: '55SiCr', weight: '900t', amount: '¥2,150万', trend: '上行' },
  { id: 'SO-24012', client: '晨曦矿山', product: '30CrMnSi', weight: '640t', amount: '¥1,320万', trend: '回落' },
  { id: 'SO-24013', client: '海宁模具', product: 'H13', weight: '500t', amount: '¥1,420万', trend: '上行' },
  { id: 'SO-24014', client: '齐鲁能源', product: '15CrMo', weight: '880t', amount: '¥1,950万', trend: '稳定' },
  { id: 'SO-24015', client: '天成工具', product: 'Cr12MoV', weight: '460t', amount: '¥1,120万', trend: '上行' },
  { id: 'SO-24016', client: '合金动力', product: '25Cr2MoV', weight: '720t', amount: '¥1,760万', trend: '稳定' },
  { id: 'SO-24017', client: '华润制造', product: '20Cr', weight: '560t', amount: '¥1,040万', trend: '上行' },
  { id: 'SO-24018', client: '东辰装备', product: '30Cr2Ni4MoV', weight: '510t', amount: '¥1,300万', trend: '上行' },
  { id: 'SO-24019', client: '新能科技', product: '16MnCr5', weight: '690t', amount: '¥1,500万', trend: '稳定' },
  { id: 'SO-24020', client: '东方重机', product: '50CrVA', weight: '820t', amount: '¥1,980万', trend: '回落' },
  { id: 'SO-24021', client: '启明工程', product: '18CrNiMo7-6', weight: '430t', amount: '¥1,050万', trend: '上行' },
  { id: 'SO-24022', client: '华北燃机', product: '17CrNiMo6', weight: '390t', amount: '¥920万', trend: '稳定' }
]

const modal = reactive({
  import: false,
  forecast: false,
  export: false
})

const importForm = reactive({
  source: 'ERP系统',
  range: '',
  note: ''
})

const progress = ref(30)
let timer

const openImport = () => {
  modal.import = true
}

const openForecast = () => {
  modal.forecast = true
  progress.value = 30
  clearInterval(timer)
  timer = setInterval(() => {
    progress.value = Math.min(progress.value + 10, 100)
    if (progress.value === 100) {
      clearInterval(timer)
    }
  }, 400)
}

const openExport = () => {
  modal.export = true
}

const closeModals = () => {
  modal.import = false
  modal.forecast = false
  modal.export = false
}

const confirmImport = () => {
  closeModals()
}

const finishForecast = () => {
  progress.value = 100
}

const confirmExport = () => {
  closeModals()
}
</script>

<style scoped>
.page {
  display: grid;
  gap: 24px;
}

.summary-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.card {
  background: #ffffff;
  padding: 18px;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(148, 163, 184, 0.2);
}

.card-title {
  font-size: 13px;
  color: #64748b;
}

.card-value {
  font-size: 20px;
  font-weight: 700;
  margin: 8px 0;
}

.card-foot {
  font-size: 12px;
  color: #16a34a;
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

.chart {
  height: 200px;
  display: flex;
  align-items: flex-end;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
}

.bar {
  flex: 1;
  background: linear-gradient(180deg, #93c5fd, #2563eb);
  border-radius: 12px 12px 4px 4px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  color: #ffffff;
  font-size: 12px;
  padding-bottom: 8px;
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

select,
textarea,
input[type='text'] {
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
