<template>
  <div class="page-shell">
    <section class="page-header">
      <div>
        <p class="eyebrow">Data Intelligence</p>
        <h2>数据分析与报告</h2>
        <p>统一整合运营、项目、客户数据，智能生成洞察。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="showReport = true">导出报告</button>
        <button @click="showFilter = true">指标筛选</button>
      </div>
    </section>
    <section class="grid">
      <article class="panel">
        <h3>多维指标对比</h3>
        <div class="radar">
          <div v-for="axis in axes" :key="axis.label" class="radar-axis">
            <span>{{ axis.label }}</span>
            <div class="bar">
              <div class="fill" :style="{ width: axis.score + '%' }"></div>
            </div>
          </div>
        </div>
      </article>
      <article class="panel">
        <h3>收入预测</h3>
        <div class="forecast">
          <div v-for="item in forecast" :key="item.month" class="forecast-item">
            <span>{{ item.month }}</span>
            <div class="forecast-bar">
              <div class="fill" :style="{ height: item.value + '%' }"></div>
            </div>
          </div>
        </div>
        <button class="secondary" @click="showForecast = true">查看预测逻辑</button>
      </article>
    </section>
    <section class="panel">
      <h3>即时洞察</h3>
      <div class="insights">
        <div v-for="insight in insights" :key="insight.title" class="insight-card">
          <strong>{{ insight.title }}</strong>
          <p>{{ insight.desc }}</p>
          <button @click="openInsight(insight)">推送</button>
        </div>
      </div>
    </section>
    <ModalDialog v-model="showReport" title="导出成功">
      <p>《月度 IT 咨询项目群运营报告》已生成并发送邮件。</p>
    </ModalDialog>
    <ModalDialog v-model="showFilter" title="指标筛选">
      <p>已启用：项目毛利、顾问利用率、交付满意度。</p>
    </ModalDialog>
    <ModalDialog v-model="showForecast" title="预测模型">
      <p>基于 36 个月收入历史 + 行业指数的 ARIMA 模型。</p>
    </ModalDialog>
    <ModalDialog v-model="showInsightModal" :title="currentInsight?.title ?? '洞察详情'">
      <p>{{ currentInsight?.desc }}</p>
      <div class="progress">
        <div class="progress-fill" :style="{ width: insightProgress + '%' }"></div>
      </div>
      <p>推送到主管邮箱完成度 {{ insightProgress }}%</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showReport = ref(false);
const showFilter = ref(false);
const showForecast = ref(false);
const showInsightModal = ref(false);
const currentInsight = ref(null);
const insightProgress = 82;

const axes = [
  { label: '交付质量', score: 86 },
  { label: '预算控制', score: 74 },
  { label: '客户满意度', score: 92 },
  { label: '资源效率', score: 68 },
  { label: '创新能力', score: 55 }
];

const forecast = [
  { month: '4月', value: 65 },
  { month: '5月', value: 72 },
  { month: '6月', value: 78 },
  { month: '7月', value: 90 }
];

const insights = [
  { title: '项目毛利波动', desc: '建议针对低毛利项目进行交付复盘。' },
  { title: '顾问加班提醒', desc: '华北交付团队近两周利用率超 90%。' },
  { title: '售前线索热点', desc: '制造行业云 MES 项目咨询需求激增。' }
];

const openInsight = (insight) => {
  currentInsight.value = insight;
  showInsightModal.value = true;
};
</script>

<style scoped>
.page-shell {
  padding: 40px 60px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.actions {
  display: flex;
  gap: 12px;
}

button {
  border: none;
  border-radius: 14px;
  padding: 10px 18px;
  font-weight: 600;
}

.primary {
  background: linear-gradient(120deg, #2563eb, #9333ea);
  color: #fff;
}

.secondary {
  background: #e0f2fe;
  color: #0369a1;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.panel {
  flex: 1 1 360px;
  background: #fff;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
}

.radar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.radar-axis .bar,
.forecast-bar,
.progress {
  background: #e2e8f0;
  border-radius: 999px;
}

.radar-axis .bar {
  height: 12px;
}

.radar-axis .fill,
.forecast-bar .fill,
.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(120deg, #10b981, #14b8a6);
}

.forecast {
  display: flex;
  align-items: flex-end;
  gap: 14px;
  height: 200px;
}

.forecast-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.forecast-bar {
  width: 36px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.forecast-bar .fill {
  width: 100%;
}

.insights {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.insight-card {
  flex: 1 1 280px;
  border-radius: 20px;
  background: #f8fafc;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.insight-card button {
  align-self: flex-start;
  background: #f97316;
  color: #fff;
  border-radius: 999px;
}

.progress {
  width: 100%;
  height: 12px;
  margin-top: 12px;
}

.progress-fill {
  background: linear-gradient(120deg, #f59e0b, #ef4444);
}
</style>
