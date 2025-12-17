<template>
  <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">
    <div class="card">
      <div class="flex" style="justify-content: space-between;">
        <div>
          <p class="muted">今日成交额</p>
          <h2>￥238,600</h2>
        </div>
        <button @click="openInfo('同步实时数据中...')">刷新概览</button>
      </div>
      <div class="stat-bar" style="margin-top: 12px;">
        <div v-for="stat in stats" :key="stat.label" class="stat-row">
          <span>{{ stat.label }}</span>
          <div class="bar-track"><div class="bar-fill" :style="{ width: stat.value + '%' }"></div></div>
          <span>{{ stat.value }}%</span>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="flex" style="justify-content: space-between;">
        <div>
          <p class="muted">渠道分布</p>
          <h2>订单来源</h2>
        </div>
        <button class="secondary" @click="openProgress('导出日报中...')">导出日报</button>
      </div>
      <div class="chart">
        <div v-for="channel in channels" :key="channel.name" class="chart-row">
          <span>{{ channel.name }}</span>
          <div class="bar-track"><div class="bar-fill" :style="{ width: channel.share + '%' }"></div></div>
          <span>{{ channel.share }}%</span>
        </div>
      </div>
    </div>
    <div class="card" style="grid-column: 1 / -1;">
      <div class="flex" style="justify-content: space-between;">
        <h3>近七日运营快照</h3>
        <button @click="openInfo('计划任务将在30分钟后执行')">提醒</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>日期</th>
            <th>访客</th>
            <th>转化</th>
            <th>成交额</th>
            <th>履约状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in snapshot" :key="item.date">
            <td>{{ item.date }}</td>
            <td>{{ item.visitors }}</td>
            <td>{{ item.conversion }}%</td>
            <td>￥{{ item.revenue }}</td>
            <td><span :class="['badge', item.status === '正常' ? 'success' : 'warn']">{{ item.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ModalDialog :visible="infoModal" title="操作提示" @close="infoModal = false">
    <p>{{ infoMessage }}</p>
  </ModalDialog>

  <ModalDialog :visible="progressModal" title="执行进度" @close="progressModal = false">
    <p style="margin: 0 0 8px 0;">{{ progressMessage }}</p>
    <div class="progress"><div class="progress-fill" :style="{ width: progress + '%' }"></div></div>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const stats = [
  { label: '订单履约', value: 92 },
  { label: '售后响应', value: 88 },
  { label: '仓储周转', value: 76 },
  { label: '支付成功', value: 95 },
];

const channels = [
  { name: '自营商城', share: 36 },
  { name: '抖音小店', share: 22 },
  { name: '拼多多', share: 18 },
  { name: '天猫旗舰店', share: 14 },
  { name: '社区团购', share: 10 },
];

const snapshot = [
  { date: '05-01', visitors: 3400, conversion: 5.4, revenue: 180000, status: '正常' },
  { date: '05-02', visitors: 3600, conversion: 5.6, revenue: 188200, status: '正常' },
  { date: '05-03', visitors: 3100, conversion: 5.2, revenue: 165400, status: '正常' },
  { date: '05-04', visitors: 3900, conversion: 5.8, revenue: 201000, status: '正常' },
  { date: '05-05', visitors: 2800, conversion: 4.8, revenue: 148300, status: '预警' },
  { date: '05-06', visitors: 3200, conversion: 5.1, revenue: 160900, status: '正常' },
  { date: '05-07', visitors: 4100, conversion: 6.0, revenue: 218600, status: '正常' },
  { date: '05-08', visitors: 4300, conversion: 6.3, revenue: 226800, status: '正常' },
  { date: '05-09', visitors: 4000, conversion: 5.7, revenue: 210300, status: '正常' },
  { date: '05-10', visitors: 3800, conversion: 5.5, revenue: 198700, status: '正常' },
];

const infoModal = ref(false);
const progressModal = ref(false);
const infoMessage = ref('');
const progressMessage = ref('');
const progress = ref(0);

const openInfo = (message) => {
  infoMessage.value = message;
  infoModal.value = true;
};

const openProgress = (message) => {
  progressMessage.value = message;
  progress.value = 0;
  progressModal.value = true;
  setTimeout(() => (progress.value = 38), 200);
  setTimeout(() => (progress.value = 72), 600);
  setTimeout(() => (progress.value = 100), 1000);
};
</script>

<style scoped>
.chart {
  display: grid;
  gap: 10px;
}

.chart-row {
  display: grid;
  grid-template-columns: 110px 1fr 50px;
  align-items: center;
  gap: 10px;
  color: var(--muted);
}
</style>
