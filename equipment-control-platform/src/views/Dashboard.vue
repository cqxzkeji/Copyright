<template>
  <div class="dashboard">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">EC</div>
        <div>
          <h2>装备运维平台</h2>
          <p>多场景协同控制</p>
        </div>
      </div>
      <nav class="menu">
        <router-link to="/dashboard/device-control">装备接入与控制</router-link>
        <router-link to="/dashboard/monitoring">运行监控</router-link>
        <router-link to="/dashboard/maintenance">运维管理</router-link>
        <router-link to="/dashboard/analysis">数据分析</router-link>
        <router-link to="/dashboard/system">系统管理</router-link>
      </nav>
    </aside>
    <main class="content">
      <header class="topbar">
        <div class="status">
          <span>当前场景：综合指挥中心</span>
          <span>在线装备：128 台</span>
        </div>
        <div class="user">
          <span>值班员：陈亮</span>
          <button type="button" @click="logout">退出登录</button>
        </div>
      </header>
      <section class="view-area">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const logout = () => {
  router.push('/');
};
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #e2e8f5;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logo {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: linear-gradient(140deg, #2f80ed, #56ccf2);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.brand h2 {
  margin: 0;
  font-size: 18px;
}

.brand p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #8a97a7;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu a {
  padding: 10px 14px;
  border-radius: 12px;
  text-decoration: none;
  color: #2c3e50;
  background: #f4f7ff;
  font-size: 14px;
}

.menu a.router-link-active {
  background: linear-gradient(120deg, #2f80ed, #56ccf2);
  color: #fff;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f5;
  gap: 16px;
}

.status {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #5b6b82;
  flex-wrap: wrap;
}

.user {
  display: flex;
  gap: 12px;
  align-items: center;
}

.user button {
  border: none;
  background: #e8edf7;
  color: #2f3c4a;
  padding: 6px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.view-area {
  flex: 1;
  padding: 24px 32px;
  overflow: auto;
}

@media (max-width: 900px) {
  .dashboard {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .menu {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .content {
    width: 100%;
  }
}
</style>
