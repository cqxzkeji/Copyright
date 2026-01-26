<template>
  <section class="page">
    <div class="card">
      <div class="card-header">
        <h2>数据统计与分析</h2>
        <div class="button-group">
          <button class="primary" type="button" @click="openGenerate">生成分析</button>
          <button class="secondary" type="button" @click="openTrend">查看趋势</button>
          <button class="secondary" type="button" @click="openExport">导出图表</button>
        </div>
      </div>
      <div class="chart-wrapper">
        <svg viewBox="0 0 600 240" class="chart">
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#3b5bfd" />
              <stop offset="100%" stop-color="#8fb2ff" />
            </linearGradient>
          </defs>
          <line x1="40" y1="20" x2="40" y2="210" stroke="#d7ddea" />
          <line x1="40" y1="210" x2="580" y2="210" stroke="#d7ddea" />
          <g v-for="(item, index) in activityBars" :key="item.month">
            <rect
              :x="60 + index * 42"
              :y="210 - item.value"
              width="26"
              :height="item.value"
              fill="url(#barGradient)"
              rx="6"
            />
            <text :x="73 + index * 42" y="228" text-anchor="middle" font-size="10" fill="#7b879a">
              {{ item.month }}
            </text>
          </g>
        </svg>
        <div class="chart-summary">
          <div>
            <strong>{{ activeRate }}%</strong>
            <p>客户活跃度</p>
          </div>
          <div>
            <strong>{{ tradeRate }} 次</strong>
            <p>平均交易频率</p>
          </div>
          <div>
            <strong>{{ retentionRate }}%</strong>
            <p>客户留存率</p>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h2>客户行为分析表</h2>
        <button class="secondary" type="button" @click="openInsight">生成洞察</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>客户群</th>
            <th>平均订单</th>
            <th>交易频率</th>
            <th>访问时段</th>
            <th>推荐指数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in behaviorData" :key="item.id">
            <td>{{ item.segment }}</td>
            <td>¥ {{ item.order }}</td>
            <td>{{ item.frequency }} 次/月</td>
            <td>{{ item.visit }}</td>
            <td>{{ item.nps }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :open="modalOpen" :title="modalTitle" @close="closeModal">
      <template v-if="modalType === 'progress'">
        <p>{{ modalMessage }}</p>
        <div class="progress-bar">
          <span :style="{ width: `${progress}%` }"></span>
        </div>
        <p style="text-align: right;">{{ progress }}%</p>
      </template>
      <template v-else>
        <p>{{ modalMessage }}</p>
        <div class="button-group" style="justify-content: flex-end;">
          <button class="primary" type="button" @click="closeModal">完成</button>
        </div>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const activityBars = [
  { month: '1月', value: 90 },
  { month: '2月', value: 110 },
  { month: '3月', value: 150 },
  { month: '4月', value: 130 },
  { month: '5月', value: 170 },
  { month: '6月', value: 160 },
  { month: '7月', value: 190 },
  { month: '8月', value: 175 },
  { month: '9月', value: 200 },
  { month: '10月', value: 185 },
  { month: '11月', value: 210 },
  { month: '12月', value: 195 }
];

const behaviorData = ref(
  Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    segment: `画像群组-${index + 1}`,
    order: (260 + index * 12).toFixed(2),
    frequency: 2 + (index % 5),
    visit: ['上午', '午后', '晚上'][index % 3],
    nps: `${70 + (index % 20)}分`
  }))
);

const activeRate = 78;
const tradeRate = 5.6;
const retentionRate = 92;

const modalOpen = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const modalType = ref('');
const progress = ref(0);
let timer = null;

const openProgress = (title, message) => {
  modalTitle.value = title;
  modalMessage.value = message;
  modalType.value = 'progress';
  modalOpen.value = true;
  progress.value = 0;
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer);
      modalType.value = '';
      modalMessage.value = '分析完成，已生成最新洞察报告。';
      return;
    }
    progress.value += 10;
  }, 300);
};

const openGenerate = () => {
  openProgress('生成分析', '正在计算客户活跃度与交易频率...');
};

const openTrend = () => {
  modalTitle.value = '趋势洞察';
  modalMessage.value = '本季度活跃客户增长 12%，高价值客户转化率提升 8%。';
  modalType.value = '';
  modalOpen.value = true;
};

const openExport = () => {
  modalTitle.value = '导出图表';
  modalMessage.value = '图表已打包为 PNG + CSV，将发送至您的邮箱。';
  modalType.value = '';
  modalOpen.value = true;
};

const openInsight = () => {
  modalTitle.value = '行为洞察';
  modalMessage.value = '建议在晚间推出组合套餐，提高夜间客群下单率。';
  modalType.value = '';
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
  if (timer) {
    clearInterval(timer);
  }
};

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.chart-wrapper {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  gap: 24px;
  align-items: center;
}

.chart {
  width: 100%;
  height: 240px;
}

.chart-summary {
  display: grid;
  gap: 12px;
}

.chart-summary strong {
  font-size: 20px;
  color: #3b5bfd;
}

.chart-summary p {
  margin: 4px 0 0;
  color: #7b879a;
}

@media (max-width: 900px) {
  .chart-wrapper {
    grid-template-columns: 1fr;
  }
}
</style>
