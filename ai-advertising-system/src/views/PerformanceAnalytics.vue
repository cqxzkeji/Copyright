<template>
  <div class="module">
    <header>
      <div>
        <h3>广告效果分析与报告</h3>
        <p>实时监测 KPI，自动生成可交付报告。</p>
      </div>
      <button class="primary" @click="generateReport" title="生成报告">生成洞察报告</button>
    </header>

    <section class="grid">
      <div class="panel">
        <h4>核心指标</h4>
        <div class="kpi-grid">
          <div class="kpi" v-for="metric in metrics" :key="metric.label">
            <small>{{ metric.label }}</small>
            <strong>{{ metric.value }}</strong>
            <span :class="{ up: metric.trend >= 0, down: metric.trend < 0 }">
              {{ metric.trend >= 0 ? '+' : '' }}{{ metric.trend }}%
            </span>
          </div>
        </div>
      </div>
      <div class="panel chart">
        <h4>渠道贡献</h4>
        <div class="stacked">
          <div v-for="item in contribution" :key="item.name">
            <span>{{ item.name }}</span>
            <div class="stack-shell">
              <div class="stack-bar" :style="{ width: item.value + '%' }"></div>
            </div>
            <span>{{ item.value }}%</span>
          </div>
        </div>
        <button class="ghost" @click="showShare = true">分享报告链接</button>
      </div>
    </section>

    <ModalDialog v-model="showReport" title="报告生成进度">
      <p>正在写入 {{ selectedPeriod }} 报告...</p>
      <div class="progress-shell"><div class="progress" :style="{ width: progress + '%' }"></div></div>
      <small>可视化渲染完成度：{{ progress }}%</small>
    </ModalDialog>

    <ModalDialog v-model="showShare" title="报告分享">
      <p>链接：analytics.ai/report/{{ shareCode }}</p>
      <p>有效期：24 小时</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const metrics = [
  { label: '曝光', value: '8.2M', trend: 12 },
  { label: '点击', value: '320K', trend: 6 },
  { label: '转化', value: '12.4K', trend: 4 },
  { label: 'ROI', value: '3.6', trend: 9 }
];
const contribution = [
  { name: '信息流', value: 45 },
  { name: '短视频', value: 28 },
  { name: '直播', value: 17 },
  { name: '搜索', value: 10 }
];
const periods = ['今日', '近7天', '近30天'];
const selectedPeriod = ref(periods[1]);
const showReport = ref(false);
const showShare = ref(false);
const progress = ref(0);
const shareCode = ref('AD-9821');
let timer;

const generateReport = () => {
  showReport.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value += 25;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(timer);
    }
  }, 250);
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.grid {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.panel {
  flex: 1;
  min-width: 280px;
  background: #fff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 20px 35px rgba(15, 23, 42, 0.08);
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.kpi {
  padding: 16px;
  background: #f9fafb;
  border-radius: 14px;
}

.kpi small {
  color: #6b7280;
}

.kpi strong {
  display: block;
  font-size: 1.4rem;
  margin: 6px 0;
}

.kpi span {
  font-weight: 600;
}

.up {
  color: #16a34a;
}

.down {
  color: #dc2626;
}

.chart {
  flex: 0.8;
}

.stacked {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stack-shell {
  flex: 1;
  height: 10px;
  border-radius: 999px;
  background: #e5e7eb;
}

.stack-bar {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(120deg, #f59e0b, #ef4444);
}

.primary {
  border: none;
  padding: 10px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f97316, #ef4444);
  color: #fff;
  cursor: pointer;
}

.ghost {
  border: 1px solid #d1d5db;
  border-radius: 12px;
  background: transparent;
  padding: 10px 16px;
  cursor: pointer;
}

.progress-shell {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(120deg, #fb923c, #f97316);
}
</style>
