<template>
  <section class="grid" style="gap: 18px">
    <div class="flex-between">
      <div>
        <p class="badge">统计</p>
        <h3 style="margin: 4px 0">数据统计与分析</h3>
      </div>
      <div style="display: flex; gap: 8px">
        <button class="secondary-btn" @click="openMetric">新增指标</button>
        <button class="primary-btn" @click="openAggregate">运行聚合</button>
        <button class="secondary-btn" @click="openDownload">下载报告</button>
      </div>
    </div>

    <div class="card">
      <div class="flex-between" style="margin-bottom: 10px">
        <h4 style="margin: 0">核心指标趋势</h4>
        <span class="tag">周度</span>
      </div>
      <div class="chart-bars">
        <div v-for="item in metricsChart" :key="item.label" class="chart-bar">
          <div class="flex-between">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </div>
          <div class="bar" :style="{ width: item.value * 2 + 'px' }"></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="flex-between" style="margin-bottom: 10px">
        <h4 style="margin: 0">指标数据表</h4>
        <span class="badge">10行</span>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>指标</th>
            <th>数值</th>
            <th>环比</th>
            <th>同比</th>
            <th>目标</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in metricRows" :key="row.name">
            <td>{{ row.name }}</td>
            <td>{{ row.value }}</td>
            <td>{{ row.mom }}%</td>
            <td>{{ row.yoy }}%</td>
            <td>{{ row.target }}</td>
            <td>{{ row.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog
      v-if="showMetric"
      title="新增分析指标"
      badge="配置"
      description="自定义统计口径与标签"
      @close="showMetric = false"
    >
      <div class="form-row two-col">
        <div>
          <label class="label">指标名称</label>
          <input v-model="metricForm.name" placeholder="如：DAU 留存" />
        </div>
        <div>
          <label class="label">计算方式</label>
          <select v-model="metricForm.method">
            <option>总和</option>
            <option>平均</option>
            <option>百分位</option>
          </select>
        </div>
        <div>
          <label class="label">维度</label>
          <input v-model="metricForm.dimension" placeholder="渠道, 终端" />
        </div>
        <div>
          <label class="label">时间窗口</label>
          <input v-model="metricForm.window" placeholder="7d" />
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px">
        <button class="secondary-btn" @click="showMetric = false">取消</button>
        <button class="primary-btn" @click="saveMetric">保存</button>
      </div>
    </ModalDialog>

    <ModalDialog
      v-if="showAggregate"
      title="运行数据聚合"
      badge="任务"
      description="基于最新数据源计算聚合结果"
      @close="stopAggregate"
    >
      <div class="progress-bar" style="margin: 12px 0">
        <span :style="{ width: aggProgress + '%' }"></span>
      </div>
      <p style="margin: 0">{{ aggProgress < 100 ? '正在聚合…' : '完成' }}</p>
      <div style="display: flex; justify-content: flex-end; margin-top: 14px">
        <button class="primary-btn" @click="stopAggregate">关闭</button>
      </div>
    </ModalDialog>

    <ModalDialog
      v-if="showDownload"
      title="报告下载"
      badge="导出"
      description="选择格式并触发下载"
      @close="showDownload = false"
    >
      <div class="form-row">
        <div>
          <label class="label">格式</label>
          <select v-model="downloadForm.format">
            <option>PDF</option>
            <option>Excel</option>
            <option>CSV</option>
          </select>
        </div>
        <div>
          <label class="label">包含附件</label>
          <select v-model="downloadForm.attach">
            <option>是</option>
            <option>否</option>
          </select>
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px">
        <button class="secondary-btn" @click="showDownload = false">取消</button>
        <button class="primary-btn" @click="startDownload">开始下载</button>
      </div>
    </ModalDialog>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const metricsChart = [
  { label: 'DAU', value: 82 },
  { label: '留存率', value: 64 },
  { label: '付费转化', value: 32 },
  { label: '订单完成', value: 48 },
  { label: '推荐点击', value: 55 },
  { label: '裂变分享', value: 23 }
]

const metricRows = [
  { name: 'DAU', value: '1,280,000', mom: 3.2, yoy: 12.4, target: '1,250,000', status: '稳定' },
  { name: 'WAU', value: '3,420,000', mom: 2.4, yoy: 10.1, target: '3,300,000', status: '超出' },
  { name: 'MAU', value: '9,780,000', mom: 1.4, yoy: 8.2, target: '9,500,000', status: '超出' },
  { name: '付费率', value: '7.2%', mom: 0.6, yoy: 1.4, target: '7%', status: '稳定' },
  { name: 'ARPU', value: '58.3', mom: 0.9, yoy: 2.1, target: '55', status: '超出' },
  { name: '订单量', value: '486,000', mom: 3.4, yoy: 11.7, target: '470,000', status: '超出' },
  { name: '退款率', value: '1.8%', mom: -0.2, yoy: -0.3, target: '2%', status: '优化' },
  { name: '推荐CTR', value: '14.6%', mom: 0.7, yoy: 1.2, target: '14%', status: '稳定' },
  { name: '搜索转化', value: '5.8%', mom: 0.4, yoy: 0.9, target: '6%', status: '提升中' },
  { name: '客服响应', value: '92%', mom: 1.1, yoy: 2.0, target: '90%', status: '稳定' }
]

const showMetric = ref(false)
const showAggregate = ref(false)
const showDownload = ref(false)
const aggProgress = ref(22)
const metricForm = reactive({ name: '', method: '总和', dimension: '', window: '7d' })
const downloadForm = reactive({ format: 'PDF', attach: '是' })
let timer

const openMetric = () => (showMetric.value = true)
const saveMetric = () => {
  showMetric.value = false
}

const openAggregate = () => {
  showAggregate.value = true
  aggProgress.value = 22
  timer = setInterval(() => {
    aggProgress.value = Math.min(100, aggProgress.value + 19)
    if (aggProgress.value === 100) clearInterval(timer)
  }, 500)
}

const stopAggregate = () => {
  showAggregate.value = false
  clearInterval(timer)
}

const openDownload = () => (showDownload.value = true)
const startDownload = () => {
  showDownload.value = false
}
</script>
