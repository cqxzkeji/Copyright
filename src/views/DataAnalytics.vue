<template>
  <div>
    <div class="section-header">
      <div>
        <p class="status-pill">数据分析与运营决策</p>
        <small>订单、流量、履约的多维分析，沉淀运营动作</small>
      </div>
      <div class="nav-links">
        <button class="btn" @click="openModal('report')">生成报表</button>
        <button class="btn secondary" @click="openModal('forecast')">销量预测</button>
        <button class="btn secondary" @click="openModal('notify')">运营提示</button>
      </div>
    </div>

    <div class="card-grid" style="margin-top: 12px;">
      <div class="chart-box" style="grid-column: span 2; min-height: 260px;">
        <canvas ref="chartRef"></canvas>
      </div>
      <div class="card" v-for="item in highlights" :key="item.label">
        <p>{{ item.label }}</p>
        <h3 style="margin: 8px 0; color: #1b72e8;">{{ item.value }}</h3>
        <p style="color: #4b5563;">{{ item.desc }}</p>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>日期</th>
          <th>GMV</th>
          <th>访客</th>
          <th>转化率</th>
          <th>客单价</th>
          <th>履约及时率</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in tableData" :key="row.date">
          <td>{{ row.date }}</td>
          <td>￥{{ row.gmv }}</td>
          <td>{{ row.visitor }}</td>
          <td>{{ row.cvt }}%</td>
          <td>￥{{ row.aov }}</td>
          <td>{{ row.fulfill }}%</td>
        </tr>
      </tbody>
    </table>

    <ModalDialog v-if="modal.visible" :title="modal.title" @close="modal.visible = false">
      <template v-if="modal.type === 'report'">
        <form class="form-grid" @submit.prevent="modal.visible = false">
          <div>
            <label>周期</label>
            <select>
              <option>近7天</option>
              <option>近30天</option>
              <option>自定义</option>
            </select>
          </div>
          <div>
            <label>输出格式</label>
            <select>
              <option>Excel</option>
              <option>PDF</option>
            </select>
          </div>
          <button class="btn" type="submit">导出报表</button>
        </form>
      </template>
      <template v-else-if="modal.type === 'forecast'">
        <p>根据近 30 天趋势，预测品类销量。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: forecastProgress + '%' }"></div>
        </div>
      </template>
      <template v-else>
        <p>系统将根据异常指标推送运营提醒。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: 100 }"></div>
        </div>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { Chart, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Legend, Tooltip, LineController } from 'chart.js';
import ModalDialog from '../components/ModalDialog.vue';

Chart.register(LineController, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Legend, Tooltip);

const chartRef = ref(null);
const forecastProgress = ref(30);

const highlights = [
  { label: '核心渠道', value: '抖音/小程序', desc: '短视频与自营占GMV 76%' },
  { label: '复购率', value: '32%', desc: '乡村优选包月带动复购' },
  { label: '物流时效', value: '95% 24h', desc: '冷链仓与干线调度已优化' }
];

const tableData = reactive([
  { date: '05-01', gmv: 98600, visitor: 16800, cvt: 3.2, aov: 58, fulfill: 95 },
  { date: '05-02', gmv: 105300, visitor: 17540, cvt: 3.1, aov: 60, fulfill: 96 },
  { date: '05-03', gmv: 112680, visitor: 18020, cvt: 3.3, aov: 62, fulfill: 96 },
  { date: '05-04', gmv: 98660, visitor: 15200, cvt: 3.5, aov: 65, fulfill: 94 },
  { date: '05-05', gmv: 126800, visitor: 19210, cvt: 3.6, aov: 66, fulfill: 95 },
  { date: '05-06', gmv: 118430, visitor: 18800, cvt: 3.4, aov: 64, fulfill: 97 },
  { date: '05-07', gmv: 130240, visitor: 19500, cvt: 3.8, aov: 67, fulfill: 96 },
  { date: '05-08', gmv: 128420, visitor: 19040, cvt: 3.7, aov: 65, fulfill: 95 },
  { date: '05-09', gmv: 133600, visitor: 20010, cvt: 3.9, aov: 68, fulfill: 97 },
  { date: '05-10', gmv: 140220, visitor: 21020, cvt: 4.0, aov: 69, fulfill: 97 }
]);

const modal = reactive({ visible: false, type: 'report', title: '数据动作' });

const openModal = (type) => {
  modal.visible = true;
  modal.type = type;
  modal.title = type === 'report' ? '报表导出' : type === 'forecast' ? '销量预测' : '运营提示';
  if (type === 'forecast') {
    forecastProgress.value = 30;
    const timer = setInterval(() => {
      if (forecastProgress.value >= 100) {
        clearInterval(timer);
      } else {
        forecastProgress.value += 20;
      }
    }, 500);
  }
};

onMounted(() => {
  const ctx = chartRef.value?.getContext('2d');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: tableData.map((d) => d.date),
      datasets: [
        {
          label: 'GMV',
          data: tableData.map((d) => d.gmv),
          borderColor: '#1b72e8',
          backgroundColor: 'rgba(27,114,232,0.2)',
          tension: 0.35
        },
        {
          label: '访客',
          data: tableData.map((d) => d.visitor),
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34,197,94,0.2)',
          tension: 0.35
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
});
</script>
