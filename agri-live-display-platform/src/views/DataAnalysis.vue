<template>
  <section class="view">
    <div class="panel">
      <div class="panel-header">
        <div>
          <h2>数据统计与分析</h2>
          <p>汇总直播数据，生成趋势分析与报告。</p>
        </div>
        <div class="actions">
          <button class="primary" @click="openModal('report')">生成报告</button>
          <button class="ghost" @click="openModal('export')">导出数据</button>
          <button class="outline" @click="openModal('progress')">计算进度</button>
        </div>
      </div>
      <div class="chart-grid">
        <div class="chart-card" v-for="metric in metrics" :key="metric.label">
          <h3>{{ metric.label }}</h3>
          <div class="bar">
            <div class="fill" :style="{ width: metric.value + '%' }"></div>
          </div>
          <p>{{ metric.value }}%</p>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h2>数据指标明细</h2>
        <button class="primary" @click="openModal('filter')">筛选维度</button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>日期</th>
              <th>直播间</th>
              <th>观看人数</th>
              <th>互动率</th>
              <th>成交额</th>
              <th>客单价</th>
              <th>满意度</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.date + row.room">
              <td>{{ row.date }}</td>
              <td>{{ row.room }}</td>
              <td>{{ row.viewers }}</td>
              <td>{{ row.interaction }}</td>
              <td>{{ row.sales }}</td>
              <td>{{ row.unit }}</td>
              <td><span class="tag">{{ row.score }}</span></td>
              <td><button class="ghost" @click="openModal('detail')">分析</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <BaseModal v-if="activeModal" :title="modalTitle" :confirm-text="confirmText" @close="activeModal = ''" @confirm="confirm">
    <template v-if="activeModal === 'report'">
      <label>
        报告周期
        <select v-model="form.period">
          <option>本周</option>
          <option>本月</option>
          <option>自定义</option>
        </select>
      </label>
      <label>
        报告主题
        <input v-model="form.topic" placeholder="例如：直播复盘" />
      </label>
    </template>
    <template v-else-if="activeModal === 'export'">
      <p>请选择导出格式</p>
      <label>
        导出格式
        <select v-model="form.format">
          <option>CSV</option>
          <option>Excel</option>
          <option>PDF</option>
        </select>
      </label>
    </template>
    <template v-else-if="activeModal === 'filter'">
      <label>
        直播间
        <input v-model="form.room" placeholder="输入直播间名称" />
      </label>
      <label>
        指标范围
        <select v-model="form.range">
          <option>全部</option>
          <option>转化率高于 6%</option>
          <option>成交额高于 20 万</option>
        </select>
      </label>
    </template>
    <template v-else-if="activeModal === 'detail'">
      <p>已生成本场分析结果。</p>
      <ul class="info-list">
        <li>流量来源：推荐位 62%</li>
        <li>平均观看时长：14 分钟</li>
        <li>复购意向：68%</li>
      </ul>
    </template>
    <template v-else-if="activeModal === 'progress'">
      <p>模型计算进度</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p>{{ progress }}% 已完成</p>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const metrics = [
  { label: '直播间转化率', value: 78 },
  { label: '复购转化率', value: 66 },
  { label: '用户满意度', value: 88 },
  { label: '优惠券使用率', value: 54 },
  { label: '推荐位点击率', value: 72 }
];

const tableRows = [
  { date: '04-01', room: '清晨采摘', viewers: '1.2万', interaction: '6.8%', sales: '18.2万', unit: '￥86', score: '良好' },
  { date: '04-02', room: '午间厨房', viewers: '1.8万', interaction: '7.2%', sales: '22.4万', unit: '￥92', score: '优秀' },
  { date: '04-03', room: '夜场团购', viewers: '2.4万', interaction: '8.1%', sales: '28.2万', unit: '￥98', score: '优秀' },
  { date: '04-04', room: '清晨采摘', viewers: '1.1万', interaction: '6.3%', sales: '16.5万', unit: '￥80', score: '良好' },
  { date: '04-05', room: '午间厨房', viewers: '1.9万', interaction: '7.4%', sales: '25.9万', unit: '￥94', score: '优秀' },
  { date: '04-06', room: '夜场团购', viewers: '2.1万', interaction: '7.8%', sales: '26.4万', unit: '￥96', score: '优秀' },
  { date: '04-07', room: '清晨采摘', viewers: '1.4万', interaction: '6.9%', sales: '19.1万', unit: '￥88', score: '良好' },
  { date: '04-08', room: '午间厨房', viewers: '1.7万', interaction: '7.0%', sales: '21.3万', unit: '￥90', score: '良好' },
  { date: '04-09', room: '夜场团购', viewers: '2.0万', interaction: '7.6%', sales: '24.8万', unit: '￥95', score: '优秀' },
  { date: '04-10', room: '清晨采摘', viewers: '1.5万', interaction: '6.7%', sales: '20.4万', unit: '￥87', score: '良好' }
];

const activeModal = ref('');
const modalTitle = ref('');
const confirmText = ref('确认');
const progress = ref(58);

const form = reactive({
  period: '本周',
  topic: '',
  format: 'CSV',
  room: '',
  range: '全部'
});

const openModal = (type) => {
  activeModal.value = type;
  const titleMap = {
    report: '生成数据报告',
    export: '导出数据',
    progress: '模型计算进度',
    filter: '筛选维度',
    detail: '场次分析详情'
  };
  modalTitle.value = titleMap[type];
  confirmText.value = type === 'detail' || type === 'progress' ? '' : '确认';
};

const confirm = () => {
  activeModal.value = '';
};
</script>

<style scoped>
.view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.panel {
  background: #fff;
  padding: 20px;
  border-radius: 18px;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
  display: grid;
  gap: 16px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.panel-header p {
  color: #64748b;
  font-size: 13px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.chart-card {
  background: #f8fafc;
  padding: 14px;
  border-radius: 16px;
  display: grid;
  gap: 10px;
}

.bar {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #a5b4fc);
}

.tag {
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

thead {
  background: #f1f5f9;
}

th,
td {
  padding: 10px 12px;
  text-align: left;
}

tr + tr {
  border-top: 1px solid #e2e8f0;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.ghost {
  background: #e0f2fe;
  color: #0369a1;
  border: none;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.outline {
  background: transparent;
  border: 1px solid #cbd5f5;
  color: #1d4ed8;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.progress {
  height: 12px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4ade80, #22d3ee);
}

input,
select,
textarea {
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.info-list {
  padding-left: 18px;
  color: #475569;
}
</style>
