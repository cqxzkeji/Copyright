<template>
  <div class="module-wrapper">
    <div class="section-header">
      <div>
        <h2>数据分析与报告</h2>
        <p>吸附效果、磷去除率、运行能耗一目了然。</p>
      </div>
      <div class="actions">
        <button @click="showReport = true">生成报告</button>
        <button @click="showShare = true">分享数据</button>
        <button @click="showExport = true">导出表格</button>
      </div>
    </div>

    <div class="cards">
      <div class="card">
        <div class="card-title">去除率曲线</div>
        <div class="chart">
          <div v-for="point in removal" :key="point.label" class="bar" :style="{ height: point.value + 'px' }">
            <span>{{ point.label }}</span>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-title">能耗分布</div>
        <div class="pill" v-for="energy in energies" :key="energy.name">
          <span>{{ energy.name }}</span>
          <div class="pill-bar">
            <div class="pill-fill" :style="{ width: energy.percent + '%' }"></div>
          </div>
          <span class="value">{{ energy.percent }}%</span>
        </div>
      </div>
    </div>

    <div class="table-wrapper">
      <div class="table-title">日常统计（不少于10条）</div>
      <table>
        <thead>
          <tr>
            <th>日期</th>
            <th>进水 TP(mg/L)</th>
            <th>出水 TP(mg/L)</th>
            <th>去除率(%)</th>
            <th>能耗(kWh)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in daily" :key="row.date">
            <td>{{ row.date }}</td>
            <td>{{ row.in }}</td>
            <td>{{ row.out }}</td>
            <td>{{ row.rate }}</td>
            <td>{{ row.energy }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal title="报告生成" :visible="showReport" @close="showReport = false">
      <form class="modal-form">
        <label>时间范围<select v-model="reportForm.range"><option>最近7天</option><option>最近30天</option></select></label>
        <label>包含图表<select v-model="reportForm.charts"><option>全部</option><option>仅去除率</option></select></label>
        <label>签名人<input v-model="reportForm.sign" placeholder="审核人" /></label>
      </form>
      <template #footer>
        <button class="ghost" @click="showReport = false">取消</button>
        <button class="primary" @click="submitReport">生成 PDF</button>
      </template>
    </BaseModal>

    <BaseModal title="分享设置" :visible="showShare" @close="showShare = false">
      <p>生成只读链接，支持二维码展示。</p>
      <div class="progress" v-for="share in shareLinks" :key="share.name">
        <div class="progress-header">
          <span>{{ share.name }}</span>
          <span>{{ share.progress }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: share.progress + '%' }"></div>
        </div>
      </div>
    </BaseModal>

    <BaseModal title="导出进度" :visible="showExport" @close="showExport = false">
      <p>导出 CSV/Excel 任务。</p>
      <div class="progress">
        <div class="progress-header">
          <span>进度</span>
          <span>{{ exportProgress }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: exportProgress + '%' }"></div>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const showReport = ref(false);
const showShare = ref(false);
const showExport = ref(false);

const reportForm = reactive({ range: '最近7天', charts: '全部', sign: '' });
const exportProgress = ref(68);

const removal = [
  { label: '周一', value: 120 },
  { label: '周二', value: 135 },
  { label: '周三', value: 140 },
  { label: '周四', value: 138 },
  { label: '周五', value: 142 },
  { label: '周六', value: 144 }
];

const energies = [
  { name: '提升泵', percent: 24 },
  { name: '搅拌与曝气', percent: 32 },
  { name: '压滤/脱水', percent: 18 },
  { name: '辅机与照明', percent: 12 }
];

const daily = [
  { date: '04-21', in: 2.1, out: 0.12, rate: 94.3, energy: 612 },
  { date: '04-22', in: 2.2, out: 0.13, rate: 94.1, energy: 605 },
  { date: '04-23', in: 2.3, out: 0.12, rate: 94.8, energy: 618 },
  { date: '04-24', in: 2.0, out: 0.11, rate: 94.5, energy: 599 },
  { date: '04-25', in: 1.9, out: 0.1, rate: 94.7, energy: 593 },
  { date: '04-26', in: 2.1, out: 0.12, rate: 94.3, energy: 607 },
  { date: '04-27', in: 2.0, out: 0.11, rate: 94.5, energy: 590 },
  { date: '04-28', in: 1.8, out: 0.09, rate: 95.0, energy: 585 },
  { date: '04-29', in: 1.9, out: 0.1, rate: 94.7, energy: 588 },
  { date: '04-30', in: 2.0, out: 0.1, rate: 95.0, energy: 591 }
];

const shareLinks = [
  { name: '内部链接', progress: 80 },
  { name: '二维码生成', progress: 65 },
  { name: '邮箱推送', progress: 52 }
];

const submitReport = () => {
  showReport.value = false;
};
</script>

<style scoped>
.module-wrapper {
  display: grid;
  gap: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

h2 {
  margin: 0;
}

p {
  margin: 6px 0 0;
  color: #475569;
}

.actions {
  display: flex;
  gap: 10px;
}

.actions button {
  border: none;
  padding: 10px 14px;
  border-radius: 12px;
  background: #e0e7ff;
  color: #312e81;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(99, 102, 241, 0.18);
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}

.card {
  background: #eef2ff;
  border-radius: 14px;
  padding: 14px;
  border: 1px solid #e0e7ff;
}

.card-title {
  font-weight: 700;
  margin-bottom: 10px;
}

.chart {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 180px;
}

.bar {
  flex: 1;
  background: linear-gradient(180deg, #a5b4fc, #e0e7ff);
  border-radius: 12px 12px 6px 6px;
  display: grid;
  place-items: center;
  color: #1e1b4b;
  font-weight: 700;
  position: relative;
}

.bar span {
  position: absolute;
  bottom: -24px;
  font-size: 13px;
}

.pill {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-weight: 600;
}

.pill-bar {
  width: 100%;
  background: #e0e7ff;
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
}

.pill-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #a5b4fc);
}

.table-wrapper {
  border: 1px solid #e0e7ff;
  border-radius: 14px;
  overflow: hidden;
}

.table-title {
  background: #ede9fe;
  padding: 12px;
  font-weight: 700;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px 12px;
  border-bottom: 1px solid #e0e7ff;
  text-align: left;
}

tr:nth-child(even) {
  background: #f5f3ff;
}

.modal-form {
  display: grid;
  gap: 10px;
}

.modal-form label {
  display: grid;
  gap: 6px;
  font-weight: 600;
}

.modal-form input,
.modal-form select {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #e0e7ff;
}

.ghost {
  background: #ede9fe;
}

.primary {
  background: #6366f1;
  color: #fff;
}

.progress {
  margin-bottom: 12px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
}

.progress-bar {
  background: #e0e7ff;
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 6px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #a5b4fc);
}
</style>
