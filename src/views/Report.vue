<template>
  <div class="grid" style="gap: 18px">
    <div class="card">
      <header class="section-header">
        <div>
          <p class="eyebrow">统计分析与报告</p>
          <h3>长期健康数据统计分析，生成阶段性报告</h3>
        </div>
        <div class="chip-row">
          <button class="btn" @click="generateReport">生成报告</button>
          <button class="btn secondary" @click="showSchedule = true">安排周期报告</button>
        </div>
      </header>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">
        <div class="card" style="background:#ecfeff;">
          <p class="eyebrow">近三月平均肌酐</p>
          <h2>112 µmol/L</h2>
          <p>与上季度相比下降 6%</p>
        </div>
        <div class="card" style="background:#fef9c3;">
          <p class="eyebrow">eGFR 变化率</p>
          <h2>+2.3 ml/min</h2>
          <p>持续小幅改善</p>
        </div>
        <div class="card" style="background:#f0fdf4;">
          <p class="eyebrow">随访完成率</p>
          <h2>93%</h2>
          <p>未完成随访 3 人</p>
        </div>
      </div>
    </div>

    <div class="card">
      <header class="section-header">
        <h3>趋势统计</h3>
        <small>展示关键指标月度变化</small>
      </header>
      <div class="chart-grid">
        <div class="card" style="background:#f8fafc;">
          <p class="eyebrow">肌酐月度走势</p>
          <canvas ref="creatinineMonth"></canvas>
        </div>
        <div class="card" style="background:#f0f9ff;">
          <p class="eyebrow">eGFR 月度走势</p>
          <canvas ref="egfrMonth"></canvas>
        </div>
      </div>
    </div>

    <div class="card">
      <header class="section-header">
        <h3>阶段性报告概览</h3>
        <small>可导出或分享给患者与家属</small>
        <div class="chip-row">
          <button class="btn secondary" @click="openInfo('报告已发送至指定邮箱。')">发送邮件</button>
          <button class="btn secondary" @click="openInfo('报告链接已复制，可分享。')">复制链接</button>
        </div>
      </header>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>报告名称</th>
              <th>周期</th>
              <th>核心亮点</th>
              <th>生成时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in reports" :key="report.title">
              <td>{{ report.title }}</td>
              <td>{{ report.period }}</td>
              <td>{{ report.summary }}</td>
              <td>{{ report.time }}</td>
              <td><button class="btn secondary" @click="openInfo(report.title + ' 已下载。')">下载</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <ModalDialog v-model="showProgress" title="报告生成中">
    <p>正在汇总指标、渲染趋势图并生成 PDF...</p>
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progress + '%' }"></div>
    </div>
    <p style="margin-top:8px">当前进度：{{ progress }}%</p>
    <div class="modal-footer">
      <button class="btn secondary" @click="showProgress = false">取消</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showSchedule" title="安排周期报告">
    <form class="grid" @submit.prevent="saveSchedule">
      <div class="form-row">
        <div>
          <label>患者群组</label>
          <input v-model="scheduleForm.group" required />
        </div>
        <div>
          <label>频次</label>
          <select v-model="scheduleForm.frequency" class="select">
            <option>每周</option>
            <option>每月</option>
            <option>每季度</option>
          </select>
        </div>
      </div>
      <div>
        <label>备注</label>
        <textarea v-model="scheduleForm.note" rows="2"></textarea>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" type="button" @click="showSchedule = false">取消</button>
        <button class="btn" type="submit">保存</button>
      </div>
    </form>
  </ModalDialog>

  <ModalDialog v-model="showInfo" title="提示">
    <p>{{ infoMessage }}</p>
    <div class="modal-footer">
      <button class="btn" @click="showInfo = false">好的</button>
    </div>
  </ModalDialog>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Filler } from 'chart.js';
import ModalDialog from '../components/ModalDialog.vue';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Filler);

const creatinineMonth = ref(null);
const egfrMonth = ref(null);
const showProgress = ref(false);
const showSchedule = ref(false);
const showInfo = ref(false);
const infoMessage = ref('');
const progress = ref(10);

const reports = reactive([
  { title: '2024 Q4 阶段报告', period: '季度', summary: '肾功能稳定，血压波动缩小', time: '2024-12-28 09:00' },
  { title: '11 月健康总结', period: '月度', summary: 'eGFR 较上月上升 2ml/min', time: '2024-12-01 08:30' },
  { title: '近期随访汇总', period: '周报', summary: '随访完成率 93%，异常 2 例', time: '2024-12-11 19:00' }
]);

const scheduleForm = reactive({ group: '高风险组', frequency: '每月', note: '自动发送给家属邮箱' });

const renderCharts = () => {
  const labels = ['7月', '8月', '9月', '10月', '11月', '12月'];
  const creatinineData = [125, 120, 118, 116, 113, 112];
  const egfrData = [62, 65, 68, 70, 72, 74];

  new Chart(creatinineMonth.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: '肌酐',
          data: creatinineData,
          borderColor: '#f97316',
          backgroundColor: 'rgba(249, 115, 22, 0.15)',
          tension: 0.35,
          fill: true
        }
      ]
    },
    options: { plugins: { legend: { display: false } } }
  });

  new Chart(egfrMonth.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'eGFR',
          data: egfrData,
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          tension: 0.35,
          fill: true
        }
      ]
    },
    options: { plugins: { legend: { display: false } } }
  });
};

const generateReport = () => {
  progress.value = 10;
  showProgress.value = true;
  const timer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer);
      showProgress.value = false;
      openInfo('报告生成完成，可下载和分享。');
    } else {
      progress.value += 18;
    }
  }, 400);
};

const saveSchedule = () => {
  openInfo(`周期报告已安排：${scheduleForm.group}，频次 ${scheduleForm.frequency}`);
  showSchedule.value = false;
};

const openInfo = (msg) => {
  infoMessage.value = msg;
  showInfo.value = true;
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

.table-wrapper {
  overflow-x: auto;
}
</style>
