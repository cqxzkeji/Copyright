<template>
  <div class="module-shell">
    <section class="module-header">
      <div>
        <h2>数据分析与决策支持</h2>
        <p>聚合任务执行、消耗与效能数据，输出辅助决策策略。</p>
      </div>
      <div class="header-btns">
        <select v-model="filter" class="filter-select">
          <option value="all">全部区域</option>
          <option value="north">北部战区</option>
          <option value="south">南部战区</option>
        </select>
        <button class="primary-btn" @click="analyze">生成分析</button>
      </div>
    </section>

    <div class="analysis-grid">
      <div class="chart-card">
        <Bar :data="barData" :options="barOptions" />
      </div>
      <div class="insight-card">
        <h3>策略洞察</h3>
        <ul>
          <li v-for="insight in insights" :key="insight" @click="showInsight(insight)">
            {{ insight }}
          </li>
        </ul>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>任务名称</th>
          <th>区域</th>
          <th>完成率</th>
          <th>资源消耗</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in filteredTasks" :key="task.id">
          <td>{{ task.name }}</td>
          <td>{{ task.region }}</td>
          <td>{{ task.rate }}%</td>
          <td>{{ task.cost }}</td>
          <td><button class="secondary-btn" @click="showInsight(task.name + ' - 成效良好')">查看</button></td>
        </tr>
      </tbody>
    </table>

    <BaseModal v-if="modal" :title="modal.title" @close="modal = null">
      {{ modal.message }}
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import BaseModal from '../components/BaseModal.vue';
import { Bar } from 'vue-chartjs';
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const filter = ref('all');
const modal = ref(null);

const tasks = ref([
  { id: 1, name: '边界巡逻', region: 'north', rate: 96, cost: '320L' },
  { id: 2, name: '能源补给', region: 'north', rate: 91, cost: '0.8MWh' },
  { id: 3, name: '岛礁巡查', region: 'south', rate: 88, cost: '210L' },
  { id: 4, name: '水下探测', region: 'south', rate: 93, cost: '140L' }
]);

const insights = ref([
  '北部机动平台能耗下降 6%，策略有效',
  '南部海域任务完成率连续 4 周上升',
  '能源补给任务可与巡逻任务合并执行'
]);

const filteredTasks = computed(() =>
  tasks.value.filter((task) => filter.value === 'all' || task.region === filter.value)
);

const barData = computed(() => ({
  labels: filteredTasks.value.map((task) => task.name),
  datasets: [
    {
      label: '完成率 %',
      data: filteredTasks.value.map((task) => task.rate),
      backgroundColor: ['#05c3dd', '#7928ca', '#34d399', '#fbbf24']
    }
  ]
}));

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
    y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true, suggestedMax: 100 }
  },
  plugins: {
    legend: { labels: { color: '#cbd5f5' } }
  }
};

const analyze = () => {
  modal.value = {
    title: '分析完成',
    message: `已根据 ${filter.value === 'all' ? '全部区域' : '当前区域'} 数据生成策略建议。`
  };
};

const showInsight = (message) => {
  modal.value = { title: '策略洞察', message };
};
</script>

<style scoped>
.module-shell {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.analysis-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.chart-card {
  flex: 2 1 360px;
  min-height: 280px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1rem;
}

.chart-card canvas {
  min-height: 240px;
}

.insight-card {
  flex: 1 1 240px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1rem;
}

.insight-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.insight-card li {
  padding: 0.75rem;
  border-radius: 12px;
  background: rgba(5, 195, 221, 0.1);
  cursor: pointer;
}

.filter-select {
  border-radius: 999px;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--text);
}
</style>
