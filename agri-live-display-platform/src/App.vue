<template>
  <div class="app-shell">
    <header class="top-bar">
      <div class="brand">
        <span class="brand-dot"></span>
        <div>
          <h1>农产品直播展示与互动服务平台</h1>
          <p>直播展示 · 互动运营 · 商品联动 · 数据洞察</p>
        </div>
      </div>
      <div class="user-info">
        <div class="status-chip">在线</div>
        <div>
          <strong>{{ loginForm.username || '运营管理员' }}</strong>
          <p>今日值班：{{ new Date().toLocaleDateString() }}</p>
        </div>
        <button class="ghost" @click="logout">退出登录</button>
      </div>
    </header>

    <div class="main-layout">
      <aside class="sidebar">
        <nav>
          <RouterLink to="/dashboard">平台概览</RouterLink>
          <RouterLink to="/live-display">直播展示页面</RouterLink>
          <RouterLink to="/interaction">互动交流管理页面</RouterLink>
          <RouterLink to="/product-link">商品关联与展示页面</RouterLink>
          <RouterLink to="/anchor-manage">主播与账号管理页面</RouterLink>
          <RouterLink to="/data-analysis">数据统计与分析页面</RouterLink>
        </nav>
      </aside>

      <main class="content-area">
        <RouterView />
      </main>
    </div>
  </div>

  <div v-if="!loggedIn" class="login-overlay">
    <div class="login-card">
      <div class="login-header">
        <h2>平台登录</h2>
        <p>欢迎进入农产品直播展示与互动服务平台</p>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="loginForm.username" type="text" placeholder="请输入账号" required />
        </label>
        <label>
          密码
          <input v-model="loginForm.password" type="password" placeholder="请输入密码" required />
        </label>
        <label>
          验证方式
          <select v-model="loginForm.role">
            <option>平台管理员</option>
            <option>直播运营</option>
            <option>数据分析师</option>
          </select>
        </label>
        <button class="primary" type="submit">登录并进入主界面</button>
      </form>
      <div class="login-footer">
        <span>安全提醒：请勿泄露账号信息</span>
        <span class="badge">系统状态：正常</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

const loginForm = reactive({
  username: 'agri-admin',
  password: '123456',
  role: '平台管理员'
});

const loggedIn = ref(false);

const handleLogin = () => {
  loggedIn.value = true;
};

const logout = () => {
  loggedIn.value = false;
};
</script>

<style>
:root {
  color-scheme: light;
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background: #f8fafc;
  color: #0f172a;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body,
#app {
  min-height: 100vh;
  background: #f8fafc;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 16px 32px;
  background: #ffffff;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.08);
  position: sticky;
  top: 0;
  z-index: 10;
}

.brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-dot {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: linear-gradient(135deg, #60a5fa, #f9a8d4);
  display: inline-block;
}

.brand h1 {
  font-size: 20px;
}

.brand p {
  font-size: 13px;
  color: #64748b;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #475569;
}

.status-chip {
  background: #dcfce7;
  color: #166534;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
}

.ghost {
  border: 1px solid #cbd5f5;
  background: transparent;
  color: #1d4ed8;
  padding: 6px 14px;
  border-radius: 999px;
  cursor: pointer;
}

.main-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
  padding: 24px 32px 32px;
}

.sidebar {
  background: #ffffff;
  border-radius: 20px;
  padding: 18px;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
  height: fit-content;
}

.sidebar nav {
  display: grid;
  gap: 10px;
}

.sidebar a {
  padding: 10px 14px;
  border-radius: 12px;
  text-decoration: none;
  color: #334155;
  font-weight: 600;
  background: #f8fafc;
}

.sidebar a.router-link-active {
  background: linear-gradient(135deg, #bae6fd, #e0f2fe);
  color: #1d4ed8;
}

.content-area {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.login-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}

.login-card {
  width: min(440px, 92vw);
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.2);
}

.login-header {
  margin-bottom: 18px;
}

.login-header h2 {
  font-size: 22px;
  margin-bottom: 6px;
}

.login-header p {
  color: #64748b;
  font-size: 13px;
}

.login-form {
  display: grid;
  gap: 14px;
}

.login-form label {
  display: grid;
  gap: 8px;
  font-size: 13px;
  color: #475569;
}

.login-form input,
.login-form select {
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.login-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  font-size: 12px;
  color: #94a3b8;
}

.badge {
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 10px;
  border-radius: 999px;
}

@media (max-width: 1024px) {
  .main-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: sticky;
    top: 90px;
  }
}

@media (max-width: 720px) {
  .top-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .user-info {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
