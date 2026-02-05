<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">CRM</div>
        <div>
          <p>云端业务弹性伸缩</p>
          <span>资源调度管理系统</span>
        </div>
      </div>
      <nav>
        <router-link to="/dashboard">系统仪表盘</router-link>
        <router-link to="/resource-scheduling">自动化资源调度</router-link>
        <router-link to="/auto-scaling">弹性伸缩管理</router-link>
        <router-link to="/monitoring">监控与预警系统</router-link>
        <router-link to="/load-balancing">负载均衡与流量管理</router-link>
        <router-link to="/cost-optimization">成本优化与分析</router-link>
      </nav>
      <button class="logout" type="button" @click="logout">退出登录</button>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <h1>云端业务弹性伸缩与资源调度管理系统</h1>
          <p>轻量化、可视化、智能化的云资源运营中心</p>
        </div>
        <div class="status-card">
          <p>运行状态</p>
          <strong>稳定 · 资源利用率 78%</strong>
        </div>
      </header>
      <section class="view-container">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const logout = () => {
  localStorage.removeItem("crm-auth");
  router.push("/login");
};
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7fb;
}

.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand p {
  margin: 0;
  font-weight: 600;
}

.brand span {
  font-size: 12px;
  color: #64748b;
}

.logo {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #38bdf8, #4f46e5);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

nav a {
  padding: 10px 12px;
  border-radius: 10px;
  color: #334155;
  font-size: 14px;
}

nav a.router-link-active {
  background: #e0f2fe;
  color: #0ea5e9;
  font-weight: 600;
}

.logout {
  margin-top: auto;
  border: none;
  background: #f1f5f9;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px 32px;
  gap: 24px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.topbar h1 {
  margin: 0 0 6px;
  font-size: 22px;
}

.topbar p {
  margin: 0;
  color: #64748b;
}

.status-card {
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  min-width: 200px;
}

.status-card p {
  margin: 0 0 6px;
  color: #64748b;
  font-size: 13px;
}

.view-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 960px) {
  .layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
  }

  nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
