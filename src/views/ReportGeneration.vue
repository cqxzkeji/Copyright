<template>
  <div class="light-card module-card">
    <div class="card-header">
      <div>
        <h3>报告生成与分析</h3>
        <p>生成日报、周报和风险分析，导出 PDF / Excel。</p>
      </div>
      <div class="flex-row">
        <button class="secondary-btn" @click="openConfig">生成设置</button>
        <button class="primary-btn" @click="generateReport">生成报告</button>
      </div>
    </div>

    <div class="flex-row charts">
      <div class="chart-block">
        <h4>类型分布</h4>
        <canvas ref="barRef" height="200"></canvas>
      </div>
      <div class="chart-block">
        <h4>季度趋势</h4>
        <canvas ref="trendRef" height="200"></canvas>
      </div>
    </div>

    <table class="table" aria-label="report table">
      <thead>
        <tr>
          <th>报告名称</th>
          <th>周期</th>
          <th>风险指数</th>
          <th>生成时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="report in reports" :key="report.name">
          <td>{{ report.name }}</td>
          <td>{{ report.cycle }}</td>
          <td><span class="status-pill warning">{{ report.risk }}</span></td>
          <td>{{ report.time }}</td>
          <td>
            <button class="secondary-btn" @click="preview(report)">预览</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="notice">点击生成报告将显示带进度的弹窗，预览按钮打开报告摘要。</div>
  </div>

  <div v-if="configOpen" class="modal-backdrop" @click.self="configOpen = false">
    <div class="modal">
      <h3>生成设置</h3>
      <div class="form-row">
        <label>周期
          <select v-model="config.cycle">
            <option>日报</option>
            <option>周报</option>
            <option>月报</option>
          </select>
        </label>
        <label>格式
          <select v-model="config.format">
            <option>PDF</option>
            <option>Excel</option>
          </select>
        </label>
        <label>包含内容 <textarea v-model="config.scope" rows="3"></textarea></label>
      </div>
      <footer>
        <button class="secondary-btn" @click="configOpen = false">取消</button>
        <button class="primary-btn" @click="configOpen = false">保存</button>
      </footer>
    </div>
  </div>

  <div v-if="previewing" class="modal-backdrop" @click.self="previewing = null">
    <div class="modal">
      <h3>{{ previewing.name }}</h3>
      <p>周期：{{ previewing.cycle }} | 风险指数：{{ previewing.risk }}</p>
      <p>摘要：{{ previewing.summary }}</p>
      <footer>
        <button class="primary-btn" @click="previewing = null">关闭</button>
      </footer>
    </div>
  </div>

  <div v-if="generating" class="modal-backdrop" @click.self="generating = false">
    <div class="modal">
      <h3>报告生成中</h3>
      <div class="progress-bar">
        <div class="progress-bar-inner" :style="{ width: genProgress + '%' }"></div>
      </div>
      <p style="text-align:right;margin-top:8px;">{{ genProgress }}%</p>
      <footer>
        <button class="primary-btn" @click="generating = false">后台生成</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineElement, PointElement } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineElement, PointElement);

const reports = reactive([
  { name: '隐患日报-07', cycle: '日报', risk: '0.32', time: '09:00', summary: '今日发现 6 处隐患，已处理 4 处' },
  { name: '周报-3月第2周', cycle: '周报', risk: '0.41', time: '周日 18:00', summary: '周内告警 23 次，平均响应 2.3 分钟' },
  { name: '配电室专项', cycle: '专项', risk: '0.55', time: '昨日 16:00', summary: '配电室温升多发，建议增设巡检' },
  { name: '仓库综合', cycle: '专项', risk: '0.37', time: '昨日 10:20', summary: '仓库烟感维护完毕，风险下降' },
  { name: '月报-2月', cycle: '月报', risk: '0.46', time: '月初 09:30', summary: '本月主要风险为线缆老化与遮挡' }
]);

const configOpen = ref(false);
const generating = ref(false);
const genProgress = ref(0);
const previewing = ref(null);
const config = reactive({ cycle: '周报', format: 'PDF', scope: '包含报警、巡检、设备状态' });
const barRef = ref(null);
const trendRef = ref(null);

const openConfig = () => {
  configOpen.value = true;
};

const generateReport = () => {
  generating.value = true;
  genProgress.value = 0;
  const timer = setInterval(() => {
    genProgress.value = Math.min(100, genProgress.value + 20);
    if (genProgress.value >= 100) {
      clearInterval(timer);
    }
  }, 320);
};

const preview = (row) => {
  previewing.value = row;
};

const initCharts = () => {
  if (barRef.value) {
    new Chart(barRef.value, {
      type: 'bar',
      data: {
        labels: ['烟雾', '温度', '电气', '视频', '巡检'],
        datasets: [
          {
            label: '次数',
            data: [12, 9, 7, 5, 8],
            backgroundColor: '#3b82f6'
          }
        ]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
  if (trendRef.value) {
    new Chart(trendRef.value, {
      type: 'line',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
          {
            label: '风险指数',
            data: [0.48, 0.44, 0.51, 0.42],
            borderColor: '#22c55e',
            fill: false,
            tension: 0.3
          }
        ]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
};

onMounted(() => {
  initCharts();
});
</script>

<style scoped>
.module-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
