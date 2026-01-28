<template>
  <div v-if="isAuth" class="auth-layout">
    <router-view />
  </div>
  <div v-else class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <span class="logo">CB</span>
        <div>
          <p>车身开发管理</p>
          <small>Car Body Dev Suite</small>
        </div>
      </div>
      <nav class="menu">
        <router-link to="/demand" class="menu-item" active-class="active">需求管理</router-link>
        <router-link to="/design" class="menu-item" active-class="active">设计管理</router-link>
        <router-link to="/testing" class="menu-item" active-class="active">测试与验证</router-link>
        <router-link to="/production" class="menu-item" active-class="active">生产工艺管理</router-link>
        <router-link to="/project" class="menu-item" active-class="active">项目管理</router-link>
      </nav>
      <div class="sidebar-footer">
        <p>在线协同 · 轻量追踪</p>
      </div>
    </aside>
    <div class="main-area">
      <header class="topbar">
        <div>
          <h1>汽车车身正向开发管理软件</h1>
          <p>亮色模式 · 模块化管理 · 自适应布局</p>
        </div>
        <div class="user-card">
          <div>
            <strong>{{ userName }}</strong>
            <p>当前角色：{{ userRole }}</p>
          </div>
          <button class="ghost-button" @click="handleLogout">退出登录</button>
        </div>
      </header>
      <main class="content-area">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const isAuth = computed(() => route.meta.layout === 'auth');
const userName = computed(() => localStorage.getItem('session-user') || '开发主管');
const userRole = computed(() => localStorage.getItem('session-role') || '项目经理');

const handleLogout = () => {
  localStorage.removeItem('session-user');
  localStorage.removeItem('session-role');
  router.push('/login');
};
</script>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 28px;
}

.logo {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #5b8cff, #7ad6ff);
  color: white;
  font-weight: 700;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand p {
  font-weight: 700;
}

.brand small {
  color: #64748b;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  padding: 12px 16px;
  border-radius: 12px;
  background: #f8fafc;
  color: #0f172a;
  font-weight: 600;
  transition: all 0.2s ease;
}

.menu-item.active,
.menu-item:hover {
  background: #e0ecff;
  color: #1d4ed8;
}

.sidebar-footer {
  margin-top: auto;
  font-size: 12px;
  color: #94a3b8;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 20px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.topbar h1 {
  font-size: 20px;
  margin-bottom: 4px;
}

.topbar p {
  color: #64748b;
  font-size: 13px;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #f1f5ff;
  padding: 10px 16px;
  border-radius: 14px;
}

.user-card p {
  font-size: 12px;
  color: #475569;
}

.content-area {
  padding: 28px;
  flex: 1;
}

.ghost-button {
  border: 1px solid #94a3b8;
  background: transparent;
  border-radius: 10px;
  padding: 6px 12px;
  font-size: 12px;
  color: #1f2937;
}

@media (max-width: 1024px) {
  .sidebar {
    width: 200px;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 768px) {
  .app-shell {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: static;
  }

  .menu {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
