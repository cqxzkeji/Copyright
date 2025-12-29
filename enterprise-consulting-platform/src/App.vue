<template>
  <div class="app-shell">
    <div v-if="!loggedIn" class="login-overlay">
      <div class="login-card">
        <div class="login-banner">
          <h1>多维度企业咨询信息采集平台</h1>
          <p>统一入口、全流程追踪、实时洞察，助力咨询服务精准高效。</p>
        </div>
        <form class="login-form" @submit.prevent="handleLogin">
          <label>
            账号
            <input v-model="loginForm.username" placeholder="输入用户名" required />
          </label>
          <label>
            密码
            <input v-model="loginForm.password" type="password" placeholder="输入密码" required />
          </label>
          <button type="submit">立即登录</button>
        </form>
      </div>
    </div>

    <div v-else class="layout">
      <header class="topbar">
        <div class="brand">咨询采集驾驶舱</div>
        <div class="status">
          <span class="badge">在线</span>
          <span class="user">{{ loginForm.username || '管理员' }}</span>
        </div>
      </header>
      <div class="main">
        <aside class="sidebar">
          <nav>
            <RouterLink v-for="item in menus" :key="item.path" :to="item.path" active-class="active">
              <span class="dot" />
              {{ item.label }}
            </RouterLink>
          </nav>
        </aside>
        <section class="content">
          <RouterView />
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

const loggedIn = ref(false);
const loginForm = ref({ username: '', password: '' });
const menus = [
  { path: '/collect', label: '企业信息采集' },
  { path: '/analysis', label: '数据分析画像' },
  { path: '/match', label: '咨询资源匹配' },
  { path: '/track', label: '过程跟踪评估' },
  { path: '/system', label: '系统管理统计' }
];

const handleLogin = () => {
  loggedIn.value = true;
};
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
}

.login-overlay {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 20% 20%, #e8f3ff, #f7fbff 40%, #eef2f7 100%);
  padding: 20px;
}

.login-card {
  background: #fff;
  border-radius: 20px;
  width: min(920px, 95vw);
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  box-shadow: 0 16px 60px rgba(0, 60, 120, 0.18);
  overflow: hidden;
  border: 1px solid #e1e9f4;
}

.login-banner {
  background: linear-gradient(135deg, #4cc2ff, #8ee1ff);
  color: #06355c;
  padding: 36px;
}

.login-banner h1 {
  margin: 0 0 8px;
}

.login-banner p {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
}

.login-form {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.login-form label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #38526f;
  font-weight: 600;
}

.login-form input {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #dbe6f3;
  background: #f9fbff;
}

.login-form button {
  margin-top: 6px;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(120deg, #2da1ff, #69d5ff);
  color: #fff;
  font-weight: 700;
}

.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.topbar {
  height: 62px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.brand {
  font-weight: 800;
  color: #0f437d;
}

.status {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #416285;
}

.badge {
  background: #e9f7ff;
  color: #1790ff;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  border: 1px solid #c8e8ff;
}

.main {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: calc(100vh - 62px);
}

.sidebar {
  background: #f7fbff;
  border-right: 1px solid #e5edf7;
  padding: 18px;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar a {
  text-decoration: none;
  color: #2c527a;
  padding: 12px 14px;
  border-radius: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid #e5edf7;
}

.sidebar a.active {
  background: linear-gradient(120deg, #33b1ff, #71d8ff);
  color: #0c2f55;
  box-shadow: 0 10px 30px rgba(0, 140, 255, 0.18);
}

.sidebar .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3baaff;
}

.content {
  padding: 20px;
  background: #f4f7fb;
}

@media (max-width: 900px) {
  .login-card {
    grid-template-columns: 1fr;
  }

  .main {
    grid-template-columns: 1fr;
  }

  .sidebar {
    border-right: none;
    border-bottom: 1px solid #e5edf7;
  }
}
</style>
