<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">🏢 集中供水监控</div>
      <nav>
        <RouterLink to="/dashboard" class="nav-link" :class="{ active: isActive('/dashboard') }">系统监控</RouterLink>
        <RouterLink to="/water-quality" class="nav-link" :class="{ active: isActive('/water-quality') }">水质监测</RouterLink>
        <RouterLink to="/device-status" class="nav-link" :class="{ active: isActive('/device-status') }">设备状态</RouterLink>
        <RouterLink to="/data-storage" class="nav-link" :class="{ active: isActive('/data-storage') }">数据存储</RouterLink>
        <RouterLink to="/optimization" class="nav-link" :class="{ active: isActive('/optimization') }">智能优化</RouterLink>
      </nav>
      <div class="sidebar-footer">
        <div>
          <div class="muted">当前值班员</div>
          <strong>{{ auth.state.user }}</strong>
        </div>
        <button class="btn outline" @click="logout">退出</button>
      </div>
    </aside>
    <main class="content">
      <header class="topbar card">
        <div>
          <div class="section-title">多建筑群供水与污水处理监控</div>
          <div class="muted">监控和优化系统运行 · 亮色自适应界面</div>
        </div>
        <div class="chip-bar">
          <span class="badge info">水厂在线</span>
          <span class="badge success">供水稳定</span>
          <span class="badge warning">夜间模式关闭</span>
        </div>
      </header>
      <section class="module-content">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const isActive = (path) => route.path.startsWith(path);

const logout = () => {
  auth.logout();
  router.push({ name: 'login' });
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
}

.sidebar {
  background: linear-gradient(180deg, #ffffff 0%, #f2f7ff 100%);
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-right: 1px solid #e8edf5;
}

.brand {
  font-weight: 800;
  font-size: 18px;
  margin-bottom: 12px;
}

.nav-link {
  display: block;
  padding: 12px;
  border-radius: 10px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4px;
}

.nav-link:hover,
.nav-link.active {
  background: linear-gradient(120deg, rgba(47, 128, 237, 0.12), rgba(86, 204, 242, 0.08));
  color: #1f5fbf;
}

.sidebar-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: #f7faff;
}

.content {
  padding: 18px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.module-content {
  display: grid;
  gap: 16px;
}
</style>
