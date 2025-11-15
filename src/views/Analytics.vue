<template>
  <div class="module-shell">
    <header class="module-header">
      <div>
        <p class="eyebrow">数据分析</p>
        <h3>危废全流程指标 · 可视化洞察</h3>
      </div>
      <div class="actions">
        <button @click="exportOpen = true">导出数据</button>
        <button class="ghost" @click="subscribeOpen = true">订阅周报</button>
      </div>
    </header>
    <section class="charts">
      <article class="chart-card">
        <header>
          <h4>月度危废去向</h4>
          <span>单位：吨</span>
        </header>
        <div class="stacked-bars">
          <div v-for="item in flowData" :key="item.month" class="bar">
            <span>{{ item.month }}</span>
            <div class="segments">
              <div class="incinerate" :style="{ height: item.incinerate + '%' }" :title="'焚烧 ' + item.incinerate"></div>
              <div class="landfill" :style="{ height: item.landfill + '%' }" :title="'填埋 ' + item.landfill"></div>
              <div class="recycle" :style="{ height: item.recycle + '%' }" :title="'资源化 ' + item.recycle"></div>
            </div>
          </div>
        </div>
      </article>
      <article class="chart-card">
        <header>
          <h4>环节耗时 (小时)</h4>
          <span>登记-运输-入库-处置</span>
        </header>
        <div class="line-chart">
          <svg viewBox="0 0 300 120">
            <polyline :points="linePoints" />
          </svg>
          <div class="labels">
            <span v-for="stage in stages" :key="stage">{{ stage }}</span>
          </div>
        </div>
      </article>
    </section>
    <section class="kpi">
      <article v-for="item in kpis" :key="item.title" class="kpi-card">
        <p>{{ item.title }}</p>
        <strong>{{ item.value }}</strong>
        <span :class="item.trend >= 0 ? 'up' : 'down'">{{ item.trend >= 0 ? '+' : '' }}{{ item.trend }}%</span>
      </article>
    </section>

    <ModalDialog v-if="exportOpen" title="导出数据" primary-text="生成 CSV" @close="exportOpen = false" @confirm="confirmExport">
      <p>将导出本月所有危废记录、运输计划及仓储库存。</p>
      <p>导出完成后将自动下载 CSV 并发送至您邮箱。</p>
    </ModalDialog>

    <ModalDialog
      v-if="subscribeOpen"
      title="订阅周报"
      primary-text="订阅"
      @close="subscribeOpen = false"
      @confirm="confirmSubscribe"
    >
      <p>每周一 09:00 推送系统运行简报至您邮箱。</p>
      <label class="email">
        邮箱
        <input v-model="email" type="email" placeholder="you@company.com" />
      </label>
    </ModalDialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const flowData = [
  { month: '1月', incinerate: 60, landfill: 20, recycle: 30 },
  { month: '2月', incinerate: 54, landfill: 26, recycle: 35 },
  { month: '3月', incinerate: 65, landfill: 22, recycle: 40 },
  { month: '4月', incinerate: 58, landfill: 24, recycle: 38 }
];

const stages = ['登记', '运输', '入库', '处置'];
const stageHours = [5, 8, 6, 10];
const linePoints = computed(() =>
  stageHours.map((value, index) => `${(index / (stageHours.length - 1)) * 300},${120 - value * 10}`).join(' ')
);

const kpis = [
  { title: '危废总量 (月)', value: '128 吨', trend: 6 },
  { title: '平均转运时长', value: '7.8 小时', trend: -4 },
  { title: '台账准确率', value: '100%', trend: 0 },
  { title: '预警响应', value: '12 分钟', trend: 8 }
];

const exportOpen = ref(false);
const subscribeOpen = ref(false);
const email = ref('');

const confirmExport = () => {
  exportOpen.value = false;
};

const confirmSubscribe = () => {
  subscribeOpen.value = false;
};
</script>

<style scoped>
.module-shell {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions {
  display: flex;
  gap: 0.75rem;
}

button {
  background: linear-gradient(120deg, #0ea5e9, #38bdf8);
  color: #fff;
  border-radius: 16px;
  padding: 0.7rem 1.6rem;
}

button.ghost {
  background: rgba(14, 165, 233, 0.15);
  color: #0369a1;
}

.charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}

.chart-card {
  background: #f0f9ff;
  border-radius: 22px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stacked-bars {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  height: 180px;
}

.bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.segments {
  width: 40px;
  background: #e2e8f0;
  border-radius: 999px;
  display: flex;
  flex-direction: column-reverse;
  overflow: hidden;
  height: 140px;
}

.segments div {
  width: 100%;
}

.incinerate {
  background: #f87171;
}

.landfill {
  background: #fb923c;
}

.recycle {
  background: #34d399;
}

.line-chart svg {
  width: 100%;
  height: 150px;
}

polyline {
  fill: none;
  stroke: #0284c7;
  stroke-width: 3;
}

.labels {
  display: flex;
  justify-content: space-between;
  color: #475569;
}

.kpi {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}

.kpi-card {
  background: #e0f2fe;
  border-radius: 20px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.kpi-card span.up {
  color: #16a34a;
}

.kpi-card span.down {
  color: #dc2626;
}

.email {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-top: 0.75rem;
}

.email input {
  background: #f1f5f9;
  border-radius: 12px;
  padding: 0.65rem 1rem;
}
</style>
