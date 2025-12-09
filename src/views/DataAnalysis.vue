<template>
  <div class="card">
    <div class="header">
      <div>
        <div class="subtitle">数据分析与报告生成模块</div>
        <h2 style="margin: 0;">性能汇总与报告</h2>
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button class="btn" @click="openReport">生成报告</button>
        <button class="btn secondary" @click="openExport">导出数据</button>
        <button class="btn secondary" @click="openForecast">趋势预测</button>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: 1.2fr 1fr; align-items: start;">
      <div class="card" style="min-height: 320px;">
        <div class="subtitle">吸附量趋势图</div>
        <canvas ref="chartRef" height="200"></canvas>
      </div>
      <div class="card">
        <div class="subtitle">关键指标</div>
        <ul style="margin: 0; padding-left: 1.2rem; color: #4b5568;">
          <li>平均吸附量：{{ avgCapacity }} mg/g</li>
          <li>最佳批次：{{ bestBatch.batch }} ({{ bestBatch.capacity }} mg/g)</li>
          <li>偏差系数：{{ deviation }}%</li>
        </ul>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>批次</th>
          <th>吸附量(mg/g)</th>
          <th>比表面积(m²/g)</th>
          <th>孔容(cm³/g)</th>
          <th>报告状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.batch">
          <td>{{ row.batch }}</td>
          <td>{{ row.capacity }}</td>
          <td>{{ row.area }}</td>
          <td>{{ row.pore }}</td>
          <td><span class="badge">{{ row.status }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="showReport" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header"><strong>生成报告</strong></div>
      <div class="modal-body">
        <div class="form-group">
          <label>报告名称</label>
          <input v-model="reportForm.title" placeholder="例如：4 月吸附性能分析" />
        </div>
        <div class="form-group">
          <label>包含批次</label>
          <input v-model="reportForm.batches" placeholder="T-2404-01,T-2404-05" />
        </div>
        <div class="form-group">
          <label>备注</label>
          <textarea v-model="reportForm.notes" rows="3"></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" @click="showReport = false">取消</button>
        <button class="btn" @click="generate">生成</button>
      </div>
    </div>
  </div>

  <div v-if="showExport" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header"><strong>导出数据</strong></div>
      <div class="modal-body">
        <p style="margin-top: 0;">请选择导出格式</p>
        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));">
          <button class="btn" @click="confirmExport('CSV')">导出 CSV</button>
          <button class="btn" @click="confirmExport('Excel')">导出 Excel</button>
          <button class="btn" @click="confirmExport('PDF')">导出 PDF 图表</button>
        </div>
        <div v-if="exportMessage" class="card" style="margin-top: 0.75rem;">
          <div class="subtitle">导出提示</div>
          <p style="margin: 0;">{{ exportMessage }}</p>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn" @click="showExport = false">完成</button>
      </div>
    </div>
  </div>

  <div v-if="showForecast" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header"><strong>趋势预测</strong></div>
      <div class="modal-body">
        <p style="margin-top: 0;">自动预测未来批次吸附量</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: forecastProgress + '%' }"></div>
        </div>
        <p style="margin: 0.5rem 0;">{{ forecastProgress.toFixed(0) }}% 完成</p>
        <p style="margin: 0; color: #4b5568;">{{ forecastTip }}</p>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" @click="showForecast = false">关闭</button>
        <button class="btn" @click="runForecast">刷新预测</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, reactive, ref, computed } from 'vue'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const chartRef = ref(null)
let chartInstance = null

const rows = reactive([
  { batch: 'T-2404-01', capacity: 17.7, area: 82, pore: 0.21, status: '已归档' },
  { batch: 'T-2404-02', capacity: 15.9, area: 76, pore: 0.19, status: '已归档' },
  { batch: 'T-2404-03', capacity: 8.8, area: 65, pore: 0.15, status: '待审核' },
  { batch: 'T-2404-04', capacity: 23.5, area: 90, pore: 0.25, status: '已归档' },
  { batch: 'T-2404-05', capacity: 20.0, area: 84, pore: 0.23, status: '已归档' },
  { batch: 'T-2404-06', capacity: 13.5, area: 71, pore: 0.18, status: '已归档' },
  { batch: 'T-2404-07', capacity: 14.8, area: 69, pore: 0.17, status: '已归档' },
  { batch: 'T-2404-08', capacity: 17.6, area: 79, pore: 0.2, status: '已归档' },
  { batch: 'T-2404-09', capacity: 13.9, area: 73, pore: 0.19, status: '待审核' },
  { batch: 'T-2404-10', capacity: 10.2, area: 60, pore: 0.14, status: '草稿' }
])

const avgCapacity = computed(() => (rows.reduce((sum, r) => sum + r.capacity, 0) / rows.length).toFixed(2))
const bestBatch = computed(() => rows.reduce((max, r) => (r.capacity > max.capacity ? r : max), rows[0]))
const deviation = computed(() => {
  const avg = rows.reduce((sum, r) => sum + r.capacity, 0) / rows.length
  const variance = rows.reduce((sum, r) => sum + Math.pow(r.capacity - avg, 2), 0) / rows.length
  return Math.sqrt(variance).toFixed(2)
})

const showReport = ref(false)
const showExport = ref(false)
const showForecast = ref(false)
const forecastProgress = ref(40)
const forecastTip = ref('根据近 10 个批次估算，下批次吸附量 18.2 mg/g')
const exportMessage = ref('')
const reportForm = reactive({ title: '', batches: '全部', notes: '' })
let forecastTimer = null

const buildChart = () => {
  const ctx = chartRef.value.getContext('2d')
  if (chartInstance) chartInstance.destroy()
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: rows.map((r) => r.batch),
      datasets: [
        {
          label: '吸附量 (mg/g)',
          data: rows.map((r) => r.capacity),
          backgroundColor: 'rgba(43, 123, 255, 0.65)',
          borderRadius: 8
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        tooltip: { enabled: true }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  })
}

const openReport = () => {
  showReport.value = true
}

const generate = () => {
  reportForm.title ||= '吸附性能报告'
  exportMessage.value = `报告“${reportForm.title}”已生成，包含批次：${reportForm.batches || '全部'}`
  showReport.value = false
  showExport.value = true
}

const openExport = () => {
  exportMessage.value = ''
  showExport.value = true
}

const confirmExport = (type) => {
  exportMessage.value = `${type} 导出已准备，包含 ${rows.length} 条记录。`
}

const openForecast = () => {
  showForecast.value = true
  runForecast()
}

const runForecast = () => {
  forecastProgress.value = 0
  forecastTip.value = '正在拟合曲线...'
  clearInterval(forecastTimer)
  forecastTimer = setInterval(() => {
    forecastProgress.value += 20
    if (forecastProgress.value >= 100) {
      forecastProgress.value = 100
      forecastTip.value = '预测完成：预计下批次 18.6 mg/g，误差 ±0.8 mg/g'
      clearInterval(forecastTimer)
    }
  }, 400)
}

onMounted(() => {
  buildChart()
})

onBeforeUnmount(() => {
  clearInterval(forecastTimer)
  if (chartInstance) chartInstance.destroy()
})
</script>
