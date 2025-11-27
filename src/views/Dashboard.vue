<template>
  <div class="dashboard-shell">
    <aside class="sidebar light-card">
      <div class="user-panel">
        <div class="avatar">{{ initials }}</div>
        <div>
          <p class="welcome">欢迎，{{ username }} </p>
          <small>安全总览 / 实时监控</small>
        </div>
      </div>
      <nav class="menu">
        <button
          v-for="item in modules"
          :key="item.key"
          :class="['menu-item', active === item.key ? 'active' : '']"
          @click="active = item.key"
        >
          <span>{{ item.label }}</span>
          <span class="status-pill" v-if="item.status">{{ item.status }}</span>
        </button>
      </nav>
      <div class="notice">所有按钮均已绑定弹窗或执行流程，适合演示。</div>
      <button class="primary-btn" @click="showProgress">系统自检</button>
    </aside>

    <main class="content">
      <header class="gradient-header topbar">
        <div>
          <p class="badge">消防安全隐患智能检测与预警系统</p>
          <h2>{{ currentModule?.label }}窗口</h2>
        </div>
        <div class="top-actions">
          <button class="secondary-btn" @click="showTip = true">使用提示</button>
          <button class="primary-btn" @click="logout">退出登录</button>
        </div>
      </header>
      <section class="module-container">
        <component :is="currentModule?.component" />
      </section>
    </main>

    <div v-if="showTip" class="modal-backdrop" @click.self="showTip = false">
      <div class="modal">
        <h3>操作提示</h3>
        <p>左侧菜单切换各独立模块，按钮均会触发对应功能的表单、进度或提示弹窗。</p>
        <footer>
          <button class="primary-btn" @click="showTip = false">我已知晓</button>
        </footer>
      </div>
    </div>

    <div v-if="showingProgress" class="modal-backdrop" @click.self="showingProgress = false">
      <div class="modal">
        <h3>系统自检</h3>
        <p>正在检查探测器、告警主机、网络与存储。</p>
        <div class="progress-bar">
          <div class="progress-bar-inner" :style="{ width: progress + '%' }"></div>
        </div>
        <p style="text-align:right;margin-top:8px;">{{ progress }}%</p>
        <footer>
          <button class="primary-btn" @click="finishProgress">完成</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HazardDetection from './HazardDetection.vue';
import AlarmManagement from './AlarmManagement.vue';
import ReportGeneration from './ReportGeneration.vue';
import DeviceManagement from './DeviceManagement.vue';
import Settings from './Settings.vue';

const router = useRouter();
const route = useRoute();
const username = computed(() => route.query.user || '访客');
const initials = computed(() => (username.value ? username.value.slice(0, 2).toUpperCase() : 'GS'));

const modules = [
  { key: 'hazard', label: '火灾隐患检测', component: HazardDetection, status: '实时' },
  { key: 'alarm', label: '预警管理', component: AlarmManagement, status: '正常' },
  { key: 'report', label: '报告生成与分析', component: ReportGeneration },
  { key: 'device', label: '设备管理', component: DeviceManagement },
  { key: 'settings', label: '系统设置', component: Settings }
];

const active = ref('hazard');
const showTip = ref(false);
const showingProgress = ref(false);
const progress = ref(0);

const currentModule = computed(() => modules.find((m) => m.key === active.value));

const showProgress = () => {
  showingProgress.value = true;
  progress.value = 0;
  const timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 20);
    if (progress.value >= 100) {
      clearInterval(timer);
    }
  }, 300);
};

const finishProgress = () => {
  showingProgress.value = false;
};

const logout = () => {
  router.push('/login');
};

onMounted(() => {
  if (!route.query.user) {
    showTip.value = true;
  }
});
</script>

<style scoped>
.dashboard-shell {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;
  background: #f5f7fb;
}

.sidebar {
  padding: 22px 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-panel {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  background: linear-gradient(135deg, #3b82f6, #22c55e);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 800;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.15s ease;
}

.menu-item.active {
  border-color: #2563eb;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.15);
}

.content {
  display: flex;
  flex-direction: column;
}

.topbar {
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
}

.top-actions {
  display: flex;
  gap: 10px;
}

.module-container {
  padding: 18px;
}

@media (max-width: 960px) {
  .dashboard-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
