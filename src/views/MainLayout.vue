<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">HPC</div>
        <div>
          <div class="name">集群管理平台</div>
          <small>V1.0 · Light</small>
        </div>
      </div>
      <nav>
        <RouterLink to="/app/dashboard" class="nav-item">集群资源监控</RouterLink>
        <RouterLink to="/app/scheduler" class="nav-item">作业调度管理</RouterLink>
        <RouterLink to="/app/node" class="nav-item">节点与环境管理</RouterLink>
        <RouterLink to="/app/storage" class="nav-item">存储与数据管理</RouterLink>
        <RouterLink to="/app/access" class="nav-item">用户权限与统计</RouterLink>
      </nav>
    </aside>
    <main class="main">
      <header class="topbar">
        <div>
          <h2>高性能计算集群管理平台</h2>
          <p>全局监控、调度、运维与审计一体化管理</p>
        </div>
        <div class="topbar-actions">
          <div class="status-pill">运行正常</div>
          <button class="ghost" type="button" @click="handleLogout">退出登录</button>
        </div>
      </header>
      <section class="content">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const handleLogout = () => {
  router.push("/");
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
  background: #f6f8fb;
}

.sidebar {
  background: #fff;
  padding: 24px;
  border-right: 1px solid #e2e8f0;
  display: grid;
  gap: 24px;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logo {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #2563eb;
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
}

.name {
  font-weight: 600;
}

nav {
  display: grid;
  gap: 8px;
}

.nav-item {
  padding: 10px 12px;
  border-radius: 10px;
  color: #334155;
  background: transparent;
  transition: all 0.2s ease;
}

.nav-item.router-link-active {
  background: #e0f2fe;
  color: #1d4ed8;
  font-weight: 600;
}

.main {
  display: grid;
  grid-template-rows: auto 1fr;
}

.topbar {
  padding: 24px 32px 16px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.topbar h2 {
  margin: 0 0 6px;
}

.topbar p {
  margin: 0;
  color: #64748b;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-pill {
  background: #dcfce7;
  color: #166534;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
}

.ghost {
  border: 1px solid #cbd5f5;
  background: #fff;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.content {
  padding: 24px 32px 40px;
}

@media (max-width: 1024px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: sticky;
    top: 0;
    z-index: 5;
    grid-template-columns: 1fr;
  }
}
</style>
