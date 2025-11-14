<template>
  <section class="panel">
    <header>
      <div>
        <h3>数据统计与分析</h3>
        <p>实时掌握场景浏览、互动学习与后台操作数据</p>
      </div>
      <button @click="downloadReport">导出日报</button>
    </header>
    <div class="metrics">
      <div class="metric" v-for="metric in metrics" :key="metric.label">
        <p>{{ metric.label }}</p>
        <strong>{{ metric.value }}</strong>
        <small>{{ metric.trend }}</small>
      </div>
    </div>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>模块</th>
            <th>使用人次</th>
            <th>平均时长</th>
            <th>满意度</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in dataRows" :key="row.module">
            <td>{{ row.module }}</td>
            <td>{{ row.usage }}</td>
            <td>{{ row.duration }} 分钟</td>
            <td>{{ row.satisfaction }}%</td>
            <td><button class="secondary" @click="showDetail(row)">查看</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <ModalDialog v-model="reportModal" title="日报导出">
      <p>数据已打包为 CSV 并发送至管理邮箱。</p>
    </ModalDialog>
    <ModalDialog v-model="detailModal" :title="activeRow?.module ?? '模块详情'">
      <p>使用人次：{{ activeRow?.usage }}</p>
      <p>平均体验时长：{{ activeRow?.duration }} 分钟</p>
      <p>满意度：{{ activeRow?.satisfaction }}%</p>
    </ModalDialog>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const metrics = [
  { label: '累计参观', value: '18,302', trend: '较昨日 +8.3%' },
  { label: '互动课程完成', value: '1,245', trend: '较昨日 +4.2%' },
  { label: '场景同步成功率', value: '99.3%', trend: '连续稳定 7 天' }
];

const dataRows = [
  { module: '场景展示', usage: 6200, duration: 9, satisfaction: 95 },
  { module: '资源建模', usage: 380, duration: 18, satisfaction: 88 },
  { module: '交互学习', usage: 3100, duration: 12, satisfaction: 91 },
  { module: '后台管理', usage: 260, duration: 6, satisfaction: 89 }
];

const reportModal = ref(false);
const detailModal = ref(false);
const activeRow = ref(null);

const downloadReport = () => {
  reportModal.value = true;
};

const showDetail = (row) => {
  activeRow.value = row;
  detailModal.value = true;
};
</script>

<style scoped>
.panel {
  background: white;
  border-radius: 18px;
  padding: 1.5rem;
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.08);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.metric {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1rem;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border-bottom: 1px solid #e2e8f0;
  padding: 0.75rem;
  text-align: left;
}

button {
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  background: #6366f1;
  color: white;
}

button.secondary {
  background: #e2e8f0;
  color: #0f172a;
}
</style>
