<template>
  <div class="dashboard">
    <aside class="sidebar">
      <div class="user-block">
        <p class="hello">欢迎回来</p>
        <h2>数字农业指挥中心</h2>
        <button class="secondary" @click="triggerHealthCheck">系统巡检</button>
      </div>
      <div class="module-list">
        <button
          v-for="item in modules"
          :key="item.key"
          :class="['module-btn', { active: activeModule === item.key }]"
          @click="selectModule(item)"
        >
          <div>
            <strong>{{ item.name }}</strong>
            <p>{{ item.description }}</p>
          </div>
          <span>→</span>
        </button>
      </div>
    </aside>

    <main class="content-area">
      <section class="overview">
        <div class="overview-text">
          <h1>今日概览</h1>
          <p>数据采集 {{ stats.entries }} 条 · 合规证书 {{ stats.certifications }} 份 · 供应链节点 {{ stats.nodes }} 个</p>
          <div class="overview-actions">
            <button class="primary" @click="openAnnouncement">发布调度</button>
            <button class="ghost" @click="showChartInfo = true">图表说明</button>
          </div>
        </div>
        <canvas ref="chartCanvas"></canvas>
      </section>

      <section class="module-container">
        <component :is="activeComponent" />
      </section>
    </main>

    <ModalDialog
      :show="showAnnouncement"
      title="全局调度发布"
      confirm-text="已通知"
      @close="showAnnouncement = false"
      @confirm="showAnnouncement = false"
    >
      <p>系统已向各生产基地推送最新质量巡检任务，请在 <strong>2 小时</strong> 内反馈执行状态。</p>
    </ModalDialog>

    <ModalDialog
      :show="showChartInfo"
      title="指标图表说明"
      @close="showChartInfo = false"
      @confirm="showChartInfo = false"
    >
      <ul>
        <li>绿色曲线：本周采集批次数量趋势。</li>
        <li>蓝色阴影：质量预警覆盖率。</li>
        <li>点击模块按钮可联动更新下方功能区域。</li>
      </ul>
    </ModalDialog>

    <ModalDialog
      :show="showHealthCheck"
      title="系统巡检中"
      confirm-text="后台继续"
      @close="showHealthCheck = false"
      @confirm="showHealthCheck = false"
    >
      <div class="progress-wrapper">
        <div class="progress-label">巡检进度 {{ healthProgress }}%</div>
        <div class="progress-bar">
          <div class="progress-inner" :style="{ width: healthProgress + '%' }"></div>
        </div>
      </div>
    </ModalDialog>
  </div>
</template>

<script setup>
import { onMounted, ref, shallowRef } from 'vue';
import Chart from 'chart.js/auto';
import ModalDialog from '../components/ModalDialog.vue';
import DataEntry from './DataEntry.vue';
import Traceability from './Traceability.vue';
import QualityMonitoring from './QualityMonitoring.vue';
import SupplyChain from './SupplyChain.vue';
import Certification from './Certification.vue';

const modules = [
  { key: 'data', name: '数据采集与录入', description: '实时汇聚田间传感与人工巡检数据', component: DataEntry },
  { key: 'trace', name: '溯源查询', description: '批次追踪、产地证明、运输流向', component: Traceability },
  { key: 'quality', name: '质量监控', description: '指标监测、预警策略与分析', component: QualityMonitoring },
  { key: 'supply', name: '供应链管理', description: '采购、仓储、运输全过程可视', component: SupplyChain },
  { key: 'cert', name: '合规与认证', description: '合格证、认证证书及年审提醒', component: Certification }
];

const stats = { entries: 186, certifications: 42, nodes: 18 };

const activeModule = ref('data');
const activeComponent = shallowRef(DataEntry);
const chartCanvas = ref(null);
const showAnnouncement = ref(false);
const showChartInfo = ref(false);
const showHealthCheck = ref(false);
const healthProgress = ref(10);

const selectModule = (item) => {
  activeModule.value = item.key;
  activeComponent.value = item.component;
  showChartInfo.value = true;
};

const openAnnouncement = () => {
  showAnnouncement.value = true;
};

const triggerHealthCheck = () => {
  showHealthCheck.value = true;
  healthProgress.value = 10;
  const timer = setInterval(() => {
    if (healthProgress.value >= 100) {
      clearInterval(timer);
      return;
    }
    healthProgress.value += 15;
  }, 500);
};

onMounted(() => {
  if (!chartCanvas.value) return;
  new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      datasets: [
        {
          label: '采集批次',
          data: [30, 42, 38, 50, 62, 54, 70],
          fill: true,
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          borderColor: '#10b981',
          tension: 0.4,
          pointRadius: 4
        },
        {
          label: '质量预警覆盖率',
          data: [65, 68, 72, 76, 80, 82, 84],
          borderColor: '#3b82f6',
          borderDash: [6, 4],
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: true } }
    }
  });
});
</script>

<style scoped>
.dashboard {
  flex: 1;
  display: flex;
  background: #f5f7fb;
  min-height: 100vh;
}

.sidebar {
  width: 320px;
  background: #0f172a;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;
  gap: 2rem;
}

.user-block {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.hello {
  margin: 0;
  color: #94a3b8;
}

.secondary {
  background: #1d283e;
  color: #22d3ee;
}

.module-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.module-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  padding: 1rem;
}

.module-btn.active {
  background: linear-gradient(135deg, #34d399, #10b981);
  color: #0f172a;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  gap: 1.5rem;
}

.overview {
  background: #fff;
  border-radius: 24px;
  padding: 1.5rem;
  display: flex;
  gap: 1.5rem;
  min-height: 260px;
}

.overview-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.overview-actions {
  display: flex;
  gap: 0.8rem;
}

.primary {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
}

.ghost {
  background: #ecfccb;
  color: #4d7c0f;
}

.overview canvas {
  flex: 1;
}

.module-container {
  flex: 1;
  background: #fff;
  border-radius: 24px;
  padding: 1.5rem;
  display: flex;
}

.progress-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
}

.progress-inner {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(135deg, #0ea5e9, #22d3ee);
}

@media (max-width: 1200px) {
  .dashboard {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
  }
  .module-btn {
    min-width: 200px;
  }
}
</style>
