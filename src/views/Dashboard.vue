<template>
  <div class="dashboard">
    <aside class="sidebar">
      <div class="user-card">
        <p class="role">系统管理员</p>
        <h2>Geo Manager</h2>
        <p class="status">今日任务完成度 {{ progress }}%</p>
      </div>
      <nav>
        <RouterLink v-for="item in menu" :key="item.to" :to="item.to" class="nav-item" active-class="active">
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>
      <button class="logout" @click="logout">退出登录</button>
    </aside>

    <main class="content">
      <header class="top-panel">
        <div class="stat" v-for="stat in stats" :key="stat.label">
          <p>{{ stat.label }}</p>
          <h3>{{ stat.value }}</h3>
          <small>{{ stat.desc }}</small>
        </div>
      </header>

      <section class="chart-panel">
        <canvas ref="chartRef" height="160"></canvas>
        <div class="actions">
          <div class="btn-group">
            <button @mouseenter="showTooltip('查看月度数据洞察')" @mouseleave="showTooltip('')" @click="openInfo('系统正在计算全局风险指数')">
              月度洞察
            </button>
            <button @mouseenter="showTooltip('执行数据清理任务')" @mouseleave="showTooltip('')" @click="startProcessing">
              启动清理
            </button>
            <button @mouseenter="showTooltip('快速跳转到地图浏览模块')" @mouseleave="showTooltip('')" @click="goToMap">
              地图浏览
            </button>
          </div>
          <span class="tooltip" v-if="tooltip">{{ tooltip }}</span>
        </div>
      </section>

      <section class="module-view">
        <RouterView />
      </section>
    </main>

    <ModalDialog v-if="infoModal" title="操作提示" @close="infoModal = false">
      <p>{{ infoModal }}</p>
      <template #footer>
        <button class="ghost" @click="infoModal = false">关闭</button>
      </template>
    </ModalDialog>

    <ProgressModal
      v-if="progressModal"
      title="任务执行中"
      description="后台正在自动处理选定的数据批次"
      :percentage="modalProgress"
      @close="progressModal = false"
    />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router';
import Chart from 'chart.js/auto';
import ModalDialog from '../components/ModalDialog.vue';
import ProgressModal from '../components/ProgressModal.vue';

const router = useRouter();
const menu = [
  { label: '数据导入与采集', to: '/dashboard/data-import' },
  { label: '地图展示与浏览', to: '/dashboard/map-viewer' },
  { label: '数据查询与检索', to: '/dashboard/data-query' },
  { label: '数据分析与统计', to: '/dashboard/data-analysis' },
  { label: '数据导出与共享', to: '/dashboard/data-export' }
];

const stats = reactive([
  { label: '本周入库', value: '12,430 条', desc: '+18% 周环比' },
  { label: '在线地图', value: '38 图层', desc: '3 个异常' },
  { label: '分析模型', value: '16 套', desc: '最新：土地利用' }
]);

const chartRef = ref(null);
let chartInstance;
const tooltip = ref('');
const infoModal = ref('');
const progressModal = ref(false);
const modalProgress = ref(0);
const progress = ref(72);
let timer;

const buildChart = () => {
  if (!chartRef.value) return;
  chartInstance = new Chart(chartRef.value, {
    type: 'line',
    data: {
      labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
      datasets: [
        {
          label: '入库数据量',
          data: [1200, 1800, 1500, 2300, 2100, 2600],
          borderColor: '#4dd0e1',
          backgroundColor: 'rgba(77, 208, 225, 0.2)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false } }, y: { ticks: { color: '#bcd' } } }
    }
  });
};

const showTooltip = (text) => {
  tooltip.value = text;
};

const openInfo = (message) => {
  infoModal.value = message;
};

const startProcessing = () => {
  progressModal.value = true;
  modalProgress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    modalProgress.value += Math.random() * 15;
    if (modalProgress.value >= 100) {
      modalProgress.value = 100;
      clearInterval(timer);
      setTimeout(() => {
        progressModal.value = false;
        infoModal.value = '清理完成，结果已同步到分析模块。';
      }, 800);
    }
  }, 500);
};

const goToMap = () => {
  router.push('/dashboard/map-viewer');
};

const logout = () => router.push('/login');

onMounted(() => {
  buildChart();
});

onUnmounted(() => {
  if (chartInstance) chartInstance.destroy();
  clearInterval(timer);
});
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  color: #e7f1ff;
}
.sidebar {
  width: 260px;
  background: rgba(7, 12, 24, 0.9);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.user-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 16px;
  border-radius: 18px;
}
.role {
  margin: 0;
  opacity: 0.8;
}
.user-card h2 {
  margin: 8px 0;
}
.status {
  margin: 0;
  font-size: 0.9rem;
}
nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.nav-item {
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
}
.nav-item.active {
  background: linear-gradient(120deg, #3a86ff, #64c5eb);
}
.logout {
  margin-top: auto;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 10px;
  color: #fff;
}
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  background: radial-gradient(circle at top, rgba(255, 255, 255, 0.05), transparent);
}
.top-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.stat {
  flex: 1 1 180px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 18px;
  padding: 16px;
}
.chart-panel {
  background: rgba(9, 16, 35, 0.75);
  border-radius: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btn-group {
  display: flex;
  gap: 12px;
}
.btn-group button {
  padding: 10px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}
.tooltip {
  font-size: 0.9rem;
  opacity: 0.8;
}
.module-view {
  flex: 1;
  background: rgba(10, 18, 32, 0.85);
  border-radius: 22px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.ghost {
  background: rgba(255, 255, 255, 0.15);
  padding: 8px 16px;
  border-radius: 12px;
  color: #fff;
}
@media (max-width: 900px) {
  .dashboard {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
  }
  nav {
    flex: 1;
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
