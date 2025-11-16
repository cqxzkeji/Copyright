<template>
  <section class="module">
    <header>
      <h2>数据驱动的内容效果评估</h2>
      <p>实时接入广告投放、社媒互动与站点行为数据，多维分析营销素材表现。</p>
    </header>
    <div class="grid">
      <div class="panel chart-panel">
        <h3>渠道表现对比</h3>
        <div class="chart">
          <div
            v-for="(metric, index) in metrics"
            :key="metric.name"
            class="chart-row"
          >
            <span>{{ metric.name }}</span>
            <div class="chart-bars">
              <div class="bar" :style="{ width: metric.value + '%', background: colors[index] }"></div>
            </div>
            <small>{{ metric.value }}%</small>
          </div>
        </div>
        <button @click="runAnalysis">重新计算</button>
      </div>
      <div class="panel">
        <h3>内容评分矩阵</h3>
        <table>
          <thead>
            <tr>
              <th>语言</th>
              <th>互动率</th>
              <th>转化率</th>
              <th>建议</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in table" :key="item.lang">
              <td>{{ item.lang }}</td>
              <td>{{ item.engagement }}%</td>
              <td>{{ item.conversion }}%</td>
              <td>{{ item.tip }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="panel">
        <h3>预测投放效果</h3>
        <p>基于历史 A/B 数据和媒体成本实时生成 ROI 预测。</p>
        <button class="secondary" @click="showForecast">查看预测详情</button>
      </div>
    </div>
    <ModalDialog v-model="analysisVisible" title="数据分析更新">
      <p>分析完成，发现 {{ highlight }} 表现显著高于平均水平，建议追加预算。</p>
    </ModalDialog>
    <ModalDialog v-model="forecastVisible" title="ROI 预测">
      <ul>
        <li>未来 7 天预计曝光：1200 万</li>
        <li>预计 CPL：$3.7</li>
        <li>预计 ROI：238%</li>
      </ul>
    </ModalDialog>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const metrics = reactive([
  { name: '社交媒体', value: 78 },
  { name: '搜索投放', value: 64 },
  { name: '邮件自动化', value: 58 },
  { name: '线下活动', value: 45 }
]);

const table = reactive([
  { lang: '英语', engagement: 4.2, conversion: 2.4, tip: '主打价值场景' },
  { lang: '法语', engagement: 3.6, conversion: 2.8, tip: '加强情绪故事' },
  { lang: '西语', engagement: 5.1, conversion: 3.1, tip: '突出优惠信息' }
]);

const colors = ['#38bdf8', '#0ea5e9', '#c084fc', '#f97316'];
const analysisVisible = ref(false);
const forecastVisible = ref(false);
const highlight = ref('社交媒体');

const runAnalysis = () => {
  const top = metrics.reduce((prev, current) => (current.value > prev.value ? current : prev), metrics[0]);
  highlight.value = top.name;
  analysisVisible.value = true;
};

const showForecast = () => {
  forecastVisible.value = true;
};
</script>

<style scoped>
.module header {
  margin-bottom: 24px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.panel {
  background: var(--panel);
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.chart-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.chart-bars {
  flex: 1;
  height: 10px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.2);
}

.bar {
  height: 100%;
  border-radius: 999px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

button {
  border: none;
  border-radius: 999px;
  padding: 10px 24px;
  font-weight: 600;
  cursor: pointer;
  background: var(--accent);
  color: #0f172a;
}

button.secondary {
  background: transparent;
  border: 1px solid rgba(148, 163, 184, 0.4);
  color: var(--muted);
}
</style>
