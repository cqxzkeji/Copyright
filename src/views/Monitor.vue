<template>
  <div class="grid" style="gap: 18px">
    <div class="card">
      <header class="section-header">
        <div>
          <p class="eyebrow">指标监测分析</p>
          <h3>实时监测肾功能核心指标，展示趋势</h3>
        </div>
        <div class="chip-row">
          <button class="btn" @click="refreshData">刷新数据</button>
          <button class="btn secondary" @click="showNote = true">录入随访记录</button>
        </div>
      </header>
      <div class="chart-grid">
        <div class="card" style="background:#f8fafc;">
          <p class="eyebrow">血肌酐趋势</p>
          <canvas ref="creatinineChart"></canvas>
        </div>
        <div class="card" style="background:#f0f9ff;">
          <p class="eyebrow">eGFR 变化</p>
          <canvas ref="egfrChart"></canvas>
        </div>
      </div>
    </div>

    <div class="card">
      <header class="section-header">
        <h3>实时指标监测</h3>
        <small>高亮显示异常指标，辅助判断病情</small>
      </header>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
        <div class="card" v-for="metric in metrics" :key="metric.label" :style="{ background: metric.bg }">
          <p class="eyebrow">{{ metric.label }}</p>
          <h2>{{ metric.value }}</h2>
          <p :class="metric.status">{{ metric.statusText }}</p>
          <button class="btn secondary" @click="openInfo(metric.label + ' 已更新，时间：' + metric.time)">查看明细</button>
        </div>
      </div>
    </div>
  </div>

  <ModalDialog v-model="showNote" title="新增随访记录">
    <form class="grid" @submit.prevent="saveNote">
      <div>
        <label>随访内容</label>
        <textarea v-model="note" rows="3" placeholder="填写指标解读、生活方式建议等" required></textarea>
      </div>
      <div class="form-row">
        <div>
          <label>随访人</label>
          <input v-model="noteAuthor" placeholder="主管医生" required />
        </div>
        <div>
          <label>时间</label>
          <input type="datetime-local" v-model="noteTime" required />
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" type="button" @click="showNote = false">取消</button>
        <button class="btn" type="submit">保存</button>
      </div>
    </form>
  </ModalDialog>

  <ModalDialog v-model="showInfo" title="提示">
    <p>{{ infoMessage }}</p>
    <div class="modal-footer">
      <button class="btn" @click="showInfo = false">知道了</button>
    </div>
  </ModalDialog>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Filler } from 'chart.js';
import ModalDialog from '../components/ModalDialog.vue';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Filler);

const creatinineChart = ref(null);
const egfrChart = ref(null);
const showNote = ref(false);
const showInfo = ref(false);
const infoMessage = ref('');
const note = ref('');
const noteAuthor = ref('');
const noteTime = ref('');

const metrics = ref([
  { label: '血肌酐', value: '108 µmol/L', status: 'amber', statusText: '轻度升高', bg: '#fff7ed', time: '10:30' },
  { label: 'eGFR', value: '72 ml/min', status: 'green', statusText: '稳定', bg: '#ecfeff', time: '10:32' },
  { label: '尿蛋白', value: '165 mg/L', status: 'amber', statusText: '需复查', bg: '#fefce8', time: '10:35' },
  { label: '血压', value: '130/82 mmHg', status: 'green', statusText: '控制良好', bg: '#f0fdf4', time: '10:28' }
]);

const refreshData = () => {
  openInfo('实时数据已刷新，异常指标已同步至预警模块。');
};

const openInfo = (msg) => {
  infoMessage.value = msg;
  showInfo.value = true;
};

const renderCharts = () => {
  const labels = ['近6周', '近5周', '近4周', '近3周', '近2周', '本周'];
  const creatinineData = [125, 120, 118, 112, 110, 108];
  const egfrData = [65, 68, 70, 72, 73, 75];

  new Chart(creatinineChart.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: '血肌酐',
          data: creatinineData,
          tension: 0.4,
          fill: true,
          borderColor: '#f97316',
          backgroundColor: 'rgba(249, 115, 22, 0.15)'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });

  new Chart(egfrChart.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'eGFR',
          data: egfrData,
          tension: 0.4,
          fill: true,
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.15)'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
};

const saveNote = () => {
  openInfo(`随访记录已保存：${note.value}，记录人：${noteAuthor.value}`);
  showNote.value = false;
  note.value = '';
  noteAuthor.value = '';
  noteTime.value = '';
};

onMounted(() => {
  renderCharts();
});
</script>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.chart-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.card h2 {
  margin: 6px 0;
}
</style>
