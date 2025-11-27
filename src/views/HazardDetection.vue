<template>
  <div class="light-card module-card">
    <div class="card-header">
      <div>
        <h3>实时隐患检测</h3>
        <p>根据烟感、温感及摄像检测结果，展示最新隐患分布与数据。</p>
      </div>
      <div class="flex-row" style="align-items:center;">
        <button class="secondary-btn" @click="openAddForm">录入隐患</button>
        <button class="primary-btn" @click="runScan">立即扫描</button>
      </div>
    </div>

    <div class="flex-row charts">
      <div class="chart-block">
        <h4>隐患等级占比</h4>
        <canvas ref="pieRef" height="200"></canvas>
      </div>
      <div class="chart-block">
        <h4>近7日检测趋势</h4>
        <canvas ref="lineRef" height="200"></canvas>
      </div>
    </div>

    <table class="table" aria-label="hazard table">
      <thead>
        <tr>
          <th>位置</th>
          <th>设备</th>
          <th>类型</th>
          <th>等级</th>
          <th>时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in hazards" :key="item.id">
          <td>{{ item.location }}</td>
          <td>{{ item.device }}</td>
          <td>{{ item.type }}</td>
          <td><span :class="['status-pill', levelClass(item.level)]">{{ item.level }}</span></td>
          <td>{{ item.time }}</td>
          <td>
            <button class="secondary-btn" @click="showDetail(item)">详情</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="notice">提示：扫描按钮会展示进度弹窗，录入按钮弹出表单，详情按钮弹出信息弹窗。</div>
  </div>

  <div v-if="detail" class="modal-backdrop" @click.self="detail = null">
    <div class="modal">
      <h3>隐患详情 - {{ detail.location }}</h3>
      <p>类型：{{ detail.type }} | 设备：{{ detail.device }}</p>
      <p>等级：{{ detail.level }} | 发现时间：{{ detail.time }}</p>
      <p>描述：{{ detail.desc }}</p>
      <footer>
        <button class="primary-btn" @click="detail = null">关闭</button>
      </footer>
    </div>
  </div>

  <div v-if="showForm" class="modal-backdrop" @click.self="showForm = false">
    <div class="modal">
      <h3>录入隐患</h3>
      <div class="form-row">
        <label>位置 <input v-model="form.location" placeholder="B2 机房" /></label>
        <label>类型 <input v-model="form.type" placeholder="烟雾异常" /></label>
        <label>等级
          <select v-model="form.level">
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select>
        </label>
        <label>描述 <textarea v-model="form.desc" rows="3"></textarea></label>
      </div>
      <footer>
        <button class="secondary-btn" @click="showForm = false">取消</button>
        <button class="primary-btn" @click="submitForm">保存</button>
      </footer>
    </div>
  </div>

  <div v-if="scanning" class="modal-backdrop" @click.self="scanning = false">
    <div class="modal">
      <h3>扫描进行中</h3>
      <div class="progress-bar">
        <div class="progress-bar-inner" :style="{ width: scanProgress + '%' }"></div>
      </div>
      <p style="text-align:right;margin-top:8px;">{{ scanProgress }}%</p>
      <footer>
        <button class="primary-btn" @click="scanning = false">停止</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, LineController, CategoryScale, LinearScale, PointElement, LineElement);

const hazards = reactive([
  { id: 1, location: 'A1 楼梯间', device: '烟感#01', type: '烟雾超阈值', level: '高', time: '09:12', desc: '烟雾指数 0.82' },
  { id: 2, location: 'B2 配电室', device: '温感#04', type: '温升过快', level: '中', time: '09:05', desc: '温度 56℃' },
  { id: 3, location: 'C5 走廊', device: '摄像头#12', type: '明火检测', level: '高', time: '08:51', desc: '检测到火苗' },
  { id: 4, location: '库房南侧', device: '烟感#07', type: '电气火花', level: '中', time: '08:40', desc: '电弧放电' },
  { id: 5, location: '地下车库', device: '温感#11', type: '温感故障', level: '低', time: '08:30', desc: '需要校准' }
]);

const pieRef = ref(null);
const lineRef = ref(null);
const showForm = ref(false);
const scanning = ref(false);
const scanProgress = ref(0);
const detail = ref(null);
const form = reactive({ location: '', type: '', level: '中', desc: '' });

const levelClass = (level) => {
  if (level === '高') return 'danger';
  if (level === '中') return 'warning';
  return 'success';
};

const showDetail = (row) => {
  detail.value = row;
};

const openAddForm = () => {
  showForm.value = true;
};

const submitForm = () => {
  const newItem = {
    id: hazards.length + 1,
    location: form.location || '未知区域',
    device: '手工录入',
    type: form.type || '待定',
    level: form.level,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    desc: form.desc || '无'
  };
  hazards.push(newItem);
  showForm.value = false;
};

const runScan = () => {
  scanning.value = true;
  scanProgress.value = 0;
  const timer = setInterval(() => {
    scanProgress.value = Math.min(100, scanProgress.value + 15);
    if (scanProgress.value >= 100) {
      clearInterval(timer);
    }
  }, 350);
};

const initCharts = () => {
  if (pieRef.value) {
    new Chart(pieRef.value, {
      type: 'pie',
      data: {
        labels: ['高', '中', '低'],
        datasets: [
          {
            data: [2, 2, 1],
            backgroundColor: ['#ef4444', '#f59e0b', '#22c55e'],
            borderWidth: 0
          }
        ]
      },
      options: {
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }
  if (lineRef.value) {
    new Chart(lineRef.value, {
      type: 'line',
      data: {
        labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        datasets: [
          {
            label: '隐患次数',
            data: [5, 4, 6, 3, 7, 4, 5],
            fill: false,
            borderColor: '#3b82f6',
            tension: 0.3
          }
        ]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { ticks: { stepSize: 2 }, beginAtZero: true } }
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
  gap: 18px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.charts {
  width: 100%;
}

.chart-block {
  flex: 1;
  min-width: 260px;
  padding: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #f8fafc;
}
</style>
