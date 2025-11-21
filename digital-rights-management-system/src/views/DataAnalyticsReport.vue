<template>
  <div class="module-shell">
    <section class="panel">
      <header class="panel-header">
        <div>
          <h2>收益趋势</h2>
          <p>覆盖 12 个月的渠道流水</p>
        </div>
        <button @click="exportReport">导出图表</button>
      </header>
      <div class="line-chart">
        <svg viewBox="0 0 400 160">
          <polyline :points="linePoints" fill="rgba(99,102,241,0.2)" stroke="#6366f1" stroke-width="3" />
        </svg>
      </div>
      <div class="chart-legend">
        <span>蓝色：授权收入</span>
        <span>单位：万元</span>
      </div>
    </section>

    <section class="panel">
      <header class="panel-header">
        <h2>报表中心</h2>
        <button @click="scheduleEmail">预约发送</button>
      </header>
      <div class="report-grid">
        <article v-for="report in reports" :key="report.title" class="report-card">
          <h3>{{ report.title }}</h3>
          <p>{{ report.desc }}</p>
          <button class="ghost" @click="() => openReport(report)">查看详情</button>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
const data = [12, 18, 16, 25, 28, 34, 31, 38, 44, 42, 48, 55];
const stepX = 400 / (data.length - 1);
const linePoints = data.map((value, index) => `${index * stepX},${160 - value * 2}`).join(' ');

const reports = [
  { title: '平台分成报表', desc: '展示各分发渠道的收入拆分' },
  { title: '授权转化漏斗', desc: '记录每一步转化率与客户留存' },
  { title: '侵权热力图', desc: '统计高风险领域与地区' }
];

function exportReport() {
  window.alert('收益图已生成 PNG，并保存在下载中心。');
}

function scheduleEmail() {
  window.alert('系统将在每周一 09:00 自动发送报表邮件。');
}

function openReport(report) {
  window.alert(`报表：${report.title}\n内容：${report.desc}`);
}
</script>

<style scoped>
.module-shell {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.panel {
  flex: 1 1 360px;
  background: rgba(249, 250, 251, 0.9);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.line-chart {
  width: 100%;
  height: 200px;
  background: #fff;
  border-radius: 20px;
  padding: 1rem;
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.08);
}

svg {
  width: 100%;
  height: 100%;
}

.chart-legend {
  display: flex;
  justify-content: space-between;
  color: #6b7280;
}

.report-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.report-card {
  background: #fff;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 15px 25px rgba(15, 23, 42, 0.09);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ghost {
  background: #111827;
}
</style>
