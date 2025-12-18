<template>
  <div class="content-card">
    <div class="section-title">数据分析与决策支持</div>
    <div class="actions-row">
      <button class="primary-btn" @click="showMetricModal = true">设置指标</button>
      <button class="secondary-btn" @click="refreshData">刷新数据</button>
      <button class="secondary-btn" @click="showExportModal = true">导出报表</button>
    </div>

    <div class="card-grid" style="margin-top: 16px; align-items: stretch;">
      <div class="stat-card" style="grid-column: span 2; min-width: 320px;">
        <strong>产供销协同指数</strong>
        <canvas ref="scoreCanvas" height="120"></canvas>
      </div>
      <div class="stat-card">
        <div class="stat-label">供应保障天数</div>
        <div class="stat-value">18.5</div>
        <span class="badge">库存周转 7.2 天</span>
      </div>
      <div class="stat-card">
        <div class="stat-label">订单履约率</div>
        <div class="stat-value">97.2%</div>
        <span class="badge">缺货率 1.3%</span>
      </div>
    </div>

    <div class="table-wrapper" style="margin-top: 18px;">
      <div style="display:flex;justify-content:space-between;align-items:center; margin-bottom: 8px;">
        <strong>关键指标日报</strong>
        <span class="tag">总计 {{ metrics.length }} 条</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>日期</th>
            <th>产量(吨)</th>
            <th>采购到货率</th>
            <th>销售转化率</th>
            <th>库存周转(天)</th>
            <th>预警</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in metrics" :key="row.date">
            <td>{{ row.date }}</td>
            <td>{{ row.output }}</td>
            <td>{{ row.supply }}%</td>
            <td>{{ row.sales }}%</td>
            <td>{{ row.turnover }}</td>
            <td>
              <span class="badge" :style="{ background: row.alert ? '#fff4e6' : '#e5fbef', color: '#1d3557' }">{{ row.alert ? '关注' : '正常' }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <Modal title="指标配置" :show="showMetricModal" @close="showMetricModal = false">
    <form class="form-grid" @submit.prevent="saveMetrics">
      <label>预测模型<select v-model="metricForm.model">
        <option>基于历史回归</option>
        <option>节气+销售动销</option>
        <option>天气+产量</option>
      </select></label>
      <label>预警阈值(%)<input type="number" min="0" max="100" v-model.number="metricForm.threshold" required /></label>
      <label>关注品类<select v-model="metricForm.category">
        <option>番茄</option>
        <option>草莓</option>
        <option>生菜</option>
        <option>玉米</option>
        <option>大豆</option>
      </select></label>
      <label style="grid-column: span 2;">备注<textarea rows="3" v-model="metricForm.note"></textarea></label>
      <div style="grid-column: span 2; display:flex; gap:10px; justify-content:flex-end;">
        <button type="button" class="secondary-btn" @click="showMetricModal = false">取消</button>
        <button type="submit" class="primary-btn">保存</button>
      </div>
    </form>
  </Modal>

  <Modal title="数据刷新" :show="showRefreshModal" @close="showRefreshModal = false">
    <p>正在重算预测曲线与库存安全线。</p>
    <div class="progress-track" style="margin: 12px 0;">
      <div class="progress-bar" :style="{ width: refreshProgress + '%' }"></div>
    </div>
    <p style="margin:0;">刷新进度：{{ refreshProgress }}%</p>
  </Modal>

  <Modal title="导出报表" :show="showExportModal" @close="showExportModal = false">
    <p>将导出 PDF 与 Excel 版本的周度报告。</p>
    <div style="display:flex; gap:10px; justify-content:flex-end;">
      <button class="secondary-btn" @click="showExportModal = false">关闭</button>
      <button class="primary-btn" @click="exportReport">开始导出</button>
    </div>
  </Modal>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import Chart from 'chart.js/auto';
import Modal from '../components/Modal.vue';

const metrics = [
  { date: '04-01', output: 128, supply: 96, sales: 28, turnover: 7.1, alert: false },
  { date: '04-02', output: 132, supply: 94, sales: 27, turnover: 7.0, alert: false },
  { date: '04-03', output: 138, supply: 93, sales: 26, turnover: 7.3, alert: false },
  { date: '04-04', output: 140, supply: 95, sales: 29, turnover: 7.0, alert: false },
  { date: '04-05', output: 142, supply: 92, sales: 31, turnover: 7.5, alert: true },
  { date: '04-06', output: 145, supply: 93, sales: 30, turnover: 7.2, alert: false },
  { date: '04-07', output: 150, supply: 96, sales: 32, turnover: 7.1, alert: false },
  { date: '04-08', output: 152, supply: 97, sales: 33, turnover: 6.9, alert: false },
  { date: '04-09', output: 155, supply: 95, sales: 35, turnover: 6.8, alert: false },
  { date: '04-10', output: 160, supply: 96, sales: 34, turnover: 6.7, alert: false }
];

const showMetricModal = ref(false);
const showRefreshModal = ref(false);
const showExportModal = ref(false);
const refreshProgress = ref(0);
const timer = ref(null);

const metricForm = reactive({ model: '基于历史回归', threshold: 15, category: '番茄', note: '' });

const scoreCanvas = ref(null);
let chartInstance;

onMounted(() => {
  chartInstance = new Chart(scoreCanvas.value, {
    type: 'bar',
    data: {
      labels: ['供应协同', '生产效率', '渠道动销', '库存健康', '质量稳定', '资金周转'],
      datasets: [
        {
          label: '本周',
          data: [86, 78, 82, 75, 90, 80],
          backgroundColor: '#36b3f9'
        },
        {
          label: '上周',
          data: [80, 74, 79, 73, 88, 77],
          backgroundColor: '#2ec4b6'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } },
      scales: { y: { beginAtZero: true, max: 100 } }
    }
  });
});

onBeforeUnmount(() => {
  if (chartInstance) chartInstance.destroy();
  clearInterval(timer.value);
});

const saveMetrics = () => {
  alert(`已保存指标：模型 ${metricForm.model}，阈值 ${metricForm.threshold}%`);
  showMetricModal.value = false;
};

const refreshData = () => {
  refreshProgress.value = 0;
  showRefreshModal.value = true;
  clearInterval(timer.value);
  timer.value = setInterval(() => {
    if (refreshProgress.value >= 100) {
      clearInterval(timer.value);
      return;
    }
    refreshProgress.value += 18;
  }, 420);
};

const exportReport = () => {
  alert('报表正在导出并将通过邮件推送');
  showExportModal.value = false;
};
</script>
