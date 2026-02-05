<template>
  <div v-if="isLogin">
    <RouterView />
  </div>
  <div v-else class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">DI</div>
        <div>
          <h1>数据中台</h1>
          <p>多源数据管理</p>
        </div>
      </div>
      <nav class="menu">
        <RouterLink to="/collection">数据采集与接入</RouterLink>
        <RouterLink to="/storage">数据存储与管理</RouterLink>
        <RouterLink to="/analysis">数据智能分析</RouterLink>
        <RouterLink to="/decision">业务规则与决策</RouterLink>
        <RouterLink to="/monitoring">监控与预警</RouterLink>
      </nav>
      <button class="logout" type="button" @click="logout">退出登录</button>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <h2>多源数据中台管理与智能分析系统</h2>
          <span>统一接入、智能分析、可视化决策</span>
        </div>
        <div class="status-pill">
          <span class="dot"></span>
          系统运行正常
        </div>
      </header>
      <section class="page-container">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const isLogin = computed(() => route.meta.layout === "empty");

const logout = () => {
  localStorage.removeItem("dip_authed");
  router.push("/login");
};
</script>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
  background: #f5f7fb;
}

.sidebar {
  width: 240px;
  background: #ffffff;
  padding: 24px 20px;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #69b7ff, #4f46e5);
  display: grid;
  place-items: center;
  font-weight: 700;
  color: #fff;
}

.brand h1 {
  margin: 0;
  font-size: 18px;
}

.brand p {
  margin: 2px 0 0;
  font-size: 12px;
  color: #6b7280;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 14px;
}

.menu a {
  padding: 10px 12px;
  border-radius: 10px;
  color: #1f2937;
  background: #f3f4f6;
  transition: 0.2s ease;
}

.menu a.router-link-active {
  background: #e0edff;
  color: #1d4ed8;
  font-weight: 600;
}

.logout {
  margin-top: auto;
  padding: 10px;
  border: none;
  border-radius: 10px;
  background: #fef2f2;
  color: #b91c1c;
  cursor: pointer;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px 12px;
}

.topbar h2 {
  margin: 0;
  font-size: 20px;
}

.topbar span {
  font-size: 13px;
  color: #6b7280;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ecfdf3;
  color: #047857;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
}

.page-container {
  padding: 16px 32px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 1024px) {
  .app-shell {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .menu {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .content {
    min-height: calc(100vh - 140px);
  }
}
</style>
