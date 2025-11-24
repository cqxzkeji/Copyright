<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <strong>Smart Agri</strong>
        <span>农业运营中枢</span>
      </div>
      <nav>
        <RouterLink class="nav-link" to="/" active-class="active" exact-active-class="active">系统概况</RouterLink>
        <RouterLink class="nav-link" to="/farm-monitoring" active-class="active">农田监控</RouterLink>
        <RouterLink class="nav-link" to="/irrigation" active-class="active">精准灌溉</RouterLink>
        <RouterLink class="nav-link" to="/crop-management" active-class="active">作物管理</RouterLink>
        <RouterLink class="nav-link" to="/data-analysis" active-class="active">数据分析</RouterLink>
        <RouterLink class="nav-link" to="/resource-management" active-class="active">资源管理</RouterLink>
      </nav>
      <button class="assistant" @click="assistantVisible = true">智慧助手提示</button>
    </aside>
    <div class="content">
      <header class="top-bar">
        <div>
          <h2>智慧农业管理中心</h2>
          <p>实时联动农情、灌溉、作物、资源全链路</p>
        </div>
        <div class="top-actions">
          <button @click="simulateSync">同步物联设备</button>
          <button class="outline" @click="handleLogout">退出登录</button>
        </div>
      </header>
      <section class="view-holder">
        <router-view />
      </section>
    </div>
    <ModalDialog v-if="assistantVisible" title="智慧助手提示" @close="assistantVisible = false">
      <p>建议优先关注墒情低于 35% 的地块，并根据实时模型自动生成灌溉计划。</p>
    </ModalDialog>
    <ProgressModal
      v-if="syncVisible"
      title="设备同步中"
      description="正在与 36 台传感器和 4 套灌溉控制器进行认证"
      :progress="progress"
      @close="syncVisible = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';
import ProgressModal from '../components/ProgressModal.vue';

const assistantVisible = ref(false);
const syncVisible = ref(false);
const progress = ref(0);
const router = useRouter();
let timer;

const simulateSync = () => {
  syncVisible.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer);
      return;
    }
    progress.value += 10;
  }, 400);
};

const handleLogout = () => {
  router.push('/login');
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  background: #eef2ff;
}

.sidebar {
  width: 240px;
  background: linear-gradient(180deg, #0f172a, #1e293b);
  color: #fff;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.brand {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

a {
  color: rgba(255, 255, 255, 0.7);
  padding: 0.4rem 0.5rem;
  border-radius: 8px;
  transition: background 0.2s, color 0.2s;
}

a.active,
a:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
}

.assistant {
  border: none;
  border-radius: 12px;
  padding: 0.6rem 1rem;
  background: #22d3ee;
  color: #0f172a;
  cursor: pointer;
  font-weight: 600;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.75rem;
  gap: 1.5rem;
}

.top-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  background: #fff;
  padding: 1.25rem 1.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.top-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.top-actions button {
  border: none;
  border-radius: 999px;
  padding: 0.5rem 1.4rem;
  font-weight: 600;
  cursor: pointer;
  background: #22c55e;
  color: #fff;
}

button.outline {
  background: transparent;
  border: 1px solid #cbd5f5;
  color: #0f172a;
}

.view-holder {
  flex: 1;
  min-height: 60vh;
  background: #fff;
  border-radius: 26px;
  padding: 1.5rem;
  box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.1);
}

@media (max-width: 900px) {
  .layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
