<template>
  <div class="layout">
    <aside>
      <div class="brand">
        <strong>维护中心</strong>
        <small>橡胶制品车间</small>
      </div>
      <nav>
        <RouterLink to="/dashboard/devices">设备管理</RouterLink>
        <RouterLink to="/dashboard/plans">维护计划</RouterLink>
        <RouterLink to="/dashboard/inventory">库存管理</RouterLink>
        <RouterLink to="/dashboard/personnel">维修人员</RouterLink>
        <RouterLink to="/dashboard/analysis">数据分析</RouterLink>
      </nav>
      <div class="quick-actions">
        <button @click="showProgressModal = true">查看巡检进度</button>
        <button @click="showNoticeModal = true">系统公告</button>
      </div>
    </aside>
    <main>
      <header class="top-bar">
        <div>
          <h2>设备运行快照</h2>
          <p>实时监控橡胶生产线关键参数</p>
        </div>
        <div class="status-pill">{{ alerts.length }} 条预警</div>
      </header>
      <section class="overview">
        <article class="card">
          <h3>巡检任务完成率</h3>
          <OverviewChart />
        </article>
        <article class="card stats">
          <div v-for="item in stats" :key="item.label" class="stat">
            <p>{{ item.label }}</p>
            <strong>{{ item.value }}</strong>
            <small>{{ item.trend }}</small>
          </div>
        </article>
      </section>
      <section class="alerts">
        <h3>即时提醒</h3>
        <div class="alert-list">
          <div v-for="alert in alerts" :key="alert.id" class="alert-card">
            <div>
              <strong>{{ alert.title }}</strong>
              <p>{{ alert.description }}</p>
            </div>
            <button @click="acknowledge(alert)">处理</button>
          </div>
        </div>
      </section>
      <section class="content">
        <RouterView />
      </section>
    </main>
  </div>

  <BaseModal
    v-if="showNoticeModal"
    :show="showNoticeModal"
    title="系统公告"
    @close="showNoticeModal = false"
  >
    <p>夜班设备升级期间请将制品转移到线体 B，避免停机。所有操作请记录于交接表。</p>
  </BaseModal>

  <BaseModal
    v-if="showProgressModal"
    :show="showProgressModal"
    title="巡检进度"
    @close="closeProgress"
  >
    <div class="progress">
      <div class="bar" :style="{ width: progress + '%' }"></div>
    </div>
    <p>正在统计今日巡检情况：{{ progress }}%</p>
  </BaseModal>

  <BaseModal
    v-if="acknowledgedAlert"
    :show="!!acknowledgedAlert"
    title="提醒处理完成"
    @close="acknowledgedAlert = null"
  >
    <p>{{ acknowledgedAlert?.title }} 已标记为处理中并同步到运行日志。</p>
  </BaseModal>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import OverviewChart from '../components/OverviewChart.vue';
import BaseModal from '../components/BaseModal.vue';

const stats = [
  { label: '今日巡检', value: '28 / 32', trend: '剩余 4 条' },
  { label: '运行设备', value: '18 台', trend: '2 台待复检' },
  { label: '物料充足率', value: '92%', trend: '安全库存充足' }
];

const alerts = ref([
  { id: 1, title: '加硫机 3# 振动异常', description: '振幅高于标准 12%，需复测轴承' },
  { id: 2, title: '冷却水塔水压偏低', description: '请检修阀门并记录水压曲线' }
]);

const showNoticeModal = ref(false);
const showProgressModal = ref(false);
const acknowledgedAlert = ref(null);
const progress = ref(20);
let timer;

onMounted(() => {
  startProgress();
});

const startProgress = () => {
  showProgressModal.value = true;
  progress.value = 20;
  clearInterval(timer);
  timer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer);
    } else {
      progress.value += 10;
    }
  }, 400);
};

const closeProgress = () => {
  showProgressModal.value = false;
  clearInterval(timer);
};

const acknowledge = (alert) => {
  alerts.value = alerts.value.filter((item) => item.id !== alert.id);
  acknowledgedAlert.value = alert;
};
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: #eef2ff;
}

aside {
  width: 280px;
  background: #0f172a;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 32px 24px;
  gap: 24px;
}

.brand {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.brand strong {
  font-size: 22px;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

nav a {
  padding: 10px 16px;
  border-radius: 10px;
  color: #cbd5f5;
}

nav a.router-link-active {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
}

.quick-actions button {
  padding: 10px;
  border-radius: 10px;
  border: none;
  background: #1d4ed8;
  color: #fff;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 28px;
  gap: 20px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-pill {
  padding: 6px 18px;
  background: #fee2e2;
  color: #b91c1c;
  border-radius: 999px;
  font-weight: 600;
}

.overview {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  flex: 1 1 320px;
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.stats {
  display: flex;
  gap: 16px;
}

.stat {
  flex: 1;
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px 16px;
}

.alerts .alert-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: #fff;
  border-radius: 12px;
  border-left: 4px solid #f97316;
}

.alert-card button {
  border: none;
  background: #f97316;
  color: #fff;
  padding: 8px 14px;
  border-radius: 8px;
}

.content {
  background: #fff;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.progress {
  width: 100%;
  background: #e2e8f0;
  border-radius: 999px;
  height: 14px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: linear-gradient(90deg, #22d3ee, #3b82f6);
}

@media (max-width: 960px) {
  .layout {
    flex-direction: column;
  }

  aside {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 12px;
  }

  nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
