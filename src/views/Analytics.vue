<template>
  <div>
    <div class="header">
      <div>
        <h2>数据分析</h2>
        <p class="muted">销售与标准执行情况的可视化洞察。</p>
      </div>
      <div class="action-row">
        <button class="primary-btn" @click="openExport">导出报表</button>
        <button class="secondary-btn" @click="openConfig">指标配置</button>
      </div>
    </div>

    <div class="card-grid">
      <div class="card" v-for="chart in charts" :key="chart.title">
        <div class="tag">{{ chart.title }}</div>
        <div class="bar-chart">
          <div v-for="bar in chart.data" :key="bar.label" class="bar-row">
            <span>{{ bar.label }}</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: bar.value + '%', background: bar.color }"></div>
            </div>
            <span class="value">{{ bar.value }}%</span>
          </div>
        </div>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>指标</th>
          <th>当前值</th>
          <th>环比</th>
          <th>备注</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.metric">
          <td>{{ row.metric }}</td>
          <td>{{ row.value }}</td>
          <td><span :class="['badge', row.trend > 0 ? 'badge-green' : 'badge-amber']">{{ row.trend }}%</span></td>
          <td>{{ row.note }}</td>
          <td><button class="secondary-btn" @click="openMetric(row)">说明</button></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="showExport" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">
        <h3>导出报表</h3>
        <button class="secondary-btn" @click="showExport = false">关闭</button>
      </div>
      <p>正在生成 PDF 报表，请稍候...</p>
      <div class="progress-bar"><div class="progress-fill" style="width: 90%"></div></div>
    </div>
  </div>

  <div v-if="showConfig" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">
        <h3>指标配置</h3>
        <button class="secondary-btn" @click="showConfig = false">关闭</button>
      </div>
      <form class="form-grid" @submit.prevent>
        <label>分析周期<select v-model="config.cycle"><option>周</option><option>月</option><option>季度</option></select></label>
        <label>重点指标<select v-model="config.focus"><option>准时交付</option><option>合同金额</option><option>质量合格率</option></select></label>
      </form>
      <div class="modal-footer">
        <button class="primary-btn" @click="showConfig = false">保存</button>
      </div>
    </div>
  </div>

  <div v-if="showMetric" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">
        <h3>{{ active.metric }}</h3>
        <button class="secondary-btn" @click="showMetric = false">关闭</button>
      </div>
      <p>{{ active.note }}</p>
      <div class="alert">提示：按钮已触发指标说明，便于决策沟通。</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showExport = ref(false)
const showConfig = ref(false)
const showMetric = ref(false)
const active = ref({})
const config = ref({ cycle: '周', focus: '准时交付' })

const charts = [
  {
    title: '准时交付率走势',
    data: [
      { label: '一月', value: 92, color: '#60a5fa' },
      { label: '二月', value: 95, color: '#34d399' },
      { label: '三月', value: 90, color: '#f59e0b' }
    ]
  },
  {
    title: '质量合格率',
    data: [
      { label: '理化', value: 98, color: '#6366f1' },
      { label: '探伤', value: 97, color: '#22c55e' },
      { label: '尺寸', value: 95, color: '#f97316' }
    ]
  }
]

const rows = [
  { metric: '合同金额', value: '1.1 亿元', trend: 12, note: '大单签约带动增长' },
  { metric: '准时交付率', value: '96%', trend: 3, note: '排产协调到位' },
  { metric: '质量合格率', value: '98.3%', trend: 1, note: '稳步提升' },
  { metric: '标准引用率', value: '94%', trend: 5, note: '销售报价引用标准' },
  { metric: '回款进度', value: '72%', trend: -2, note: '个别客户账期调整' },
  { metric: '异常批次', value: '2 批', trend: -1, note: '均已隔离' },
  { metric: '库存周转', value: '18 天', trend: 2, note: '保持良性水平' },
  { metric: '新增客户', value: '11 家', trend: 4, note: '市场拓展见效' },
  { metric: '发运完成', value: '6 单', trend: 1, note: '交付顺畅' },
  { metric: '报价响应', value: '3.2 小时', trend: 8, note: '快速反馈客户' }
]

const openExport = () => (showExport.value = true)
const openConfig = () => (showConfig.value = true)
const openMetric = (row) => {
  active.value = row
  showMetric.value = true
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

h2 {
  margin: 0;
  color: #1e3a8a;
}

.muted {
  color: #6b7280;
  margin: 4px 0 0;
}

.action-row {
  display: flex;
  gap: 10px;
}

.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 10px;
}

.bar-row {
  display: grid;
  grid-template-columns: 70px 1fr 60px;
  align-items: center;
  gap: 10px;
}

.bar-track {
  background: #e5e7eb;
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
}

.value {
  text-align: right;
  color: #1f2937;
  font-weight: 600;
}

select {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
}
</style>
