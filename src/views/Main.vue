<template>
  <div class="layout">
    <aside class="sidebar card">
      <div class="logo">规划模拟控制</div>
      <nav>
        <RouterLink to="/main/land-data" class="nav-btn" active-class="active">地块基础数据</RouterLink>
        <RouterLink to="/main/simulation" class="nav-btn" active-class="active">拆除重建模拟</RouterLink>
        <RouterLink to="/main/compliance" class="nav-btn" active-class="active">指标校核</RouterLink>
        <RouterLink to="/main/construction" class="nav-btn" active-class="active">施工控制</RouterLink>
        <RouterLink to="/main/analytics" class="nav-btn" active-class="active">统计决策</RouterLink>
      </nav>
      <button class="btn btn-outline" @click="showLogout = true">安全退出</button>
    </aside>
    <section class="content">
      <header class="topbar card">
        <div>
          <div class="eyebrow">亮色可视布局</div>
          <h2>拆除重建地块规划模拟与控制中心</h2>
        </div>
        <div class="pill">实时监控</div>
      </header>
      <div class="card shell">
        <RouterView />
      </div>
    </section>
    <BaseModal v-if="showLogout" title="确认退出" @close="showLogout = false" :actions="logoutActions">
      <p>结束本次模拟与监控会话？</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const showLogout = ref(false);
const logoutActions = [
  { label: '取消', onClick: () => (showLogout.value = false) },
  {
    label: '返回登录',
    primary: true,
    onClick: () => {
      window.location.hash = '#/';
    }
  }
];
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 16px;
  padding: 16px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: sticky;
  top: 16px;
  height: calc(100vh - 32px);
}

.logo {
  font-weight: 800;
  font-size: 18px;
}

nav {
  display: grid;
  gap: 8px;
  flex: 1;
}

.nav-btn {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid transparent;
  background: rgba(45, 123, 255, 0.06);
  color: #0f172a;
  font-weight: 600;
}

.nav-btn.active {
  background: linear-gradient(120deg, rgba(45, 123, 255, 0.18), rgba(79, 225, 185, 0.25));
  border-color: rgba(45, 123, 255, 0.4);
}

.content {
  display: grid;
  gap: 12px;
  grid-template-rows: auto 1fr;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.eyebrow {
  color: #2563eb;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 1px;
}

.pill {
  background: rgba(79, 225, 185, 0.2);
  padding: 8px 12px;
  border-radius: 10px;
  color: #0f766e;
  font-weight: 700;
}

.shell {
  min-height: 70vh;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    position: static;
    height: auto;
  }
}
</style>
